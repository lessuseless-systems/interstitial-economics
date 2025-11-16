# Pyramid-Driven Interstitial Journaling
## Specification Document

**Version**: 1.0
**Date**: November 16, 2025
**Purpose**: AI generates coherent analytical reports from voice journal fragments

---

## Table of Contents

1. [Core Concept](#core-concept)
2. [Pyramid Types](#pyramid-types)
3. [Question Selection Algorithm](#question-selection-algorithm)
4. [Report Markdown Format](#report-markdown-format)
5. [Pattern Discovery Engine](#pattern-discovery-engine)
6. [Implementation Examples](#implementation-examples)
7. [Data Flow](#data-flow)

---

## Core Concept

### The Minto Pyramid Principle Applied to Journaling

**Traditional journaling:**
```
User writes → Entries accumulate → User manually synthesizes insights
```

**Pyramid-driven journaling:**
```
User speaks → AI identifies patterns → AI builds pyramids → AI asks questions to complete pyramids → Reports auto-generate
```

### Key Innovation

**The AI has an objective function: Build coherent analytical reports**

Every question asked serves to complete a specific pyramid. No arbitrary data collection.

---

## Pyramid Types

### 1. Relationship Pyramids (Per-Person)

**Trigger**: Same person mentioned 3+ times

**Pyramid Structure**:
```
┌─────────────────────────────────────────────┐
│ CONCLUSION: Nature of relationship with X   │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │Frequency│  │Balance │  │Pattern │
    │of       │  │of      │  │of      │
    │contact  │  │exchange│  │interaction│
    └────────┘  └────────┘  └────────┘
        │           │           │
     [Data]      [Data]      [Data]
```

**Required Datapoints**:
- Frequency: How often you interact (dates, count)
- Duration: Total time investment
- Direction: Who initiates, who gives/receives
- Reciprocity: Balance of exchange
- Context: Where/why interactions happen
- Sentiment: Emotional valence of interactions
- Outcome: Results of interactions

**Generated Report**: `reports/relationships/[person-name].md`

**Example Questions AI Asks**:
- "How long did helping [[Bob]] take?" (duration)
- "Did [[Bob]] ask you, or did you offer?" (direction)
- "Has [[Bob]] helped you before?" (reciprocity)
- "How did you feel after?" (sentiment)

---

### 2. Time Allocation Pyramids (Weekly/Monthly)

**Trigger**: End of week/month, or user asks "how did I spend my time?"

**Pyramid Structure**:
```
┌─────────────────────────────────────────────┐
│ CONCLUSION: How you spent time this [period]│
└─────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┬──────────┐
        ▼           ▼           ▼          ▼
    ┌────────┐  ┌────────┐  ┌────────┐ ┌────────┐
    │People  │  │Solo    │  │Work    │ │Rest    │
    │40%     │  │30%     │  │20%     │ │10%     │
    └────────┘  └────────┘  └────────┘ └────────┘
```

**Required Datapoints**:
- Activity categorization (helping, working, resting, etc.)
- Duration of each entry
- Gaps between entries (unaccounted time)
- Energy level during activities
- Context (location, with whom)

**Generated Report**: `reports/time/2025-11-week46.md`

**Example Questions AI Asks**:
- "Roughly how long did that take?" (duration)
- "What did you do between 2pm and 6pm?" (gaps)
- "Were you energized or drained after?" (energy)

---

### 3. Reciprocity Network Pyramid

**Trigger**: 5+ people mentioned, or patterns of helping detected

**Pyramid Structure**:
```
┌─────────────────────────────────────────────┐
│ CONCLUSION: Your reciprocity network map    │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │Net     │  │Mutual  │  │One-way │
    │givers  │  │aid     │  │takers  │
    └────────┘  └────────┘  └────────┘
```

**Required Datapoints**:
- Who helps whom (directed graph)
- Value exchanged (time, resources, emotional support)
- Balance per relationship (net positive/negative)
- Indirect reciprocity (A helps B, B helps C, C helps A)
- Network density (how interconnected)

**Generated Report**: `reports/network/reciprocity-map.md`

**Example Questions AI Asks**:
- "Do [[Bob]] and [[Sarah]] know each other?" (connections)
- "Has [[Clara]] ever helped [[Bob]]?" (indirect reciprocity)
- "What did [[Sarah]] give you in return?" (value)

---

### 4. Behavioral Pattern Pyramids

**Trigger**: Repeated activity types detected (helping, avoiding, committing, etc.)

**Pyramid Structure**:
```
┌─────────────────────────────────────────────┐
│ CONCLUSION: You exhibit prosocial behavior  │
│ independent of reciprocity expectations     │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │Evidence│  │Counter │  │Context │
    │15 cases│  │examples│  │factors │
    │        │  │2 cases │  │        │
    └────────┘  └────────┘  └────────┘
```

**Pattern Types to Detect**:
- Prosocial behavior (helping without expectation)
- Transactional behavior (explicit exchange)
- Avoidance patterns (declining requests)
- Commitment keeping (follow-through rate)
- Decision-making under uncertainty
- Value alignment (stated vs. revealed preferences)

**Required Datapoints**:
- Frequency of pattern
- Context when pattern appears/doesn't appear
- Exceptions that prove/disprove pattern
- Emotional state during pattern
- Outcomes of pattern behavior

**Generated Report**: `reports/patterns/prosocial-behavior.md`

**Example Questions AI Asks**:
- "Did you expect anything in return?" (motivation)
- "Have you ever said no to a request like this?" (exceptions)
- "How did this turn out?" (outcomes)

---

### 5. Prediction Market Pyramids (Future)

**Trigger**: User makes predictions about outcomes

**Pyramid Structure**:
```
┌─────────────────────────────────────────────┐
│ CONCLUSION: Your prediction accuracy is 73% │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │Social  │  │Time    │  │Outcome │
    │70%     │  │85%     │  │65%     │
    └────────┘  └────────┘  └────────┘
```

**Required Datapoints**:
- Prediction made (what you think will happen)
- Confidence level (how sure you are)
- Resolution criteria (how to judge outcome)
- Actual outcome (what really happened)
- Time to resolution
- Stakes involved

**Generated Report**: `reports/markets/prediction-accuracy.md`

**Example Questions AI Asks**:
- "How likely is this to work out?" (prediction)
- "When will you know?" (resolution timeline)
- "What would count as success?" (criteria)
- [Later] "Did helping [[Bob]] feel worth it?" (resolution)

---

### 6. Value Alignment Pyramid

**Trigger**: Contradictions detected between stated values and actions

**Pyramid Structure**:
```
┌─────────────────────────────────────────────┐
│ CONCLUSION: Actions align with values 89%   │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │Stated  │  │Revealed│  │Gaps    │
    │values  │  │by      │  │        │
    │        │  │actions │  │        │
    └────────┘  └────────┘  └────────┘
```

**Required Datapoints**:
- Explicit value statements ("community is important")
- Decisions made (helped Bob despite low reciprocity)
- Trade-offs (chose X over Y)
- Regrets or second thoughts
- Rationalizations

**Generated Report**: `reports/values/alignment-analysis.md`

**Example Questions AI Asks**:
- "Why did you choose to help?" (stated motivation)
- "What did you give up to do this?" (trade-offs)
- "Would you make the same choice again?" (reflection)

---

## Question Selection Algorithm

### Priority Scoring System

Each pyramid has a **completeness score** (0-100%) and **priority weight**.

**Completeness Calculation**:
```
completeness = (datapoints_filled / datapoints_required) * 100

Example:
Bob Relationship Pyramid:
- Frequency: ✓ (3 interactions)
- Duration: ✗ (missing 2 durations)
- Direction: ✓ (noted)
- Reciprocity: ✗ (not asked yet)
- Context: ✓ (location noted)
- Sentiment: ✗ (not asked)
- Outcome: ✗ (not resolved)

Completeness: 3/7 = 43%
```

**Priority Weight Factors**:
```
priority = recency * relevance * impact * user_tolerance

Where:
- recency: How recent is the entry (decay: 1.0 today → 0.1 after 30 days)
- relevance: Does this relate to current entry? (0.5-2.0)
- impact: How valuable is this pyramid? (relationship: 1.0, time: 0.8)
- user_tolerance: How annoyed is user? (starts 1.0, decreases with questions)
```

**Combined Score**:
```
score = (100 - completeness) * priority

Higher score = more urgent to ask about
```

### Decision Tree

**After each entry, AI evaluates:**

```
1. Does this entry trigger new pyramid creation?
   └─ Yes: Initialize pyramid, mark incomplete
   └─ No: Continue

2. Which existing pyramids does this entry support?
   └─ Update those pyramids with new data

3. Calculate scores for all incomplete pyramids
   └─ Sort by score (highest first)

4. Check user tolerance
   └─ Has user been asked questions recently?
   └─ Is this entry particularly brief/casual?
   └─ Time of day (don't interrupt morning routine)

5. If tolerance allows, ask top-scoring question
   └─ Frame question in pyramid context
   └─ Limit to 1 question per entry (usually)

6. If tolerance low, skip questions this entry
   └─ Increment "patience" counter
   └─ Ask multiple questions later when user engaged
```

### Question Framing

**Bad (generic)**:
```
AI: "How long did that take?"
```

**Good (pyramid-contextualized)**:
```
AI: "Quick question - how long did the painting take?
     Trying to understand your total time investment with Bob."
```

**Better (shows insight)**:
```
AI: "You've helped Bob 4 times this year. How long did
     painting take? Curious about your overall time commitment."
```

### Batching Questions

**Sometimes AI saves up questions:**

```
[Entry 1: Brief mention of Bob]
AI: [Stays silent, marks question for later]

[Entry 2: Another Bob mention]
AI: [Stays silent, another question marked]

[Entry 3: User seems engaged, longer entry]
AI: "I've been tracking your relationship with Bob.
     Mind if I ask a few questions to fill in some gaps?"
User: "Sure"
AI: "How long did the painting take?"
User: "4 hours"
AI: "And the tool lending - have you gotten them back?"
User: "Yeah, he returned them"
AI: "Last one - how do you generally feel after helping Bob?"
User: "Good, he's a good neighbor"
AI: "Perfect. Built a relationship analysis report if you want to see it."
```

---

## Report Markdown Format

### General Structure

All reports follow this template:

```markdown
---
report_type: [relationship|time|network|pattern|market|values]
subject: [person-name|time-period|pattern-name]
generated: 2025-11-16T15:30:00Z
last_updated: 2025-11-16T15:30:00Z
completeness: 87%
confidence: high|medium|low
entries_analyzed: 12
auto_update: true
---

# [Report Title]

**Summary**: [One-sentence Minto-style conclusion]

## Key Findings

[2-4 bullet points, most important insights]

## Supporting Evidence

[Pyramidal structure with links to actual journal entries]

### [Category 1]
[Details with [[links]] to entries]

### [Category 2]
[Details with [[links]] to entries]

## Data Gaps

[What's missing, questions to ask]

## Contradictions

[Any inconsistencies noticed]

## Trends Over Time

[If enough data, show temporal patterns]

---

*Auto-generated from [[journal-entries]]. Last updated: [timestamp]*
*Completeness: [X]% | Confidence: [level]*
```

### Example: Relationship Report

**`reports/relationships/bob.md`**:

```markdown
---
report_type: relationship
subject: Bob
generated: 2025-11-16T15:30:00Z
last_updated: 2025-11-16T15:30:00Z
completeness: 87%
confidence: high
entries_analyzed: 5
auto_update: true
---

# Relationship Analysis: Bob

**Summary**: You maintain a prosocial relationship with Bob characterized by consistent helping behavior (5 interactions over 18 months) with minimal reciprocity expectations, primarily motivated by community values rather than transactional exchange.

## Key Findings

- **Net giver**: You've invested 14+ hours helping Bob vs. 2 hours received
- **Consistent pattern**: Help offered even when reciprocity is unlikely
- **Community-motivated**: Language indicates neighborhood cohesion values
- **Recent stress**: Bob's eviction may change relationship dynamics

## Supporting Evidence

### Frequency of Interaction

| Date | Type | Your Investment | Bob's Return |
|------|------|----------------|--------------|
| [[2024-03-15-helped-bob-move]] | Moving help | 6 hours | - |
| [[2024-08-03-bob-helped-with-fence]] | Fence repair | - | 2 hours |
| [[2025-09-12-lent-bob-tools]] | Tool lending | $200 value | Returned |
| [[2025-11-10-bob-borrowed-truck]] | Vehicle loan | - | Filled tank |
| [[2025-11-16-bob-painting]] | House painting | 4 hours | Unlikely |

**Total**: 5 interactions, average 1 per 3.6 months

### Balance of Exchange

**You → Bob**:
- Time: 10+ hours
- Resources: ~$250 (tools, truck)
- Emotional support: High

**Bob → You**:
- Time: 2 hours
- Resources: ~$30 (gas)
- Emotional support: Medium

**Net balance**: You give 5x more in time, 8x more in resources

### Motivation Analysis

From your own words:

> "Probably not for payback, but feels right"
> — [[2025-11-16-bob-painting]]

> "He's a good neighbor"
> — [[2025-09-12-lent-bob-tools]]

> "Community is important to me"
> — [[2024-03-15-helped-bob-move]]

**Pattern**: Consistent prosocial framing, emphasis on "neighbor" identity, no transactional language.

### Sentiment Trajectory

```
2024-03: Positive (excited to help)
2024-08: Neutral (reciprocal, balanced)
2025-09: Positive (trusted with tools)
2025-11: Mixed (helping despite eviction news)
```

**Trend**: Generally positive, recent ambivalence about sustainability.

## Data Gaps

**Missing information** (asked in future entries):
- [ ] Bob's perspective on this relationship
- [ ] Your satisfaction level (1-10 scale)
- [ ] Other neighbors you help similarly (comparison)
- [ ] Outcome of painting (was it appreciated?)

## Contradictions

None detected. Actions align with stated values (community > reciprocity).

## Trends Over Time

**Interaction frequency**: Increasing (1 in 2024 → 4 in 2025)
**Investment per interaction**: Decreasing (6h → 4h average)
**Reciprocity gap**: Widening (50% reciprocal → 20% reciprocal)

**Prediction**: Relationship may transition after eviction. Monitor for:
- Continued contact post-move?
- Feelings about investment if Bob disappears?
- Pattern shift toward more reciprocal relationships?

---

*Auto-generated from 5 journal entries. Last updated: 2025-11-16 15:30*
*Completeness: 87% | Confidence: High*

**Related Reports**:
- [[prosocial-behavior-pattern]]
- [[reciprocity-network-map]]
- [[time-allocation-nov-2025]]
```

---

### Example: Time Allocation Report

**`reports/time/2025-11-week46.md`**:

```markdown
---
report_type: time
subject: 2025-week-46
generated: 2025-11-17T00:00:00Z
last_updated: 2025-11-17T08:30:00Z
completeness: 78%
confidence: medium
entries_analyzed: 23
auto_update: true
---

# Time Allocation: Week 46 (Nov 11-17, 2025)

**Summary**: You allocated 68% of tracked time to social activities (helping others, conversations), 22% to personal projects, and 10% to rest, suggesting a heavily community-oriented week with potential burnout risk.

## Key Findings

- **Social-heavy**: 41 hours helping others (68% of waking time)
- **Gaps**: 15 hours unaccounted (likely rest, not journaled)
- **Top recipients**: Bob (4h), Sarah (6h), Clara (3h)
- **Energy trend**: High early week → low by Friday

## Time Breakdown

### By Activity Type

| Category | Hours | % | Trend vs. Last Week |
|----------|-------|---|---------------------|
| Helping others | 41h | 68% | +15% ⬆️ |
| Personal projects | 13h | 22% | -10% ⬇️ |
| Rest/leisure | 6h | 10% | -5% ⬇️ |
| **Tracked total** | 60h | 100% | - |
| **Unaccounted** | 15h | - | Unknown |

### By Person

| Person | Hours | Activities |
|--------|-------|------------|
| [[Bob]] | 4h | Painting house |
| [[Sarah]] | 6h | Childcare help (3 days) |
| [[Clara]] | 3h | Grocery shopping |
| [[Michael]] | 2h | Tech support |
| Community | 26h | Various (see entries) |

### Daily Distribution

```
Mon  ████████████░░░░  8h social, 4h personal
Tue  ██████████████░░  10h social, 2h personal
Wed  ███████░░░░░░░░░  5h social, 7h personal (balanced!)
Thu  ████████████████  12h social, 0h personal (burnout risk?)
Fri  ██████░░░░░░░░░░  4h social, 2h personal, 6h rest
Sat  █████████░░░░░░░  6h social (Bob painting)
Sun  ████░░░░░░░░░░░░  2h social, [untracked afternoon]
```

### Energy Levels

```
Mon: ████████░░ 8/10 (energized)
Tue: ███████░░░ 7/10 (good)
Wed: █████████░ 9/10 (peak)
Thu: ████░░░░░░ 4/10 (drained)
Fri: ███░░░░░░░ 3/10 (exhausted)
Sat: █████░░░░░ 5/10 (recovering)
Sun: ██████░░░░ 6/10 (better)
```

**Pattern**: Energy crashed Thursday (after 3 days of heavy social load), took weekend to recover.

## Supporting Entries

**High-energy social activities**:
- [[2025-11-11-helped-sarah-kids]] (2h, energizing)
- [[2025-11-13-community-meeting]] (3h, inspiring)
- [[2025-11-15-clara-groceries]] (3h, pleasant)

**Draining activities**:
- [[2025-11-14-michael-tech-support]] (2h, frustrating)
- [[2025-11-14-mediated-dispute]] (4h, exhausting)

**Personal project time**:
- [[2025-11-13-worked-on-app]] (5h)
- [[2025-11-11-reading]] (2h)

## Data Gaps

**Missing time blocks**:
- Sunday 2pm-8pm (6 hours unaccounted)
- Thursday 6pm-10pm (4 hours unaccounted)
- Daily gaps likely: meals, transit, phone scrolling

**Questions to ask**:
- [ ] What happened Sunday afternoon?
- [ ] Typical meal/transit time per day?
- [ ] Screen time (not journaled)?

## Insights

**Prosocial ceiling**: You seem to hit exhaustion around 40h/week of helping. Thursday's crash suggests this is your limit.

**Energy sources vs. drains**:
- **Energizing**: Kids, community organizing, creative projects
- **Draining**: Tech support, conflict mediation, rushed commitments

**Recommendation**: Consider capping helping at 30h/week, protect Wednesday for personal projects (your peak energy day).

## Comparison to Previous Weeks

| Week | Social | Personal | Rest | Energy Avg |
|------|--------|----------|------|------------|
| 44 | 35h | 18h | 12h | 7/10 |
| 45 | 38h | 15h | 10h | 6/10 |
| 46 | 41h | 13h | 6h | 6/10 |

**Trend**: Increasing social commitment at expense of rest and personal time. Energy holding steady but rest declining = unsustainable.

---

*Auto-generated from 23 journal entries. Last updated: 2025-11-17 08:30*
*Completeness: 78% (missing time gaps) | Confidence: Medium*

**Related Reports**:
- [[prosocial-behavior-pattern]]
- [[energy-management-analysis]]
- [[bob-relationship]]
- [[sarah-relationship]]
```

---

### Example: Pattern Recognition Report

**`reports/patterns/prosocial-behavior.md`**:

```markdown
---
report_type: pattern
subject: prosocial-behavior
generated: 2025-11-17T00:00:00Z
last_updated: 2025-11-17T00:00:00Z
completeness: 91%
confidence: high
entries_analyzed: 47
auto_update: true
---

# Behavioral Pattern: Prosocial Behavior

**Summary**: You consistently engage in prosocial behavior (helping without expectation of return) across 73% of social interactions, motivated primarily by community values and identity maintenance rather than transactional reciprocity.

## Key Findings

- **Frequency**: 34 of 47 social interactions (72%) classified as prosocial
- **Independence**: Prosocial behavior occurs even when reciprocity is unlikely (89% of cases)
- **Motivation**: Community identity > personal gain in stated values
- **Sustainability question**: Recent energy depletion suggests pattern may be unsustainable at current volume

## Evidence

### Prosocial Instances (34 entries)

**High-cost, low-reciprocity examples**:
- [[2025-11-16-bob-painting]] (4h, eviction imminent, no return expected)
- [[2024-03-15-helped-bob-move]] (6h, new neighbor, no prior relationship)
- [[2025-11-12-sarah-emergency-childcare]] (3h, dropped personal plans)
- [[2025-10-05-community-cleanup]] (4h, anonymous contribution)

**Pattern**: Consistently choose to help even when:
- Time investment is high (>2 hours)
- Reciprocity is unlikely or impossible
- Personal costs exist (missed opportunities)
- No social pressure to help

### Transactional Instances (13 entries)

**Clear reciprocity expected**:
- [[2025-09-20-traded-skills-michael]] (teach coding ↔ learn design)
- [[2025-08-15-carpool-exchange]] (drive Monday ↔ they drive Wednesday)

**Pattern**: Transactional behavior limited to:
- Explicit skill trades
- Formal arrangements (carpools, childcare swaps)
- Professional contexts

### Counter-Examples (Declined Help)

**You said NO to helping**:
- [[2025-10-12-declined-steve-request]] (moving, cited exhaustion)
- [[2025-09-08-said-no-to-committee]] (time commitment too high)

**Why you decline**:
- Energy depletion (not selfishness)
- Prior commitments (reliability to others)
- Boundary violations (unreasonable requests)

**NOT related to reciprocity**: You never mention "they wouldn't help me" as reason to decline.

## Motivational Analysis

### Stated Values (from your own words)

> "Community is important to me"
> — Mentioned 7 times across entries

> "Being a good neighbor"
> — Core identity phrase (12 instances)

> "Feels right" / "Right thing to do"
> — Moral framing (18 instances)

> "Not about payback"
> — Explicit rejection of reciprocity logic (5 instances)

### Revealed Preferences (from actions)

**Trade-offs made FOR helping**:
- Personal project time sacrificed (13 instances)
- Financial costs absorbed ($500+ in 2025)
- Energy depletion accepted (see week 46 crash)

**Trade-offs NOT made**:
- Never cancel commitments to others
- Never compromise family time
- Never violate stated boundaries

**Alignment**: 89% - Actions strongly match stated community values

## Contextual Factors

**When prosocial behavior peaks**:
- Early week (Monday-Wednesday, high energy)
- After receiving help from others (reciprocal mood)
- Community-visible contexts (reputation maintenance?)

**When prosocial behavior declines**:
- Late week (Thursday-Friday, depleted)
- After consecutive high-cost helps (burnout)
- When boundaries are tested (learning)

## Sustainability Analysis

**Current volume**: 40h/week helping (week 46)
**Energy capacity**: ~30h/week sustainable (estimated from crash pattern)
**Overage**: 33% above sustainable level

**Risk**: Pattern is driven by authentic values BUT may be unsustainable at current intensity.

**Prediction**: One of three outcomes likely:
1. **Burnout**: Crash and withdraw from helping (25% probability)
2. **Calibration**: Reduce volume to sustainable level (60% probability)
3. **Acceptance**: Embrace depletion as cost of values (15% probability)

## Comparison to General Population

**Your prosocial frequency**: 72% of interactions
**Population average**: ~30% of interactions (estimated)
**Your ranking**: Top 5% in prosocial orientation

**Note**: This is GOOD, but may explain social exhaustion.

## Questions for Reflection

- [ ] Is current helping volume sustainable long-term?
- [ ] Can you maintain community values with 30h/week instead of 40h?
- [ ] Are you helping to avoid something (work avoidance)?
- [ ] What would happen if you said "no" more often?

---

*Auto-generated from 47 journal entries. Last updated: 2025-11-17*
*Completeness: 91% | Confidence: High*

**Related Reports**:
- [[reciprocity-network-map]]
- [[time-allocation-nov-2025]]
- [[energy-management-analysis]]
- [[value-alignment]]
```

---

## Pattern Discovery Engine

### How AI Decides What Pyramids to Build

**Phase 1: Passive Observation (Entries 1-10)**

AI just collects entries, doesn't generate reports yet.

**Looking for**:
- Repeated names (person mentions)
- Repeated activities (verbs: helping, working, resting)
- Time patterns (when you journal)
- Sentiment patterns (language used)

**Phase 2: Pattern Recognition (Entries 10-20)**

AI starts noticing:
```
"User mentions [[Bob]] 4 times → Create relationship pyramid"
"User says 'helped' in 60% of entries → Possible prosocial pattern"
"User tracks time often → Create time allocation pyramid"
```

**Triggers pyramid creation**, but doesn't alert user yet.

**Phase 3: Pyramid Maturation (Entries 20-50)**

AI fills in pyramids by asking questions across subsequent entries.

**When pyramid reaches 70% completeness** → Generate draft report

**Phase 4: Report Presentation (Entry ~50)**

AI surfaces reports:
```
Voice: "I've been analyzing your journal. Built a relationship
       report for Bob - want to hear it, or just keep it filed?"
```

User can:
- Ignore (report updates silently in background)
- Listen (AI reads summary)
- Read (open markdown file in Obsidian)

### Discovery Heuristics

**Person Detection**:
```
IF same_name mentioned >= 3 times:
    CREATE relationship_pyramid(person)

IF multiple people form cluster:
    CREATE network_pyramid(group)
```

**Activity Pattern Detection**:
```
IF activity_verb appears >= 5 times:
    ANALYZE context
    IF context similar across instances:
        CREATE pattern_pyramid(activity)
```

**Time Pattern Detection**:
```
IF user mentions duration in >= 50% of entries:
    CREATE time_allocation_pyramid(period)
```

**Value Detection**:
```
IF user states value explicitly ("community is important"):
    STORE stated_value

IF actions contradict stated_value:
    CREATE value_alignment_pyramid
    FLAG contradiction
```

### Pyramid Lifecycle

```
1. TRIGGERED
   "Bob mentioned 3rd time"

2. INITIALIZED
   Create pyramid structure
   Mark all datapoints incomplete

3. ACTIVE
   Ask questions across entries
   Fill in datapoints
   Update completeness score

4. MATURE (70%+ complete)
   Generate report markdown
   Continue updating with new data

5. STABLE (90%+ complete)
   Fewer questions needed
   Monitor for changes
   Flag contradictions

6. ARCHIVED (no new data for 90 days)
   Stop asking questions
   Keep report but mark "historical"
```

---

## Implementation Examples

### Example 1: Bob Relationship Discovery

**Journal Entries**:

```markdown
# Entry 1 (2024-03-15)
Helped Bob move into the house next door. Took about 6 hours.
Seems like a nice guy.

# Entry 2 (2024-08-03)
Bob helped me fix the fence. Only took 2 hours. Good neighbor.

# Entry 3 (2025-09-12)
Lent Bob my tools for his deck project. $200 worth of stuff.
Hope he returns them lol.
```

**AI Processing**:

```
Entry 1:
- Person: Bob (first mention)
- Activity: helping
- Duration: 6h
- Sentiment: positive
→ No pyramid yet (need 3 mentions)

Entry 2:
- Person: Bob (second mention)
- Activity: being helped
- Duration: 2h
- Sentiment: positive
→ No pyramid yet (need 3 mentions)

Entry 3:
- Person: Bob (THIRD mention)
- Activity: lending
- Value: $200
- Sentiment: positive, slight concern
→ TRIGGER: Create Bob relationship pyramid
```

**Pyramid Initialized**:

```yaml
pyramid_id: relationship_bob
type: relationship
subject: Bob
completeness: 43%
datapoints:
  frequency:
    value: 3
    complete: true
  duration:
    value: [6h, 2h, null]
    complete: false  # Missing entry 3 duration
  direction:
    value: [you→bob, bob→you, you→bob]
    complete: true
  reciprocity:
    value: unknown
    complete: false
  context:
    value: [moving, fence, tools]
    complete: true
  sentiment:
    value: positive
    complete: true
  outcome:
    value: [unknown, unknown, pending]
    complete: false
```

**Next Entry Triggers Question**:

```markdown
# Entry 4 (2025-09-20)
Went to Sarah's for coffee.

AI: "Quick question about Bob - did he return your tools?"
User: "Yeah, last week"
AI: "Great. Noted."

[Updates pyramid: tools returned, reciprocity pattern emerging]
```

**Pyramid Now 57% Complete → Continues asking questions until 70%**

**At 70% completeness → Generates `reports/relationships/bob.md`**

---

### Example 2: Prosocial Pattern Discovery

**Journal Entries (over 3 weeks)**:

```
Week 1: Helped Bob, helped Sarah, helped Clara
Week 2: Helped Michael, community cleanup, helped elderly neighbor
Week 3: Helped Bob again, declined Steve (exhausted), helped Sarah again
```

**AI Processing**:

```
After 15 entries:
- "help" verb appears in 11/15 entries (73%)
- Sentiment: positive in 10/11 cases
- Reciprocity mentioned: only 2/11 cases
- Pattern hypothesis: Prosocial behavior independent of reciprocity

CREATE pattern_pyramid(prosocial_behavior)
```

**Questions AI Asks Over Next 10 Entries**:

```
Entry 16: "Did you expect Bob to help you back?"
Entry 18: "Why did you help Clara even though you were tired?"
Entry 22: "You declined Steve - why? (First time you've said no)"
Entry 25: "How do you feel after helping someone?"
```

**Pyramid Completes → Generates Report**

AI (voice): "I noticed a pattern - you help people a lot. Built an analysis if you're curious."

---

## Data Flow

### System Architecture

```
┌──────────────────────────────────────────────────┐
│ User speaks → STT → Transcript                   │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│ Entity Extraction (on-device AI)                 │
│ - People: [[Bob]]                                │
│ - Duration: 4 hours                              │
│ - Activity: painting, helping                    │
│ - Sentiment: mixed (positive action, concern)    │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│ Journal Entry Created                            │
│ File: 2025-11-16-1047-bob-painting.md            │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│ Pyramid Engine Triggered                         │
│ - Which pyramids does this support?              │
│ - Bob relationship: +1 interaction               │
│ - Prosocial pattern: +1 instance                 │
│ - Time allocation (Nov): +4 hours social         │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│ Update Pyramids                                  │
│ - Calculate new completeness scores              │
│ - Update priority rankings                       │
│ - Generate questions if needed                   │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│ Question Selection                               │
│ - Score all incomplete pyramids                  │
│ - Check user tolerance                           │
│ - Frame question in context                      │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│ AI Asks Question (or stays silent)               │
│ "How long did the painting take?"                │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│ User Answers (or ignores)                        │
│ "About 4 hours"                                  │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│ Update Pyramid                                   │
│ Bob relationship: duration now complete          │
│ Completeness: 43% → 57%                          │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│ Check for Report Generation                      │
│ IF completeness >= 70%:                          │
│   Generate/update markdown report                │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│ Report Saved                                     │
│ reports/relationships/bob.md                     │
│ (Auto-updates as new data arrives)               │
└──────────────────────────────────────────────────┘
```

### File System Structure

```
~/interstitial-journal/
├── entries/
│   ├── 2024-03-15-helped-bob-move.md
│   ├── 2024-08-03-bob-helped-fence.md
│   ├── 2025-09-12-lent-bob-tools.md
│   ├── 2025-11-16-bob-painting.md
│   └── [... all entries ...]
│
├── reports/
│   ├── relationships/
│   │   ├── bob.md
│   │   ├── sarah.md
│   │   └── clara.md
│   │
│   ├── time/
│   │   ├── 2025-11-week46.md
│   │   ├── 2025-11-week45.md
│   │   └── 2025-11-month.md
│   │
│   ├── patterns/
│   │   ├── prosocial-behavior.md
│   │   ├── energy-management.md
│   │   └── commitment-keeping.md
│   │
│   ├── network/
│   │   └── reciprocity-map.md
│   │
│   └── values/
│       └── alignment-analysis.md
│
├── meta/
│   ├── _schema.md (discovered schema)
│   ├── _pyramids.json (active pyramids state)
│   └── _stats.md (journal statistics)
│
└── .obsidian/
    └── [Obsidian vault config]
```

### Pyramid State File

**`meta/_pyramids.json`**:

```json
{
  "pyramids": [
    {
      "id": "relationship_bob",
      "type": "relationship",
      "subject": "Bob",
      "created": "2025-09-12T10:00:00Z",
      "last_updated": "2025-11-16T10:47:23Z",
      "completeness": 87,
      "confidence": "high",
      "status": "mature",
      "datapoints": {
        "frequency": {"value": 5, "complete": true},
        "duration": {"value": [6, 2, 0, 0, 4], "complete": true},
        "direction": {"complete": true},
        "reciprocity": {"complete": true},
        "context": {"complete": true},
        "sentiment": {"complete": true},
        "outcome": {"complete": false}
      },
      "questions_asked": 7,
      "questions_pending": ["How did the painting turn out?"],
      "entries": [
        "2024-03-15-helped-bob-move",
        "2024-08-03-bob-helped-fence",
        "2025-09-12-lent-bob-tools",
        "2025-11-10-bob-borrowed-truck",
        "2025-11-16-bob-painting"
      ],
      "report_path": "reports/relationships/bob.md"
    },
    {
      "id": "pattern_prosocial",
      "type": "pattern",
      "subject": "prosocial-behavior",
      "created": "2025-10-01T00:00:00Z",
      "last_updated": "2025-11-16T10:47:23Z",
      "completeness": 91,
      "confidence": "high",
      "status": "mature",
      "datapoints": {
        "frequency": {"value": 34, "complete": true},
        "motivation": {"complete": true},
        "context": {"complete": true},
        "exceptions": {"complete": true},
        "outcomes": {"complete": false}
      },
      "questions_asked": 12,
      "questions_pending": [],
      "entries": [
        "[... 47 entries ...]"
      ],
      "report_path": "reports/patterns/prosocial-behavior.md"
    }
  ],
  "stats": {
    "total_pyramids": 8,
    "active": 6,
    "mature": 2,
    "archived": 0,
    "avg_completeness": 73
  }
}
```

---

## Next Steps

### Implementation Phases

**Phase 1: Basic Journaling (Week 1-2)**
- Voice → STT → Markdown
- Simple frontmatter (timestamp, people)
- File naming convention
- No pyramids yet (just collect)

**Phase 2: Entity Extraction (Week 3-4)**
- On-device AI extracts:
  - People
  - Duration
  - Activities
  - Sentiment
- Populate frontmatter automatically

**Phase 3: Pyramid Engine (Week 5-8)**
- Build pattern detection
- Initialize pyramids at thresholds
- Question selection algorithm
- State management (pyramids.json)

**Phase 4: Report Generation (Week 9-10)**
- Markdown report templates
- Auto-update on new entries
- Minto pyramid structure
- Link to supporting entries

**Phase 5: Voice Interface (Week 11-12)**
- AI asks questions naturally
- Context-aware framing
- Batch question mode
- Report summaries via voice

**Phase 6: Obsidian Integration (Week 13-14)**
- Plugin for visualization
- Graph view of relationships
- Time-series charts
- Export options

---

## Open Questions

1. **Report surfacing**: When/how does AI tell user about new reports?
   - Proactive ("I built a report for you")
   - Passive (silent generation, user discovers)
   - On-demand ("Analyze my relationship with Bob")

2. **Contradiction handling**: What if user says conflicting things?
   - Flag in report
   - Ask clarifying question
   - Track evolution of thinking

3. **Privacy levels**: Which reports are shareable vs. private?
   - All private by default
   - User marks reports for sharing
   - Generate "public version" (anonymized)

4. **Report frequency**: How often to regenerate?
   - Real-time (after every entry)
   - Daily batch (overnight)
   - On-demand only

5. **Pyramid pruning**: When to archive or delete pyramids?
   - No activity for 90 days
   - User explicitly dismisses
   - Contradicted by later behavior

---

**End of Specification**

*This document describes the pyramid-driven journaling system. For implementation details, see technical specifications.*
