/**
 * Simple entity extraction (browser-based)
 * For prototype - can be replaced with better ML models later
 */

export interface ExtractedEntities {
  people: string[];
  duration?: number;
  activity?: string;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'mixed';
  tags: string[];
}

/**
 * Extract people names from transcript
 * Simple approach: look for capitalized words not at sentence start
 */
function extractPeople(text: string): string[] {
  const people: string[] = [];

  // Common names to look for (can be expanded)
  const commonNames = [
    'Bob', 'Alice', 'Sarah', 'Michael', 'Clara', 'David', 'Emma',
    'James', 'Linda', 'Maria', 'John', 'Lisa', 'Carlos', 'Anna'
  ];

  // Find capitalized words
  const words = text.split(/\s+/);

  for (const word of words) {
    const cleaned = word.replace(/[.,!?;:]/, '');
    if (commonNames.includes(cleaned)) {
      if (!people.includes(cleaned)) {
        people.push(cleaned);
      }
    }
  }

  return people;
}

/**
 * Extract duration from text
 * Patterns: "4 hours", "30 minutes", "2h 15m"
 */
function extractDuration(text: string): number | undefined {
  const lowerText = text.toLowerCase();

  let totalMinutes = 0;

  // Match hours
  const hoursMatch = lowerText.match(/(\d+)\s*(?:hours?|hrs?|h)/);
  if (hoursMatch) {
    totalMinutes += parseInt(hoursMatch[1]) * 60;
  }

  // Match minutes
  const minutesMatch = lowerText.match(/(\d+)\s*(?:minutes?|mins?|m)/);
  if (minutesMatch) {
    totalMinutes += parseInt(minutesMatch[1]);
  }

  return totalMinutes > 0 ? totalMinutes : undefined;
}

/**
 * Detect activity type from keywords
 */
function extractActivity(text: string): string | undefined {
  const lowerText = text.toLowerCase();

  const activities: Record<string, string[]> = {
    helping: ['help', 'helped', 'assist', 'paint', 'fix', 'repair', 'lent', 'lend', 'gave'],
    working: ['work', 'meeting', 'call', 'project', 'task'],
    socializing: ['coffee', 'lunch', 'dinner', 'chat', 'talk', 'visited'],
    learning: ['learn', 'study', 'read', 'course', 'tutorial'],
    creating: ['build', 'make', 'create', 'design', 'write'],
    resting: ['rest', 'sleep', 'nap', 'relax']
  };

  for (const [activity, keywords] of Object.entries(activities)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return activity;
    }
  }

  return undefined;
}

/**
 * Detect sentiment from text
 */
function extractSentiment(text: string): 'positive' | 'neutral' | 'negative' | 'mixed' | undefined {
  const lowerText = text.toLowerCase();

  const positiveWords = ['great', 'good', 'nice', 'happy', 'excellent', 'wonderful', 'enjoyed'];
  const negativeWords = ['bad', 'terrible', 'awful', 'frustrated', 'annoyed', 'angry'];
  const mixedIndicators = ['but', 'however', 'although', 'though'];

  const hasPositive = positiveWords.some(word => lowerText.includes(word));
  const hasNegative = negativeWords.some(word => lowerText.includes(word));
  const hasMixed = mixedIndicators.some(word => lowerText.includes(word));

  if (hasMixed) return 'mixed';
  if (hasPositive && hasNegative) return 'mixed';
  if (hasPositive) return 'positive';
  if (hasNegative) return 'negative';

  return undefined;
}

/**
 * Generate tags from text
 */
function generateTags(text: string): string[] {
  const tags: string[] = [];
  const lowerText = text.toLowerCase();

  const tagKeywords: Record<string, string[]> = {
    helping: ['help', 'helped', 'assist'],
    neighbor: ['neighbor', 'neighbourhood'],
    family: ['family', 'mom', 'dad', 'sister', 'brother'],
    work: ['work', 'job', 'office'],
    friend: ['friend'],
    home: ['house', 'home']
  };

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      tags.push(tag);
    }
  }

  return tags;
}

/**
 * Extract all entities from transcript
 */
export function extractEntities(transcript: string): ExtractedEntities {
  return {
    people: extractPeople(transcript),
    duration: extractDuration(transcript),
    activity: extractActivity(transcript),
    sentiment: extractSentiment(transcript),
    tags: generateTags(transcript)
  };
}
