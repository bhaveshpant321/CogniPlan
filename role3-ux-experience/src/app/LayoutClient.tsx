"use client";
import { useEffect } from "react";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize dark mode on mount (optional)
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-gray-50 dark:text-slate-100 text-gray-900">
      {children}
    </div>
  );
}
