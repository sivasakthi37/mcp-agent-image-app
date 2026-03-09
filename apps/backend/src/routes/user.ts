import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthRequest, hashPassword } from '../lib/auth';
import { z } from 'zod';

const router = Router();

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  organizationId: z.string().optional(),
  role: z.enum(['PRODUCT_OWNER', 'ADMIN', 'USER']).optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['PRODUCT_OWNER', 'ADMIN', 'USER']).optional(),
  imageQuota: z.number().optional(),
});

// Create user (Product Owner and Admin)
router.post(
  '/',
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const data = createUserSchema.parse(req.body);

      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Check authorization based on role
      const requestingUserRole = req.user!.role;
      if (requestingUserRole !== 'PRODUCT_OWNER' && requestingUserRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // ADMIN can only create USER role
      if (requestingUserRole === 'ADMIN' && data.role && data.role !== 'USER') {
        return res.status(403).json({ error: 'Admin can only create USER role' });
      }

      const hashedPassword = await hashPassword(data.password);
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: data.role || 'USER',
          organizationId: data.organizationId || null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          organizationId: true,
          imageQuota: true,
        },
      });

      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

// Get users in organization
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { organizationId } = req.query;

    const users = await prisma.user.findMany({
      where: organizationId
        ? { organizationId: organizationId as string }
        : {},
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organizationId: true,
        imageQuota: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organizationId: true,
        imageQuota: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user (Admin only)
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  async (req: AuthRequest, res) => {
    try {
      const data = updateUserSchema.parse(req.body);

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          organizationId: true,
          imageQuota: true,
        },
      });

      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
);

// Delete user (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  async (req: AuthRequest, res) => {
    try {
      await prisma.user.delete({
        where: { id: req.params.id },
      });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
);

export default router;
