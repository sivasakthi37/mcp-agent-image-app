# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Razorpay account
- (Optional) Gemini API key or Groq API key or Ollama installed locally

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install dependencies for all apps
cd apps/backend && npm install
cd ../frontend && npm install
cd ../mcp-server && npm install
cd ../ai-agent && npm install
```

### 2. Environment Setup

Create `.env` files in each app directory:

#### Backend (.env in apps/backend/)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/image_upload_db"
NEXTAUTH_SECRET="your-secret-key-here"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_SECRET="your-razorpay-secret"
PORT=4000
```

#### Frontend (.env.local in apps/frontend/)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your-secret-key-here"
```

#### MCP Server (.env in apps/mcp-server/)
```env
BACKEND_URL=http://localhost:4000
```

#### AI Agent (.env in apps/ai-agent/)
```env
BACKEND_URL=http://localhost:4000
MCP_SERVER_URL=http://localhost:5000
GEMINI_API_KEY="your-gemini-api-key"
GROQ_API_KEY="your-groq-api-key"
OLLAMA_BASE_URL="http://localhost:11434"
AI_AGENT_PORT=6000
```

### 3. Database Setup

```bash
# Navigate to backend
cd apps/backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 4. Razorpay Setup

1. Sign up at https://razorpay.com
2. Get API keys from Dashboard
3. Add keys to backend .env

### 5. AI Provider Setup (Choose One)

**Option A: Google Gemini (Free)**
1. Get API key from https://makersuite.google.com/app/apikey
2. Add to AI agent .env

**Option B: Groq (Free)**
1. Get API key from https://console.groq.com
2. Add to AI agent .env

**Option C: Ollama (Local, Free)**
1. Install Ollama: https://ollama.ai
2. Pull a model: `ollama pull llama3`
3. Ensure Ollama is running

## Running the Application

### Development Mode

From the root directory:

```bash
# Run all services concurrently
npm run dev
```

Or run each service individually:

```bash
# Terminal 1 - Backend
cd apps/backend && npm run dev

# Terminal 2 - Frontend
cd apps/frontend && npm run dev

# Terminal 3 - MCP Server
cd apps/mcp-server && npm run dev

# Terminal 4 - AI Agent
cd apps/ai-agent && npm run dev
```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **AI Agent**: http://localhost:6000
- **MCP Server**: stdio (used by AI agents)

## Initial User Setup

1. Register a new user at http://localhost:3000/auth/register
2. For Product Owner access, manually update the user role in the database:
```sql
UPDATE users SET role = 'PRODUCT_OWNER' WHERE email = 'your@email.com';
```

## Testing the System

### 1. Create Organization (Product Owner)
- Login as Product Owner
- Create an organization
- Assign an admin

### 2. Add Users (Admin)
- Login as Admin
- Add users to the organization

### 3. Upload Images (User)
- Login as User
- Upload images (5 free uploads)
- Tag other users

### 4. Purchase Slots (User)
- When quota runs out
- Purchase additional slots via Razorpay

### 5. Test AI Agent
- Send requests to http://localhost:6000/api/agent/chat
- Example:
```bash
curl -X POST http://localhost:6000/api/agent/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How many images can I upload?",
    "userId": "user-id-here",
    "organizationId": "org-id-here"
  }'
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists

### AI Agent Not Responding
- Verify API keys are correct
- Check if Ollama is running (if using local)
- Review AI agent logs

### Frontend Build Errors
- Clear .next folder: `rm -rf apps/frontend/.next`
- Reinstall dependencies: `cd apps/frontend && npm install`

## Production Deployment

### Backend
- Set NODE_ENV=production
- Use production database
- Enable HTTPS
- Set secure CORS origins

### Frontend
- Build: `npm run build`
- Deploy to Vercel/Netlify
- Set environment variables

### Database
- Use managed PostgreSQL (AWS RDS, Supabase, etc.)
- Run migrations: `npx prisma migrate deploy`

### MCP Server & AI Agent
- Deploy to cloud (AWS, GCP, etc.)
- Use PM2 or similar for process management
- Set up monitoring

## Next Steps

- Configure PWA settings in next.config.js
- Set up email notifications
- Add image compression
- Implement caching
- Add monitoring and logging
- Set up CI/CD pipeline
