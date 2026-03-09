'use client';

import { useEffect, useState } from 'react';
import { Container, Title, Button, Stack, Card, Text, Group, Badge, Modal, TextInput, Select, Loader } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  imageQuota: number;
  organizationId?: string;
  organization?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    organizationId: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN';
  const isProductOwner = userRole === 'PRODUCT_OWNER';

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    if (!isProductOwner && !isAdmin) {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [session]);

  const fetchData = async () => {
    try {
      // Fetch current user data first
      const currentUserResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${(session as any)?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
          },
        }
      );
      setCurrentUserData(currentUserResponse.data);

      // Fetch users
      const usersResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
          },
        }
      );

      // Filter users based on role
      let filteredUsers = usersResponse.data;
      if (isAdmin && currentUserResponse.data.organizationId) {
        // Admin can only see users from their organization
        filteredUsers = usersResponse.data.filter(
          (u: User) => u.organizationId === currentUserResponse.data.organizationId
        );
      }
      setUsers(filteredUsers);

      // Only fetch organizations for Product Owner
      if (isProductOwner) {
        const orgsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations`,
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.accessToken}`,
            },
          }
        );
        setOrganizations(orgsResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // For ADMIN, automatically use their organization
      const orgId = isAdmin ? currentUserData?.organizationId : (formData.organizationId || undefined);

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          organizationId: orgId,
        },
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
          },
        }
      );

      notifications.show({
        title: 'Success',
        message: 'User created successfully',
        color: 'green',
      });

      setModalOpened(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        organizationId: '',
      });
      fetchData();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to create user',
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" py="xl">
          <Loader size="lg" />
          <Text>Loading users...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <div>
            <Title order={1}>Users</Title>
            {isAdmin && currentUserData?.organization && (
              <Text size="sm" c="dimmed">
                Organization: {currentUserData.organization.name}
              </Text>
            )}
          </div>
          <Button onClick={() => setModalOpened(true)}>
            Create User
          </Button>
        </Group>

        {users.length === 0 ? (
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Text ta="center" c="dimmed">
              No users found
            </Text>
          </Card>
        ) : (
          <Stack gap="md">
            {users.map((user) => (
              <Card key={user.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between">
                  <Stack gap="xs">
                    <Group gap="sm">
                      <Text fw={700} size="lg">
                        {user.name}
                      </Text>
                      <Badge variant="light" color={
                        user.role === 'PRODUCT_OWNER' ? 'red' :
                        user.role === 'ADMIN' ? 'blue' : 'green'
                      }>
                        {user.role}
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {user.email}
                    </Text>
                    {user.organization && (
                      <Text size="sm" c="dimmed">
                        Organization: {user.organization.name}
                      </Text>
                    )}
                    <Text size="sm" c="dimmed">
                      Image Quota: {user.imageQuota}
                    </Text>
                  </Stack>
                  <Text size="xs" c="dimmed">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Text>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Create User"
        size="md"
      >
        <form onSubmit={handleCreateUser}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Enter user name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextInput
              label="Email"
              placeholder="user@example.com"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextInput
              label="Password"
              placeholder="Enter password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Select
              label="Role"
              placeholder="Select role"
              required
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value || 'USER' })}
              data={[
                { value: 'USER', label: 'User' },
                ...(isProductOwner ? [{ value: 'ADMIN', label: 'Admin' }] : []),
                ...(isProductOwner ? [{ value: 'PRODUCT_OWNER', label: 'Product Owner' }] : []),
              ]}
            />
            {isProductOwner && (
              <Select
                label="Organization (Optional)"
                placeholder="Select organization"
                value={formData.organizationId}
                onChange={(value) => setFormData({ ...formData, organizationId: value || '' })}
                data={organizations.map(org => ({ value: org.id, label: org.name }))}
                clearable
              />
            )}
            {isAdmin && currentUserData?.organization && (
              <Text size="sm" c="dimmed">
                Users will be added to: {currentUserData.organization.name}
              </Text>
            )}
            <Button type="submit" loading={submitting} fullWidth>
              Create User
            </Button>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
