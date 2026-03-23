"use client";
import { useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { usePomodoroStore } from "@/store/uiStore";

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Pomodoro() {
  const { minutesLeft, secondsLeft, isRunning, isBreak, cyclesCompleted, tick, toggle, reset } = usePomodoroStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => tick(), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, tick]);

  const totalSeconds = isBreak ? 5 * 60 : 25 * 60;
  const elapsed      = totalSeconds - (minutesLeft * 60 + secondsLeft);
  const pct          = Math.max(0, 1 - elapsed / totalSeconds);
  const dashOffset   = CIRCUMFERENCE * (1 - pct);
  const timeStr      = `${String(minutesLeft).padStart(2,"0")}:${String(secondsLeft).padStart(2,"0")}`;

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl bg-slate-800/60 border border-slate-700/50 p-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
        {isBreak && <Coffee size={13} className="text-green-400" />}
        {isBreak ? "Break" : "Focus Session"}
        <span className="text-slate-600">·</span>
        <span className="text-slate-500">{cyclesCompleted} done</span>
      </div>
      <div className="relative flex items-center justify-center w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#1e293b" strokeWidth="8"/>
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke={isBreak ? "#22C55E" : "#3B82F6"} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={dashOffset}
            style={{ transition:"stroke-dashoffset 0.9s linear" }}/>
        </svg>
        <span className="absolute text-2xl font-bold tabular-nums text-slate-100">{timeStr}</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={reset} className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-colors">
          <RotateCcw size={15} />
        </button>
        <button onClick={toggle} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 active:scale-95 transition-all">
          {isRunning ? <Pause size={14} /> : <Play size={14} />}
          {isRunning ? "Pause" : "Start"}
        </button>
      </div>
    </div>
  );
}