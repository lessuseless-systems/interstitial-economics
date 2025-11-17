/**
 * Validation utilities
 * Helper functions for validating and transforming data with Zod
 */
import { z } from 'zod';
import {
  JournalEntrySchema,
  ExtractedEntitiesSchema,
  type JournalEntry,
  type ExtractedEntities
} from '../schemas/journal-entry.schema';
import {
  PyramidSchema,
  type Pyramid
} from '../schemas/pyramids';
import { UserConfigSchema, type UserConfig } from '../schemas/config.schema';

/**
 * Validation result type
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Array<{ path: string; message: string }> };

/**
 * Safe parse wrapper that returns friendly error format
 */
export function safeValidate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): ValidationResult<z.infer<T>> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }))
  };
}

/**
 * Validate journal entry with helpful error messages
 */
export function validateJournalEntry(data: unknown): ValidationResult<JournalEntry> {
  return safeValidate(JournalEntrySchema, data);
}

/**
 * Validate extracted entities from AI
 */
export function validateExtractedEntities(data: unknown): ValidationResult<ExtractedEntities> {
  return safeValidate(ExtractedEntitiesSchema, data);
}

/**
 * Validate pyramid data
 */
export function validatePyramid(data: unknown): ValidationResult<Pyramid> {
  return safeValidate(PyramidSchema, data);
}

/**
 * Validate user config
 */
export function validateConfig(data: unknown): ValidationResult<UserConfig> {
  return safeValidate(UserConfigSchema, data);
}

/**
 * Merge AI-extracted entities with journal entry
 * Handles messy AI outputs gracefully
 */
export function mergeEntities(
  transcript: string,
  rawEntities: unknown
): JournalEntry {
  // Validate entities with defaults
  const entitiesResult = validateExtractedEntities(rawEntities);

  const entities = entitiesResult.success
    ? entitiesResult.data
    : {
        people: [],
        tags: [],
        key_phrases: [],
        questions_asked: []
      };

  // Create entry with validated data
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    created: new Date(),
    transcript,
    people: entities.people || [],
    duration: entities.duration,
    activity: entities.activity,
    location: entities.location,
    tags: entities.tags || [],
    energy: entities.energy,
    sentiment: entities.sentiment,
    pyramids: []
  };

  // Validate final entry
  return JournalEntrySchema.parse(entry);
}

/**
 * Clean and normalize person names
 * Handles various formats: "Bob", "[[Bob]]", "bob", etc.
 */
export function normalizePerson(name: string): string {
  return name
    .replace(/\[\[|\]\]/g, '') // Remove brackets
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Parse duration from natural language
 * "4 hours" → 240
 * "30 minutes" → 30
 * "2h 15m" → 135
 */
export function parseDuration(text: string): number | null {
  const patterns = [
    /(\d+)\s*(?:hours?|hrs?|h)/i,
    /(\d+)\s*(?:minutes?|mins?|m)/i
  ];

  let totalMinutes = 0;

  // Try to match hours
  const hoursMatch = text.match(patterns[0]);
  if (hoursMatch) {
    totalMinutes += parseInt(hoursMatch[1]) * 60;
  }

  // Try to match minutes
  const minutesMatch = text.match(patterns[1]);
  if (minutesMatch) {
    totalMinutes += parseInt(minutesMatch[1]);
  }

  return totalMinutes > 0 ? totalMinutes : null;
}

/**
 * Format duration for display
 * 240 → "4h"
 * 90 → "1h 30m"
 * 30 → "30m"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Validate and clean tags
 */
export function normalizeTags(tags: string[]): string[] {
  return tags
    .map(tag => tag.toLowerCase().trim())
    .filter(tag => tag.length > 0)
    .filter((tag, index, self) => self.indexOf(tag) === index); // Unique
}

/**
 * Check if data is a valid ISO date string
 */
export function isValidISODate(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  try {
    const date = new Date(value);
    return !isNaN(date.getTime()) && value === date.toISOString();
  } catch {
    return false;
  }
}

/**
 * Coerce value to Date
 */
export function toDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

/**
 * Deep partial - make all fields optional recursively
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/**
 * Merge partial updates into existing data
 */
export function mergePartial<T extends Record<string, any>>(
  existing: T,
  updates: DeepPartial<T>
): T {
  const result = { ...existing };

  for (const key in updates) {
    const updateValue = updates[key];

    if (updateValue !== undefined) {
      if (
        typeof updateValue === 'object' &&
        !Array.isArray(updateValue) &&
        updateValue !== null &&
        typeof existing[key] === 'object' &&
        !Array.isArray(existing[key]) &&
        existing[key] !== null
      ) {
        // Recursively merge objects
        result[key] = mergePartial(existing[key], updateValue);
      } else {
        // Direct assignment for primitives and arrays
        result[key] = updateValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}
