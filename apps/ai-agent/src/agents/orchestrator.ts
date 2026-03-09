import { getAIProvider } from '../providers/index.js';
import { mcpTools } from '../mcp/tools.js';

interface AgentRequest {
  message: string;
  userId?: string;
  organizationId?: string;
  context?: any;
}

export async function handleAgentRequest(request: AgentRequest) {
  const { message, userId, organizationId, context } = request;

  // Determine which agent to use based on the message
  const agent = determineAgent(message);

  // Get AI provider (Gemini, Groq, or Ollama)
  const aiProvider = await getAIProvider();

  // Build system prompt based on agent type
  const systemPrompt = buildSystemPrompt(agent, userId, organizationId);

  // Get available MCP tools
  const toolsDescription = mcpTools
    .map((tool) => `- ${tool.name}: ${tool.description}`)
    .join('\n');

  const fullPrompt = `${systemPrompt}\n\nAvailable tools:\n${toolsDescription}\n\nUser message: ${message}`;

  // Call AI provider
  const aiResponse = await aiProvider.generate(fullPrompt, context);

  // Parse AI response and execute MCP tools if needed
  const result = await executeTools(aiResponse, userId, organizationId);

  return {
    agent,
    response: result.response,
    toolsUsed: result.toolsUsed,
  };
}

function determineAgent(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('upload') ||
    lowerMessage.includes('image') ||
    lowerMessage.includes('tag')
  ) {
    return 'upload_assistant';
  }

  if (
    lowerMessage.includes('quota') ||
    lowerMessage.includes('limit') ||
    lowerMessage.includes('remaining')
  ) {
    return 'quota_assistant';
  }

  if (
    lowerMessage.includes('payment') ||
    lowerMessage.includes('purchase') ||
    lowerMessage.includes('buy')
  ) {
    return 'payment_assistant';
  }

  if (
    lowerMessage.includes('statistics') ||
    lowerMessage.includes('analytics') ||
    lowerMessage.includes('report')
  ) {
    return 'analytics_assistant';
  }

  return 'general_assistant';
}

function buildSystemPrompt(
  agent: string,
  userId?: string,
  organizationId?: string
): string {
  const basePrompt = `You are an AI assistant for an image upload and management system. `;

  switch (agent) {
    case 'upload_assistant':
      return (
        basePrompt +
        `You help users upload images, tag other users, and manage their uploads. 
        You can use tools to upload images and send notifications.`
      );

    case 'quota_assistant':
      return (
        basePrompt +
        `You help users check their upload quota and understand their limits. 
        You can use tools to check remaining uploads and suggest purchasing more slots if needed.`
      );

    case 'payment_assistant':
      return (
        basePrompt +
        `You help users purchase additional upload slots. Each pack costs ₹100 and provides 5 image uploads. 
        You can guide them through the payment process.`
      );

    case 'analytics_assistant':
      return (
        basePrompt +
        `You provide analytics and insights about image uploads in the organization. 
        You can show statistics, top contributors, and usage patterns.`
      );

    default:
      return (
        basePrompt +
        `You assist with general queries about the image upload system, user management, and organization features.`
      );
  }
}

async function executeTools(
  aiResponse: string,
  userId?: string,
  organizationId?: string
) {
  // Simple tool execution logic
  // In production, you'd parse the AI response for tool calls
  const toolsUsed: string[] = [];
  let response = aiResponse;

  // This is a simplified version - in production, use function calling
  // from Gemini/Groq or parse structured output

  return {
    response,
    toolsUsed,
  };
}
