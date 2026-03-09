import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../lib/auth';

const router = Router();

// Get notifications for user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        receiverIds: {
          has: req.user!.id,
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        image: {
          select: {
            id: true,
            url: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get notification by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        image: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
});

export default router;
