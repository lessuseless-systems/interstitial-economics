/**
 * User configuration schema
 * Settings and preferences for the journaling system
 */
import { z } from 'zod';
import { PatternTypeEnum } from './pyramids/pattern.schema';

/**
 * Voice interface configuration
 */
export const VoiceConfigSchema = z.object({
  prompt_frequency: z.number()
    .int()
    .min(1)
    .max(20)
    .default(5)
    .describe('How many times per day to prompt for journaling'),

  question_tolerance: z.number()
    .int()
    .min(0)
    .max(3)
    .default(1)
    .describe('Maximum questions to ask per entry'),

  voice_provider: z.enum([
    'whisper-local',
    'openai-whisper',
    'google-stt',
    'apple-dictation'
  ]).default('whisper-local')
    .describe('Speech-to-text provider'),

  voice_language: z.string()
    .default('en-US')
    .describe('Language code for voice recognition'),

  auto_prompt_contexts: z.array(z.enum([
    'location-change',
    'calendar-event-end',
    'time-interval',
    'manual-only'
  ])).default(['calendar-event-end', 'time-interval'])
    .describe('When to automatically prompt for journaling'),

  quiet_hours: z.object({
    enabled: z.boolean().default(false),
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('22:00'),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('07:00')
  }).optional()
});

/**
 * Pyramid configuration
 */
export const PyramidConfigSchema = z.object({
  auto_generate: z.boolean()
    .default(true)
    .describe('Automatically create pyramids from patterns'),

  relationship_threshold: z.number()
    .int()
    .min(2)
    .max(10)
    .default(3)
    .describe('Number of mentions before creating relationship pyramid'),

  pattern_threshold: z.number()
    .int()
    .min(3)
    .max(15)
    .default(5)
    .describe('Number of instances before detecting pattern'),

  time_period: z.enum(['day', 'week', 'month'])
    .default('week')
    .describe('Default time aggregation period'),

  enabled_patterns: z.array(PatternTypeEnum)
    .default([
      'prosocial',
      'transactional',
      'commitment',
      'value-alignment',
      'energy-management'
    ])
    .describe('Which patterns to detect'),

  completeness_threshold: z.number()
    .int()
    .min(50)
    .max(100)
    .default(70)
    .describe('Minimum completeness before generating report')
});

/**
 * Privacy configuration
 */
export const PrivacyConfigSchema = z.object({
  sync_reports: z.boolean()
    .default(false)
    .describe('Sync reports to cloud'),

  encryption_enabled: z.boolean()
    .default(true)
    .describe('Encrypt journal entries at rest'),

  local_only: z.boolean()
    .default(true)
    .describe('Keep all data local (no network)'),

  share_analytics: z.boolean()
    .default(false)
    .describe('Share anonymized usage analytics'),

  export_format: z.enum(['markdown', 'json', 'both'])
    .default('markdown')
    .describe('Format for exported data')
});

/**
 * Storage configuration
 */
export const StorageConfigSchema = z.object({
  journal_path: z.string()
    .default('~/interstitial-journal')
    .describe('Path to journal directory'),

  entries_subdir: z.string()
    .default('entries')
    .describe('Subdirectory for entry files'),

  reports_subdir: z.string()
    .default('reports')
    .describe('Subdirectory for report files'),

  backup_enabled: z.boolean()
    .default(true)
    .describe('Enable automatic backups'),

  backup_frequency: z.enum(['daily', 'weekly', 'monthly'])
    .default('weekly')
    .describe('Backup frequency'),

  max_backups: z.number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .describe('Maximum number of backups to keep')
});

/**
 * AI/ML configuration
 */
export const AIConfigSchema = z.object({
  entity_extraction: z.enum(['local', 'cloud', 'hybrid'])
    .default('local')
    .describe('Where to run entity extraction'),

  local_model: z.string()
    .default('distilbert-base-uncased')
    .describe('Local ML model to use'),

  confidence_threshold: z.number()
    .min(0)
    .max(1)
    .default(0.7)
    .describe('Minimum confidence for entity extraction'),

  generate_reflections: z.boolean()
    .default(true)
    .describe('Auto-generate AI reflections'),

  reflection_frequency: z.enum(['always', 'sometimes', 'never'])
    .default('sometimes')
    .describe('How often to generate reflections')
});

/**
 * Notification configuration
 */
export const NotificationConfigSchema = z.object({
  enabled: z.boolean().default(true),

  prompt_style: z.enum(['silent', 'gentle', 'persistent'])
    .default('gentle')
    .describe('How assertive to be with prompts'),

  report_notifications: z.boolean()
    .default(false)
    .describe('Notify when new reports are generated'),

  milestone_notifications: z.boolean()
    .default(true)
    .describe('Notify on milestones (100 entries, etc.)')
});

/**
 * Complete user configuration schema
 */
export const UserConfigSchema = z.object({
  version: z.string().default('1.0'),

  voice_interface: VoiceConfigSchema.default({}),
  pyramids: PyramidConfigSchema.default({}),
  privacy: PrivacyConfigSchema.default({}),
  storage: StorageConfigSchema.default({}),
  ai: AIConfigSchema.default({}),
  notifications: NotificationConfigSchema.default({})
});

// Type exports
export type VoiceConfig = z.infer<typeof VoiceConfigSchema>;
export type PyramidConfig = z.infer<typeof PyramidConfigSchema>;
export type PrivacyConfig = z.infer<typeof PrivacyConfigSchema>;
export type StorageConfig = z.infer<typeof StorageConfigSchema>;
export type AIConfig = z.infer<typeof AIConfigSchema>;
export type NotificationConfig = z.infer<typeof NotificationConfigSchema>;
export type UserConfig = z.infer<typeof UserConfigSchema>;

/**
 * Helper to load and validate config with defaults
 */
export function loadConfig(rawConfig: unknown): UserConfig {
  return UserConfigSchema.parse(rawConfig);
}

/**
 * Helper to generate default config
 */
export function generateDefaultConfig(): UserConfig {
  return UserConfigSchema.parse({});
}

/**
 * Helper to export config as JSON
 */
export function configToJSON(config: UserConfig): string {
  return JSON.stringify(config, null, 2);
}
