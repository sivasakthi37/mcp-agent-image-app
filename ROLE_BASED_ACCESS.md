# Role-Based Access Control

## Overview

The application now has a complete role-based access control system with a sidebar navigation that adapts to user roles.

## User Roles

### 1. **PRODUCT_OWNER**
**Highest level access - Can manage everything**

**Permissions:**
- Create and manage organizations
- Create users with any role (USER, ADMIN, PRODUCT_OWNER)
- Assign users to any organization
- View all users across all organizations
- Full system access

**Sidebar Navigation:**
- Dashboard
- Organizations (Product Owner only)
- All Users (Product Owner only)

**Workflow:**
1. Create organizations
2. Assign admin to each organization
3. Create users and assign them to organizations

---

### 2. **ADMIN**
**Organization-level access**

**Permissions:**
- Create users within their own organization only
- View only users from their organization
- Can only create USER role (not ADMIN or PRODUCT_OWNER)
- Manage users within their organization
- Upload images
- View images
- Purchase quota

**Sidebar Navigation:**
- Dashboard
- Upload Image
- My Images
- Purchase Quota
- Notifications
- Manage Users (organization users only)

**Restrictions:**
- Cannot see organization details
- Cannot create organizations
- Cannot see users from other organizations
- Automatically assigns new users to their organization

---

### 3. **USER**
**Basic user access**

**Permissions:**
- Upload images (within quota)
- View their images
- Purchase quota
- View notifications

**Sidebar Navigation:**
- Dashboard
- Upload Image
- My Images
- Purchase Quota
- Notifications

**Restrictions:**
- Cannot manage users
- Cannot create organizations
- Must belong to an organization to upload images

---

## Features

### Sidebar Navigation
- **Fixed left sidebar** (280px wide)
- **Role-based menu items** - Only shows relevant options
- **Active state highlighting** - Current page is highlighted
- **User info display** - Shows name and role badge
- **Logout button** - At the bottom of sidebar

### Dashboard
- **Clean overview** with key stats:
  - Image quota remaining
  - User role
  - Organization name (if assigned)
- **Warning message** if user not assigned to organization
- **Quick actions guide**

### Organization Management (Product Owner)
- Create organizations
- Set admin for each organization
- View all organizations
- Organization details (logo, address, phone)

### User Management

**Product Owner:**
- Create users with any role
- Assign to any organization
- View all users system-wide

**Admin:**
- Create only USER role
- Automatically assigned to admin's organization
- View only organization users
- Shows organization name in header

### Session Persistence
- **JWT-based sessions** lasting 30 days
- **Auto-restore on refresh** - No need to re-login
- **Secure logout** - Clears session completely

---

## Setup Instructions

### 1. Create Product Owner
```bash
cd apps/backend
npx prisma studio
```
- Find your user
- Set `role` to `PRODUCT_OWNER`

### 2. Create Organization (as Product Owner)
- Login to frontend
- Go to "Organizations" in sidebar
- Click "Create Organization"
- Fill in:
  - Organization name
  - Admin email (creates user if doesn't exist)
  - Optional: logo, address, phone

### 3. Create Users
**As Product Owner:**
- Go to "All Users"
- Create users with any role
- Assign to organizations

**As Admin:**
- Go to "Manage Users"
- Create USER role only
- Auto-assigned to your organization

### 4. Upload Images
- Users must be assigned to an organization
- Must have quota > 0
- Upload via "Upload Image" in sidebar

---

## File Structure

```
apps/frontend/src/
├── components/
│   ├── DashboardSidebar.tsx      # Main sidebar navigation
│   ├── DashboardNav.tsx           # (Deprecated - replaced by sidebar)
│   └── SessionProvider.tsx
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx             # Includes sidebar
│   │   ├── page.tsx               # Dashboard overview
│   │   ├── organizations/
│   │   │   └── page.tsx           # Product Owner only
│   │   ├── users/
│   │   │   └── page.tsx           # Product Owner & Admin
│   │   ├── upload/
│   │   │   └── page.tsx           # Admin & User
│   │   ├── images/
│   │   │   └── page.tsx           # Admin & User
│   │   └── notifications/
│   │       └── page.tsx           # Admin & User
│   └── api/auth/[...nextauth]/
│       └── route.ts               # Session config
```

---

## Key Changes from Previous Version

1. **Sidebar Navigation** - Replaced top nav with fixed sidebar
2. **Role Filtering** - Admin sees only their organization's users
3. **Auto Organization Assignment** - Admin-created users auto-assigned
4. **Session Persistence** - 30-day JWT sessions
5. **Simplified Dashboard** - Shows only key stats
6. **Organization Context** - Admin sees their org name
7. **Notifications Page** - New page for user notifications

---

## Security Notes

- Product Owner can create other Product Owners
- Admin cannot escalate their own privileges
- Users must belong to organization to upload
- Sessions expire after 30 days of inactivity
- All API calls require valid JWT token
- Role checks on both frontend and backend

---

## Future Enhancements

- Organization switching for multi-org users
- User invitation system via email
- Activity logs and audit trails
- Organization-level settings
- Bulk user import
- User profile editing
- Password reset functionality
