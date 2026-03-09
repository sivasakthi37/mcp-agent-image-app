export const tools = [
  {
    name: 'get_user_quota',
    description: 'Get the remaining upload quota for a user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The ID of the user',
        },
      },
      required: ['userId'],
    },
  },
  {
    name: 'upload_image',
    description: 'Upload an image to the system',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The ID of the user uploading',
        },
        imageUrl: {
          type: 'string',
          description: 'The URL of the image to upload',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'User IDs to tag in the image',
        },
      },
      required: ['userId', 'imageUrl'],
    },
  },
  {
    name: 'purchase_slots',
    description: 'Purchase additional upload slots for a user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The ID of the user',
        },
        slots: {
          type: 'number',
          description: 'Number of slot packs to purchase (1 pack = 5 images)',
        },
      },
      required: ['userId', 'slots'],
    },
  },
  {
    name: 'get_organization_images',
    description: 'Get all images for an organization',
    inputSchema: {
      type: 'object',
      properties: {
        organizationId: {
          type: 'string',
          description: 'The ID of the organization',
        },
      },
      required: ['organizationId'],
    },
  },
  {
    name: 'send_notification',
    description: 'Send a notification to users',
    inputSchema: {
      type: 'object',
      properties: {
        organizationId: {
          type: 'string',
          description: 'The organization ID',
        },
        senderId: {
          type: 'string',
          description: 'The sender user ID',
        },
        receiverIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of receiver user IDs',
        },
        message: {
          type: 'string',
          description: 'The notification message',
        },
        imageId: {
          type: 'string',
          description: 'Optional image ID',
        },
      },
      required: ['organizationId', 'senderId', 'receiverIds', 'message'],
    },
  },
  {
    name: 'create_user',
    description: 'Create a new user in an organization',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'User name',
        },
        email: {
          type: 'string',
          description: 'User email',
        },
        password: {
          type: 'string',
          description: 'User password',
        },
        organizationId: {
          type: 'string',
          description: 'Organization ID',
        },
        role: {
          type: 'string',
          enum: ['ADMIN', 'USER'],
          description: 'User role',
        },
      },
      required: ['name', 'email', 'password', 'organizationId'],
    },
  },
  {
    name: 'create_organization',
    description: 'Create a new organization',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Organization name',
        },
        adminId: {
          type: 'string',
          description: 'Admin user ID',
        },
        logoUrl: {
          type: 'string',
          description: 'Optional logo URL',
        },
        address: {
          type: 'string',
          description: 'Optional address',
        },
        phone: {
          type: 'string',
          description: 'Optional phone',
        },
      },
      required: ['name', 'adminId'],
    },
  },
  {
    name: 'get_upload_statistics',
    description: 'Get upload statistics for an organization',
    inputSchema: {
      type: 'object',
      properties: {
        organizationId: {
          type: 'string',
          description: 'The organization ID',
        },
      },
      required: ['organizationId'],
    },
  },
];
