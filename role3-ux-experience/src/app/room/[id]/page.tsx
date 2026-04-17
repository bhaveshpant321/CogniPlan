"use client";

// 1. Added "use" to the React imports
import { useState, useRef, useEffect, useCallback, use } from "react";
import {
  Users, Mic, MicOff, Video, VideoOff,
  Pencil, Eraser, Square, Circle, Minus,
  Trash2, Download, ZoomIn, ZoomOut,
  RotateCcw, ChevronUp, ChevronDown,
} from "lucide-react";
import Pomodoro from "@/components/Pomodoro";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tool = "pencil" | "eraser" | "line" | "rectangle" | "circle";

interface Point { x: number; y: number }

interface Stroke {
  id: string;
  tool: Tool;
  colour: string;
  width: number;
  points: Point[];
  opacity: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const COLOURS = [
  "#ffffff", "#3B82F6", "#22C55E", "#EF4444",
  "#EAB308", "#A855F7", "#EC4899", "#F97316",
];

const BRUSH_SIZES = [2, 4, 8, 14, 20];

const PARTICIPANTS = [
  { name: "You",   initials: "Y", colour: "#3B82F6" },
  { name: "Priya", initials: "P", colour: "#A855F7" },
  { name: "Rohan", initials: "R", colour: "#22C55E" },
  { name: "Sara",  initials: "S", colour: "#EC4899" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
// 2. Updated the type definition for params to be a Promise
export default function WarRoom({ params }: { params: Promise<{ id: string }> }) {
  
  // 3. Unwrap the params using the use() hook
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  // ── Canvas refs ──
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const overlayRef    = useRef<HTMLCanvasElement>(null); 
  const containerRef  = useRef<HTMLDivElement>(null);

  // ── Drawing state ──
  const [tool,        setTool]        = useState<Tool>("pencil");
  const [colour,      setColour]      = useState("#ffffff");
  const [brushSize,   setBrushSize]   = useState(4);
  const [opacity,     setOpacity]     = useState(1);
  const [strokes,     setStrokes]     = useState<Stroke[]>([]);
  const [isDrawing,   setIsDrawing]   = useState(false);
  const currentStroke = useRef<Stroke | null>(null);
  const startPoint    = useRef<Point | null>(null);

  // ── Media state ──
  const [muted,    setMuted]    = useState(false);
  const [camOff,   setCamOff]   = useState(false);

  // ── UI state ──
  const [showPomodoro,  setShowPomodoro]  = useState(true);
  const [showParticipants, setShowPart]  = useState(true);
  const [zoom,          setZoom]          = useState(1);

  // ─── Canvas setup ─────────────────────────────────────────────────────────
  const redrawAll = useCallback((canvas: HTMLCanvasElement, strokeList: Stroke[]) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokeList.forEach(s => drawStroke(ctx, s));
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas  = canvasRef.current;
    const overlay = overlayRef.current;
    const cont    = containerRef.current;
    if (!canvas || !overlay || !cont) return;

    const { width, height } = cont.getBoundingClientRect();
    canvas.width  = width;
    canvas.height = height;
    overlay.width = width;
    overlay.height = height;

    redrawAll(canvas, strokes);
  }, [strokes, redrawAll]);

  useEffect(() => {
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [resizeCanvas]);

  function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
    if (stroke.points.length === 0) return;
    ctx.save();
    ctx.globalAlpha   = stroke.opacity;
    ctx.strokeStyle   = stroke.tool === "eraser" ? "#0F1117" : stroke.colour;
    ctx.lineWidth     = stroke.width;
    ctx.lineCap       = "round";
    ctx.lineJoin      = "round";

    if (stroke.tool === "pencil" || stroke.tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    } else if (stroke.tool === "line" && stroke.points.length >= 2) {
      const last = stroke.points[stroke.points.length - 1];
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    } else if (stroke.tool === "rectangle" && stroke.points.length >= 2) {
      const p0   = stroke.points[0];
      const last = stroke.points[stroke.points.length - 1];
      ctx.strokeRect(p0.x, p0.y, last.x - p0.x, last.y - p0.y);
    } else if (stroke.tool === "circle" && stroke.points.length >= 2) {
      const p0   = stroke.points[0];
      const last = stroke.points[stroke.points.length - 1];
      const rx   = Math.abs(last.x - p0.x) / 2;
      const ry   = Math.abs(last.y - p0.y) / 2;
      const cx   = p0.x + (last.x - p0.x) / 2;
      const cy   = p0.y + (last.y - p0.y) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPreview(point: Point) {
    const overlay = overlayRef.current;
    const stroke  = currentStroke.current;
    if (!overlay || !stroke) return;

    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const previewStroke: Stroke = {
      ...stroke,
      points: [stroke.points[0], point],
    };
    drawStroke(ctx, previewStroke);
  }

  function getPoint(e: React.PointerEvent<HTMLCanvasElement>): Point {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = getPoint(e);
    startPoint.current = point;

    const newStroke: Stroke = {
      id:       crypto.randomUUID(),
      tool,
      colour,
      width:   tool === "eraser" ? brushSize * 3 : brushSize,
      points:  [point],
      opacity,
    };
    currentStroke.current = newStroke;
    setIsDrawing(true);

    if (tool === "pencil" || tool === "eraser") {
      const canvas = canvasRef.current!;
      const ctx    = canvas.getContext("2d")!;
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = tool === "eraser" ? "#0F1117" : colour;
      ctx.lineWidth   = newStroke.width;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.restore();
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing || !currentStroke.current) return;
    const point = getPoint(e);

    if (tool === "pencil" || tool === "eraser") {
      const canvas = canvasRef.current!;
      const ctx    = canvas.getContext("2d")!;
      const prev   = currentStroke.current.points[currentStroke.current.points.length - 1];

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = tool === "eraser" ? "#0F1117" : colour;
      ctx.lineWidth   = currentStroke.current.width;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      ctx.restore();

      currentStroke.current.points.push(point);
    } else {
      drawPreview(point);
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing || !currentStroke.current) return;
    const point = getPoint(e);

    const finalStroke: Stroke = {
      ...currentStroke.current,
      points: [...currentStroke.current.points, point],
    };

    if (tool !== "pencil" && tool !== "eraser") {
      const canvas = canvasRef.current!;
      const ctx    = canvas.getContext("2d")!;
      drawStroke(ctx, finalStroke);

      const overlay = overlayRef.current!;
      overlay.getContext("2d")!.clearRect(0, 0, overlay.width, overlay.height);
    }

    setStrokes(prev => [...prev, finalStroke]);
    currentStroke.current = null;
    setIsDrawing(false);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
  }

  function undoLast() {
    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);
    if (canvasRef.current) redrawAll(canvasRef.current, newStrokes);
  }

  function downloadCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link    = document.createElement("a");
    link.download = `studysync-warroom-${id}.png`;
    link.href     = canvas.toDataURL();
    link.click();
  }

  const cursorStyle = tool === "eraser" ? "cell" : "crosshair";

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 border-b border-slate-700/50 shrink-0">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-blue-400" />
          <span className="text-sm font-semibold text-slate-200">War Room</span>
          <span className="text-xs text-slate-500 font-mono">#{id}</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Live</span>
          <span className="text-slate-600 mx-2">·</span>
          <span className="text-xs text-slate-400">{PARTICIPANTS.length} participants</span>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex flex-col flex-1 min-w-0">
          <div ref={containerRef} className="flex-1 relative overflow-hidden bg-slate-950" style={{ cursor: cursorStyle }}>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            />
            <canvas
              ref={overlayRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
            />
            {strokes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center gap-2 text-slate-700">
                  <Pencil size={32} strokeWidth={1} />
                  <p className="text-sm">Start drawing to collaborate</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1">
              <button onClick={() => setZoom(z => Math.min(z + 0.1, 3))} className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors">
                <ZoomIn size={14} />
              </button>
              <button onClick={() => setZoom(1)} className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-500 hover:text-slate-200 flex items-center justify-center text-[10px] font-bold transition-colors">
                {Math.round(zoom * 100)}%
              </button>
              <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.3))} className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors">
                <ZoomOut size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-t border-slate-700/50 flex-wrap shrink-0">
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
              {([
                { t: "pencil",    Icon: Pencil,    label: "Pencil"    },
                { t: "eraser",    Icon: Eraser,    label: "Eraser"    },
                { t: "line",      Icon: Minus,     label: "Line"      },
                { t: "rectangle", Icon: Square,    label: "Rectangle" },
                { t: "circle",    Icon: Circle,    label: "Circle"    },
              ] as const).map(({ t, Icon, label }) => (
                <button
                  key={t}
                  onClick={() => setTool(t)}
                  title={label}
                  className={[
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all",
                    tool === t ? "bg-blue-500 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700",
                  ].join(" ")}
                >
                  <Icon size={13} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800 rounded-lg p-1.5 border border-slate-700">
              {COLOURS.map(c => (
                <button
                  key={c}
                  onClick={() => setColour(c)}
                  style={{ background: c }}
                  className={[
                    "w-5 h-5 rounded-full transition-all hover:scale-110",
                    colour === c ? "ring-2 ring-offset-1 ring-offset-slate-800 ring-blue-400 scale-110" : "border border-slate-600",
                  ].join(" ")}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
              {BRUSH_SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => setBrushSize(s)}
                  className={[
                    "w-7 h-7 rounded-md flex items-center justify-center transition-all",
                    brushSize === s ? "bg-blue-500" : "hover:bg-slate-700",
                  ].join(" ")}
                >
                  <span
                    className="rounded-full bg-current"
                    style={{
                      width:  Math.max(2, s / 2),
                      height: Math.max(2, s / 2),
                      background: brushSize === s ? "white" : "#94a3b8",
                    }}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-medium">Opacity</span>
              <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-20 accent-blue-500" />
              <span className="text-[10px] text-slate-400 w-6">{Math.round(opacity * 100)}%</span>
            </div>

            <div className="flex items-center gap-1 ml-auto">
              <button onClick={undoLast} disabled={strokes.length === 0} className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 transition-colors border border-transparent hover:border-slate-700">
                <RotateCcw size={14} />
              </button>
              <button onClick={downloadCanvas} className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">
                <Download size={14} />
              </button>
              <button onClick={clearCanvas} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border border-transparent hover:border-red-500/20 text-xs font-semibold">
                <Trash2 size={13} /> Clear
              </button>
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-700">
                <button onClick={() => setMuted(v => !v)} className={["p-2 rounded-lg border transition-colors", muted ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"].join(" ")}>
                  {muted ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
                <button onClick={() => setCamOff(v => !v)} className={["p-2 rounded-lg border transition-colors", camOff ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"].join(" ")}>
                  {camOff ? <VideoOff size={14} /> : <Video size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-52 shrink-0 border-l border-slate-700/50 bg-slate-900 overflow-y-auto">
          <div className="flex flex-col">
            <button onClick={() => setShowPart(v => !v)} className="flex items-center justify-between px-3 py-2.5 border-b border-slate-700/50 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors">
              <span className="flex items-center gap-1.5"><Users size={12} /> Participants ({PARTICIPANTS.length})</span>
              {showParticipants ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {showParticipants && (
              <div className="flex flex-col gap-2 p-2">
                {PARTICIPANTS.map((p, i) => (
                  <div key={p.name} className="rounded-lg bg-slate-800 border border-slate-700 overflow-hidden">
                    <div className="relative flex items-center justify-center" style={{ aspectRatio: "16/9" }}>
                      <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at center, ${p.colour}, transparent)` }} />
                      {camOff && i === 0 ? <VideoOff size={18} className="text-slate-500" /> : (
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: p.colour }}>{p.initials}</div>
                      )}
                      <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-300 font-medium">{p.name}</span>
                        {muted && i === 0 ? <MicOff size={9} className="text-red-400" /> : (
                          <div className="flex items-end gap-px h-3">
                            {[2, 4, 3, 5, 2].map((h, j) => (
                              <div key={j} className="w-0.5 bg-green-400 rounded-full" style={{ height: `${h * 2}px`, animation: `pulse ${0.5 + j * 0.1}s ease-in-out infinite alternate`, opacity: i === 0 ? 1 : 0.4 + Math.random() * 0.4 }} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col border-t border-slate-700/50">
            <button onClick={() => setShowPomodoro(v => !v)} className="flex items-center justify-between px-3 py-2.5 border-b border-slate-700/50 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors">
              <span>⏱ Shared Timer</span>
              {showPomodoro ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {showPomodoro && <div className="p-3"><Pomodoro /></div>}
          </div>
          <div className="mt-auto px-3 py-2 border-t border-slate-700/50">
            <p className="text-[10px] text-slate-600">{strokes.length} stroke{strokes.length !== 1 ? "s" : ""} on canvas</p>
          </div>
        </div>
      </div>
    </div>
  );
}