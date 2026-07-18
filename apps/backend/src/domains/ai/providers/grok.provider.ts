import OpenAI from 'openai';
import { ChatProvider, EmbeddingProvider, ChatMessage } from './interfaces';

export class GrokProvider implements ChatProvider, EmbeddingProvider {
  private client: OpenAI;
  private defaultModel = 'grok-beta';

  constructor(apiKey: string, baseURL: string = 'https://api.x.ai/v1') {
    this.client = new OpenAI({
      apiKey,
      baseURL,
    });
  }

  async generateCompletion(messages: ChatMessage[], options?: { temperature?: number; maxTokens?: number; model?: string }): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: options?.model || this.defaultModel,
      messages: messages as any,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens,
    });

    return response.choices[0]?.message?.content || '';
  }

  async generateEmbedding(text: string, model: string = 'text-embedding-v1'): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model,
      input: text,
    });
    return response.data[0].embedding;
  }
}
