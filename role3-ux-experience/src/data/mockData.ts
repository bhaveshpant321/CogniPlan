import { Topic, Subject, User, SessionStats } from "@/types";

// ─── Date helpers ─────────────────────────────────────────────────────────────
const now = new Date();
const daysAgo      = (n: number) => new Date(now.getTime() - n * 86_400_000);
const daysFromNow  = (n: number) => new Date(now.getTime() + n * 86_400_000);

// ─── Mock Topics ──────────────────────────────────────────────────────────────
// Sorted by urgency (critical → due → learning → mastered)
export const MOCK_TOPICS: Topic[] = [
  {
    id: "1",
    title: "CPU Pipelining & Hazards",
    subject: "Computer Architecture",
    status: "critical",
    lastReviewed: daysAgo(5),
    nextReview:   daysAgo(2),
    easeFactor:   1.8,
    repetitions:  3,
    interval:     3,
  },
  {
    id: "2",
    title: "Dijkstra's Algorithm",
    subject: "Data Structures",
    status: "critical",
    lastReviewed: daysAgo(4),
    nextReview:   daysAgo(1),
    easeFactor:   2.0,
    repetitions:  2,
    interval:     2,
  },
  {
    id: "3",
    title: "TCP/IP Three-Way Handshake",
    subject: "Networks",
    status: "due",
    lastReviewed: daysAgo(3),
    nextReview:   now,
    easeFactor:   2.4,
    repetitions:  4,
    interval:     7,
  },
  {
    id: "4",
    title: "Deadlock Conditions (Coffman)",
    subject: "Operating Systems",
    status: "due",
    lastReviewed: daysAgo(7),
    nextReview:   now,
    easeFactor:   2.3,
    repetitions:  3,
    interval:     7,
  },
  {
    id: "5",
    title: "B-Tree vs B+ Tree",
    subject: "Database Systems",
    status: "learning",
    lastReviewed: daysAgo(1),
    nextReview:   daysFromNow(1),
    easeFactor:   2.5,
    repetitions:  1,
    interval:     1,
  },
  {
    id: "6",
    title: "Normal Forms (1NF–BCNF)",
    subject: "Database Systems",
    status: "learning",
    lastReviewed: daysAgo(0),
    nextReview:   daysFromNow(2),
    easeFactor:   2.5,
    repetitions:  0,
    interval:     1,
  },
  {
    id: "7",
    title: "P vs NP Complexity Classes",
    subject: "Theory of Computation",
    status: "mastered",
    lastReviewed: daysAgo(10),
    nextReview:   daysFromNow(14),
    easeFactor:   2.9,
    repetitions:  8,
    interval:     21,
  },
  {
    id: "8",
    title: "RSA Encryption Fundamentals",
    subject: "Cryptography",
    status: "mastered",
    lastReviewed: daysAgo(14),
    nextReview:   daysFromNow(7),
    easeFactor:   3.1,
    repetitions:  10,
    interval:     21,
  },
];

// ─── Mock Subjects ────────────────────────────────────────────────────────────
export const MOCK_SUBJECTS: Subject[] = [
  {
    id: "s1",
    name: "Computer Architecture",
    color: "#3B82F6",
    topics: MOCK_TOPICS.filter((t) => t.subject === "Computer Architecture"),
  },
  {
    id: "s2",
    name: "Data Structures",
    color: "#8B5CF6",
    topics: MOCK_TOPICS.filter((t) => t.subject === "Data Structures"),
  },
  {
    id: "s3",
    name: "Networks",
    color: "#EC4899",
    topics: MOCK_TOPICS.filter((t) => t.subject === "Networks"),
  },
  {
    id: "s4",
    name: "Operating Systems",
    color: "#F59E0B",
    topics: MOCK_TOPICS.filter((t) => t.subject === "Operating Systems"),
  },
  {
    id: "s5",
    name: "Database Systems",
    color: "#10B981",
    topics: MOCK_TOPICS.filter((t) => t.subject === "Database Systems"),
  },
  {
    id: "s6",
    name: "Theory of Computation",
    color: "#6366F1",
    topics: MOCK_TOPICS.filter((t) => t.subject === "Theory of Computation"),
  },
  {
    id: "s7",
    name: "Cryptography",
    color: "#EF4444",
    topics: MOCK_TOPICS.filter((t) => t.subject === "Cryptography"),
  },
];

// ─── Mock Stats ───────────────────────────────────────────────────────────────
export const MOCK_STATS: SessionStats = {
  dueToday:      MOCK_TOPICS.filter((t) => t.status === "due" || t.status === "critical").length,
  totalMastered: MOCK_TOPICS.filter((t) => t.status === "mastered").length,
  currentStreak: 7,
};

// ─── Mock User ────────────────────────────────────────────────────────────────
export const MOCK_USER: User = {
  id:            "u1",
  name:          "Sandhya",
  streak:        7,
  totalMastered: MOCK_STATS.totalMastered,
  dueToday:      MOCK_STATS.dueToday,
};