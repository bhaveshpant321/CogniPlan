import { StudyLogState } from "./types";

export interface NextReviewComputation {
  updated: StudyLogState;
  quality_score: number;
}

const MIN_EASE_FACTOR = 1.3;

function clampQuality(qualityScore: number): number {
  if (qualityScore < 0) return 0;
  if (qualityScore > 5) return 5;
  return Math.round(qualityScore);
}

function calculateNextEaseFactor(currentEaseFactor: number, qualityScore: number): number {
  const delta = 0.1 - (5 - qualityScore) * (0.08 + (5 - qualityScore) * 0.02);
  const next = currentEaseFactor + delta;
  return Math.max(MIN_EASE_FACTOR, Number(next.toFixed(4)));
}

function addDays(fromDate: Date, days: number): Date {
  const next = new Date(fromDate);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function calculateNextReview(currentLog: StudyLogState, qualityScore: number): NextReviewComputation {
  const q = clampQuality(qualityScore);
  const now = new Date();

  if (Number.isNaN(now.getTime())) {
    throw new Error("Invalid current date");
  }

  let reps = currentLog.reps;
  let intervalDays = currentLog.interval_days;
  let easeFactor = currentLog.ease_factor;
  let lapses = currentLog.lapses;

  if (q < 3) {
    reps = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    reps += 1;

    if (reps === 1) {
      intervalDays = 1;
    } else if (reps === 2) {
      intervalDays = 6;
    } else {
      intervalDays = Math.max(1, Math.round(intervalDays * easeFactor));
    }

    easeFactor = calculateNextEaseFactor(easeFactor, q);
  }

  const nextReview = addDays(now, intervalDays);

  return {
    quality_score: q,
    updated: {
      ...currentLog,
      last_reviewed: now.toISOString(),
      next_review: nextReview.toISOString(),
      reps,
      interval_days: intervalDays,
      ease_factor: easeFactor,
      lapses,
    },
  };
}
