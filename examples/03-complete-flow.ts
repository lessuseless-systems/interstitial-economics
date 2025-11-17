/**
 * Example 3: Complete end-to-end flow
 * Voice → Entry → Pyramid Update → Report Generation
 */

import { mergeEntities } from '../utils/validation';
import { RelationshipPyramidSchema, type RelationshipPyramid } from '../schemas/pyramids/relationship.schema';
import { relationshipReportToMarkdown, type RelationshipReport } from '../schemas/reports/relationship-report.schema';
import type { JournalEntry } from '../schemas/journal-entry.schema';

// =============================================================================
// Simulated Voice Journaling Service
// =============================================================================

class VoiceJournalingService {
  private pyramids: Map<string, RelationshipPyramid> = new Map();
  private entries: JournalEntry[] = [];

  /**
   * Process voice input → create entry → update pyramids → ask question
   */
  async processVoiceInput(transcript: string): Promise<string> {
    console.log('\n🎙️ Processing voice input:', transcript);

    // Step 1: Extract entities with AI (simulated)
    const entities = await this.extractEntities(transcript);

    // Step 2: Create validated journal entry
    const entry = mergeEntities(transcript, entities);
    this.entries.push(entry);

    console.log('✅ Entry created:', entry.id);
    console.log('   People:', entry.people);
    console.log('   Activity:', entry.activity);
    console.log('   Duration:', entry.duration, 'minutes');

    // Step 3: Update pyramids
    const updatedPyramids = await this.updatePyramids(entry);

    console.log('📊 Updated pyramids:', updatedPyramids);

    // Step 4: Check if any pyramid needs a question
    const question = this.getNextQuestion();

    if (question) {
      return `Logged. ${question}`;
    }

    return 'Logged.';
  }

