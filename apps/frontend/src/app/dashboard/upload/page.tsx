'use client';

import { useState } from 'react';
import { Container, Title, Paper, Button, Stack, MultiSelect, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function UploadPage() {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      notifications.show({
        title: 'Error',
        message: 'Please select a file',
        color: 'red',
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('tags', JSON.stringify(tags));

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      notifications.show({
        title: 'Success',
        message: 'Image uploaded successfully',
        color: 'green',
      });

      setFile(null);
      setTags([]);
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Upload failed',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Stack>
          <Title order={2}>Upload Image</Title>

          <Dropzone
            onDrop={(files) => setFile(files[0])}
            onReject={() => {
              notifications.show({
                title: 'Error',
                message: 'Invalid file type',
                color: 'red',
              });
            }}
            maxSize={10 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
          >
            <Stack align="center" gap="sm" style={{ minHeight: 220, pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <IconUpload size={52} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={52} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto size={52} stroke={1.5} />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag image here or click to select
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  File should not exceed 10MB
                </Text>
              </div>
            </Stack>
          </Dropzone>

          {file && (
            <Text size="sm">
              Selected: {file.name}
            </Text>
          )}

          <MultiSelect
            label="Tag Users (Optional)"
            placeholder="Select users to tag"
            data={[]}
            value={tags}
            onChange={setTags}
            searchable
          />

          <Button onClick={handleUpload} loading={loading} disabled={!file}>
            Upload Image
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
