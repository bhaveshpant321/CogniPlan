-- CogniPlan Role 1 Week 1 schema
-- PostgreSQL DDL for Users, Subjects, Topics, and StudyLogs

--TIMESTAMPTZ is used to store timestamps with timezone information, ensuring that all date and time data is consistent regardless of the user's location. This is crucial for a study planning app where users may be in different time zones, and accurate scheduling of reviews is essential for effective spaced repetition.
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ON DELETE CASCADE is used in the foreign key constraints to ensure that when a user is deleted, all their associated subjects, topics, and study logs are also automatically deleted. This helps maintain data integrity and prevents orphaned records in the database, which could lead to confusion and clutter over time.
CREATE TABLE subjects (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  syllabus_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE topics (
  id UUID PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'medium',
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT topics_urgency_check CHECK (urgency IN ('low', 'medium', 'high'))
);

-- Constraints: Unique constraint on (user_id, topic_id) in study_logs ensures that each user can only have one study log per topic, preventing duplicate entries and ensuring data integrity. The various CHECK constraints ensure that the values for reps, interval_days, lapses, and total_study_seconds are within logical bounds (e.g., non-negative), which helps maintain the consistency and reliability of the study log data.
CREATE TABLE study_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  last_reviewed TIMESTAMPTZ,
  next_review TIMESTAMPTZ NOT NULL,
  ease_factor DOUBLE PRECISION NOT NULL DEFAULT 2.5,
  reps INTEGER NOT NULL DEFAULT 0,
  interval_days INTEGER NOT NULL DEFAULT 1,
  lapses INTEGER NOT NULL DEFAULT 0,
  total_study_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT study_logs_unique_user_topic UNIQUE (user_id, topic_id),
  CONSTRAINT study_logs_reps_non_negative CHECK (reps >= 0),
  CONSTRAINT study_logs_interval_positive CHECK (interval_days >= 1),
  CONSTRAINT study_logs_lapses_non_negative CHECK (lapses >= 0),
  CONSTRAINT study_logs_total_study_seconds_non_negative CHECK (total_study_seconds >= 0)
);

CREATE INDEX idx_study_logs_user_next_review
  ON study_logs(user_id, next_review);

CREATE INDEX idx_topics_subject_id
  ON topics(subject_id);
