/**
 * Pyramid schemas - export all pyramid types
 */

export * from './relationship.schema';
export * from './time.schema';
export * from './pattern.schema';

import { z } from 'zod';
import { RelationshipPyramidSchema } from './relationship.schema';
import { TimeAllocationPyramidSchema } from './time.schema';
import { PatternPyramidSchema } from './pattern.schema';

/**
 * Union of all pyramid types
 */
export const PyramidSchema = z.discriminatedUnion('type', [
  RelationshipPyramidSchema,
  TimeAllocationPyramidSchema,
  PatternPyramidSchema
]);

export type Pyramid = z.infer<typeof PyramidSchema>;

/**
 * Pyramid collection schema
 */
export const PyramidCollectionSchema = z.object({
  pyramids: z.array(PyramidSchema),
  stats: z.object({
    total_pyramids: z.number().int().min(0),
    active: z.number().int().min(0),
    mature: z.number().int().min(0),
    archived: z.number().int().min(0),
    avg_completeness: z.number().min(0).max(100)
  })
});

export type PyramidCollection = z.infer<typeof PyramidCollectionSchema>;
