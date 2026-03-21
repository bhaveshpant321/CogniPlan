export type Urgency = "low" | "medium" | "high";

export interface UserStats {
  due_today: number;
  mastered: number;
  streak: number;
}

export interface TopicQueueItem {
  id: string;
  subject: string;
  title: string;
  urgency: Urgency;
  reps: number;
  next_review: string;
}

export interface TopicsQueueResponse {
  user_stats: UserStats;
  queue: TopicQueueItem[];
}

export interface ReviewSubmissionRequest {
  topic_id: string;
  quality_score: number;
  session_duration: number;
}

export interface ReviewSubmissionResponse {
  ok: boolean;
  updated_topic_id: string;
  next_review: string;
  reps: number;
  ease_factor: number;
  interval_days: number;
}

export interface StudyLogState {
  topic_id: string;
  last_reviewed: string | null;
  next_review: string;
  ease_factor: number;
  reps: number;
  interval_days: number;
  lapses: number;
  total_study_seconds: number;
}

export type MasteryLevel = "Beginner" | "Intermediate" | "Master";
