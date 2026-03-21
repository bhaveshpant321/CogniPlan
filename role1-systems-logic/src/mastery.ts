import { MasteryLevel } from "./types";

export function getMasteryLevel(reps: number): MasteryLevel {
  if (reps <= 2) {
    return "Beginner";
  }

  if (reps <= 5) {
    return "Intermediate";
  }

  return "Master";
}
