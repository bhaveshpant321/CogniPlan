"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BookOpen, ChevronDown } from "lucide-react";
import { TopicCardProps } from "@/types";
import { STATUS_STYLES, SCORE_STYLES } from "@/styles/tokens";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

export default function TopicCard({ title, subject, status, lastReviewed, onReview }: TopicCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const styles = STATUS_STYLES[status];

  function handleScore(score: number) {
    onReview(score);
    setReviewed(true);
    setExpanded(false);
  }

  return (
    <motion.div layout initial={{ opacity:0, y:8 }} animate={{ opacity: reviewed ? 0.5 : 1, y:0 }} exit={{ opacity:0, scale:0.97 }} transition={{ duration:0.2 }}
      className={`rounded-xl border-l-4 bg-slate-800/60 backdrop-blur-sm transition-opacity duration-300 ${styles.border}`}>
      <div className="flex items-start justify-between gap-4 p-4">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge label={styles.label} variant={status} />
            <span className="text-xs text-slate-500 flex items-center gap-1"><BookOpen size={11} />{subject}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-100 leading-snug truncate">{title}</h3>
          <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={11} />Last reviewed {timeAgo(lastReviewed)}</p>
        </div>
        <button onClick={() => setExpanded(v => !v)} className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors">
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration:0.2 }} className="block"><ChevronDown size={16} /></motion.span>
        </button>
      </div>
      <AnimatePresence>
        {expanded && !reviewed && (
          <motion.div key="panel" initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4 flex flex-col gap-3">
              <p className="text-xs text-slate-400 font-medium">How well did you recall this?</p>
              <div className="flex gap-2 flex-wrap">
                {[1,2,3,4,5].map(score => (
                  <Button key={score} variant="score" score={score} onClick={() => handleScore(score)} className="rounded-lg" />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        {expanded && reviewed && (
          <motion.div key="logged" initial={{ opacity:0 }} animate={{ opacity:1 }} className="px-4 pb-4">
            <p className="text-xs text-green-400 font-medium">✓ Review logged</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}