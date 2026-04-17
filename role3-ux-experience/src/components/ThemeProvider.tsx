"use client";
import { useEffect, useState } from "react";
import { useUIStore } from "@/store/uiStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // If not mounted, return children without the dark class logic to avoid hydration flicker
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}