import { EmbeddingModel } from '../models/embedding.model';

export interface VectorSearchResult {
  resourceId: string;
  resourceType: string;
  score: number;
}

export interface IVectorStore {
  saveEmbedding(resourceType: string, resourceId: string, provider: string, model: string, vector: number[]): Promise<void>;
  searchSimilar(vector: number[], resourceType: string, limit?: number): Promise<VectorSearchResult[]>;
}

export class AtlasVectorStore implements IVectorStore {
  async saveEmbedding(resourceType: string, resourceId: string, provider: string, model: string, vector: number[]): Promise<void> {
    await EmbeddingModel.findOneAndUpdate(
      { resourceType, resourceId },
      { provider, model, vector },
      { upsert: true, new: true }
    );
  }

  async searchSimilar(vector: number[], resourceType: string, limit: number = 5): Promise<VectorSearchResult[]> {
    const results = await EmbeddingModel.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'vector',
          queryVector: vector,
          numCandidates: 100,
          limit,
          filter: { resourceType }
        }
      },
      {
        $project: {
          resourceId: 1,
          resourceType: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ]);
    return results;
  }
}

export class MemoryVectorStore implements IVectorStore {
  async saveEmbedding(resourceType: string, resourceId: string, provider: string, model: string, vector: number[]): Promise<void> {
    await EmbeddingModel.findOneAndUpdate(
      { resourceType, resourceId },
      { provider, model, vector },
      { upsert: true, new: true }
    );
  }

  async searchSimilar(vector: number[], resourceType: string, limit: number = 5): Promise<VectorSearchResult[]> {
    // In-memory cosine similarity for local development without Atlas
    const allEmbeddings = await EmbeddingModel.find({ resourceType }).lean();
    
    const results = allEmbeddings.map(doc => {
      const score = this.cosineSimilarity(vector, doc.vector);
      return { resourceId: doc.resourceId, resourceType: doc.resourceType, score };
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export const vectorStore: IVectorStore = process.env.USE_ATLAS_VECTOR_SEARCH === 'true' 
  ? new AtlasVectorStore() 
  : new MemoryVectorStore();
