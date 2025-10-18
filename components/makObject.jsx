"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

// =============================
// Canvas Drawing (Pure JS version)
// - Tools: line (freehand), rect, circle
// - Export/Import JSON, Export PNG
// - Reuse shapes in other files (SVG preview provided below)
// =============================

// (Optional) JSDoc typedefs for editor IntelliSense only
/** @typedef {{x:number,y:number}} Point */
/** @typedef {{stroke:string,lineWidth:number}} BaseStyle */
/** @typedef {{id:string,type:"line",points:Point[],style:BaseStyle}} LineShape */
/** @typedef {{id:string,type:"rect",x:number,y:number,w:number,h:number,style:BaseStyle}} RectShape */
/** @typedef {{id:string,type:"circle",cx:number,cy:number,r:number,style:BaseStyle}} CircleShape */
/** @typedef {LineShape|RectShape|CircleShape} Shape */

function useHiDPICanvas(canvasRef, onSize, dprMax = 2) {
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;

    const resize = () => {
      const DPR = Math.min(window.devicePixelRatio || 1, dprMax);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * DPR);
      canvas.height = Math.round(rect.height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      onSize && onSize(rect.width, rect.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [canvasRef, dprMax, onSize]);
}

export default function DrawingCanvas({
  initialTool = "line",
  width = 900,
  height = 560,
  background = "#000000",
  onChange,    // (shapes: Shape[]) => void
  onExport,    // ({ json: Shape[], pngBlob: Blob|null }) => void
}) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState(initialTool); // "line" | "rect" | "circle"
  const [stroke, setStroke] = useState("#111");
  const [lineWidth, setLineWidth] = useState(2);

  /** @type {[Shape[], Function]} */
  const [shapes, setShapes] = useState([]);
  /** @type {[Shape|null, Function]} */
  const [draft, setDraft] = useState(null);

  const undoStack = useRef([]); // Shape[][]
  const redoStack = useRef([]); // Shape[][]

  const style = useMemo(() => ({ stroke, lineWidth }), [stroke, lineWidth]);

  useEffect(() => { onChange && onChange(shapes); }, [shapes, onChange]);

  useHiDPICanvas(canvasRef);

  // =========== Rendering loop ===========
  useEffect(() => {
    let raf = 0;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // background
      ctx.save();
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.restore();

      const drawShape = (s) => {
        ctx.save();
        ctx.strokeStyle = s.style.stroke;
        ctx.lineWidth = s.style.lineWidth;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        if (s.type === "line") {
          const pts = s.points;
          if (pts.length) ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.stroke();
        } else if (s.type === "rect") {
          ctx.strokeRect(s.x, s.y, s.w, s.h);
        } else if (s.type === "circle") {
          ctx.arc(s.cx, s.cy, Math.max(0, s.r), 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      };

      for (const s of shapes) drawShape(s);
      if (draft) drawShape(draft);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [background, shapes, draft]);

  // =========== Pointer helpers ===========
  const getPos = (e) => {
    const rect = e.target.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const commit = (next) => {
    undoStack.current.push(shapes.map(s => ({ ...s })));
    redoStack.current = [];
    setShapes(prev => [...prev, next]);
    setDraft(null);
  };

  const pointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    const { x, y } = getPos(e);
    if (tool === "line") {
      setDraft({ id: crypto.randomUUID(), type: "line", points: [{ x, y }], style });
    } else if (tool === "rect") {
      setDraft({ id: crypto.randomUUID(), type: "rect", x, y, w: 0, h: 0, style });
    } else if (tool === "circle") {
      setDraft({ id: crypto.randomUUID(), type: "circle", cx: x, cy: y, r: 0, style });
    }
  };

  const pointerMove = (e) => {
    if (!draft) return;
    const { x, y } = getPos(e);

    setDraft(prev => {
      if (!prev) return prev;
      if (prev.type === "line") {
        return { ...prev, points: [...prev.points, { x, y }] };
      } else if (prev.type === "rect") {
        return { ...prev, w: x - prev.x, h: y - prev.y };
      } else { // circle
        const dx = x - prev.cx; const dy = y - prev.cy;
        const r = Math.hypot(dx, dy);
        return { ...prev, r: r < 0 ? 0 : r };
      }
    });
  };

  const pointerUp = () => {
    if (!draft) return;
    if (draft.type === "line" && draft.points.length < 2) { setDraft(null); return; }
    if (draft.type === "rect" && Math.abs(draft.w) < 1 && Math.abs(draft.h) < 1) { setDraft(null); return; }
    if (draft.type === "circle" && draft.r < 0.5) { setDraft(null); return; }
    commit(draft);
  };

  // =========== Toolbar Actions ===========
  const undo = () => {
    const prev = undoStack.current.pop();
    if (!prev) return;
    redoStack.current.push(shapes.map(s => ({ ...s })));
    setShapes(prev);
  };
  const redo = () => {
    const next = redoStack.current.pop();
    if (!next) return;
    undoStack.current.push(shapes.map(s => ({ ...s })));
    setShapes(next);
  };

  const clearAll = () => {
    undoStack.current.push(shapes.map(s => ({ ...s })));
    redoStack.current = [];
    setShapes([]);
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(shapes);
    const blob = new Blob([dataStr], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "shapes-" + Date.now() + ".json";
    a.click();
    onExport && onExport({ json: shapes, pngBlob: null });
  };

  const exportPNG = async () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
    if (blob) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "drawing-" + Date.now() + ".png";
      a.click();
    }
    onExport && onExport({ json: shapes, pngBlob: blob || null });
  };

  const saveToFirestore = async () => {
    if (shapes.length === 0) {
      alert("저장할 도형이 없습니다. 먼저 도형을 그려주세요.");
      return;
    }
    try {
      const response = await fetch('/api/save_custom_object', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shapes),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`도형이 Firestore에 저장되었습니다! ID: ${result.docId}`);
      } else {
        alert(`도형 저장 실패: ${result.message}`);
      }
    } catch (error) {
      console.error("Failed to save custom object:", error);
      alert('도형 저장 중 오류가 발생했습니다.');
    }
  };

  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed)) {
          undoStack.current.push(shapes.map(s => ({ ...s })));
          redoStack.current = [];
          setShapes(parsed);
        }
      } catch { /* ignore */ }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-[980px] mx-auto p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="font-medium">Tool:</label>
        {["line", "rect", "circle"].map(t => (
          <button key={t}
            className={`px-3 py-1 rounded-2xl border ${tool === t ? "bg-black text-white" : "bg-white"}`}
            onClick={() => setTool(t)}>
            {t}
          </button>
        ))}
        <div className="ml-4 flex items-center gap-2">
          <label>Stroke</label>
          <input type="color" value={stroke} onChange={e => setStroke(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <label>Width</label>
          <input type="range" min={1} max={16} value={lineWidth} onChange={e => setLineWidth(parseInt(e.target.value))} />
          <span className="text-sm w-6 text-right">{lineWidth}</span>
        </div>
        <div className="flex-1" />
        <button className="px-3 py-1 rounded border" onClick={undo}>Undo</button>
        <button className="px-3 py-1 rounded border" onClick={redo}>Redo</button>
        <button className="px-3 py-1 rounded border" onClick={clearAll}>Clear</button>
        <button className="px-3 py-1 rounded border" onClick={exportJSON}>Export JSON</button>
        <button className="px-3 py-1 rounded border" onClick={exportPNG}>Export PNG</button>
        <button className="px-3 py-1 rounded border" onClick={saveToFirestore}>Save to Firestore</button>
        <label className="px-3 py-1 rounded border cursor-pointer">Import JSON
          <input type="file" accept="application/json" className="hidden" onChange={e => { if (e.target.files && e.target.files[0]) importJSON(e.target.files[0]); }} />
        </label>
      </div>

      {/* Canvas wrapper */}
      <div className="border rounded-xl overflow-hidden shadow-sm" style={{ width, height, background:"black" }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={() => setDraft(null)}
        />
      </div>

      {/* Debug */}
      <details className="mt-3">
        <summary className="cursor-pointer text-sm text-gray-600">Shapes JSON (live)</summary>
        <pre className="p-2 bg-gray-50 rounded max-h-64 overflow-auto text-xs">{JSON.stringify(shapes, null, 2)}</pre>
      </details>
    </div>
  );
}

// =============================
// Example Usage (put in another file)
// =============================
// import DrawingCanvas from "./DrawingCanvas";
// import { useState } from "react";
//
// export function ExamplePage() {
//   const [lastSaved, setLastSaved] = useState(null); // Shape[]
//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-semibold mb-4">Draw & Reuse (JS)</h1>
//       <DrawingCanvas
//         onExport={({ json, pngBlob }) => {
//           setLastSaved(json);
//           // e.g., localStorage.setItem("my-shapes", JSON.stringify(json));
//         }}
//       />
//
//       {Array.isArray(lastSaved) && (
//         <div className="mt-6">
//           <div className="font-medium">Re-render saved shapes as SVG:</div>
//           <VectorPreview shapes={lastSaved} />
//         </div>
//       )}
//     </div>
//   );
// }
//
// export function VectorPreview({ shapes }) {
//   return (
//     <svg width="900" height="300" style={{ border: "1px solid #eee", borderRadius: 12 }}>
//       {shapes.map((s) => {
//         if (s.type === "line") {
//           const d = s.points.map((p, i) => (i ? `L${p.x},${p.y}` : `M${p.x},${p.y}`)).join(" ");
//           return (
//             <path key={s.id} d={d} fill="none" stroke={s.style.stroke} strokeWidth={s.style.lineWidth} strokeLinejoin="round" strokeLinecap="round" />
//           );
//         } else if (s.type === "rect") {
//           const x = Math.min(s.x, s.x + s.w);
//           const y = Math.min(s.y, s.y + s.h);
//           const w = Math.abs(s.w);
//           const h = Math.abs(s.h);
//           return <rect key={s.id} x={x} y={y} width={w} height={h} fill="none" stroke={s.style.stroke} strokeWidth={s.style.lineWidth} />;
//         } else {
//           return <circle key={s.id} cx={s.cx} cy={s.cy} r={Math.max(0, s.r)} fill="none" stroke={s.style.stroke} strokeWidth={s.style.lineWidth} />;
//         }
//       })}
//     </svg>
//   );
// }