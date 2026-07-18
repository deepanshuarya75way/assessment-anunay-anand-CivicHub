import { ChatProvider, EmbeddingProvider, ChatMessage } from './interfaces';

export class MockProvider implements ChatProvider, EmbeddingProvider {
  async generateCompletion(messages: ChatMessage[], options?: any): Promise<string> {
    // Returns a mock JSON that matches our expected classification output for testing
    return '{"category": "Infrastructure", "department": "Public Works", "severity": "HIGH", "confidence": 95}';
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Return a normalized random 1536d vector for mock cosine similarity
    const vec = Array(1536).fill(0).map(() => Math.random() * 2 - 1);
    const mag = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    return vec.map(v => v / mag);
  }
}
