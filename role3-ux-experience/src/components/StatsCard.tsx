import { StatCardProps } from "@/types";
import { ACCENT_MAP } from "@/styles/tokens";

export default function StatCard({ label, value, icon, accent = "blue" }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-slate-800/60 border border-slate-700/50 p-4">
      <div className={`flex items-center justify-center w-10 h-10 rounded-lg border shrink-0 ${ACCENT_MAP[accent]}`}>
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-2xl font-bold text-slate-100 leading-none tabular-nums">{value}</span>
        <span className="text-xs text-slate-400 mt-1">{label}</span>
      </div>
    </div>
  );
}