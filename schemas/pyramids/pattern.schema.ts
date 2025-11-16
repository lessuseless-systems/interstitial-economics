/**
 * Behavioral pattern pyramid schema
 * Detects and tracks recurring behavioral patterns
 */
import { z } from 'zod';
import {
  PyramidBaseSchema,
  SentimentEnum,
  DatapointSchema
} from '../base.schema';

/**
 * Pattern types we detect
 */
export const PatternTypeEnum = z.enum([
  'prosocial',      // Helping without reciprocity expectation
  'transactional',  // Explicit exchanges
  'avoidance',      // Declining requests
  'commitment',     // Follow-through on promises
  'decision-making',// How decisions are made
  'value-alignment',// Actions matching stated values
  'energy-management', // Rest/activity cycles
  'time-investment',   // Where time goes
  'relationship-building', // Network expansion
  'learning',       // Knowledge acquisition patterns
  'creating',       // Creative work patterns
  'other'
]);

/**
 * Pattern instance (single occurrence of pattern)
 */
export const PatternInstanceSchema = z.object({
  entry_id: z.string(),
  date: z.date(),
  description: z.string(),
  context: z.string().optional(),
  outcome: z.string().optional(),
  matches_pattern: z.boolean(),
  is_exception: z.boolean().default(false)
});

/**
 * Pattern motivation
 */
export const MotivationSchema = z.object({
  stated: z.string().describe('What user says motivates them'),
  revealed: z.string().describe('What actions reveal as motivation'),
  alignment: z.number().min(0).max(100).describe('Percentage alignment')
});

/**
 * Contextual factors that influence pattern
 */
export const ContextualFactorSchema = z.object({
  factor: z.string(),
  influence: z.enum(['increases', 'decreases', 'neutral']),
  confidence: z.enum(['high', 'medium', 'low'])
});

/**
 * Datapoints for pattern pyramid
 */
export const PatternDatapointsSchema = z.object({
  frequency: DatapointSchema(z.number().int().min(0)),

  context: DatapointSchema(z.array(z.string())),

  exceptions: DatapointSchema(z.array(PatternInstanceSchema)),

  motivation: DatapointSchema(MotivationSchema),

  outcomes: DatapointSchema(z.array(z.string())),

  sustainability: DatapointSchema(z.enum(['sustainable', 'at-risk', 'unsustainable']))
});

/**
 * Complete pattern pyramid schema
 */
export const PatternPyramidSchema = PyramidBaseSchema.extend({
  type: z.literal('pattern'),

  // Pattern-specific fields
  pattern_type: PatternTypeEnum,

  datapoints: PatternDatapointsSchema,

  // Instances
  instances: z.array(PatternInstanceSchema),
  counter_examples: z.array(PatternInstanceSchema),

  // Analysis
  frequency_percentage: z.number().min(0).max(100)
    .describe('Percentage of relevant situations where pattern appears'),

  contextual_factors: z.array(ContextualFactorSchema),

  // Trends
  trend: z.enum(['increasing', 'decreasing', 'stable']).optional(),

  first_detected: z.date(),
  last_occurrence: z.date().optional(),

  // Predictions
  predicted_sustainability: z.enum(['sustainable', 'at-risk', 'unsustainable']).optional(),
  risk_factors: z.array(z.string()).default([])
});

/**
 * Pattern discovery criteria
 */
export const PatternDiscoverySchema = z.object({
  pattern_type: PatternTypeEnum,
  min_instances: z.number().int().min(3).default(5),
  min_frequency_percentage: z.number().min(50).default(70),
  lookback_days: z.number().int().min(7).default(30)
});

// Type exports
export type PatternType = z.infer<typeof PatternTypeEnum>;
export type PatternInstance = z.infer<typeof PatternInstanceSchema>;
export type Motivation = z.infer<typeof MotivationSchema>;
export type ContextualFactor = z.infer<typeof ContextualFactorSchema>;
export type PatternDatapoints = z.infer<typeof PatternDatapointsSchema>;
export type PatternPyramid = z.infer<typeof PatternPyramidSchema>;
export type PatternDiscovery = z.infer<typeof PatternDiscoverySchema>;

/**
 * Helper to calculate pattern frequency
 */
export function calculatePatternFrequency(pyramid: PatternPyramid): number {
  const total = pyramid.instances.length + pyramid.counter_examples.length;
  if (total === 0) return 0;

  const matching = pyramid.instances.filter(i => i.matches_pattern && !i.is_exception).length;
  return Math.round((matching / total) * 100);
}

/**
 * Helper to detect if pattern is at risk
 */
export function assessPatternSustainability(pyramid: PatternPyramid): 'sustainable' | 'at-risk' | 'unsustainable' {
  const recentInstances = pyramid.instances
    .filter(i => {
      const daysSince = (Date.now() - i.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 14;
    });

  const recentExceptions = recentInstances.filter(i => i.is_exception);

  // If >50% of recent instances are exceptions, pattern is at risk
  if (recentExceptions.length / recentInstances.length > 0.5) {
    return 'at-risk';
  }

  // If no instances in last 14 days, unsustainable
  if (recentInstances.length === 0 && pyramid.instances.length > 0) {
    return 'unsustainable';
  }

  return 'sustainable';
}

/**
 * Helper to get next question for pattern pyramid
 */
export function getNextPatternQuestion(pyramid: PatternPyramid): string | null {
  const { datapoints, instances } = pyramid;

  // Ask about motivation if not captured
  if (!datapoints.motivation.complete) {
    return `What motivates your ${pyramid.subject} behavior?`;
  }

  // Ask about exceptions
  if (!datapoints.exceptions.complete && instances.length > 5) {
    return `Have you ever NOT followed your ${pyramid.subject} pattern? When?`;
  }

  // Ask about outcomes if missing
  if (!datapoints.outcomes.complete) {
    return `How does your ${pyramid.subject} pattern usually work out?`;
  }

  // Ask about sustainability
  if (!datapoints.sustainability.complete && instances.length > 10) {
    return `Do you feel your ${pyramid.subject} pattern is sustainable long-term?`;
  }

  return null;
}
