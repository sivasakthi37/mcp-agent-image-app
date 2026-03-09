import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider } from './index.js';

export class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generate(prompt: string, context?: any): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }
}
