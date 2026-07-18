import { aiGateway } from '../gateway/ai.gateway';
import { vectorStore } from '../vector/vector.store';
import { AIInsightModel } from '../models/ai-insight.model';

export class DuplicateDetectorService {
  async detectDuplicates(issueId: string, title: string, description: string) {
    const textToEmbed = `Title: ${title}\nDescription: ${description}`;
    const embedding = await aiGateway.generateEmbedding(textToEmbed);
    
    const provider = process.env.GROK_API_KEY ? 'grok' : 'mock';
    const model = process.env.GROK_API_KEY ? 'text-embedding-v1' : 'mock-model';

    await vectorStore.saveEmbedding('ISSUE', issueId, provider, model, embedding);

    const similar = await vectorStore.searchSimilar(embedding, 'ISSUE', 5);
    
    const potentialDuplicates = similar.filter(res => res.resourceId !== issueId && res.score > 0.85);

    if (potentialDuplicates.length > 0) {
      const insight = new AIInsightModel({
        resourceType: 'ISSUE',
        resourceId: issueId,
        capability: 'DUPLICATE_DETECTION',
        provider,
        model,
        confidence: Math.round(potentialDuplicates[0].score * 100),
        result: {
          duplicates: potentialDuplicates.map(d => ({ issueId: d.resourceId, score: d.score }))
        }
      });
      await insight.save();
      return insight;
    }

    return null;
  }
}

export const duplicateDetectorService = new DuplicateDetectorService();
