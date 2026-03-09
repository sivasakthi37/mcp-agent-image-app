import { Router } from 'express';
import Razorpay from 'razorpay';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../lib/auth';
import crypto from 'crypto';

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_SECRET || '',
});

const PRICE_PER_SLOT = 100; // ₹100 per 5 images
const SLOTS_PER_PURCHASE = 5;

// Create payment order
router.post('/create-order', authenticate, async (req: AuthRequest, res) => {
  try {
    const { slots } = req.body;
    const amount = slots * PRICE_PER_SLOT * 100; // Convert to paise

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment
router.post('/verify', authenticate, async (req: AuthRequest, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      slots,
    } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET || '')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: req.user!.id,
        organizationId: user.organizationId!,
        amount: slots * PRICE_PER_SLOT,
        slotsPurchased: slots * SLOTS_PER_PURCHASE,
        transactionId: razorpay_payment_id,
        status: 'SUCCESS',
      },
    });

    // Update user quota
    await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        imageQuota: user.imageQuota + slots * SLOTS_PER_PURCHASE,
      },
    });

    res.json({ success: true, payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Get payment history
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

export default router;