  /**
   * Extract entities from transcript (simulated AI)
   */
  private async extractEntities(transcript: string) {
    // In real implementation, this would call ML model
    // For now, simple pattern matching

    const people: string[] = [];
    const namePattern = /\b([A-Z][a-z]+)\b/g;
    let match;

    while ((match = namePattern.exec(transcript)) !== null) {
      if (!['I', 'Monday', 'Sunday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(match[1])) {
        people.push(match[1]);
      }
    }

    // Extract duration
    let duration: number | undefined;
    const durationMatch = transcript.match(/(\d+)\s*hour/i);
    if (durationMatch) {
      duration = parseInt(durationMatch[1]) * 60;
    }

    // Detect activity
    let activity: string | undefined;
    if (/help|paint|fix|assist/i.test(transcript)) {
      activity = 'helping';
    } else if (/work|meeting|call/i.test(transcript)) {
      activity = 'working';
    }

    // Detect sentiment
    let sentiment: 'positive' | 'neutral' | 'negative' | 'mixed' | undefined;
    if (/but|however|although/i.test(transcript)) {
      sentiment = 'mixed';
    } else if (/great|good|nice|happy/i.test(transcript)) {
      sentiment = 'positive';
    }

    return {
      people,
      duration,
      activity,
      sentiment,
      energy: 6,
      tags: activity ? [activity] : []
    };
  }

  /**
   * Update or create pyramids based on entry
   */
  private async updatePyramids(entry: JournalEntry): Promise<string[]> {
    const updated: string[] = [];

    // Check each person mentioned
    for (const person of entry.people) {
      const pyramidId = `relationship_${person.replace(/\[\[|\]\]/g, '').toLowerCase()}`;

      // Get or create pyramid
      let pyramid = this.pyramids.get(pyramidId);

      if (!pyramid) {
        // First mention - don't create pyramid yet
        console.log(`   First mention of ${person} - waiting for 3 mentions`);
        continue;
      }

      // Update pyramid
      pyramid.interactions.push({
        entry_id: entry.id,
        date: entry.created,
        type: entry.activity || 'interaction',
        duration: entry.duration,
        direction: 'you→them', // Simplified - would detect from context
        your_investment: entry.duration ? `${entry.duration} minutes` : 'time',
        sentiment: entry.sentiment
      });

      pyramid.entries.push(entry.id);
      pyramid.datapoints.frequency.value += 1;

      if (entry.duration) {
        pyramid.datapoints.duration.value.push(entry.duration);
      }

      pyramid.last_updated = new Date();

      // Recalculate completeness
      const complete = Object.values(pyramid.datapoints).filter(d => d.complete).length;
      pyramid.completeness = Math.round((complete / 7) * 100);

      this.pyramids.set(pyramidId, pyramid);
      updated.push(pyramidId);

      console.log(`   Updated pyramid: ${pyramidId} (${pyramid.completeness}% complete)`);

      // Check if ready for report
      if (pyramid.completeness >= 70 && pyramid.status !== 'mature') {
        pyramid.status = 'mature';
        console.log(`   ✨ Pyramid ${pyramidId} is now MATURE - generating report`);
        await this.generateReport(pyramid);
      }
    }

    return updated;
  }

  /**
   * Get next question from highest-priority pyramid
   */
  private getNextQuestion(): string | null {
    let highestPriority: { pyramid: RelationshipPyramid; question: string; score: number } | null = null;

    for (const pyramid of this.pyramids.values()) {
      // Calculate priority score
      const incompleteness = 100 - pyramid.completeness;
      const recency = 1.0; // Would calculate based on last_updated
      const score = incompleteness * recency;

      // Get next question for this pyramid
      const question = this.getQuestionForPyramid(pyramid);

      if (question && (!highestPriority || score > highestPriority.score)) {
        highestPriority = { pyramid, question, score };
      }
    }

    return highestPriority?.question || null;
  }

  /**
   * Get specific question for a pyramid
   */
  private getQuestionForPyramid(pyramid: RelationshipPyramid): string | null {
    const person = pyramid.subject.replace(/\[\[|\]\]/g, '');

    // Priority order
    if (!pyramid.datapoints.reciprocity.complete && pyramid.interactions.length >= 3) {
      return `Has ${person} helped you before?`;
    }

    if (!pyramid.datapoints.duration.complete) {
      const missing = pyramid.datapoints.duration.value.filter(d => d === null).length;
      if (missing > 0) {
        return `How long did that take with ${person}?`;
      }
    }

    if (!pyramid.datapoints.sentiment.complete) {
      return `How do you generally feel after interacting with ${person}?`;
    }

    return null;
  }

  /**
   * Generate markdown report for pyramid
   */
  private async generateReport(pyramid: RelationshipPyramid): Promise<void> {
    const report: RelationshipReport = {
      report_type: 'relationship',
      subject: pyramid.subject,
      generated: new Date(),
      last_updated: new Date(),
      completeness: pyramid.completeness,
      confidence: pyramid.confidence,
      entries_analyzed: pyramid.entries.length,
      auto_update: true,

      summary: `You maintain a ${pyramid.relationship_type || 'personal'} relationship with ${pyramid.subject}`,
      key_findings: [
        `${pyramid.interactions.length} interactions recorded`,
        `${pyramid.datapoints.direction.value.filter(d => d === 'you→them').length} times you helped`,
        `Pattern: ${pyramid.prosocial_pattern ? 'prosocial' : 'reciprocal'}`
      ],

      interactions: pyramid.interactions.map(i => ({
        date: i.date,
        entry_id: i.entry_id,
        type: i.type,
        duration: i.duration,
        your_investment: i.your_investment,
        their_return: i.their_return,
        sentiment: i.sentiment
      })),

      balance: {
        you_to_them: {
          time_hours: (pyramid.total_time_invested || 0) / 60,
          resources_value: 0,
          emotional_support: 'medium'
        },
        them_to_you: {
          time_hours: (pyramid.total_time_received || 0) / 60,
          resources_value: 0,
          emotional_support: 'medium'
        },
        net_time_balance: pyramid.net_balance_minutes || 0,
        net_resource_balance: 0
      },

      sentiment_trajectory: pyramid.interactions
        .filter(i => i.sentiment)
        .map(i => ({
          date: i.date,
          sentiment: i.sentiment!
        })),

      motivation_quotes: [],

      interaction_frequency: {
        total: pyramid.interactions.length,
        avg_per_month: pyramid.interactions.length / 12, // Simplified
        trend: 'stable'
      },

      reciprocity_pattern: {
        type: pyramid.datapoints.reciprocity.value,
        ratio: 1.0,
        prosocial: pyramid.prosocial_pattern || false
      },

      data_gaps: [],
      contradictions: [],

      predictions: {
        risk_factors: [],
        opportunities: []
      },

      related_reports: []
    };

    const markdown = relationshipReportToMarkdown(report);

    console.log('\n📄 Generated report:');
    console.log('---');
    console.log(markdown);
    console.log('---');
  }

  /**
   * Create a new pyramid when threshold reached
   */
  createPyramid(person: string): void {
    const pyramidId = `relationship_${person.replace(/\[\[|\]\]/g, '').toLowerCase()}`;

    const pyramid: RelationshipPyramid = {
      id: pyramidId,
      type: 'relationship',
      subject: `[[${person}]]`,
      created: new Date(),
      last_updated: new Date(),
      completeness: 0,
      confidence: 'low',
      status: 'active',
      entries: [],
      questions_pending: [],
      questions_asked: 0,
      relationship_type: 'other',
      datapoints: {
        frequency: { value: 0, complete: false },
        duration: { value: [], complete: false },
        direction: { value: [], complete: false },
        reciprocity: { value: 'unknown', complete: false },
        context: { value: [], complete: false },
        sentiment: { value: 'neutral', complete: false },
        outcome: { value: [], complete: false }
      },
      interactions: []
    };

    this.pyramids.set(pyramidId, pyramid);
    console.log(`\n🆕 Created pyramid for ${person}`);
  }
}

// =============================================================================
// Demo: Complete flow
// =============================================================================

async function demo() {
  const service = new VoiceJournalingService();

  console.log('='.repeat(70));
  console.log('COMPLETE FLOW DEMO');
  console.log('='.repeat(70));

  // Create Bob pyramid manually (normally done after 3 mentions)
  service.createPyramid('Bob');

  // Entry 1
  console.log('\n\n' + '='.repeat(70));
  console.log('ENTRY 1');
  console.log('='.repeat(70));
  const response1 = await service.processVoiceInput(
    'Helped Bob move into the house next door. Took about 6 hours. Seems like a nice guy.'
  );
  console.log('\n🤖 Response:', response1);

  // Entry 2
  console.log('\n\n' + '='.repeat(70));
  console.log('ENTRY 2');
  console.log('='.repeat(70));
  const response2 = await service.processVoiceInput(
    'Bob helped me fix the fence. Only took 2 hours. Good neighbor.'
  );
  console.log('\n🤖 Response:', response2);

  // Entry 3
  console.log('\n\n' + '='.repeat(70));
  console.log('ENTRY 3');
  console.log('='.repeat(70));
  const response3 = await service.processVoiceInput(
    'Lent Bob my tools for his deck project.'
  );
  console.log('\n🤖 Response:', response3);

  // Entry 4 (triggers question - 3rd mention)
  console.log('\n\n' + '='.repeat(70));
  console.log('ENTRY 4');
  console.log('='.repeat(70));
  const response4 = await service.processVoiceInput(
    'Bob asked me to paint his house Sunday, but heard he\'s getting evicted Monday'
  );
  console.log('\n🤖 Response:', response4);
  // Should ask: "Has Bob helped you before?"

  console.log('\n\n' + '='.repeat(70));
  console.log('DEMO COMPLETE');
  console.log('='.repeat(70));
}

// Run demo
demo().catch(console.error);
