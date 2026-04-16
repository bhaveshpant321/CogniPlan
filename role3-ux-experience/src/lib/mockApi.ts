import { MOCK_SUBJECTS, MOCK_STATS, MOCK_TOPICS } from "@/data/mockData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchTopics() {
  await delay(300);
  return { topics: MOCK_TOPICS };
}

export async function fetchSubjects() {
  await delay(300);
  return { subjects: MOCK_SUBJECTS };
}

export async function fetchStats() {
  await delay(250);
  return { stats: MOCK_STATS };
}

export async function submitReview(topicId: string, score: number) {
  await delay(250);
  console.log(`Mock submit review for ${topicId}: score ${score}`);
  return { topicId, score, success: true };
}

export async function createTopic(topicName: string, subject?: string) {
  await delay(250);
  console.log(`Mock create topic: ${topicName} (${subject ?? "General"})`);
  return { id: `${Date.now()}`, title: topicName, subject: subject || "General", status: "learning" };
}
