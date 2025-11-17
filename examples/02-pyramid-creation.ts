/**
 * Example 2: Creating and managing pyramids
 * Shows how pyramids are initialized, updated, and queried
 */

import {
  RelationshipPyramidSchema,
  calculateRelationshipCompleteness,
  getNextRelationshipQuestion,
  type RelationshipPyramid
} from '../schemas/pyramids/relationship.schema';
import { validatePyramid } from '../utils/validation';

// =============================================================================
// Example: Initialize a relationship pyramid for Bob
// =============================================================================

const bobPyramid: RelationshipPyramid = {
  // Base pyramid fields
  id: 'relationship_bob',
  type: 'relationship',
  subject: '[[Bob]]',
  created: new Date('2024-03-15'),
  last_updated: new Date(),
  completeness: 0,
  confidence: 'low',
  status: 'initializing',
  entries: [],
  questions_pending: [],
  questions_asked: 0,

  // Relationship-specific fields
  relationship_type: 'neighbor',

  datapoints: {
    frequency: {
      value: 0,
      complete: false
    },
    duration: {
      value: [],
      complete: false
    },
    direction: {
      value: [],
      complete: false
    },
    reciprocity: {
      value: 'unknown',
      complete: false
    },
    context: {
      value: [],
      complete: false
    },
    sentiment: {
      value: 'neutral',
      complete: false
    },
    outcome: {
      value: [],
      complete: false
    }
  },

  interactions: []
};

// =============================================================================
// Validate pyramid
// =============================================================================

const pyramidValidation = validatePyramid(bobPyramid);

if (pyramidValidation.success) {
  console.log('✅ Pyramid valid');
} else {
  console.error('❌ Pyramid invalid:', pyramidValidation.errors);
}

// =============================================================================
// Update pyramid with first interaction
// =============================================================================

console.log('\n📊 Adding first interaction...');

bobPyramid.interactions.push({
  entry_id: '2024-03-15-helped-bob-move',
  date: new Date('2024-03-15'),
  type: 'helping (moving)',
  duration: 360, // 6 hours
  direction: 'you→them',
  your_investment: '6 hours + truck',
  sentiment: 'positive'
});

// Update datapoints
bobPyramid.datapoints.frequency.value = 1;
bobPyramid.datapoints.duration.value.push(360);
bobPyramid.datapoints.direction.value.push('you→them');
bobPyramid.datapoints.context.value.push('moving');

// Mark some as complete
bobPyramid.datapoints.frequency.complete = true;

// Update metadata
bobPyramid.entries.push('2024-03-15-helped-bob-move');
bobPyramid.status = 'active';
bobPyramid.last_updated = new Date();

// Recalculate completeness
bobPyramid.completeness = calculateRelationshipCompleteness(bobPyramid);

console.log('Completeness:', bobPyramid.completeness + '%'); // ~14% (1/7 datapoints)

// =============================================================================
// Get next question
// =============================================================================

const question = getNextRelationshipQuestion(bobPyramid);
console.log('\n❓ Next question:', question);
// null - need more interactions before asking

// =============================================================================
// Add more interactions
// =============================================================================

console.log('\n📊 Adding second interaction...');

bobPyramid.interactions.push({
  entry_id: '2024-08-03-bob-helped-fence',
  date: new Date('2024-08-03'),
  type: 'being helped (fence repair)',
  duration: 120, // 2 hours
  direction: 'them→you',
  your_investment: '',
  their_return: '2 hours labor',
  sentiment: 'positive'
});

bobPyramid.datapoints.frequency.value = 2;
bobPyramid.datapoints.duration.value.push(120);
bobPyramid.datapoints.direction.value.push('them→you');
bobPyramid.datapoints.context.value.push('fence');
bobPyramid.entries.push('2024-08-03-bob-helped-fence');
bobPyramid.completeness = calculateRelationshipCompleteness(bobPyramid);

console.log('Completeness:', bobPyramid.completeness + '%'); // ~14% still

// =============================================================================
// Add third interaction (triggers questions)
// =============================================================================

console.log('\n📊 Adding third interaction...');

bobPyramid.interactions.push({
  entry_id: '2025-11-16-bob-painting',
  date: new Date('2025-11-16'),
  type: 'helping (painting)',
  duration: 240, // 4 hours
  direction: 'you→them',
  your_investment: '4 hours',
  sentiment: 'mixed'
});

