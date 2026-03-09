import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../lib/auth';
import { z } from 'zod';

const router = Router();

const createOrgSchema = z.object({
  name: z.string().min(2),
  logoUrl: z.string().url().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  adminId: z.string(),
});

const updateOrgSchema = z.object({
  name: z.string().min(2).optional(),
  logoUrl: z.string().url().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

// Create organization (Product Owner only)
router.post(
  '/',
  authenticate,
  authorize('PRODUCT_OWNER'),
  async (req: AuthRequest, res) => {
    try {
      const data = createOrgSchema.parse(req.body);

      // Update admin user role
      await prisma.user.update({
        where: { id: data.adminId },
        data: { role: 'ADMIN' },
      });

      const organization = await prisma.organization.create({
        data,
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      // Link admin to organization
      await prisma.user.update({
        where: { id: data.adminId },
        data: { organizationId: organization.id },
      });

      res.json(organization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create organization' });
    }
  }
);

// Get all organizations (Product Owner only)
router.get(
  '/',
  authenticate,
  authorize('PRODUCT_OWNER'),
  async (req: AuthRequest, res) => {
    try {
      const organizations = await prisma.organization.findMany({
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              users: true,
              images: true,
            },
          },
        },
      });

      res.json(organizations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch organizations' });
    }
  }
);

// Get organization by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: req.params.id },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            imageQuota: true,
          },
        },
        _count: {
          select: {
            images: true,
          },
        },
      },
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

// Update organization
router.put(
  '/:id',
  authenticate,
  authorize('PRODUCT_OWNER', 'ADMIN'),
  async (req: AuthRequest, res) => {
    try {
      const data = updateOrgSchema.parse(req.body);

      const organization = await prisma.organization.update({
        where: { id: req.params.id },
        data,
      });

      res.json(organization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update organization' });
    }
  }
);

// Delete organization (Product Owner only)
router.delete(
  '/:id',
  authenticate,
  authorize('PRODUCT_OWNER'),
  async (req: AuthRequest, res) => {
    try {
      await prisma.organization.delete({
        where: { id: req.params.id },
      });

      res.json({ message: 'Organization deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete organization' });
    }
  }
);

export default router;
