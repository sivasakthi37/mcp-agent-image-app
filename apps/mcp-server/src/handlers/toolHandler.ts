import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export async function handleToolCall(
  toolName: string,
  args: any
): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    switch (toolName) {
      case 'get_user_quota':
        return await getUserQuota(args.userId);

      case 'upload_image':
        return await uploadImage(args.userId, args.imageUrl, args.tags);

      case 'purchase_slots':
        return await purchaseSlots(args.userId, args.slots);

      case 'get_organization_images':
        return await getOrganizationImages(args.organizationId);

      case 'send_notification':
        return await sendNotification(args);

      case 'create_user':
        return await createUser(args);

      case 'create_organization':
        return await createOrganization(args);

      case 'get_upload_statistics':
        return await getUploadStatistics(args.organizationId);

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
}

async function getUserQuota(userId: string) {
  const response = await axios.get(`${BACKEND_URL}/api/users/${userId}`);
  const user = response.data;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          userId: user.id,
          name: user.name,
          imageQuota: user.imageQuota,
          message: `User ${user.name} has ${user.imageQuota} uploads remaining.`,
        }),
      },
    ],
  };
}

async function uploadImage(userId: string, imageUrl: string, tags?: string[]) {
  // Note: This is a simplified version. In production, you'd handle actual file upload
  const response = await axios.post(`${BACKEND_URL}/api/images/upload`, {
    userId,
    imageUrl,
    tags: tags || [],
  });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          image: response.data,
          message: 'Image uploaded successfully',
        }),
      },
    ],
  };
}

async function purchaseSlots(userId: string, slots: number) {
  const amount = slots * 100; // ₹100 per pack

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          userId,
          slots,
          amount,
          message: `To purchase ${slots} slot pack(s) for ₹${amount}, please complete the payment process.`,
          action: 'create_payment_order',
        }),
      },
    ],
  };
}

async function getOrganizationImages(organizationId: string) {
  const response = await axios.get(
    `${BACKEND_URL}/api/images?organizationId=${organizationId}`
  );

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          organizationId,
          images: response.data,
          count: response.data.length,
        }),
      },
    ],
  };
}

async function sendNotification(args: any) {
  const response = await axios.post(`${BACKEND_URL}/api/notifications`, args);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          notification: response.data,
          message: 'Notification sent successfully',
        }),
      },
    ],
  };
}

async function createUser(args: any) {
  const response = await axios.post(`${BACKEND_URL}/api/users`, args);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          user: response.data,
          message: 'User created successfully',
        }),
      },
    ],
  };
}

async function createOrganization(args: any) {
  const response = await axios.post(`${BACKEND_URL}/api/organizations`, args);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          organization: response.data,
          message: 'Organization created successfully',
        }),
      },
    ],
  };
}

async function getUploadStatistics(organizationId: string) {
  const imagesResponse = await axios.get(
    `${BACKEND_URL}/api/images?organizationId=${organizationId}`
  );
  const usersResponse = await axios.get(
    `${BACKEND_URL}/api/users?organizationId=${organizationId}`
  );

  const images = imagesResponse.data;
  const users = usersResponse.data;

  // Calculate statistics
  const uploaderCounts: Record<string, number> = {};
  images.forEach((img: any) => {
    uploaderCounts[img.uploadedById] = (uploaderCounts[img.uploadedById] || 0) + 1;
  });

  const topUploaders = Object.entries(uploaderCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([userId, count]) => {
      const user = users.find((u: any) => u.id === userId);
      return { userId, name: user?.name, uploadCount: count };
    });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          organizationId,
          totalImages: images.length,
          totalUsers: users.length,
          topUploaders,
          averageUploadsPerUser: (images.length / users.length).toFixed(2),
        }),
      },
    ],
  };
}
