"use client";
import { usePathname } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";

const ROUTE_MAP: Record<string, string[]> = {
  "/":           ["Dashboard"],
  "/syllabus":   ["Syllabus"],
  "/analytics":  ["Analytics"],
};

export default function Header() {
  const pathname = usePathname();
  const crumbs = ROUTE_MAP[pathname] ?? pathname.split("/").filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1));

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-slate-900 border-b border-slate-700/50 shrink-0">
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="text-slate-500 font-medium">StudySync</span>
        {crumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-slate-600" />
            <span className={i === crumbs.length - 1 ? "text-slate-200 font-semibold capitalize" : "text-slate-400 capitalize"}>{crumb}</span>
          </span>
        ))}
      </nav>
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 active:scale-95 transition-all">
        <Plus size={13} />New Topic
      </button>
    </header>
  );
}