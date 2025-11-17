/**
 * Relationship report schema
 * Auto-generated markdown reports for relationship analysis
 */
import { z } from 'zod';
import {
  ReportBaseSchema,
  SentimentEnum,
  DurationSchema
} from '../base.schema';

/**
 * Interaction summary for report
 */
export const ReportInteractionSchema = z.object({
  date: z.date(),
  entry_id: z.string(),
  type: z.string(),
  duration: DurationSchema.optional(),
  your_investment: z.string(),
  their_return: z.string().optional(),
  sentiment: SentimentEnum.optional()
});

/**
 * Balance of exchange summary
 */
export const BalanceSummarySchema = z.object({
  you_to_them: z.object({
    time_hours: z.number().min(0),
    resources_value: z.number().min(0),
    emotional_support: z.enum(['low', 'medium', 'high'])
  }),
  them_to_you: z.object({
    time_hours: z.number().min(0),
    resources_value: z.number().min(0),
    emotional_support: z.enum(['low', 'medium', 'high'])
  }),
  net_time_balance: z.number().describe('Positive = you give more'),
  net_resource_balance: z.number().describe('Positive = you give more')
});

/**
 * Sentiment trajectory
 */
export const SentimentTrajectorySchema = z.object({
  date: z.date(),
  sentiment: SentimentEnum,
  note: z.string().optional()
});

/**
 * Motivation quote
 */
export const MotivationQuoteSchema = z.object({
  quote: z.string(),
  entry_id: z.string(),
  date: z.date()
});

/**
 * Complete relationship report schema
 */
export const RelationshipReportSchema = ReportBaseSchema.extend({
  report_type: z.literal('relationship'),

  // Summary
  summary: z.string().describe('One-sentence Minto-style conclusion'),
  key_findings: z.array(z.string()).min(2).max(5),

  // Supporting evidence
  interactions: z.array(ReportInteractionSchema),
  balance: BalanceSummarySchema,
  sentiment_trajectory: z.array(SentimentTrajectorySchema),
  motivation_quotes: z.array(MotivationQuoteSchema),

  // Analysis
  interaction_frequency: z.object({
    total: z.number().int().min(0),
    avg_per_month: z.number().min(0),
    trend: z.enum(['increasing', 'decreasing', 'stable'])
  }),

  reciprocity_pattern: z.object({
    type: z.enum(['balanced', 'you-give-more', 'they-give-more']),
    ratio: z.number().describe('Ratio of your investment to theirs'),
    prosocial: z.boolean().describe('Helping without expectation')
  }),

  // Gaps and contradictions
  data_gaps: z.array(z.string()),
  contradictions: z.array(z.string()),

  // Predictions
  predictions: z.object({
    relationship_trajectory: z.enum(['strengthening', 'stable', 'weakening']).optional(),
    risk_factors: z.array(z.string()),
    opportunities: z.array(z.string())
  }),

  // Related reports
  related_reports: z.array(z.string()).default([])
});

export type ReportInteraction = z.infer<typeof ReportInteractionSchema>;
export type BalanceSummary = z.infer<typeof BalanceSummarySchema>;
export type SentimentTrajectory = z.infer<typeof SentimentTrajectorySchema>;
export type MotivationQuote = z.infer<typeof MotivationQuoteSchema>;
export type RelationshipReport = z.infer<typeof RelationshipReportSchema>;

/**
 * Helper to generate markdown from relationship report
 */
export function relationshipReportToMarkdown(report: RelationshipReport): string {
  const fm = `---
report_type: ${report.report_type}
subject: ${report.subject}
generated: ${report.generated.toISOString()}
last_updated: ${report.last_updated.toISOString()}
completeness: ${report.completeness}%
confidence: ${report.confidence}
entries_analyzed: ${report.entries_analyzed}
auto_update: ${report.auto_update}
---

`;

  const content = `# Relationship Analysis: ${report.subject}

**Summary**: ${report.summary}

## Key Findings

${report.key_findings.map(f => `- ${f}`).join('\n')}

## Supporting Evidence

### Frequency of Interaction

| Date | Type | Your Investment | Their Return |
|------|------|----------------|--------------|
${report.interactions.map(i =>
  `| [[${i.entry_id}]] | ${i.type} | ${i.your_investment} | ${i.their_return || '-'} |`
).join('\n')}

**Total**: ${report.interaction_frequency.total} interactions, average ${report.interaction_frequency.avg_per_month.toFixed(1)} per month

### Balance of Exchange

**You → ${report.subject}**:
- Time: ${report.balance.you_to_them.time_hours}h
- Resources: $${report.balance.you_to_them.resources_value}
- Emotional support: ${report.balance.you_to_them.emotional_support}

**${report.subject} → You**:
- Time: ${report.balance.them_to_you.time_hours}h
- Resources: $${report.balance.them_to_you.resources_value}
- Emotional support: ${report.balance.them_to_you.emotional_support}

**Net balance**: ${report.reciprocity_pattern.type} (ratio: ${report.reciprocity_pattern.ratio.toFixed(1)}x)

### Motivation Analysis

${report.motivation_quotes.length > 0 ? 'From your own words:\n\n' + report.motivation_quotes.map(q =>
  `> "${q.quote}"\n> — [[${q.entry_id}]]`
).join('\n\n') : ''}

**Pattern**: ${report.reciprocity_pattern.prosocial ? 'Prosocial (helping without expectation)' : 'Transactional'}

### Sentiment Trajectory

\`\`\`
${report.sentiment_trajectory.map(st =>
  `${st.date.toISOString().split('T')[0]}: ${st.sentiment}${st.note ? ` (${st.note})` : ''}`
).join('\n')}
\`\`\`

**Trend**: ${report.interaction_frequency.trend}

## Data Gaps

${report.data_gaps.length > 0 ? report.data_gaps.map(g => `- [ ] ${g}`).join('\n') : 'None'}

## Contradictions

${report.contradictions.length > 0 ? report.contradictions.map(c => `- ${c}`).join('\n') : 'None detected'}

## Predictions

**Trajectory**: ${report.predictions.relationship_trajectory || 'Unknown'}

${report.predictions.risk_factors.length > 0 ? `**Risk factors**:\n${report.predictions.risk_factors.map(r => `- ${r}`).join('\n')}` : ''}

${report.predictions.opportunities.length > 0 ? `**Opportunities**:\n${report.predictions.opportunities.map(o => `- ${o}`).join('\n')}` : ''}

---

*Auto-generated from ${report.entries_analyzed} journal entries. Last updated: ${report.last_updated.toLocaleString()}*
*Completeness: ${report.completeness}% | Confidence: ${report.confidence}*

${report.related_reports.length > 0 ? `\n**Related Reports**:\n${report.related_reports.map(r => `- [[${r}]]`).join('\n')}` : ''}
`;

  return fm + content;
}
