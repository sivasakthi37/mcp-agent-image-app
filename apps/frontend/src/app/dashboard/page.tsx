'use client';

import { Container, Title, Grid, Card, Text, Button, Stack, Group, Badge } from '@mantine/core';
import { IconUpload, IconPhoto, IconCoin, IconUsers } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session) {
      fetchUserData();
    }
  }, [session, status]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${(session as any)?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
          },
        }
      );
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  if (status === 'loading' || !userData) {
    return null;
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1}>Dashboard</Title>
          <Text c="dimmed">Welcome back, {userData.name}</Text>
        </div>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="xs">
                <Group>
                  <IconCoin size={32} color="blue" />
                  <div>
                    <Text size="xl" fw={700}>
                      {userData.imageQuota}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Uploads Remaining
                    </Text>
                  </div>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="xs">
                <Group>
                  <IconUsers size={32} color="green" />
                  <div>
                    <Text size="xl" fw={700}>
                      {userData.role}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Your Role
                    </Text>
                  </div>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>

          {userData.organization && (
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="xs">
                  <Group>
                    <IconPhoto size={32} color="purple" />
                    <div>
                      <Text size="lg" fw={700} lineClamp={1}>
                        {userData.organization.name}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Organization
                      </Text>
                    </div>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          )}
        </Grid>

        {userData.role !== 'PRODUCT_OWNER' && !userData.organization && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text c="orange" ta="center">
              You are not assigned to any organization. Please contact your administrator.
            </Text>
          </Card>
        )}

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Quick Actions
          </Title>
          <Text size="sm" c="dimmed">
            Use the sidebar on the left to navigate through the application.
          </Text>
        </Card>
      </Stack>
    </Container>
  );
}
