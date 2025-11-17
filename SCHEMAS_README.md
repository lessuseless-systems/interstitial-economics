# Zod Schema Architecture for Pyramid Journaling

Complete type-safe schema definitions using Zod for the interstitial journaling system.

## Overview

This architecture uses [Zod](https://github.com/colinhacks/zod) for:
- **Runtime validation** of AI-extracted data
- **Type inference** for TypeScript
- **Data transformation** (cleaning messy AI outputs)
- **Self-documenting schemas** with built-in descriptions

## Directory Structure

```
schemas/
├── base.schema.ts                  # Common types and utilities
├── journal-entry.schema.ts         # Core journal entry schemas
├── config.schema.ts                # User configuration
├── pyramids/
│   ├── index.ts                    # Pyramid union types
│   ├── relationship.schema.ts      # Relationship pyramid
│   ├── time.schema.ts              # Time allocation pyramid
│   └── pattern.schema.ts           # Behavioral pattern pyramid
└── reports/
    └── relationship-report.schema.ts  # Report generation

utils/
└── validation.ts                   # Validation helpers

examples/
├── 01-basic-entry.ts               # Creating journal entries
├── 02-pyramid-creation.ts          # Managing pyramids
└── 03-complete-flow.ts             # End-to-end demo
```

## Quick Start

### Installation

```bash
npm install zod
```

### Basic Usage

```typescript
import { JournalEntrySchema } from './schemas/journal-entry.schema';

// Voice transcript from user
const transcript = "Bob asked me to paint his house";

// AI extraction (potentially messy)
const aiData = {
  people: ['bob', '[[Bob]]', 'Bob'], // Mixed formats
  duration: '4 hours',                // String instead of number
  activity: 'helping'
};

// Validate and transform
const entry = JournalEntrySchema.parse({
  id: crypto.randomUUID(),
  created: new Date(),
  transcript,
  people: aiData.people,  // Will be normalized to ['[[Bob]]']
  duration: 240,          // Must be number (minutes)
  activity: aiData.activity,
  tags: [],
  pyramids: []
});

// Now entry is type-safe!
console.log(entry.people); // ['[[Bob]]'] - normalized
```

## Core Schemas

### 1. Journal Entry Schema

**File**: `schemas/journal-entry.schema.ts`

The fundamental data structure for voice journal entries.

```typescript
import { JournalEntrySchema, type JournalEntry } from './schemas/journal-entry.schema';

const entry: JournalEntry = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  created: new Date(),
  transcript: 'Bob asked me to paint his house',
  people: ['[[Bob]]'],
  duration: 240, // minutes
  activity: 'helping',
  location: "Bob's house",
  tags: ['helping', 'neighbor'],
  energy: 6,
  sentiment: 'positive',
  pyramids: ['relationship_bob']
};

// Validate
const validated = JournalEntrySchema.parse(entry); // ✅ or throws
```

**Key Features**:
- Normalizes person names to `[[Name]]` format
- Validates duration (0-1440 minutes)
- Type-safe activity enum
- Optional AI-generated reflection

### 2. Pyramid Schemas

**File**: `schemas/pyramids/*.schema.ts`

#### Relationship Pyramid

Tracks interactions with specific people.

```typescript
import { RelationshipPyramidSchema, type RelationshipPyramid } from './schemas/pyramids/relationship.schema';

const pyramid: RelationshipPyramid = {
  id: 'relationship_bob',
  type: 'relationship',
  subject: '[[Bob]]',
  created: new Date(),
  last_updated: new Date(),
  completeness: 75,
  confidence: 'high',
  status: 'mature',
  entries: ['entry-1', 'entry-2', 'entry-3'],

  relationship_type: 'neighbor',

  datapoints: {
    frequency: { value: 3, complete: true },
    duration: { value: [360, 120, 240], complete: true },
    direction: { value: ['you→them', 'them→you', 'you→them'], complete: true },
    reciprocity: { value: 'you-give-more', complete: true },
    // ... more datapoints
  },

  interactions: [
    {
      entry_id: 'entry-1',
      date: new Date('2024-03-15'),
      type: 'helping (moving)',
      duration: 360,
      direction: 'you→them',
      your_investment: '6 hours + truck'
    },
    // ... more interactions
  ],

  prosocial_pattern: true
};
```

**Helpers**:
- `calculateRelationshipCompleteness(pyramid)` - Auto-calculate %
- `getNextRelationshipQuestion(pyramid)` - Get next question to ask

#### Time Allocation Pyramid

Tracks time usage over a period.

```typescript
import { TimeAllocationPyramidSchema } from './schemas/pyramids/time.schema';

const timePyramid = TimeAllocationPyramidSchema.parse({
  type: 'time',
  period: 'week',
  period_start: new Date('2025-11-11'),
  period_end: new Date('2025-11-17'),

  by_category: [
    {
      category: 'helping',
      total_minutes: 2460, // 41 hours
      percentage: 68,
      entry_count: 15
    },
    // ... more categories
  ],

  daily_breakdown: [
    {
      date: new Date('2025-11-11'),
      total_tracked: 720,
      by_category: [/* ... */],
      average_energy: 8
    },
    // ... more days
  ]
});
```

**Helpers**:
- `detectTimeGaps(entries)` - Find unaccounted time
- `getNextTimeQuestion(pyramid)` - Ask about gaps

#### Pattern Pyramid

Detects behavioral patterns.

```typescript
import { PatternPyramidSchema } from './schemas/pyramids/pattern.schema';

const patternPyramid = PatternPyramidSchema.parse({
  type: 'pattern',
  pattern_type: 'prosocial',

  instances: [
    {
      entry_id: 'entry-1',
      date: new Date(),
      description: 'Helped Bob without expectation',
      matches_pattern: true,
      is_exception: false
    },
    // ... 34 instances
  ],

  frequency_percentage: 72, // 72% of social interactions

  trend: 'stable',
  predicted_sustainability: 'at-risk'
});
```

**Helpers**:
- `calculatePatternFrequency(pyramid)` - Calculate % frequency
- `assessPatternSustainability(pyramid)` - Check if sustainable

### 3. Report Schemas

**File**: `schemas/reports/*.schema.ts`

Auto-generated markdown reports.

```typescript
import {
  RelationshipReportSchema,
  relationshipReportToMarkdown
} from './schemas/reports/relationship-report.schema';

const report = RelationshipReportSchema.parse({
  report_type: 'relationship',
  subject: '[[Bob]]',
  summary: 'You maintain a prosocial relationship...',
  key_findings: [
    'Net giver: invested 14+ hours vs 2 received',
    'Consistent pattern over 18 months',
    'Community-motivated behavior'
  ],
  interactions: [/* ... */],
  balance: {/* ... */},
  // ... more fields
});

// Generate markdown
const markdown = relationshipReportToMarkdown(report);

// Save to file
fs.writeFileSync('reports/relationships/bob.md', markdown);
```

### 4. Configuration Schema

**File**: `schemas/config.schema.ts`

User preferences with validation and defaults.

```typescript
import { UserConfigSchema, generateDefaultConfig } from './schemas/config.schema';

// Load config with validation
const config = UserConfigSchema.parse({
  voice_interface: {
    prompt_frequency: 5,
    question_tolerance: 1,
    voice_provider: 'whisper-local'
  },
  pyramids: {
    auto_generate: true,
    relationship_threshold: 3
  },
  privacy: {
    local_only: true,
    encryption_enabled: true
  }
});

// Or use defaults
const defaultConfig = generateDefaultConfig();
```

## Validation Utilities

**File**: `utils/validation.ts`

### Safe Validation

```typescript
import { safeValidate } from './utils/validation';

const result = safeValidate(JournalEntrySchema, rawData);

if (result.success) {
  console.log('Valid:', result.data);
} else {
  result.errors.forEach(err => {
    console.error(`${err.path}: ${err.message}`);
  });
}
```

### Entity Merging

Combines voice transcript with AI-extracted entities:

```typescript
import { mergeEntities } from './utils/validation';

const entry = mergeEntities(
  transcript,
  rawAIExtraction // Potentially messy
);
// Returns validated JournalEntry
```

### Data Transformation

```typescript
import {
  normalizePerson,
  parseDuration,
  formatDuration,
  normalizeTags
} from './utils/validation';

// Normalize person names
normalizePerson('bob'); // '[[Bob]]'
normalizePerson('[[Bob]]'); // '[[Bob]]'

// Parse duration from text
parseDuration('4 hours'); // 240
parseDuration('2h 30m'); // 150

// Format duration
formatDuration(240); // '4h'
formatDuration(90); // '1h 30m'

// Normalize tags
normalizeTags(['Helping', 'NEIGHBOR', 'helping']); // ['helping', 'neighbor']
```

## Type Safety

Zod provides full TypeScript type inference:

```typescript
import { z } from 'zod';
import { JournalEntrySchema } from './schemas/journal-entry.schema';

// Infer type from schema
type JournalEntry = z.infer<typeof JournalEntrySchema>;

// Now you have full autocomplete
function processEntry(entry: JournalEntry) {
  entry.created // ✅ Date
  entry.people  // ✅ string[]
  entry.duration // ✅ number | undefined

  // TypeScript prevents errors
  // entry.dration // ❌ Property 'dration' does not exist
  // const x: string = entry.duration // ❌ Type 'number' is not assignable to 'string'
}
```

## Examples

### Example 1: Basic Entry Creation

**File**: `examples/01-basic-entry.ts`

Shows:
- Creating entries from voice
- Validating AI extraction
- Converting to markdown frontmatter
- Type safety

Run:
```bash
npx tsx examples/01-basic-entry.ts
```

### Example 2: Pyramid Management

**File**: `examples/02-pyramid-creation.ts`

Shows:
- Initializing pyramids
- Adding interactions
- Calculating completeness
- Getting next questions
- Detecting patterns

Run:
```bash
npx tsx examples/02-pyramid-creation.ts
```

### Example 3: Complete Flow

**File**: `examples/03-complete-flow.ts`

Shows:
- Voice → Entry → Pyramid → Report
- Question selection logic
- Report generation
- Full simulated service

Run:
```bash
npx tsx examples/03-complete-flow.ts
```

## Best Practices

### 1. Always Validate External Data

```typescript
// ❌ Don't trust AI output
const entry = rawAIData as JournalEntry;

// ✅ Validate it
const entry = JournalEntrySchema.parse(rawAIData);
```

### 2. Use SafeParse for Error Handling

```typescript
const result = JournalEntrySchema.safeParse(data);

if (result.success) {
  // Use result.data
} else {
  // Handle result.error
}
```

### 3. Leverage Type Inference

```typescript
// ✅ Let Zod infer types
type JournalEntry = z.infer<typeof JournalEntrySchema>;

// ❌ Don't manually duplicate types
interface JournalEntry {
  id: string;
  created: Date;
  // ... error-prone
}
```

### 4. Use Transformations for Cleanup

```typescript
const PersonLinkSchema = z.string()
  .transform(name => {
    const clean = name.replace(/\[\[|\]\]/g, '');
    return `[[${clean}]]`;
  });

// Input: 'bob' or '[[Bob]]' or 'Bob'
// Output: '[[Bob]]'
```

### 5. Provide Defaults

```typescript
const ConfigSchema = z.object({
  prompt_frequency: z.number().default(5),
  auto_generate: z.boolean().default(true)
});

// Partial input works!
const config = ConfigSchema.parse({}); // Uses all defaults
```

## Testing

All schemas include runtime validation, making tests straightforward:

```typescript
import { test, expect } from 'vitest';
import { JournalEntrySchema } from './schemas/journal-entry.schema';

test('validates correct entry', () => {
  const entry = {
    id: crypto.randomUUID(),
    created: new Date(),
    transcript: 'Test',
    people: [],
    tags: [],
    pyramids: []
  };

  expect(() => JournalEntrySchema.parse(entry)).not.toThrow();
});

test('rejects invalid duration', () => {
  const entry = {
    id: crypto.randomUUID(),
    created: new Date(),
    transcript: 'Test',
    duration: -10, // ❌ Negative
    people: [],
    tags: [],
    pyramids: []
  };

  expect(() => JournalEntrySchema.parse(entry)).toThrow();
});
```

## Performance

Zod is fast, but for maximum performance:

### 1. Parse Once, Use Many Times

```typescript
// ✅ Parse once
const entry = JournalEntrySchema.parse(rawData);

// Use many times (no validation needed)
processEntry(entry);
saveEntry(entry);
updatePyramid(entry);
```

### 2. Use safeParse for Optional Validation

```typescript
// Only validate when needed
if (DEBUG) {
  JournalEntrySchema.parse(entry);
}
```

### 3. Pre-compile Schemas

Zod schemas are already compiled at module load, so no need for explicit compilation.

## Error Messages

Zod provides excellent error messages:

```typescript
JournalEntrySchema.parse({
  id: 'not-a-uuid',
  created: 'not-a-date',
  duration: -10
});

// Error:
// [
//   { path: 'id', message: 'Invalid uuid' },
//   { path: 'created', message: 'Invalid date' },
//   { path: 'duration', message: 'Duration cannot be negative' },
//   { path: 'transcript', message: 'Required' }
// ]
```

## Migration from Other Systems

### From JSON Schema

```typescript
// JSON Schema
{
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" }
  }
}

// Zod equivalent
z.object({
  id: z.string().uuid()
})
```

### From TypeScript Interfaces

```typescript
// TypeScript interface
interface Entry {
  id: string;
  created: Date;
  people: string[];
}

// Zod schema (with validation!)
const EntrySchema = z.object({
  id: z.string().uuid(),
  created: z.date(),
  people: z.array(z.string())
});

// Get type back
type Entry = z.infer<typeof EntrySchema>;
```

## Extending Schemas

### Adding Custom Validation

```typescript
const EmailSchema = z.string()
  .email()
  .refine(
    email => !email.endsWith('@tempmail.com'),
    'Temporary emails not allowed'
  );
```

### Composing Schemas

```typescript
const BaseSchema = z.object({
  id: z.string().uuid(),
  created: z.date()
});

const EntrySchema = BaseSchema.extend({
  transcript: z.string(),
  people: z.array(z.string())
});
```

## Integration Examples

### With React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JournalEntrySchema } from './schemas/journal-entry.schema';

const form = useForm({
  resolver: zodResolver(JournalEntrySchema)
});
```

### With tRPC

```typescript
import { z } from 'zod';
import { JournalEntrySchema } from './schemas/journal-entry.schema';

const appRouter = router({
  createEntry: procedure
    .input(JournalEntrySchema)
    .mutation(({ input }) => {
      // input is fully typed!
      return saveEntry(input);
    })
});
```

### With Prisma

```typescript
import { Prisma } from '@prisma/client';
import { JournalEntrySchema } from './schemas/journal-entry.schema';

// Validate before save
const entry = JournalEntrySchema.parse(rawData);

await prisma.journalEntry.create({
  data: entry
});
```

## FAQ

**Q: Why Zod instead of Nickel?**

A: Zod provides runtime validation (critical for AI data), TypeScript integration, and ecosystem support. Nickel is for static config files.

**Q: Does validation impact performance?**

A: Minimal. Validate once at boundaries (AI extraction, user input), then use type-safe data throughout.

**Q: Can I use this with JavaScript (not TypeScript)?**

A: Yes! Zod works in plain JS. You just lose type inference.

**Q: How do I handle validation errors gracefully?**

A: Use `safeParse()` instead of `parse()` - it returns `{ success: false, error }` instead of throwing.

**Q: Can schemas evolve over time?**

A: Yes! Zod supports optional fields, defaults, and transformations. Old data can be migrated via transforms.

## Resources

- [Zod Documentation](https://zod.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Pyramid Journaling Spec](./pyramid-driven-journaling-spec.md)
- [Gesture Interface Spec](./technical-spec-gesture-interface.md)

## License

MIT
