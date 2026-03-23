export const PALETTE = {
  focusBlue:      "#3B82F6",
  successGreen:   "#22C55E",
  warningYellow:  "#EAB308",
  criticalRed:    "#EF4444",
  backgroundDark: "#0F1117",
} as const;

export const STATUS_STYLES = {
  critical: {
    border: "border-l-red-500",
    badge:  "bg-red-500/20 text-red-400 ring-1 ring-red-500/40",
    dot:    "bg-red-500",
    label:  "Critical",
    text:   "text-red-400",
  },
  due: {
    border: "border-l-yellow-500",
    badge:  "bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/40",
    dot:    "bg-yellow-500",
    label:  "Due Today",
    text:   "text-yellow-400",
  },
  learning: {
    border: "border-l-blue-500",
    badge:  "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40",
    dot:    "bg-blue-500",
    label:  "Learning",
    text:   "text-blue-400",
  },
  mastered: {
    border: "border-l-green-500",
    badge:  "bg-green-500/20 text-green-400 ring-1 ring-green-500/40",
    dot:    "bg-green-500",
    label:  "Mastered",
    text:   "text-green-400",
  },
  default: {
    border: "border-l-slate-600",
    badge:  "bg-slate-700 text-slate-300 ring-1 ring-slate-600",
    dot:    "bg-slate-500",
    label:  "Unknown",
    text:   "text-slate-400",
  },
} as const;

export const SCORE_STYLES: Record<number, string> = {
  1: "bg-red-500/20    text-red-400    hover:bg-red-500    hover:text-white  border border-red-500/40",
  2: "bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white  border border-orange-500/40",
  3: "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-black  border border-yellow-500/40",
  4: "bg-blue-500/20   text-blue-400   hover:bg-blue-500   hover:text-white  border border-blue-500/40",
  5: "bg-green-500/20  text-green-400  hover:bg-green-500  hover:text-black  border border-green-500/40",
};

export const SCORE_LABELS: Record<number, string> = {
  1: "Blackout",
  2: "Hard",
  3: "Good",
  4: "Easy",
  5: "Perfect",
};

export const ACCENT_MAP: Record<string, string> = {
  blue:   "text-blue-400   bg-blue-500/10   border-blue-500/20",
  green:  "text-green-400  bg-green-500/10  border-green-500/20",
  yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  red:    "text-red-400    bg-red-500/10    border-red-500/20",
};