import { aiGateway } from '../gateway/ai.gateway';
import { promptRepository } from '../prompt/prompt.repository';
import { AIInsightModel } from '../models/ai-insight.model';

export class DiscussionSummarizerService {
  async summarizeThread(resourceType: 'ISSUE' | 'CAMPAIGN' | 'EVENT', resourceId: string, commentsText: string) {
    const promptTemplate = await promptRepository.getPrompt('discussion-summarization');
    const userPrompt = `Discussion:\n${commentsText}`;

    const response = await aiGateway.generateChatCompletion(promptTemplate.content, userPrompt, { temperature: 0.3 });
    
    // Summary is usually plain text, but we'll assume the prompt forces a JSON response like { summary: "...", confidence: 95 }
    let parsedResult;
    try {
      parsedResult = JSON.parse(response);
    } catch (e) {
      // Fallback if not JSON
      parsedResult = { summary: response, confidence: 80 };
    }

    const insight = new AIInsightModel({
      resourceType,
      resourceId,
      capability: 'SUMMARIZATION',
      provider: process.env.GROK_API_KEY ? 'grok' : 'mock',
      model: process.env.GROK_API_KEY ? 'grok-beta' : 'mock-model',
      confidence: parsedResult.confidence || 80,
      result: {
        summary: parsedResult.summary
      }
    });

    await insight.save();
    return insight;
  }
}

export const discussionSummarizerService = new DiscussionSummarizerService();
