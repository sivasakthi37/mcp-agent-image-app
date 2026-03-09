'use client';

import { Group, Button, Text, Container, Box } from '@mantine/core';
import { IconLogout, IconHome } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function DashboardNav() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <Box style={{ borderBottom: '1px solid #e9ecef', marginBottom: '2rem' }}>
      <Container size="xl" py="md">
        <Group justify="space-between">
          <Group>
            <Button
              variant="subtle"
              leftSection={<IconHome size={20} />}
              onClick={() => router.push('/dashboard')}
            >
              Dashboard
            </Button>
            {session?.user && (
              <Text size="sm" c="dimmed">
                Welcome, {(session.user as any).name || session.user.email}
              </Text>
            )}
          </Group>
          <Button
            variant="light"
            color="red"
            leftSection={<IconLogout size={20} />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Group>
      </Container>
    </Box>
  );
}
