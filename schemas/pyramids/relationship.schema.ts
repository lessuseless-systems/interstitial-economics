/**
 * Relationship pyramid schema
 * Tracks interactions and dynamics with specific people
 */
import { z } from 'zod';
import {
  PyramidBaseSchema,
  SentimentEnum,
  DatapointSchema,
  DurationSchema
} from '../base.schema';

/**
 * Direction of interaction
 */
export const DirectionEnum = z.enum(['you→them', 'them→you', 'mutual']);

/**
 * Reciprocity balance
 */
export const ReciprocityEnum = z.enum([
  'balanced',
  'you-give-more',
  'they-give-more',
  'unknown'
]);

/**
 * Relationship type
 */
export const RelationshipTypeEnum = z.enum([
  'family',
  'friend',
  'neighbor',
  'colleague',
  'acquaintance',
  'other'
]);

/**
 * Individual interaction record
 */
export const InteractionRecordSchema = z.object({
  entry_id: z.string(),
  date: z.date(),
  type: z.string(),
  duration: DurationSchema.optional(),
  direction: DirectionEnum,
  your_investment: z.string().describe('What you gave (time, resources, etc.)'),
  their_return: z.string().optional().describe('What they gave back'),
  sentiment: SentimentEnum.optional()
});

/**
 * Datapoints for relationship pyramid
 */
export const RelationshipDatapointsSchema = z.object({
  frequency: DatapointSchema(z.number().int().min(0)),

  duration: DatapointSchema(z.array(DurationSchema.nullable())),

  direction: DatapointSchema(z.array(DirectionEnum)),

  reciprocity: DatapointSchema(ReciprocityEnum),

  context: DatapointSchema(z.array(z.string())),

  sentiment: DatapointSchema(SentimentEnum),

  outcome: DatapointSchema(z.array(z.string().nullable()))
});

/**
 * Complete relationship pyramid schema
 */
export const RelationshipPyramidSchema = PyramidBaseSchema.extend({
  type: z.literal('relationship'),

  // Relationship-specific fields
  relationship_type: RelationshipTypeEnum.optional(),

  datapoints: RelationshipDatapointsSchema,

  interactions: z.array(InteractionRecordSchema),

  // Calculated fields
  total_time_invested: DurationSchema.optional().describe('Total minutes you invested'),
  total_time_received: DurationSchema.optional().describe('Total minutes received'),
  net_balance_minutes: z.number().optional().describe('Net time balance (positive = you give more)'),

  // Analysis flags
  prosocial_pattern: z.boolean()
    .optional()
    .describe('Helping without expecting return'),

  last_interaction_date: z.date().optional()
});

/**
 * Questions for relationship pyramids
 */
export const RelationshipQuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  fills_datapoint: z.enum([
    'frequency',
    'duration',
    'direction',
    'reciprocity',
    'context',
    'sentiment',
    'outcome'
  ]),
  priority_boost: z.number().default(1.0),
  triggered: z.boolean()
});

// Type exports
export type Direction = z.infer<typeof DirectionEnum>;
export type Reciprocity = z.infer<typeof ReciprocityEnum>;
export type RelationshipType = z.infer<typeof RelationshipTypeEnum>;
export type InteractionRecord = z.infer<typeof InteractionRecordSchema>;
export type RelationshipDatapoints = z.infer<typeof RelationshipDatapointsSchema>;
export type RelationshipPyramid = z.infer<typeof RelationshipPyramidSchema>;
export type RelationshipQuestion = z.infer<typeof RelationshipQuestionSchema>;

/**
 * Helper to calculate completeness for relationship pyramid
 */
export function calculateRelationshipCompleteness(pyramid: RelationshipPyramid): number {
  const datapoints = pyramid.datapoints;
  const fields = Object.keys(datapoints) as Array<keyof typeof datapoints>;

  const completedCount = fields.filter(key => datapoints[key].complete).length;
  const totalCount = fields.length;

  return Math.round((completedCount / totalCount) * 100);
}

/**
 * Helper to determine next question for relationship pyramid
 */
export function getNextRelationshipQuestion(pyramid: RelationshipPyramid): string | null {
  const { datapoints, interactions } = pyramid;

  // Priority order for questions
  if (!datapoints.duration.complete && interactions.some(i => i.duration === undefined)) {
    return `How long did your interaction with ${pyramid.subject.replace(/\[\[|\]\]/g, '')} take?`;
  }

  if (!datapoints.reciprocity.complete && interactions.length >= 3) {
    return `Has ${pyramid.subject.replace(/\[\[|\]\]/g, '')} helped you before?`;
  }

  if (!datapoints.sentiment.complete) {
    return `How do you generally feel after interacting with ${pyramid.subject.replace(/\[\[|\]\]/g, '')}?`;
  }

  if (!datapoints.outcome.complete) {
    return `How did things turn out with ${pyramid.subject.replace(/\[\[|\]\]/g, '')}?`;
  }

  return null;
}
