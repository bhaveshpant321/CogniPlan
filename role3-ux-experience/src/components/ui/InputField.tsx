"use client";
import { InputFieldProps } from "@/types";

export default function InputField({ label, placeholder, value, onChange, type="text", error, className="" }: InputFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</label>}
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg bg-slate-800 border px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 ${error ? "border-red-500" : "border-slate-600 hover:border-slate-500"}`}
      />
      {error && <p className="text-xs text-red-400">⚠ {error}</p>}
    </div>
  );
}