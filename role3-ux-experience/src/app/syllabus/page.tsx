"use client";

import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_SUBJECTS } from "@/data/mockData";
import Badge from "@/components/ui/Badge";
import { TopicStatus } from "@/types";

interface SubjectRowProps {
  name: string;
  color: string;
  topicCount: number;
  masteredCount: number;
  children: React.ReactNode;
}

function SubjectRow({ name, color, topicCount, masteredCount, children }: SubjectRowProps) {
  const [open, setOpen] = useState(false);
  const pct = topicCount > 0 ? Math.round((masteredCount / topicCount) * 100) : 0;

  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-800 transition-colors"
      >
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
        <span className="flex-1 text-sm font-semibold text-slate-200">{name}</span>
        <div className="hidden sm:flex items-center gap-2 w-40">
          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-slate-400 tabular-nums w-8 text-right">{pct}%</span>
        </div>
        <span className="text-xs text-slate-500 shrink-0">{topicCount} topics</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} className="text-slate-500" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 px-4 pb-4 border-t border-slate-700/50 pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Syllabus() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-lg font-bold text-slate-100">Syllabus</h1>
        <p className="text-sm text-slate-400 mt-0.5">All subjects and their topic breakdown.</p>
      </div>

      <div className="flex flex-col gap-3">
        {MOCK_SUBJECTS.map(subject => (
          <SubjectRow
            key={subject.id}
            name={subject.name}
            color={subject.color}
            topicCount={subject.topics.length}
            masteredCount={subject.topics.filter(t => t.status === "mastered").length}
          >
            {subject.topics.map(topic => (
              <div key={topic.id} className="flex items-center gap-3 py-2 border-b border-slate-700/30 last:border-0">
                <BookOpen size={13} className="text-slate-500 shrink-0" />
                <span className="flex-1 text-sm text-slate-300 truncate">{topic.title}</span>
                <Badge label={topic.status} variant={topic.status as TopicStatus} />
              </div>
            ))}
          </SubjectRow>
        ))}
      </div>
    </div>
  );
}