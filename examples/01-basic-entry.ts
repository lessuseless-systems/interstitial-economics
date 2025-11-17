/**
 * Example 1: Creating a basic journal entry
 * Shows voice → transcript → validated entry flow
 */

import {
  JournalEntrySchema,
  ExtractedEntitiesSchema,
  type JournalEntry
} from '../schemas/journal-entry.schema';
import { mergeEntities, validateJournalEntry } from '../utils/validation';

// =============================================================================
// Example: Voice transcript from user
// =============================================================================

const voiceTranscript = `Bob asked me to paint his house Sunday, but heard he's getting evicted Monday`;

// =============================================================================
// Example: AI entity extraction (simulated)
// =============================================================================

// This would come from your AI/ML service
const rawAIExtraction = {
  people: ['Bob'],
  duration: '4 hours', // AI might extract as string
  activity: 'helping',
  sentiment: 'mixed',
  energy: 6,
  tags: ['helping', 'neighbor'],
  key_phrases: ['paint house', 'eviction'],
  questions_asked: []
};

// =============================================================================
// Validate AI extraction
// =============================================================================

const extractionResult = ExtractedEntitiesSchema.safeParse(rawAIExtraction);

if (extractionResult.success) {
  console.log('✅ AI extraction valid:', extractionResult.data);
} else {
  console.error('❌ AI extraction invalid:', extractionResult.error);
}

// =============================================================================
// Create journal entry (with automatic cleanup)
// =============================================================================

const entry = mergeEntities(voiceTranscript, rawAIExtraction);

console.log('\n📝 Created entry:');
console.log(entry);

// =============================================================================
// Validate final entry
// =============================================================================

const validationResult = validateJournalEntry(entry);

if (validationResult.success) {
  console.log('\n✅ Entry is valid');
  console.log('People:', validationResult.data.people); // ['[[Bob]]'] - normalized!
  console.log('Duration:', validationResult.data.duration); // undefined - string couldn't convert
  console.log('Activity:', validationResult.data.activity); // 'helping'
} else {
  console.log('\n❌ Entry validation failed:');
  validationResult.errors.forEach(err => {
    console.log(`  ${err.path}: ${err.message}`);
  });
}

// =============================================================================
// Manual entry creation (type-safe)
// =============================================================================

const manualEntry: JournalEntry = {
  id: crypto.randomUUID(),
  created: new Date(),
  transcript: voiceTranscript,
  people: ['[[Bob]]'],
  duration: 240, // 4 hours in minutes
  activity: 'helping',
  location: "Bob's house",
  tags: ['helping', 'neighbor'],
  energy: 6,
  sentiment: 'mixed',
  pyramids: []
};

// This will throw if invalid - use in try/catch
try {
  const validated = JournalEntrySchema.parse(manualEntry);
  console.log('\n✅ Manual entry validated:', validated.id);
} catch (error) {
  console.error('\n❌ Manual entry invalid:', error);
}

// =============================================================================
// Converting to frontmatter (for markdown file)
// =============================================================================

import { entryToFrontmatter } from '../schemas/journal-entry.schema';

const frontmatter = entryToFrontmatter(manualEntry);

console.log('\n📄 Frontmatter for markdown:');
console.log(frontmatter);

const fullMarkdown = `${frontmatter}

# Bob asked me to paint his house

${manualEntry.transcript}
`;

console.log('\n📄 Complete markdown:');
console.log(fullMarkdown);

// =============================================================================
// Type safety demonstration
// =============================================================================

function processEntry(entry: JournalEntry) {
  // TypeScript knows exactly what fields exist and their types
  console.log('\n🔒 Type-safe access:');
  console.log('Entry ID:', entry.id); // ✅ UUID
  console.log('Created:', entry.created.toISOString()); // ✅ Date
  console.log('People:', entry.people); // ✅ string[]
  console.log('Duration:', entry.duration); // ✅ number | undefined

  // TypeScript prevents typos
  // console.log(entry.dration); // ❌ Property 'dration' does not exist

  // TypeScript ensures correct types
  // const minutes: string = entry.duration; // ❌ Type 'number' is not assignable to type 'string'
}

processEntry(manualEntry);
