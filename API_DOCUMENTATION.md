# API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register
```http
POST /auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER" // Optional: USER, ADMIN, PRODUCT_OWNER
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "imageQuota": 5
  },
  "token": "jwt-token"
}
```

### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "token": "jwt-token"
}
```

---

## Organization Endpoints

### Create Organization (Product Owner Only)
```http
POST /organizations
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "My Organization",
  "adminId": "user-id",
  "logoUrl": "https://example.com/logo.png", // Optional
  "address": "123 Main St", // Optional
  "phone": "+1234567890" // Optional
}
```

### Get All Organizations (Product Owner Only)
```http
GET /organizations
Authorization: Bearer <token>
```

### Get Organization by ID
```http
GET /organizations/:id
Authorization: Bearer <token>
```

### Update Organization (Product Owner/Admin)
```http
PUT /organizations/:id
Authorization: Bearer <token>
```

### Delete Organization (Product Owner Only)
```http
DELETE /organizations/:id
Authorization: Bearer <token>
```

---

## User Endpoints

### Create User (Admin Only)
```http
POST /users
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "organizationId": "org-id",
  "role": "USER" // Optional: USER, ADMIN
}
```

### Get Users
```http
GET /users?organizationId=org-id
Authorization: Bearer <token>
```

### Get User by ID
```http
GET /users/:id
Authorization: Bearer <token>
```

### Update User (Admin Only)
```http
PUT /users/:id
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Jane Smith",
  "role": "ADMIN",
  "imageQuota": 10
}
```

### Delete User (Admin Only)
```http
DELETE /users/:id
Authorization: Bearer <token>
```

---

## Image Endpoints

### Upload Image
```http
POST /images/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `image`: File (required)
- `tags`: JSON array of user IDs (optional)

**Response:**
```json
{
  "id": "image-id",
  "url": "https://s3.amazonaws.com/bucket/image.jpg",
  "uploadedById": "user-id",
  "organizationId": "org-id",
  "tags": ["user-id-1", "user-id-2"],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Get Images
```http
GET /images?organizationId=org-id
Authorization: Bearer <token>
```

### Get Image by ID
```http
GET /images/:id
Authorization: Bearer <token>
```

### Delete Image
```http
DELETE /images/:id
Authorization: Bearer <token>
```

---

## Payment Endpoints

### Create Payment Order
```http
POST /payments/create-order
Authorization: Bearer <token>
```

**Body:**
```json
{
  "slots": 2 // Number of slot packs (1 pack = 5 images for ₹100)
}
```

**Response:**
```json
{
  "id": "order_id",
  "amount": 20000, // In paise (₹200)
  "currency": "INR"
}
```

### Verify Payment
```http
POST /payments/verify
Authorization: Bearer <token>
```

**Body:**
```json
{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature",
  "slots": 2
}
```

### Get Payment History
```http
GET /payments
Authorization: Bearer <token>
```

---

## Notification Endpoints

### Get Notifications
```http
GET /notifications
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "notification-id",
    "message": "John tagged you in an image",
    "sender": {
      "id": "user-id",
      "name": "John Doe"
    },
    "image": {
      "id": "image-id",
      "url": "https://..."
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Notification by ID
```http
GET /notifications/:id
Authorization: Bearer <token>
```

---

## AI Agent Endpoints

### Chat with AI Agent
```http
POST http://localhost:6000/api/agent/chat
```

**Body:**
```json
{
  "message": "How many images can I upload?",
  "userId": "user-id",
  "organizationId": "org-id",
  "context": {} // Optional
}
```

**Response:**
```json
{
  "agent": "quota_assistant",
  "response": "You have 3 uploads remaining. Would you like to purchase more slots?",
  "toolsUsed": ["get_user_quota"]
}
```

---

## MCP Tools

The MCP server exposes the following tools for AI agents:

### get_user_quota
Get remaining upload quota for a user.

### upload_image
Upload an image to the system.

### purchase_slots
Purchase additional upload slots.

### get_organization_images
Get all images for an organization.

### send_notification
Send notifications to users.

### create_user
Create a new user in an organization.

### create_organization
Create a new organization.

### get_upload_statistics
Get upload statistics for an organization.

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider adding:
- Rate limiting per IP
- Rate limiting per user
- Request throttling for expensive operations

---

## Webhooks

### Razorpay Webhook (Future Implementation)

```http
POST /webhooks/razorpay
```

Handle payment status updates from Razorpay.
