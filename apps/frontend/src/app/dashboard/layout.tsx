import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Box } from '@mantine/core';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box style={{ display: 'flex' }}>
      <DashboardSidebar />
      <Box style={{ marginLeft: 280, width: 'calc(100% - 280px)', minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
}
