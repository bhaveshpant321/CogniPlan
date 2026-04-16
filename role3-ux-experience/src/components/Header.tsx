"use client";
import { usePathname } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { useUIStore } from "@/store/uiStore";

const ROUTE_MAP: Record<string, string[]> = {
  "/":           ["Dashboard"],
  "/syllabus":   ["Syllabus"],
  "/analytics":  ["Analytics"],
};

export default function Header() {
  const pathname = usePathname();
  const { openAddTopicModal } = useUIStore();

  let crumbs: string[];
  if (pathname.startsWith("/room/")) {
    const id = pathname.split("/")[2];
    crumbs = [`War Room · ${id}`];
  } else {
    crumbs = ROUTE_MAP[pathname] ?? pathname.split("/").filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1));
  }

  return (
    <header className="flex items-center justify-between h-16 px-6 dark:bg-slate-900 bg-white dark:border-b dark:border-slate-700/50 border-b border-gray-200 shrink-0">
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="dark:text-slate-500 text-gray-500 font-medium">StudySync</span>
        {crumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5">
            <ChevronRight size={13} className="dark:text-slate-600 text-gray-400" />
            <span className={i === crumbs.length - 1 ? "dark:text-slate-200 text-gray-900 font-semibold capitalize" : "dark:text-slate-400 text-gray-600 capitalize"}>{crumb}</span>
          </span>
        ))}
      </nav>
      <Button size="sm" className="flex items-center gap-1.5" label="New Topic" onClick={openAddTopicModal}>
        <Plus size={13} />
      </Button>
    </header>
  );
}