"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import '../styles/makeObject.scss'

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

// Drawing logic
function drawShape(ctx, shape) {
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = shape.style.lineWidth;
  ctx.strokeStyle = shape.style.stroke;
  if (shape.type === "line") {
    shape.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  } else if (shape.type === "rect") {
    ctx.rect(shape.x, shape.y, shape.w, shape.h);
  } else { // circle
    ctx.arc(shape.cx, shape.cy, shape.r, 0, 2 * Math.PI);
  }
  ctx.stroke();
  ctx.restore();
}

export default function DrawingCanvas({
  initialTool = "line",
  width = 900,
  height = 560,
  background = "#000000",
  onChange,    // (shapes: Shape[]) => void
  onExport,    // ({ json: Shape[], pngBlob: Blob|null }) => void
  onSave,      // (newCustomObject: { id: string, shapes: Shape[], createdAt: number }) => void
}) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState(initialTool); // "line" | "rect" | "circle"
  const [stroke, setStroke] = useState("#ffffff");
  const [lineWidth, setLineWidth] = useState(2);

  /** @type {[Shape[], Function]} */
  const [shapes, setShapes] = useState([]);
  /** @type {[Shape|null, Function]} */
  const [draft, setDraft] = useState(null);

  useHiDPICanvas(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;

    // Clear canvas
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw committed shapes
    shapes.forEach(shape => drawShape(ctx, shape));

    // Draw draft shape
    if (draft) drawShape(ctx, draft);

  }, [shapes, draft]);

  const undoStack = useRef([]); // Shape[][]
  const redoStack = useRef([]); // Shape[][]

  const style = useMemo(() => ({ stroke, lineWidth }), [stroke, lineWidth]);

  // Use a ref to store the latest draft state to avoid stale closures
  const latestDraft = useRef(draft);
  useEffect(() => {
    latestDraft.current = draft;
  }, [draft]);

  // Use a ref to store the requestAnimationFrame ID
  const rafId = useRef(null);

  const pointerMove = (e) => {
    if (!latestDraft.current) return; // Use latestDraft.current

    // Cancel any pending animation frame
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      const { x, y } = getPos(e);

      setDraft(prev => {
        if (!prev) return prev;
        if (prev.type === "line") {
          return { ...prev, points: [prev.points[0], { x, y }] };
        } else if (prev.type === "rect") {
          return { ...prev, w: x - prev.x, h: y - prev.y };
        } else { // circle
          const dx = x - prev.cx; const dy = y - prev.cy;
          const r = Math.hypot(dx, dy);
          return { ...prev, r: r < 0 ? 0 : r };
        }
      });
      rafId.current = null; // Reset rafId after execution
    });
  };

  // Clear any pending animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const pointerUp = () => {
    if (!draft) return;
    // 직선 그리기의 경우, 시작점과 끝점 두 개가 있어야 유효한 선
    if (draft.type === "line" && (!draft.points || draft.points.length < 2)) {
      setDraft(null);
      return;
    }
    if (draft.type === "rect" && Math.abs(draft.w) < 1 && Math.abs(draft.h) < 1) { setDraft(null); return; }
    if (draft.type === "circle" && draft.r < 0.5) { setDraft(null); return; }
    commit(draft);
  };

  const pointerDown = (e) => {
    const { x, y } = getPos(e);
    const newDraft =
      tool === "line"
        ? { id: "" + Date.now(), type: "line", points: [{ x, y }, { x, y }], style }
        : tool === "rect"
          ? { id: "" + Date.now(), type: "rect", x, y, w: 0, h: 0, style }
          : { id: "" + Date.now(), type: "circle", cx: x, cy: y, r: 0, style };
    setDraft(newDraft);
    undoStack.current.push(shapes.map(s => ({ ...s })));
    redoStack.current = [];
  };

  // =========== Helper Functions ===========
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const commit = (newShape) => {
    setShapes(prev => [...prev, newShape]);
    setDraft(null);
    onChange && onChange([...shapes, newShape]);
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
     
        if (onSave) {
          onSave({ id: result.docId, shapes: shapes, createdAt: Date.now() });
        }
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
  <div className="canvasEditor">
    {/* Drawing Area */}
    <div className="canvasWrapper">
      <canvas
        ref={canvasRef}
        className="drawingCanvas"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={() => setDraft(null)}
      />
    </div>

    {/* Floating Toolbar */}
    <div className="floatingToolbar">
      <div className="toolGroup">
        <button onClick={undo}><svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="16.9747" cy="16.9745" r="16.9745" transform="rotate(90 16.9747 16.9745)" fill="#2B2B2B"/>
<path d="M25.6074 16.9766L9.1891 16.9766" stroke="#8E8E8E" strokeWidth="1.8"/>
<path d="M16.5254 9.64453L9.19416 16.9758L16.5254 24.307" stroke="#8E8E8E" strokeWidth="1.8"/>
</svg>
</button>
        <button onClick={redo}><svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="16.9745" cy="16.9747" r="16.9745" transform="rotate(-90 16.9745 16.9747)" fill="#2B2B2B"/>
<path d="M8.3418 16.9727L24.7601 16.9727" stroke="#8E8E8E" strokeWidth="1.8"/>
<path d="M17.4238 24.3047L24.7551 16.9735L17.4238 9.64222" stroke="#8E8E8E" strokeWidth="1.8"/>
</svg>

</button>
        <button onClick={clearAll}><svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="16.9745" cy="16.9747" r="16.9745" transform="rotate(-90 16.9745 16.9747)" fill="#9F9F9F"/>
<path d="M10.2344 23.7109L16.9732 16.9721L10.2344 10.2332" stroke="#3D3D3D" strokeWidth="1.8"/>
<path d="M23.7129 10.2344L16.974 16.9732L23.7129 23.7121" stroke="#3D3D3D" strokeWidth="1.8"/>
</svg>
</button>
        
      </div>

      <div className="divider" />

      <div className="controlGroup">
        <label>Width</label>
        <input
          type="range"
          min={1}
          max={16}
          value={lineWidth}
          onChange={e => setLineWidth(parseInt(e.target.value))}
        />
      </div>

      <div className="divider" />

      <div className="actionGroup">
        {/* {["line", "rect", "circle"].map(t => ( */}
          <button
            key={"line"}
            className={`toolButton ${tool === "line" ? "active" : ""}`}
            onClick={() => setTool("line")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.636318 22.8193L22.8188 0.636806" stroke="#E1E1E1" strokeWidth="1.8"/>
          </svg>

          </button>
           <button
            key={"rect"}
            className={`toolButton ${tool === "circle" ? "active" : ""}`}
            onClick={() => setTool("circle")}
          >
           <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect opacity="1" x="24.2637" y="24.2637" width="23.3635" height="23.3635" rx="11.6817" transform="rotate(-180 24.2637 24.2637)" stroke="#E1E1E1" strokeWidth="1.8"/>
</svg>

          </button>
          <button
            key={"circle"}
            className={`toolButton ${tool === "rect" ? "active" : ""}`}
            onClick={() => setTool("rect")}
          >
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect opacity="1" x="22.4521" y="22.4521" width="21.5518" height="21.5518" transform="rotate(-180 22.4521 22.4521)" stroke="#E1E1E1" strokeWidth="1.8"/>
</svg>


          </button>
        
        <button className="exportBtn" onClick={saveToFirestore}>SAVE</button>
      </div>
    </div>

    {/* Optional Debug JSON */}
    {/* <details className="debugPanel">
      <summary>Shapes JSON (live)</summary>
      <pre>{JSON.stringify(shapes, null, 2)}</pre>
    </details> */}
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