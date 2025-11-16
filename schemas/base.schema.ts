/**
 * Base schemas and common types used across the journaling system
 */
import { z } from 'zod';

/**
 * Common enums
 */
export const SentimentEnum = z.enum(['positive', 'neutral', 'negative', 'mixed']);
export const ConfidenceEnum = z.enum(['high', 'medium', 'low']);
export const ActivityTypeEnum = z.enum([
  'helping',
  'working',
  'resting',
  'socializing',
  'learning',
  'creating',
  'organizing',
  'maintaining',
  'other'
]);

/**
 * Duration in minutes, with validation
 */
export const DurationSchema = z.number()
  .min(0, 'Duration cannot be negative')
  .max(1440, 'Duration cannot exceed 24 hours')
  .describe('Duration in minutes');

/**
 * Person reference (wiki-link style)
 * Accepts "Bob" or "[[Bob]]" and normalizes to "[[Bob]]"
 */
export const PersonLinkSchema = z.string()
  .min(1)
  .transform(name => {
    // Normalize to [[Name]] format
    const clean = name.replace(/\[\[|\]\]/g, '');
    return `[[${clean}]]`;
  })
  .describe('Person reference in wiki-link format');

/**
 * Array of person links
 */
export const PeopleSchema = z.array(PersonLinkSchema)
  .default([])
  .describe('List of people involved');

/**
 * ISO datetime string or Date object, normalized to Date
 */
export const DateTimeSchema = z.union([
  z.string().datetime(),
  z.date()
]).transform(d => typeof d === 'string' ? new Date(d) : d)
  .describe('Timestamp');

/**
 * UUID v4 string
 */
export const UUIDSchema = z.string()
  .uuid()
  .describe('Unique identifier');

/**
 * Completeness percentage (0-100)
 */
export const CompletenessSchema = z.number()
  .min(0)
  .max(100)
  .describe('Completeness percentage');

/**
 * Energy level (1-10 scale)
 */
export const EnergyLevelSchema = z.number()
  .int()
  .min(1)
  .max(10)
  .optional()
  .describe('Energy level from 1 (exhausted) to 10 (energized)');

/**
 * Tags array
 */
export const TagsSchema = z.array(z.string())
  .default([])
  .describe('Tags for categorization');

/**
 * Datapoint with completion tracking
 */
export const DatapointSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    value: valueSchema,
    complete: z.boolean(),
    last_updated: DateTimeSchema.optional()
  });

/**
 * Base pyramid metadata
 */
export const PyramidBaseSchema = z.object({
  id: z.string(),
  type: z.string(),
  subject: z.string(),
  created: DateTimeSchema,
  last_updated: DateTimeSchema,
  completeness: CompletenessSchema,
  confidence: ConfidenceEnum,
  status: z.enum(['initializing', 'active', 'mature', 'stable', 'archived']),
  entries: z.array(z.string()).describe('List of entry IDs that support this pyramid'),
  questions_pending: z.array(z.string()).default([]),
  questions_asked: z.number().int().min(0).default(0)
});

/**
 * Report metadata base
 */
export const ReportBaseSchema = z.object({
  report_type: z.string(),
  subject: z.string(),
  generated: DateTimeSchema,
  last_updated: DateTimeSchema,
  completeness: CompletenessSchema,
  confidence: ConfidenceEnum,
  entries_analyzed: z.number().int().min(0),
  auto_update: z.boolean().default(true)
});

// Type exports
export type Sentiment = z.infer<typeof SentimentEnum>;
export type Confidence = z.infer<typeof ConfidenceEnum>;
export type ActivityType = z.infer<typeof ActivityTypeEnum>;
export type Duration = z.infer<typeof DurationSchema>;
export type PersonLink = z.infer<typeof PersonLinkSchema>;
export type People = z.infer<typeof PeopleSchema>;
export type DateTime = z.infer<typeof DateTimeSchema>;
export type UUID = z.infer<typeof UUIDSchema>;
export type Completeness = z.infer<typeof CompletenessSchema>;
export type EnergyLevel = z.infer<typeof EnergyLevelSchema>;
export type Tags = z.infer<typeof TagsSchema>;
export type PyramidBase = z.infer<typeof PyramidBaseSchema>;
export type ReportBase = z.infer<typeof ReportBaseSchema>;
