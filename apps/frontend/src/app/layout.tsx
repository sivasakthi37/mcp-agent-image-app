import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { SessionProvider } from '@/components/SessionProvider';

export const metadata = {
  title: 'Image Upload & Payment System',
  description: 'AI-powered image management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <SessionProvider>
          <MantineProvider>
            <Notifications />
            {children}
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
