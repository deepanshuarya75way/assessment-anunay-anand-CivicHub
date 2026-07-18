import { aiGateway } from '../gateway/ai.gateway';
import { promptRepository } from '../prompt/prompt.repository';
import { AIInsightModel } from '../models/ai-insight.model';

export class ModerationService {
  async moderateContent(resourceType: 'COMMENT' | 'ISSUE', resourceId: string, text: string) {
    const promptTemplate = await promptRepository.getPrompt('content-moderation');
    const userPrompt = `Content to moderate:\n"${text}"`;

    const response = await aiGateway.generateChatCompletion(promptTemplate.content, userPrompt, { temperature: 0.0 });
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse AI moderation output', response);
      throw new Error('AI output was not valid JSON');
    }

    if (parsedResult.flagged || parsedResult.riskScore > 0.5) {
      const insight = new AIInsightModel({
        resourceType,
        resourceId,
        capability: 'MODERATION',
        provider: process.env.GROK_API_KEY ? 'grok' : 'mock',
        model: process.env.GROK_API_KEY ? 'grok-beta' : 'mock-model',
        confidence: parsedResult.confidence || 95,
        result: {
          flagged: parsedResult.flagged,
          categories: parsedResult.categories,
          riskScore: parsedResult.riskScore,
          reasoning: parsedResult.reasoning
        }
      });

      await insight.save();
      return insight;
    }
    
    return null;
  }
}

export const moderationService = new ModerationService();
