"use client";
import { useEffect, useState } from "react";
import { useUIStore } from "@/store/uiStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [isDarkMode, mounted]);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
