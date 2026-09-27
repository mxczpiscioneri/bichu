/**
 * Pure progression rules. The store only persists what these functions return.
 */

export interface AnimalProgress {
  animalId: string;
  opened: boolean;
  heardName: boolean;
  heardSound: boolean;
  /** Template ids completed at least once for this animal. */
  challengesCompleted: string[];
  stars: number;
  discoveredAt?: string;
  /** Used for "Continue explorando". */
  lastSeenAt?: string;
}

export type ProgressEvent =
  | { type: 'opened' }
  | { type: 'heardName' }
  | { type: 'heardSound' }
  | { type: 'challengeCompleted'; templateId: string };

export const DISCOVERY_RULE = {
  requiresName: true,
  requiresSound: true,
  minChallenges: 2,
} as const;

export const MAX_STARS_PER_ANIMAL = 3;

export type DiscoveryState = 'unknown' | 'found' | 'discovered';

export function emptyProgress(animalId: string): AnimalProgress {
  return {
    animalId,
    opened: false,
    heardName: false,
    heardSound: false,
    challengesCompleted: [],
    stars: 0,
  };
}

export function meetsDiscoveryRule(progress: AnimalProgress): boolean {
  return (
    (!DISCOVERY_RULE.requiresName || progress.heardName) &&
    (!DISCOVERY_RULE.requiresSound || progress.heardSound) &&
    progress.challengesCompleted.length >= DISCOVERY_RULE.minChallenges
  );
}

export function discoveryState(progress: AnimalProgress | undefined): DiscoveryState {
  if (!progress) return 'unknown';
  if (progress.discoveredAt) return 'discovered';
  const touched =
    progress.opened || progress.heardName || progress.heardSound || progress.challengesCompleted.length > 0;
  return touched ? 'found' : 'unknown';
}

export interface ApplyResult {
  progress: AnimalProgress;
  /** True only on the event that turned the animal into "discovered". */
  justDiscovered: boolean;
  /** Stars earned by this event (0 or 1). */
  starsEarned: number;
}

/** Applies an event. Idempotent: repeating an event never double-counts. */
export function applyProgressEvent(
  current: AnimalProgress,
  event: ProgressEvent,
  now: Date = new Date(),
): ApplyResult {
  const next: AnimalProgress = { ...current, challengesCompleted: [...current.challengesCompleted] };
  let starsEarned = 0;

  switch (event.type) {
    case 'opened':
      next.opened = true;
      next.lastSeenAt = now.toISOString();
      break;
    case 'heardName':
      next.heardName = true;
      break;
    case 'heardSound':
      next.heardSound = true;
      break;
    case 'challengeCompleted':
      next.lastSeenAt = now.toISOString();
      if (!next.challengesCompleted.includes(event.templateId)) {
        next.challengesCompleted.push(event.templateId);
        if (next.stars < MAX_STARS_PER_ANIMAL) {
          next.stars += 1;
          starsEarned = 1;
        }
      }
      break;
  }

  const justDiscovered = !current.discoveredAt && meetsDiscoveryRule(next);
  if (justDiscovered) next.discoveredAt = now.toISOString();
  return { progress: next, justDiscovered, starsEarned };
}

/** Steps shown on the animal page (what is still missing to discover it). */
export function discoverySteps(progress: AnimalProgress | undefined) {
  const p = progress ?? emptyProgress('');
  return {
    heardName: p.heardName,
    heardSound: p.heardSound,
    challenges: Math.min(p.challengesCompleted.length, DISCOVERY_RULE.minChallenges),
    challengesNeeded: DISCOVERY_RULE.minChallenges,
  };
}
