import { calculateNextReview } from "../src/sm2";
import { getMasteryLevel } from "../src/mastery";
import { StudyLogState } from "../src/types";

function baseLog(overrides: Partial<StudyLogState> = {}): StudyLogState {
  return {
    topic_id: "topic-1",
    last_reviewed: null,
    next_review: new Date().toISOString(),
    ease_factor: 2.5,
    reps: 0,
    interval_days: 1,
    lapses: 0,
    total_study_seconds: 0,
    ...overrides,
  };
}

describe("calculateNextReview", () => {
  it("resets interval and reps when quality is below 3", () => {
    const current = baseLog({ reps: 4, interval_days: 10, ease_factor: 2.6, lapses: 1 });

    const result = calculateNextReview(current, 2);

    expect(result.updated.interval_days).toBe(1);
    expect(result.updated.reps).toBe(0);
    expect(result.updated.lapses).toBe(2);
    expect(result.updated.ease_factor).toBe(2.6);
  });

  it("increases interval for successful review", () => {
    const current = baseLog({ reps: 3, interval_days: 8, ease_factor: 2.5 });

    const result = calculateNextReview(current, 5);

    expect(result.updated.interval_days).toBeGreaterThan(8);
    expect(result.updated.reps).toBe(4);
    expect(result.updated.ease_factor).toBeGreaterThan(2.5);
  });

  it("clamps quality score to the 0-5 range", () => {
    const current = baseLog({ reps: 1, interval_days: 1, ease_factor: 2.5 });

    const low = calculateNextReview(current, -10);
    const high = calculateNextReview(current, 99);

    expect(low.quality_score).toBe(0);
    expect(high.quality_score).toBe(5);
  });
});

describe("getMasteryLevel", () => {
  it("maps reps to Beginner", () => {
    expect(getMasteryLevel(0)).toBe("Beginner");
    expect(getMasteryLevel(2)).toBe("Beginner");
  });

  it("maps reps to Intermediate", () => {
    expect(getMasteryLevel(3)).toBe("Intermediate");
    expect(getMasteryLevel(5)).toBe("Intermediate");
  });

  it("maps reps to Master", () => {
    expect(getMasteryLevel(6)).toBe("Master");
    expect(getMasteryLevel(20)).toBe("Master");
  });
});
