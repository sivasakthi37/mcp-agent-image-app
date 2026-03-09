'use client';

import { Container, Title, Text, Button, Stack, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (session) {
    return (
      <Container size="md" py={80}>
        <Stack align="center" gap="xl">
          <Title order={1} size={48}>
            Image Upload & Payment System
          </Title>
          <Text size="xl" c="dimmed" ta="center">
            You are logged in as {(session.user as any)?.name || session.user?.email}
          </Text>
          <Group>
            <Button size="lg" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
            <Button size="lg" variant="outline" color="red" onClick={handleLogout}>
              Logout
            </Button>
          </Group>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="md" py={80}>
      <Stack align="center" gap="xl">
        <Title order={1} size={48}>
          Image Upload & Payment System
        </Title>
        <Text size="xl" c="dimmed" ta="center">
          AI-powered image management platform with quota system and automated workflows
        </Text>
        <Group>
          <Button size="lg" onClick={() => router.push('/auth/login')}>
            Login
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push('/auth/register')}>
            Register
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
