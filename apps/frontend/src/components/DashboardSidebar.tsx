'use client';

import { Stack, NavLink, Box, Text, Divider, Badge } from '@mantine/core';
import {
  IconHome,
  IconUpload,
  IconPhoto,
  IconCoin,
  IconBuilding,
  IconUsers,
  IconBell,
  IconLogout,
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const navItems = [
    {
      icon: IconHome,
      label: 'Dashboard',
      href: '/dashboard',
      roles: ['PRODUCT_OWNER', 'ADMIN', 'USER'],
    },
    {
      icon: IconUpload,
      label: 'Upload Image',
      href: '/dashboard/upload',
      roles: ['ADMIN', 'USER'],
    },
    {
      icon: IconPhoto,
      label: 'My Images',
      href: '/dashboard/images',
      roles: ['ADMIN', 'USER'],
    },
    {
      icon: IconCoin,
      label: 'Purchase Quota',
      href: '/dashboard/purchase',
      roles: ['ADMIN', 'USER'],
    },
    {
      icon: IconBell,
      label: 'Notifications',
      href: '/dashboard/notifications',
      roles: ['ADMIN', 'USER'],
    },
  ];

  const adminItems = [
    {
      icon: IconUsers,
      label: 'Manage Users',
      href: '/dashboard/users',
      roles: ['ADMIN'],
    },
  ];

  const productOwnerItems = [
    {
      icon: IconBuilding,
      label: 'Organizations',
      href: '/dashboard/organizations',
      roles: ['PRODUCT_OWNER'],
    },
    {
      icon: IconUsers,
      label: 'All Users',
      href: '/dashboard/users',
      roles: ['PRODUCT_OWNER'],
    },
  ];

  return (
    <Box
      style={{
        width: 280,
        height: '100vh',
        borderRight: '1px solid #e9ecef',
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
        backgroundColor: '#f8f9fa',
      }}
      p="md"
    >
      <Stack gap="xs">
        <Box mb="md">
          <Text size="xl" fw={700}>
            Image Platform
          </Text>
          <Text size="xs" c="dimmed">
            {(session?.user as any)?.name}
          </Text>
          <Badge size="sm" variant="light" mt="xs">
            {userRole}
          </Badge>
        </Box>

        <Divider my="sm" />

        {/* Main Navigation */}
        {navItems
          .filter((item) => item.roles.includes(userRole))
          .map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              leftSection={<item.icon size={20} />}
              active={pathname === item.href}
              onClick={(e) => {
                e.preventDefault();
                router.push(item.href);
              }}
            />
          ))}

        {/* Admin Section */}
        {userRole === 'ADMIN' && (
          <>
            <Divider my="sm" label="Admin" labelPosition="center" />
            {adminItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                leftSection={<item.icon size={20} />}
                active={pathname === item.href}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                }}
              />
            ))}
          </>
        )}

        {/* Product Owner Section */}
        {userRole === 'PRODUCT_OWNER' && (
          <>
            <Divider my="sm" label="Product Owner" labelPosition="center" />
            {productOwnerItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                leftSection={<item.icon size={20} />}
                active={pathname === item.href}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                }}
              />
            ))}
          </>
        )}

        <Divider my="sm" />

        {/* Logout */}
        <NavLink
          label="Logout"
          leftSection={<IconLogout size={20} />}
          onClick={handleLogout}
          color="red"
        />
      </Stack>
    </Box>
  );
}
