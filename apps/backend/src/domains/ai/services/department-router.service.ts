import { aiGateway } from '../gateway/ai.gateway';
import { promptRepository } from '../prompt/prompt.repository';
import { AIInsightModel } from '../models/ai-insight.model';

export class DepartmentRouterService {
  async routeIssue(issueId: string, title: string, description: string, category: string) {
    const promptTemplate = await promptRepository.getPrompt('department-routing');
    const userPrompt = `Category: ${category}\nTitle: ${title}\nDescription: ${description}`;

    const response = await aiGateway.generateChatCompletion(promptTemplate.content, userPrompt, { temperature: 0.1 });
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse AI routing output', response);
      throw new Error('AI output was not valid JSON');
    }

    const insight = new AIInsightModel({
      resourceType: 'ISSUE',
      resourceId: issueId,
      capability: 'ROUTING',
      provider: process.env.GROK_API_KEY ? 'grok' : 'mock',
      model: process.env.GROK_API_KEY ? 'grok-beta' : 'mock-model',
      confidence: parsedResult.confidence || 90,
      result: {
        department: parsedResult.department,
        reasoning: parsedResult.reasoning
      }
    });

    await insight.save();
    return insight;
  }
}

export const departmentRouterService = new DepartmentRouterService();
