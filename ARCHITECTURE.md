# System Architecture

## Overview

The Image Upload & Payment System is built as a modern microservices architecture with AI integration through MCP (Model Context Protocol).

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Auth    │  │Dashboard │  │  Upload  │  │ Payment  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└───────────────────────┬─────────────────────────────────────────┘
                        │ HTTP/REST
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API (Express)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Auth    │  │  Users   │  │  Images  │  │ Payments │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└───────┬───────────────┬─────────────┬───────────────────────────┘
        │               │             │
        ▼               ▼             ▼
┌──────────────┐  ┌──────────┐  ┌──────────┐
│  PostgreSQL  │  │  AWS S3  │  │ Razorpay │
└──────────────┘  └──────────┘  └──────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      AI Layer (Free Models)                      │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              AI Agent Orchestrator                         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │  Upload  │  │  Quota   │  │ Payment  │  │Analytics │  │ │
│  │  │Assistant │  │Assistant │  │Assistant │  │Assistant │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  └────────────────────────┬───────────────────────────────────┘ │
│                            │                                     │
│  ┌────────────────────────▼───────────────────────────────────┐ │
│  │              AI Provider (Choose One)                      │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │ │
│  │  │  Gemini  │  │   Groq   │  │  Ollama  │                │ │
│  │  │  (Free)  │  │  (Free)  │  │ (Local)  │                │ │
│  │  └──────────┘  └──────────┘  └──────────┘                │ │
│  └────────────────────────┬───────────────────────────────────┘ │
│                            │                                     │
│  ┌────────────────────────▼───────────────────────────────────┐ │
│  │                    MCP Server                              │ │
│  │  Exposes backend capabilities as tools for AI agents      │ │
│  └────────────────────────┬───────────────────────────────────┘ │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
                    Backend API (HTTP)
```

## Components

### 1. Frontend (Next.js PWA)

**Technology Stack:**
- Next.js 14 (App Router)
- TypeScript
- Mantine UI
- NextAuth.js
- Axios

**Key Features:**
- Server-side rendering (SSR)
- Progressive Web App (PWA)
- Responsive design
- Role-based UI
- Real-time notifications

**Pages:**
- `/` - Landing page
- `/auth/login` - Login
- `/auth/register` - Registration
- `/dashboard` - Main dashboard
- `/dashboard/upload` - Image upload
- `/dashboard/images` - Image gallery
- `/dashboard/purchase` - Buy slots
- `/dashboard/users` - User management (Admin)
- `/dashboard/analytics` - Analytics (Admin)

### 2. Backend API (Express)

**Technology Stack:**
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

**Core Modules:**

#### Authentication (`/api/auth`)
- User registration
- Login with JWT
- Token validation
- Role-based access control

#### Organization Management (`/api/organizations`)
- CRUD operations
- Admin assignment
- User association

#### User Management (`/api/users`)
- User CRUD
- Quota management
- Role assignment

#### Image Management (`/api/images`)
- Upload to S3
- Metadata storage
- Tag management
- Quota validation

#### Payment Processing (`/api/payments`)
- Razorpay integration
- Order creation
- Payment verification
- Quota updates

#### Notifications (`/api/notifications`)
- User tagging notifications
- Upload notifications
- Real-time updates

### 3. Database (PostgreSQL + Prisma)

**Schema:**

```prisma
User
├── id
├── name
├── email
├── password
├── role (PRODUCT_OWNER | ADMIN | USER)
├── organizationId
├── imageQuota
└── timestamps

Organization
├── id
├── name
├── logoUrl
├── address
├── phone
├── adminId
└── timestamps

Image
├── id
├── url
├── uploadedById
├── organizationId
├── tags[]
└── createdAt

Payment
├── id
├── userId
├── organizationId
├── amount
├── slotsPurchased
├── transactionId
├── status
└── createdAt

Notification
├── id
├── organizationId
├── senderId
├── receiverIds[]
├── imageId
├── message
└── createdAt
```

### 4. Storage (AWS S3)

**Configuration:**
- Bucket: Private with signed URLs
- CORS: Enabled for frontend domain
- Lifecycle: Optional archival rules
- CDN: Optional CloudFront integration

**Upload Flow:**
1. Frontend requests upload
2. Backend validates quota
3. Multer-S3 handles upload
4. S3 returns URL
5. Metadata saved to database
6. Quota decremented

### 5. Payment Gateway (Razorpay)

**Integration:**
- Order creation
- Payment verification
- Webhook handling (future)
- Transaction logging

**Pricing:**
- ₹100 per 5 images
- Instant quota update
- Payment history tracking

### 6. MCP Server

**Purpose:**
Exposes backend capabilities as tools that AI agents can invoke.

**Tools:**
- `get_user_quota` - Check remaining uploads
- `upload_image` - Upload images
- `purchase_slots` - Buy more slots
- `get_organization_images` - Fetch images
- `send_notification` - Send notifications
- `create_user` - Add users
- `create_organization` - Create orgs
- `get_upload_statistics` - Analytics

**Protocol:**
- Stdio-based communication
- JSON-RPC format
- Tool schema validation

### 7. AI Agent Layer

**Architecture:**

```
User Request
    ↓
