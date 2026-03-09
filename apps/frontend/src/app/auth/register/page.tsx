'use client';

import { useState } from 'react';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      notifications.show({
        title: 'Success',
        message: 'Registration successful! Please login.',
        color: 'green',
      });

      router.push('/auth/login');
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Registration failed',
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
          Register
        </Title>
        <form onSubmit={handleRegister}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              Register
            </Button>
            <Text size="sm" ta="center">
              Already have an account?{' '}
              <Text component="a" href="/auth/login" c="blue" style={{ cursor: 'pointer' }}>
                Login
              </Text>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
