'use client';

import { useEffect, useState } from 'react';
import { Container, Title, Button, Stack, Card, Text, Group, Badge, Modal, TextInput, Loader } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
  users?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
  createdAt: string;
}

export default function OrganizationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    adminEmail: '',
    logoUrl: '',
    address: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    if ((session.user as any)?.role !== 'PRODUCT_OWNER') {
      router.push('/dashboard');
      return;
    }

    fetchOrganizations();
  }, [session]);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations`,
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
          },
        }
      );
      setOrganizations(response.data);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // First, create or get the admin user
      let adminId = '';
      
      // Try to find existing user by email
      try {
        const usersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.accessToken}`,
            },
          }
        );
        const existingUser = usersResponse.data.find(
          (u: any) => u.email === formData.adminEmail
        );
        
        if (existingUser) {
          adminId = existingUser.id;
        } else {
          // Create new admin user
          const userResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
            {
              name: formData.adminEmail.split('@')[0],
              email: formData.adminEmail,
              password: 'changeme123', // Default password
              role: 'ADMIN',
            },
            {
              headers: {
                Authorization: `Bearer ${(session as any)?.accessToken}`,
              },
            }
          );
          adminId = userResponse.data.id;
        }
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to create admin user',
          color: 'red',
        });
        setSubmitting(false);
        return;
      }

      // Create organization
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations`,
        {
          name: formData.name,
          adminId,
          logoUrl: formData.logoUrl || undefined,
          address: formData.address || undefined,
          phone: formData.phone || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
          },
        }
      );

      notifications.show({
        title: 'Success',
        message: 'Organization created successfully',
        color: 'green',
      });

      setModalOpened(false);
      setFormData({
        name: '',
        adminEmail: '',
        logoUrl: '',
        address: '',
        phone: '',
      });
      fetchOrganizations();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to create organization',
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
          <Text>Loading organizations...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <Title order={1}>Organizations</Title>
          <Button onClick={() => setModalOpened(true)}>
            Create Organization
          </Button>
        </Group>

        {organizations.length === 0 ? (
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Text ta="center" c="dimmed">
              No organizations created yet
            </Text>
          </Card>
        ) : (
          <Stack gap="md">
            {organizations.map((org) => (
              <Card key={org.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between">
                  <Stack gap="xs">
                    <Text fw={700} size="lg">
                      {org.name}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Admin: {org.admin.name} ({org.admin.email})
                    </Text>
                    {org.address && (
                      <Text size="sm" c="dimmed">
                        Address: {org.address}
                      </Text>
                    )}
                    {org.phone && (
                      <Text size="sm" c="dimmed">
                        Phone: {org.phone}
                      </Text>
                    )}
                  </Stack>
                  <Badge size="lg" variant="light">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </Badge>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Create Organization"
        size="md"
      >
        <form onSubmit={handleCreateOrganization}>
          <Stack>
            <TextInput
              label="Organization Name"
              placeholder="Enter organization name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextInput
              label="Admin Email"
              placeholder="admin@example.com"
              type="email"
              required
              value={formData.adminEmail}
              onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
              description="If user doesn't exist, will be created with default password 'changeme123'"
            />
            <TextInput
              label="Logo URL (Optional)"
              placeholder="https://example.com/logo.png"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            />
            <TextInput
              label="Address (Optional)"
              placeholder="123 Main St, City"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <TextInput
              label="Phone (Optional)"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Button type="submit" loading={submitting} fullWidth>
              Create Organization
            </Button>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
