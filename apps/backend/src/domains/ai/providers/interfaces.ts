export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatProvider {
  generateCompletion(messages: ChatMessage[], options?: { temperature?: number; maxTokens?: number; model?: string }): Promise<string>;
}

export interface EmbeddingProvider {
  generateEmbedding(text: string, model?: string): Promise<number[]>;
}

export interface ModerationProvider {
  moderateText(text: string): Promise<{ flagged: boolean; categories: string[] }>;
}

export interface TranslationProvider {
  translateText(text: string, targetLanguage: string): Promise<string>;
}

export interface VisionProvider {
  analyzeImage(imageUrl: string, prompt: string): Promise<string>;
}
