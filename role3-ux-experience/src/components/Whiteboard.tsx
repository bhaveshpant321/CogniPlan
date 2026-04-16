"use client";
import { useRef, useEffect, useState } from "react";
import { Palette, Brush, Eraser, Trash2 } from "lucide-react";

interface WhiteboardProps {
  isDrawing?: boolean;
}

export default function Whiteboard({ isDrawing = true }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const [brushColor, setBrushColor] = useState("#3B82F6");
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to parent
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(scale, scale);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, rect.width, rect.height);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: MouseEvent) => {
      if (!isDrawingMode) return;
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing || !isDrawingMode) return;

      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.strokeStyle = isEraser ? "#1e293b" : brushColor;
      ctx.lineWidth = isEraser ? brushSize * 2 : brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      lastX = currentX;
      lastY = currentY;
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [isDrawingMode, brushColor, brushSize, isEraser]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Floating Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 w-fit">
        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Color</label>
          <div className="relative">
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-2 border-l border-r border-slate-700/50 px-3">
          <Brush size={16} className="text-slate-400" />
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24 cursor-pointer accent-blue-500"
          />
          <span className="text-xs text-slate-400">{brushSize}px</span>
        </div>

        {/* Eraser */}
        <button
          onClick={() => setIsEraser(!isEraser)}
          className={`p-2 rounded-lg transition-colors ${
            isEraser
              ? "bg-slate-700 text-yellow-400"
              : "text-slate-400 hover:bg-slate-700 hover:text-white"
          }`}
          title="Eraser"
        >
          <Eraser size={16} />
        </button>

        {/* Clear Button */}
        <button
          onClick={clearCanvas}
          className="p-2 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          title="Clear Canvas"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 rounded-lg overflow-hidden border border-slate-700/50 bg-slate-950">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          style={{ display: isDrawingMode ? "block" : "none" }}
        />
      </div>
    </div>
  );
}
