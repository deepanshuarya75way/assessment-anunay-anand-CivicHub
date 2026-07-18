import { ChatProvider, EmbeddingProvider } from '../providers/interfaces';
import { GrokProvider } from '../providers/grok.provider';
import { MockProvider } from '../providers/mock.provider';

export class AIGateway {
  private chatProvider: ChatProvider;
  private embeddingProvider: EmbeddingProvider;

  constructor() {
    const useMock = process.env.NODE_ENV === 'test' || !process.env.GROK_API_KEY;
    
    if (useMock) {
      const mock = new MockProvider();
      this.chatProvider = mock;
      this.embeddingProvider = mock;
    } else {
      const grok = new GrokProvider(process.env.GROK_API_KEY!);
      this.chatProvider = grok;
      this.embeddingProvider = grok;
    }
  }

  async generateChatCompletion(systemPrompt: string, userPrompt: string, options?: any) {
    return this.chatProvider.generateCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], options);
  }

  async generateEmbedding(text: string) {
    return this.embeddingProvider.generateEmbedding(text);
  }
}

export const aiGateway = new AIGateway();
