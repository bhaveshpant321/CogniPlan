"use client";
import { ButtonProps } from "@/types";
import { SCORE_STYLES, SCORE_LABELS } from "@/styles/tokens";

const SIZE = { sm:"px-3 py-1.5 text-xs", md:"px-4 py-2 text-sm", lg:"px-6 py-3 text-base" };
const VARIANT = {
  primary: "bg-blue-500 text-white hover:bg-blue-600 active:scale-95",
  ghost:   "bg-transparent text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600",
  danger:  "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/40",
  score:   "",
};

export default function Button({ label, children, variant="primary", size="md", score, disabled=false, onClick, className="" }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-40 disabled:cursor-not-allowed select-none";
  const variantClass = variant === "score" && score != null ? (SCORE_STYLES[score] ?? "") : VARIANT[variant];
  return (
    <button className={`${base} ${SIZE[size]} ${variantClass} ${className}`} disabled={disabled} onClick={onClick}>
      {children ?? label}
      {variant === "score" && score != null && <span className="text-[10px] opacity-60 font-normal">{SCORE_LABELS[score]}</span>}
    </button>
  );
}