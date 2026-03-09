import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../lib/auth';
import multer from 'multer';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Upload image
router.post(
  '/upload',
  authenticate,
  upload.single('image'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
      });

      if (!user || user.imageQuota <= 0) {
        return res.status(403).json({ error: 'Insufficient quota' });
      }

      if (!user.organizationId) {
        return res.status(400).json({ error: 'User must belong to an organization to upload images' });
      }

      const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
      const file = req.file;

      // Convert image to base64
      const base64Data = file.buffer.toString('base64');
      
      const image = await prisma.image.create({
        data: {
          data: base64Data,
          filename: file.originalname,
          mimeType: file.mimetype,
          tags,
          uploadedBy: {
            connect: { id: req.user!.id }
          },
          organization: {
            connect: { id: user.organizationId }
          }
        },
      });

      // Decrease user quota
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { imageQuota: user.imageQuota - 1 },
      });

      // Create notifications
      let receiverIds: string[] = [];
      if (tags.length > 0) {
        // Notify tagged users
        receiverIds = tags;
      } else {
        // Notify all users in organization
        const orgUsers = await prisma.user.findMany({
          where: {
            organizationId: user.organizationId!,
            id: { not: req.user!.id },
          },
          select: { id: true },
        });
        receiverIds = orgUsers.map((u) => u.id);
      }

      if (receiverIds.length > 0) {
        await prisma.notification.create({
          data: {
            organizationId: user.organizationId!,
            senderId: req.user!.id,
            receiverIds,
            imageId: image.id,
            message: tags.length > 0
              ? `${user.name} tagged you in an image`
              : `${user.name} uploaded a new image`,
          },
        });
      }

      // Fetch image with uploadedBy relation
      const imageWithUser = await prisma.image.findUnique({
        where: { id: image.id },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.json(imageWithUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  }
);

// Get images
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { organizationId } = req.query;

    const images = await prisma.image.findMany({
      where: organizationId
        ? { organizationId: organizationId as string }
        : {},
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Get image by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const image = await prisma.image.findUnique({
      where: { id: req.params.id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Delete image
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const image = await prisma.image.findUnique({
      where: { id: req.params.id },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Only uploader or admin can delete
    if (
      image.uploadedById !== req.user!.id &&
      req.user!.role !== 'ADMIN'
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.image.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