Orchestrator (determines agent type)
    ↓
AI Provider (Gemini/Groq/Ollama)
    ↓
Tool Execution (via MCP)
    ↓
Response to User
```

**Agents:**

1. **Upload Assistant**
   - Helps with image uploads
   - Suggests tags
   - Sends notifications

2. **Quota Assistant**
   - Checks remaining quota
   - Suggests purchases
   - Explains limits

3. **Payment Assistant**
   - Guides payment process
   - Confirms purchases
   - Updates quota

4. **Analytics Assistant**
   - Provides statistics
   - Identifies top contributors
   - Detects inactive users

**AI Providers (Free Options):**

1. **Google Gemini**
   - Model: gemini-pro
   - Free tier: 60 requests/minute
   - Best for: General queries

2. **Groq**
   - Model: llama3-70b-8192
   - Free tier: High speed
   - Best for: Fast responses

3. **Ollama (Local)**
   - Models: llama3, mistral, deepseek-coder
   - Completely free
   - Best for: Privacy, no API costs

## Data Flow

### Image Upload Flow

```
1. User selects image in frontend
2. Frontend validates file type/size
3. POST /api/images/upload with FormData
4. Backend authenticates user
5. Backend checks quota
6. Multer-S3 uploads to S3
7. S3 returns URL
8. Backend saves metadata to DB
9. Backend decrements quota
10. Backend creates notifications
11. Response sent to frontend
12. Frontend displays success
```

### Payment Flow

```
1. User clicks "Buy Slots"
2. Frontend calls POST /api/payments/create-order
3. Backend creates Razorpay order
4. Frontend opens Razorpay checkout
5. User completes payment
6. Razorpay returns payment details
7. Frontend calls POST /api/payments/verify
8. Backend verifies signature
9. Backend creates payment record
10. Backend updates user quota
11. Response sent to frontend
12. Frontend shows success
```

### AI Agent Flow

```
1. User sends message to AI
2. Orchestrator determines agent type
3. Agent builds system prompt
4. AI provider generates response
5. Agent parses for tool calls
6. MCP server executes tools
7. Results returned to agent
8. Agent formats final response
9. Response sent to user
```

## Security

### Authentication
- JWT tokens with expiration
- Secure password hashing (bcrypt)
- Role-based access control

### Authorization
- Middleware validation
- Resource ownership checks
- Role-based permissions

### Data Protection
- HTTPS in production
- Environment variables for secrets
- S3 bucket policies
- CORS configuration

### Input Validation
- Zod schema validation
- File type/size limits
- SQL injection prevention (Prisma)

## Scalability

### Horizontal Scaling
- Stateless backend API
- Load balancer ready
- Database connection pooling

### Caching Strategy (Future)
- Redis for sessions
- CDN for images
- API response caching

### Performance Optimization
- Image compression
- Lazy loading
- Database indexing
- Query optimization

## Monitoring & Logging

### Application Logs
- Request/response logging
- Error tracking
- Performance metrics

### Database Monitoring
- Query performance
- Connection pool status
- Slow query detection

### Infrastructure
- Server health checks
- Resource utilization
- Uptime monitoring

## Deployment Architecture

### Development
```
Local Machine
├── Frontend (localhost:3000)
├── Backend (localhost:4000)
├── MCP Server (stdio)
├── AI Agent (localhost:6000)
└── PostgreSQL (localhost:5432)
```

### Production
```
Cloud Infrastructure
├── Frontend (Vercel/Netlify)
├── Backend (AWS/GCP/Heroku)
├── Database (AWS RDS/Supabase)
├── Storage (AWS S3)
├── MCP Server (Cloud VM)
└── AI Agent (Cloud VM)
```

## Future Enhancements

1. **AI Features**
   - Image tagging with AI
   - Duplicate detection
   - Semantic search
   - Face recognition

2. **Performance**
   - Image CDN
   - Caching layer
   - Database replication
   - Queue system

3. **Features**
   - Mobile apps
   - Bulk uploads
   - Image editing
   - Advanced analytics
   - Email notifications

4. **Infrastructure**
   - Kubernetes deployment
   - Auto-scaling
   - Multi-region
   - Disaster recovery
