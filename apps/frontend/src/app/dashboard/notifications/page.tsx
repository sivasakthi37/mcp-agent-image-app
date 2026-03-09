'use client';

import { useEffect, useState } from 'react';
import { Container, Title, Stack, Card, Text, Badge, Loader, Group } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    fetchNotifications();
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
          },
        }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" py="xl">
          <Loader size="lg" />
          <Text>Loading notifications...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title order={1}>Notifications</Title>

        {notifications.length === 0 ? (
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Text ta="center" c="dimmed">
              No notifications yet
            </Text>
          </Card>
        ) : (
          <Stack gap="md">
            {notifications.map((notification) => (
              <Card key={notification.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" align="flex-start">
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text size="sm">{notification.message}</Text>
                    <Text size="xs" c="dimmed">
                      From: {notification.sender.name}
                    </Text>
                  </Stack>
                  <Badge size="sm" variant="light">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </Badge>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
