"use client";
import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  isGroupMode:   boolean;
  toggleSidebar:   () => void;
  setSidebarOpen:  (open: boolean) => void;
  toggleGroupMode: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isGroupMode:   false,
  toggleSidebar:   () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarOpen:  (open) => set({ isSidebarOpen: open }),
  toggleGroupMode: () => set((s) => ({ isGroupMode: !s.isGroupMode })),
}));

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
  tick: () => set((s) => {
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
  reset:  () => set({ minutesLeft: FOCUS_MINUTES, secondsLeft: 0, isRunning: false, isBreak: false }),
}));