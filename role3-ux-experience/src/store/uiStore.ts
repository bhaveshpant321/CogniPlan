"use client";

import { create } from "zustand";

// ─── UI Store ─────────────────────────────────────────────────────────────────
interface UIState {
  isSidebarOpen:       boolean;
  isGroupMode:         boolean;
  isDarkMode:          boolean;
  isAddTopicModalOpen: boolean;
  toggleSidebar:       () => void;
  setSidebarOpen:      (open: boolean) => void;
  toggleGroupMode:     () => void;
  toggleDarkMode:      () => void;
  openAddTopicModal:   () => void;
  closeAddTopicModal:  () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen:       true,
  isGroupMode:         false,
  isDarkMode:          true,
  isAddTopicModalOpen: false,

  toggleSidebar:       () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarOpen:      (open) => set({ isSidebarOpen: open }),
  toggleGroupMode:     () => set((s) => ({ isGroupMode: !s.isGroupMode })),
  toggleDarkMode:      () => {
    set((s) => {
      const next = !s.isDarkMode;
      // Apply class to <html> element
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
        document.documentElement.classList.toggle("light", !next);
      }
      return { isDarkMode: next };
    });
  },
  openAddTopicModal:   () => set({ isAddTopicModalOpen: true }),
  closeAddTopicModal:  () => set({ isAddTopicModalOpen: false }),
}));

// ─── Pomodoro Store ───────────────────────────────────────────────────────────
const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

interface PomodoroState {
  minutesLeft:     number;
  secondsLeft:     number;
  isRunning:       boolean;
  isBreak:         boolean;
  cyclesCompleted: number;
  tick:   () => void;
  toggle: () => void;
  reset:  () => void;
}

export const usePomodoroStore = create<PomodoroState>((set) => ({
  minutesLeft:     FOCUS_MINUTES,
  secondsLeft:     0,
  isRunning:       false,
  isBreak:         false,
  cyclesCompleted: 0,

  tick: () =>
    set((s) => {
      if (s.secondsLeft > 0) return { secondsLeft: s.secondsLeft - 1 };
      if (s.minutesLeft > 0) return { minutesLeft: s.minutesLeft - 1, secondsLeft: 59 };
      const newIsBreak = !s.isBreak;
      return {
        isBreak:         newIsBreak,
        minutesLeft:     newIsBreak ? BREAK_MINUTES : FOCUS_MINUTES,
        secondsLeft:     0,
        isRunning:       false,
        cyclesCompleted: newIsBreak ? s.cyclesCompleted + 1 : s.cyclesCompleted,
      };
    }),

  toggle: () => set((s) => ({ isRunning: !s.isRunning })),

  reset: () =>
    set({
      minutesLeft:  FOCUS_MINUTES,
      secondsLeft:  0,
      isRunning:    false,
      isBreak:      false,
    }),
}));
