/**
 * Time allocation pyramid schema
 * Tracks how time is spent over a period (week/month)
 */
import { z } from 'zod';
import {
  PyramidBaseSchema,
  ActivityTypeEnum,
  DurationSchema,
  EnergyLevelSchema,
  DatapointSchema
} from '../base.schema';

/**
 * Time period type
 */
export const TimePeriodEnum = z.enum(['day', 'week', 'month', 'year']);

/**
 * Time allocation by category
 */
export const TimeAllocationSchema = z.object({
  category: ActivityTypeEnum,
  total_minutes: DurationSchema,
  percentage: z.number().min(0).max(100),
  entry_count: z.number().int().min(0),
  average_duration: DurationSchema.optional()
});

/**
 * Time allocation by person
 */
export const TimeByPersonSchema = z.object({
  person: z.string(),
  total_minutes: DurationSchema,
  percentage: z.number().min(0).max(100),
  activities: z.array(z.string())
});

/**
 * Daily breakdown
 */
export const DailyBreakdownSchema = z.object({
  date: z.date(),
  total_tracked: DurationSchema,
  total_unaccounted: DurationSchema.optional(),
  by_category: z.array(TimeAllocationSchema),
  average_energy: z.number().min(1).max(10).optional(),
  entry_count: z.number().int().min(0)
});

/**
 * Time gap (unaccounted time)
 */
export const TimeGapSchema = z.object({
  start: z.date(),
  end: z.date(),
  duration_minutes: DurationSchema,
  likely_activity: z.string().optional().describe('AI inference of what happened')
});

/**
 * Datapoints for time pyramid
 */
export const TimeDatapointsSchema = z.object({
  total_tracked: DatapointSchema(DurationSchema),

  gaps: DatapointSchema(z.array(TimeGapSchema)),

  energy_levels: DatapointSchema(z.array(EnergyLevelSchema.unwrap())),

  peak_hours: DatapointSchema(z.array(z.number().int().min(0).max(23))),

  burnout_indicators: DatapointSchema(z.boolean())
});

/**
 * Complete time allocation pyramid schema
 */
export const TimeAllocationPyramidSchema = PyramidBaseSchema.extend({
  type: z.literal('time'),

  // Time-specific fields
  period: TimePeriodEnum,
  period_start: z.date(),
  period_end: z.date(),

  datapoints: TimeDatapointsSchema,

  // Allocations
  by_category: z.array(TimeAllocationSchema),
  by_person: z.array(TimeByPersonSchema),
  daily_breakdown: z.array(DailyBreakdownSchema),

  // Calculated totals
  total_tracked_minutes: DurationSchema,
  total_unaccounted_minutes: DurationSchema.optional(),
  total_waking_hours: z.number().optional().describe('Estimated waking hours in period'),

  // Insights
  top_category: ActivityTypeEnum.optional(),
  top_person: z.string().optional(),
  average_energy: z.number().min(1).max(10).optional(),

  // Trends
  trend_vs_previous: z.object({
    social: z.enum(['increasing', 'decreasing', 'stable']).optional(),
    personal: z.enum(['increasing', 'decreasing', 'stable']).optional(),
    rest: z.enum(['increasing', 'decreasing', 'stable']).optional(),
    energy: z.enum(['increasing', 'decreasing', 'stable']).optional()
  }).optional()
});

// Type exports
export type TimePeriod = z.infer<typeof TimePeriodEnum>;
export type TimeAllocation = z.infer<typeof TimeAllocationSchema>;
export type TimeByPerson = z.infer<typeof TimeByPersonSchema>;
export type DailyBreakdown = z.infer<typeof DailyBreakdownSchema>;
export type TimeGap = z.infer<typeof TimeGapSchema>;
export type TimeDatapoints = z.infer<typeof TimeDatapointsSchema>;
export type TimeAllocationPyramid = z.infer<typeof TimeAllocationPyramidSchema>;

/**
 * Helper to calculate time completeness
 */
export function calculateTimeCompleteness(pyramid: TimeAllocationPyramid): number {
  const { total_tracked_minutes, total_waking_hours } = pyramid;

  if (!total_waking_hours) return 0;

  const waking_minutes = total_waking_hours * 60;
  const tracked_percentage = (total_tracked_minutes / waking_minutes) * 100;

  return Math.min(Math.round(tracked_percentage), 100);
}

/**
 * Helper to detect time gaps
 */
export function detectTimeGaps(entries: Array<{ created: Date; duration?: number }>): TimeGap[] {
  const gaps: TimeGap[] = [];
  const sorted = entries.sort((a, b) => a.created.getTime() - b.created.getTime());

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];

    const endOfCurrent = new Date(current.created.getTime() + (current.duration || 0) * 60000);
    const gapMinutes = (next.created.getTime() - endOfCurrent.getTime()) / 60000;

    // Only track gaps > 2 hours
    if (gapMinutes > 120) {
      gaps.push({
        start: endOfCurrent,
        end: next.created,
        duration_minutes: gapMinutes
      });
    }
  }

  return gaps;
}

/**
 * Helper to get next question for time pyramid
 */
export function getNextTimeQuestion(pyramid: TimeAllocationPyramid): string | null {
  const { datapoints, daily_breakdown } = pyramid;

  // Check for significant gaps
  if (!datapoints.gaps.complete) {
    const totalGapTime = datapoints.gaps.value.reduce((sum, gap) => sum + gap.duration_minutes, 0);
    if (totalGapTime > 120) {
      const largestGap = datapoints.gaps.value.sort((a, b) => b.duration_minutes - a.duration_minutes)[0];
      if (largestGap) {
        const start = largestGap.start.toLocaleString('en-US', {
          weekday: 'short',
          hour: 'numeric',
          minute: '2-digit'
        });
        return `What did you do ${start}? I have a ${Math.round(largestGap.duration_minutes / 60)}h gap.`;
      }
    }
  }

  // Check for missing energy levels
  const entriesWithoutEnergy = daily_breakdown.filter(d => d.average_energy === undefined);
  if (entriesWithoutEnergy.length > 0) {
    const recent = entriesWithoutEnergy[0];
    return `How was your energy level on ${recent.date.toLocaleDateString()}?`;
  }

  return null;
}
