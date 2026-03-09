import { GeminiProvider } from './gemini.js';
import { GroqProvider } from './groq.js';
import { OllamaProvider } from './ollama.js';

export interface AIProvider {
  generate(prompt: string, context?: any): Promise<string>;
}

export async function getAIProvider(): Promise<AIProvider> {
  // Try Gemini first
  if (process.env.GEMINI_API_KEY) {
    return new GeminiProvider(process.env.GEMINI_API_KEY);
  }

  // Try Groq as backup
  if (process.env.GROQ_API_KEY) {
    return new GroqProvider(process.env.GROQ_API_KEY);
  }

  // Fall back to Ollama (local)
  return new OllamaProvider(
    process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
  );
}
