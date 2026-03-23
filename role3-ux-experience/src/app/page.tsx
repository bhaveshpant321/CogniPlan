"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Flame, Filter } from "lucide-react";
import { TopicStatus } from "@/types";
import { MOCK_TOPICS, MOCK_STATS } from "@/data/mockData";
import TopicCard from "@/components/TopicCard";
import StatCard  from "@/components/StatsCard";
import Pomodoro  from "@/components/Pomodoro";

const FILTERS: { label: string; value: TopicStatus | "all" }[] = [
  { label:"All",      value:"all"      },
  { label:"Critical", value:"critical" },
  { label:"Due",      value:"due"      },
  { label:"Learning", value:"learning" },
  { label:"Mastered", value:"mastered" },
];

const STATUS_ORDER: Record<TopicStatus, number> = { critical:0, due:1, learning:2, mastered:3 };

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<TopicStatus | "all">("all");

  const filtered = MOCK_TOPICS
    .filter(t => activeFilter === "all" || t.status === activeFilter)
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Today&apos;s Overview</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard label="Due Today"      value={MOCK_STATS.dueToday}      accent="red"    icon={<AlertCircle  size={16} className="text-red-400"    />} />
          <StatCard label="Total Mastered" value={MOCK_STATS.totalMastered} accent="green"  icon={<CheckCircle2 size={16} className="text-green-400"  />} />
          <StatCard label="Current Streak" value={`${MOCK_STATS.currentStreak} days`} accent="yellow" icon={<Flame size={16} className="text-yellow-400" />} />
        </div>
      </section>

      <div className="flex gap-6 items-start flex-col lg:flex-row">
        <section className="flex flex-col gap-4 flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Revision Queue</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} className="text-slate-500 shrink-0" />
            {FILTERS.map(({ label, value }) => (
              <button key={value} onClick={() => setActiveFilter(value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${activeFilter === value ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"}`}>
                {label}
              </button>
            ))}
          </div>
          <motion.div layout className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  className="flex flex-col items-center justify-center gap-3 py-16 rounded-xl border border-dashed border-slate-700 text-slate-500">
                  <CheckCircle2 size={32} className="text-green-500/50" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-400">All caught up!</p>
                    <p className="text-xs">No topics in this category right now.</p>
                  </div>
                </motion.div>
              ) : (
                filtered.map(topic => (
                  <TopicCard key={topic.id} title={topic.title} subject={topic.subject}
                    status={topic.status} lastReviewed={topic.lastReviewed}
                    onReview={(score) => console.log(`${topic.id} → score ${score}`)} />
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        <aside className="w-full lg:w-56 shrink-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Focus Timer</p>
          <Pomodoro />
        </aside>
      </div>
    </div>
  );
}