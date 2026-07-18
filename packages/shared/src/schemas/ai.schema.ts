import { z } from 'zod';

export const AIInsightSchema = z.object({
  id: z.string(),
  resourceType: z.enum(['ISSUE', 'COMMENT', 'CAMPAIGN', 'EVENT']),
  resourceId: z.string(),
  capability: z.enum(['CLASSIFICATION', 'DUPLICATE_DETECTION', 'ROUTING', 'SUMMARIZATION', 'MODERATION', 'TRANSLATION']),
  provider: z.string(),
  model: z.string(),
  confidence: z.number().min(0).max(100),
  result: z.any(), // Flexible payload depending on capability
  createdAt: z.date(),
  acceptedBy: z.string().optional(),
  acceptedAt: z.date().optional(),
});
export type AIInsight = z.infer<typeof AIInsightSchema>;

export const AIRequestLogSchema = z.object({
  id: z.string(),
  provider: z.string(),
  model: z.string(),
  latencyMs: z.number(),
  tokens: z.number().optional(),
  estimatedCost: z.number().optional(),
  status: z.enum(['SUCCESS', 'ERROR', 'TIMEOUT']),
  feature: z.string(),
  cacheHit: z.boolean().default(false),
  retryCount: z.number().default(0),
  promptVersion: z.string().optional(),
  createdAt: z.date(),
});
export type AIRequestLog = z.infer<typeof AIRequestLogSchema>;

export const AIFeedbackSchema = z.object({
  id: z.string(),
  insightId: z.string(), // Refers to AIInsight
  userAction: z.enum(['ACCEPTED', 'MODIFIED', 'REJECTED', 'IGNORED']),
  originalResult: z.any(),
  modifiedResult: z.any().optional(),
  userId: z.string(),
  createdAt: z.date(),
});
export type AIFeedback = z.infer<typeof AIFeedbackSchema>;
