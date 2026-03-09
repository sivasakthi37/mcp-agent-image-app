import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleAgentRequest } from './agents/orchestrator.js';

dotenv.config();

const app = express();
const PORT = process.env.AI_AGENT_PORT || 6000;

app.use(cors());
app.use(express.json());

// AI Agent endpoint
app.post('/api/agent/chat', async (req, res) => {
  try {
    const { message, userId, organizationId, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await handleAgentRequest({
      message,
      userId,
      organizationId,
      context,
    });

    res.json(response);
  } catch (error: any) {
    console.error('Agent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🤖 AI Agent server running on http://localhost:${PORT}`);
});
