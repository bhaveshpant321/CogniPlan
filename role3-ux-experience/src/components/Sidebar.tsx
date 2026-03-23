"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, BarChart2, LogOut, Moon, Zap, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/uiStore";
import { MOCK_USER } from "@/data/mockData";

const NAV_ITEMS = [
  { label:"Dashboard", href:"/",         Icon:LayoutDashboard },
  { label:"Syllabus",  href:"/syllabus",  Icon:BookOpen        },
  { label:"War Room",  href:"/room/demo", Icon:Users           },
  { label:"Analytics", href:"/analytics", Icon:BarChart2       },
] as const;

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, isGroupMode, toggleGroupMode } = useUIStore();
  const pathname = usePathname();

  return (
    <motion.aside animate={{ width: isSidebarOpen ? 224 : 64 }} transition={{ duration:0.22, ease:"easeInOut" }}
      className="flex flex-col h-full bg-slate-900 border-r border-slate-700/50 overflow-hidden shrink-0">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 h-16 shrink-0">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex items-center gap-2 overflow-hidden">
              <Zap size={18} className="text-blue-400 shrink-0" />
              <span className="font-bold text-slate-100 whitespace-nowrap tracking-tight">StudySync</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={toggleSidebar} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors shrink-0 ml-auto">
          {isSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      </div>

      <div className="px-3 py-3 border-b border-slate-700/50">
        <button onClick={toggleGroupMode}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 ${isGroupMode ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500"}`}>
          <Users size={14} className="shrink-0" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="whitespace-nowrap">
                {isGroupMode ? "Group Mode" : "Solo Mode"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-3 flex-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${isActive ? "bg-blue-500/15 text-blue-300 border border-blue-500/25" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent"}`}>
              <Icon size={16} className="shrink-0" />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="whitespace-nowrap">
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 px-3 py-3 border-t border-slate-700/50">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
          <Moon size={15} className="shrink-0" />
          <AnimatePresence>
            {isSidebarOpen && <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="whitespace-nowrap text-xs">Dark Mode</motion.span>}
          </AnimatePresence>
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut size={15} className="shrink-0" />
          <AnimatePresence>
            {isSidebarOpen && <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="whitespace-nowrap text-xs">Logout</motion.span>}
          </AnimatePresence>
        </button>
        <div className="flex items-center gap-3 px-3 py-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-blue-500/30 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-300 shrink-0">
            {MOCK_USER.name.charAt(0)}
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-200 truncate">{MOCK_USER.name}</span>
                <span className="text-[10px] text-slate-500">🔥 {MOCK_USER.streak}-day streak</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}