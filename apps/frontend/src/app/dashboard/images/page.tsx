'use client';

import { useEffect, useState } from 'react';
import { Container, Title, SimpleGrid, Card, Image, Text, Stack, Group, Badge, Loader } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface ImageData {
  id: string;
  data: string;
  filename: string;
  mimeType: string;
  createdAt: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ImagesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    fetchImages();
  }, [session]);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images`,
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
          },
        }
      );
      setImages(response.data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" py="xl">
          <Loader size="lg" />
          <Text>Loading images...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title order={1}>Images</Title>

        {images.length === 0 ? (
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Text ta="center" c="dimmed">
              No images uploaded yet
            </Text>
          </Card>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
            {images.map((image) => (
              <Card key={image.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src={`data:${image.mimeType};base64,${image.data}`}
                    alt={image.filename}
                    height={200}
                    fit="cover"
                  />
                </Card.Section>

                <Stack gap="xs" mt="md">
                  <Text fw={500} size="sm" lineClamp={1}>
                    {image.filename}
                  </Text>
                  <Group gap="xs">
                    <Badge size="sm" variant="light">
                      {image.uploadedBy.name}
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
