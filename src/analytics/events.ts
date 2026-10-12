import type { ChallengeTemplateId } from '@/challenges/types';
import type { Level } from '@/domain/animal';

/**
 * Closed catalogue of Google Analytics events (GA4 via Firebase).
 *
 * Rule (kids app, "Made for Kids"): parameters only carry non-personal game data — technical
 * ids (game, animal, mode, button from a fixed list) and counts. Never free text, names, age,
 * a user id or anything typed. Read docs/ANALYTICS.md before adding an event.
 */

/** Buttons counted by `button_click`: a fixed list, never the button's visible text. */
export const BUTTON_NAMES = [
  'welcome_start',
  'open_parents',
  'home_animal_of_day',
  'home_game_shortcut',
  'home_place_shortcut',
  'home_collection',
  'animal_play',
  'animal_ar',
  'challenge_close',
  'result_again',
  'result_back',
  'ar_safety_continue',
  'ar_safety_back',
  'ar_challenge',
  'parents_choose_mode',
  'parents_credits',
  'parents_privacy_policy',
  'parents_reset_progress',
] as const;

export type ButtonName = (typeof BUTTON_NAMES)[number];

/**
 * A "level" in GA terms is one challenge session ("brincadeira"): either a game of one
 * challenge type across several animals (the template id) or the mixed challenges about one
 * animal opened from its page (`animal`, with `animal_id`).
 */
export type GameId = ChallengeTemplateId | 'animal';

/** Where the session was played: the 2D challenge screen or the AR overlay. */
export type Surface = 'screen' | 'ar';

interface SessionParams {
  level_id: GameId;
  /** difficulty chosen by the parents: explorer | adventurer */
  mode: Level;
  surface: Surface;
  /** only for `level_id: 'animal'` */
  animal_id?: string;
}

export interface AnalyticsEvents {
  /** app opened (once per JS start) */
  app_open: Record<string, never>;
  /** session started (also on "Brincar de novo") */
  level_start: SessionParams & { rounds: number };
  /** every round answered; `mistakes` = wrong picks in the whole session, `discovered` = new Bichupédia animals */
  level_complete: SessionParams & { rounds: number; stars: number; mistakes: number; discovered: number };
  /** left before the last round (close button, back gesture, leaving AR); `round` = 1-based round reached */
  level_quit: SessionParams & { round: number };
  /** "Brincar de novo" on the session summary */
  level_retry: SessionParams;
  /** animal page opened */
  animal_view: { animal_id: string };
  /** animal entered the Bichupédia (name + sound + 2 challenges); `discovered_total` on this device */
  animal_discovered: { animal_id: string; discovered_total: number };
  /** difficulty picked in "Modo padrão" */
  mode_selected: { mode: Level };
  /** AR view started (safety notice accepted, device supported, camera allowed) */
  ar_start: { animal_id: string };
  /** AR could not start: device unsupported, camera denied, or a build without AR */
  ar_unavailable: { reason: 'unsupported' | 'denied' | 'test' };
  /** animal placed on a surface in AR (once per AR session) */
  ar_animal_placed: { animal_id: string };
  button_click: { button: ButtonName };
}

export type AnalyticsEventName = keyof AnalyticsEvents;

/** Accepted values: technical ids only (lowercase, digits, _), no spaces or free text. */
const ID_PATTERN = /^[a-z0-9_]{1,40}$/;

/** Keeps only non-personal parameters in the expected shape; drops everything else. */
export function sanitizeParams(params: Record<string, unknown>): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (!ID_PATTERN.test(key)) continue;
    if (typeof value === 'number' && Number.isFinite(value)) {
      out[key] = Math.round(value);
    } else if (typeof value === 'string' && ID_PATTERN.test(value)) {
      out[key] = value;
    }
  }
  return out;
}
