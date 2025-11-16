/**
 * Journal entry schemas - the core data structure for voice journaling
 */
import { z } from 'zod';
import {
  UUIDSchema,
  DateTimeSchema,
  PeopleSchema,
  DurationSchema,
  ActivityTypeEnum,
  SentimentEnum,
  TagsSchema,
  EnergyLevelSchema
} from './base.schema';

/**
 * Frontmatter schema - metadata extracted from voice and AI
 */
export const FrontmatterSchema = z.object({
  created: DateTimeSchema,
  type: z.enum(['interaction', 'reflection', 'task', 'event']).optional(),
  people: PeopleSchema,
  duration: DurationSchema.optional(),
  activity: ActivityTypeEnum.optional(),
  location: z.string().optional(),
  tags: TagsSchema,
  energy: EnergyLevelSchema,
  sentiment: SentimentEnum.optional(),
  context: z.string().optional().describe('Situational context'),

  // Pyramid tracking
  pyramids: z.array(z.string())
    .default([])
    .describe('List of pyramid IDs this entry supports')
});

/**
 * Complete journal entry schema
 */
export const JournalEntrySchema = z.object({
  id: UUIDSchema,

  // Metadata
  ...FrontmatterSchema.shape,

  // Content
  transcript: z.string()
    .min(1, 'Transcript cannot be empty')
    .describe('Raw voice transcript'),

  reflection: z.string()
    .optional()
    .describe('AI-generated reflection (optional)'),

  // File metadata
  filename: z.string()
    .optional()
    .describe('Markdown filename'),

  filepath: z.string()
    .optional()
    .describe('Full path to markdown file')
});

/**
 * Minimal entry for quick capture (before AI processing)
 */
export const RawEntrySchema = z.object({
  transcript: z.string().min(1),
  created: DateTimeSchema.default(() => new Date())
});

/**
 * AI extraction result schema
 */
export const ExtractedEntitiesSchema = z.object({
  people: z.array(z.string()).default([]),
  duration: z.number().optional(),
  activity: z.string().optional(),
  location: z.string().optional(),
  sentiment: SentimentEnum.optional(),
  energy: EnergyLevelSchema,
  tags: z.array(z.string()).default([]),

  // Extracted key phrases
  key_phrases: z.array(z.string()).default([]),

  // Questions detected in transcript
  questions_asked: z.array(z.string()).default([])
});

/**
 * Entry update schema (for patching existing entries)
 */
export const EntryUpdateSchema = JournalEntrySchema.partial().required({ id: true });

/**
 * Entry query filters
 */
export const EntryFilterSchema = z.object({
  people: z.array(z.string()).optional(),
  activity: ActivityTypeEnum.optional(),
  sentiment: SentimentEnum.optional(),
  date_from: DateTimeSchema.optional(),
  date_to: DateTimeSchema.optional(),
  min_duration: DurationSchema.optional(),
  max_duration: DurationSchema.optional(),
  tags: z.array(z.string()).optional(),
  pyramids: z.array(z.string()).optional()
});

// Type exports
export type Frontmatter = z.infer<typeof FrontmatterSchema>;
export type JournalEntry = z.infer<typeof JournalEntrySchema>;
export type RawEntry = z.infer<typeof RawEntrySchema>;
export type ExtractedEntities = z.infer<typeof ExtractedEntitiesSchema>;
export type EntryUpdate = z.infer<typeof EntryUpdateSchema>;
export type EntryFilter = z.infer<typeof EntryFilterSchema>;

/**
 * Helper to convert entry to markdown frontmatter
 */
export function entryToFrontmatter(entry: JournalEntry): string {
  const frontmatter = FrontmatterSchema.parse({
    created: entry.created,
    type: entry.type,
    people: entry.people,
    duration: entry.duration,
    activity: entry.activity,
    location: entry.location,
    tags: entry.tags,
    energy: entry.energy,
    sentiment: entry.sentiment,
    context: entry.context,
    pyramids: entry.pyramids
  });

  return `---
created: ${frontmatter.created.toISOString()}
${frontmatter.type ? `type: ${frontmatter.type}` : ''}
people: ${JSON.stringify(frontmatter.people)}
${frontmatter.duration !== undefined ? `duration: ${frontmatter.duration}` : ''}
${frontmatter.activity ? `activity: ${frontmatter.activity}` : ''}
${frontmatter.location ? `location: ${frontmatter.location}` : ''}
${frontmatter.tags.length > 0 ? `tags: ${JSON.stringify(frontmatter.tags)}` : ''}
${frontmatter.energy !== undefined ? `energy: ${frontmatter.energy}` : ''}
${frontmatter.sentiment ? `sentiment: ${frontmatter.sentiment}` : ''}
${frontmatter.context ? `context: ${frontmatter.context}` : ''}
pyramids: ${JSON.stringify(frontmatter.pyramids)}
---`;
}
