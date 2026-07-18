import { aiGateway } from '../gateway/ai.gateway';
import { promptRepository } from '../prompt/prompt.repository';
import { AIInsightModel } from '../models/ai-insight.model';

export class IssueClassifierService {
  async classifyIssue(issueId: string, title: string, description: string) {
    const promptTemplate = await promptRepository.getPrompt('issue-classification');
    const userPrompt = `Title: ${title}\nDescription: ${description}`;

    const response = await aiGateway.generateChatCompletion(promptTemplate.content, userPrompt, { temperature: 0.2 });
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse AI classification output', response);
      throw new Error('AI output was not valid JSON');
    }

    const insight = new AIInsightModel({
      resourceType: 'ISSUE',
      resourceId: issueId,
      capability: 'CLASSIFICATION',
      provider: process.env.GROK_API_KEY ? 'grok' : 'mock',
      model: process.env.GROK_API_KEY ? 'grok-beta' : 'mock-model',
      confidence: parsedResult.confidence || 85,
      result: {
        category: parsedResult.category,
        severity: parsedResult.severity,
      }
    });

    await insight.save();
    return insight;
  }
}

export const issueClassifierService = new IssueClassifierService();
