import { BarChart2 } from "lucide-react";

export default function Analytics() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-slate-500 min-h-96">
      <BarChart2 size={40} className="text-slate-700" />
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-400">Analytics — Coming in Week 4</p>
        <p className="text-xs mt-1">Charts wired to real backend data via React Query.</p>
      </div>
    </div>
  );
}
