import Groq from 'groq-sdk';
import { AIProvider } from './index.js';

export class GroqProvider implements AIProvider {
  private client: Groq;

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey });
  }

  async generate(prompt: string, context?: any): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama3-70b-8192', // or mixtral-8x7b-32768
        temperature: 0.7,
        max_tokens: 1024,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error: any) {
      throw new Error(`Groq API error: ${error.message}`);
    }
  }
}
