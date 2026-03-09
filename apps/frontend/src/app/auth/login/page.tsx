'use client';

import { useState } from 'react';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { notifications } from '@mantine/notifications';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        notifications.show({
          title: 'Error',
          message: 'Invalid credentials',
          color: 'red',
        });
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Login failed',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" py={80}>
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} mb="lg" ta="center">
          Login
        </Title>
        <form onSubmit={handleLogin}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" loading={loading} fullWidth>
              Login
            </Button>
            <Text size="sm" ta="center">
              Don't have an account?{' '}
              <Text component="a" href="/auth/register" c="blue" style={{ cursor: 'pointer' }}>
                Register
              </Text>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
