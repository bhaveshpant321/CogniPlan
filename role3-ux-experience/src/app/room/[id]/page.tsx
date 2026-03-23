"use client";

import { useState } from "react";
import { Users, Mic, MicOff, Video, VideoOff, Pencil, Eraser } from "lucide-react";

const COLOURS = ["#3B82F6", "#EF4444", "#22C55E", "#EAB308", "#ffffff"];
const PARTICIPANTS = ["You", "Priya", "Rohan", "Sara"];

export default function WarRoom({ params }: { params: { id: string } }) {
  const [muted,       setMuted]       = useState(false);
  const [camOff,      setCamOff]      = useState(false);
  const [activeTool,  setTool]        = useState<"pencil" | "eraser">("pencil");
  const [activeColour, setColour]     = useState("#3B82F6");

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 border-b border-slate-700/50 shrink-0">
        <Users size={14} className="text-blue-400" />
        <span className="text-sm font-semibold text-slate-200">
          War Room — Session: {params.id}
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Canvas area */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex-1 bg-slate-950 flex items-center justify-center text-slate-600 text-sm select-none cursor-crosshair">
            HTML5 Canvas · drawing logic wired in Week 3
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-3 bg-slate-900 border-t border-slate-700/50 flex-wrap">
            <button
              onClick={() => setTool("pencil")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${activeTool === "pencil" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"}`}
            >
              <Pencil size={12} /> Pencil
            </button>

            <button
              onClick={() => setTool("eraser")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${activeTool === "eraser" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"}`}
            >
              <Eraser size={12} /> Eraser
            </button>

            <div className="flex items-center gap-2">
              {COLOURS.map(c => (
                <button
                  key={c}
                  onClick={() => setColour(c)}
                  style={{ background: c }}
                  className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${activeColour === c ? "ring-2 ring-offset-2 ring-offset-slate-900 ring-blue-400" : "border border-slate-600"}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setMuted(v => !v)}
                className={`p-2 rounded-lg border transition-colors ${muted ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"}`}
              >
                {muted ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
              <button
                onClick={() => setCamOff(v => !v)}
                className={`p-2 rounded-lg border transition-colors ${camOff ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"}`}
              >
                {camOff ? <VideoOff size={14} /> : <Video size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: video feeds */}
        <aside className="flex flex-col gap-3 w-44 p-3 border-l border-slate-700/50 bg-slate-900 overflow-y-auto shrink-0">
          {PARTICIPANTS.map(name => (
            <div key={name} className="rounded-lg bg-slate-800 border border-slate-700 overflow-hidden aspect-video flex items-center justify-center relative">
              <div className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-300">
                {name.charAt(0)}
              </div>
              <span className="absolute bottom-1 left-2 text-[10px] text-slate-400">{name}</span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}