bobPyramid.datapoints.frequency.value = 3;
bobPyramid.datapoints.duration.value.push(240);
bobPyramid.datapoints.direction.value.push('you→them');
bobPyramid.datapoints.context.value.push('painting');
bobPyramid.entries.push('2025-11-16-bob-painting');
bobPyramid.completeness = calculateRelationshipCompleteness(bobPyramid);

console.log('Completeness:', bobPyramid.completeness + '%'); // ~43%

// Now we have enough interactions - AI should ask questions
const question2 = getNextRelationshipQuestion(bobPyramid);
console.log('\n❓ Next question:', question2);
// "Has Bob helped you before?" - reciprocity question

// =============================================================================
// Answer the question (update pyramid)
// =============================================================================

console.log('\n💬 User answers: "Yeah, he helped with the fence"');

bobPyramid.datapoints.reciprocity.value = 'you-give-more'; // 10h vs 2h
bobPyramid.datapoints.reciprocity.complete = true;
bobPyramid.questions_asked += 1;
bobPyramid.completeness = calculateRelationshipCompleteness(bobPyramid);

console.log('Completeness:', bobPyramid.completeness + '%'); // ~57%

// =============================================================================
// Calculate derived fields
// =============================================================================

bobPyramid.total_time_invested = bobPyramid.interactions
  .filter(i => i.direction === 'you→them')
  .reduce((sum, i) => sum + (i.duration || 0), 0);

bobPyramid.total_time_received = bobPyramid.interactions
  .filter(i => i.direction === 'them→you')
  .reduce((sum, i) => sum + (i.duration || 0), 0);

bobPyramid.net_balance_minutes = bobPyramid.total_time_invested - bobPyramid.total_time_received;

console.log('\n⚖️ Balance:');
console.log('You invested:', bobPyramid.total_time_invested, 'minutes');
console.log('Bob invested:', bobPyramid.total_time_received, 'minutes');
console.log('Net balance:', bobPyramid.net_balance_minutes, 'minutes (you give more)');

// =============================================================================
// Check for prosocial pattern
// =============================================================================

// You helped twice (10h), received once (2h) = prosocial pattern
bobPyramid.prosocial_pattern = bobPyramid.net_balance_minutes > 180; // >3h imbalance

console.log('Prosocial pattern:', bobPyramid.prosocial_pattern);

// =============================================================================
// Mark pyramid as mature (70%+ complete)
// =============================================================================

// Answer a few more questions to get to 70%
bobPyramid.datapoints.sentiment.value = 'positive';
bobPyramid.datapoints.sentiment.complete = true;

bobPyramid.datapoints.duration.complete = true; // All durations filled

bobPyramid.completeness = calculateRelationshipCompleteness(bobPyramid);
console.log('\n📈 Completeness:', bobPyramid.completeness + '%');

if (bobPyramid.completeness >= 70) {
  bobPyramid.status = 'mature';
  bobPyramid.confidence = 'high';
  console.log('✅ Pyramid is mature - ready to generate report');
}

// =============================================================================
// Final validation
// =============================================================================

const finalValidation = RelationshipPyramidSchema.safeParse(bobPyramid);

if (finalValidation.success) {
  console.log('\n✅ Pyramid fully validated and ready to use');

  // Save to file
  const pyramidJSON = JSON.stringify(finalValidation.data, null, 2);
  console.log('\n💾 Can be saved as:');
  console.log('meta/pyramids/relationship_bob.json');

} else {
  console.error('\n❌ Validation failed:', finalValidation.error);
}

// =============================================================================
// Type safety demonstration
// =============================================================================

function analyzePyramid(pyramid: RelationshipPyramid) {
  console.log('\n🔍 Type-safe pyramid analysis:');

  // TypeScript knows the exact structure
  console.log('Subject:', pyramid.subject);
  console.log('Interactions:', pyramid.interactions.length);
  console.log('Status:', pyramid.status);

  // Can safely iterate interactions
  pyramid.interactions.forEach(interaction => {
    console.log(`  - ${interaction.date.toLocaleDateString()}: ${interaction.type}`);
    // TypeScript knows interaction has these fields
  });

  // Conditional logic is type-safe
  if (pyramid.prosocial_pattern) {
    console.log('👍 This is a prosocial relationship');
  }
}

analyzePyramid(bobPyramid);
