import axios from 'axios';
import { AIProvider } from './index.js';

export class OllamaProvider implements AIProvider {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async generate(prompt: string, context?: any): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: 'llama3', // or mistral, deepseek-coder, etc.
        prompt,
        stream: false,
      });

      return response.data.response;
    } catch (error: any) {
      throw new Error(`Ollama error: ${error.message}`);
    }
  }
}
