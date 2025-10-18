import React from 'react';
import { CanvasLine, CanvasCircle, CanvasSquare } from './basicObject'; // Assuming basicObject is in the same directory

// Helper component to render custom SVG shapes
function VectorPreview({ shapes, width, height }) {
  if (!shapes || shapes.length === 0) return null;

  // Find max dimensions to scale correctly
  let maxX = 0, maxY = 0;
  shapes.forEach(s => {
    if (s.type === "line") {
      s.points.forEach(p => { maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });
    } else if (s.type === "rect") {
      maxX = Math.max(maxX, s.x + s.w); maxY = Math.max(maxY, s.y + s.h);
    } else if (s.type === "circle") {
      maxX = Math.max(maxX, s.cx + s.r); maxY = Math.max(maxY, s.cy + s.r);
    }
  });

  const viewBoxWidth = maxX > 0 ? maxX : width;
  const viewBoxHeight = maxY > 0 ? maxY : height;

  return (
    <svg
      width="100%" // Scale to fit parent div
      height="100%"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: 'visible' }} // Allow strokes to go slightly outside
    >
      {shapes.map((s) => {
        if (s.type === "line") {
          const d = s.points.map((p, i) => (i ? `L${p.x},${p.y}` : `M${p.x},${p.y}`)).join(" ");
          return (
            <path key={s.id} d={d} fill="none" stroke={s.style.stroke} strokeWidth={s.style.lineWidth} strokeLinejoin="round" strokeLinecap="round" />
          );
        } else if (s.type === "rect") {
          const x = Math.min(s.x, s.x + s.w);
          const y = Math.min(s.y, s.y + s.h);
          const w = Math.abs(s.w);
          const h = Math.abs(s.h);
          return <rect key={s.id} x={x} y={y} width={w} height={h} fill="none" stroke={s.style.stroke} strokeWidth={s.style.lineWidth} />;
        } else if (s.type === "circle") {
          return <circle key={s.id} cx={s.cx} cy={s.cy} r={Math.max(0, s.r)} fill="none" stroke={s.style.stroke} strokeWidth={s.style.lineWidth} />;
        }
        return null;
      })}
    </svg>
  );
}

// Main ShapeRenderer component
export default function ShapeRenderer({ type, customShapes, width, height }) {
  if (type === 'line') {
    return <CanvasLine width={width || 160} height={height || 60} />;
  } else if (type === 'square') {
    return <CanvasSquare width={width || 120} height={height || 120} />;
  } else if (type === 'circle') {
    return <CanvasCircle width={width || 120} height={height || 120} />;
  } else if (type === 'custom' && customShapes) {
    // For custom shapes, we need to render the SVG
    return <VectorPreview shapes={customShapes} width={width || 100} height={height || 100} />;
  }
  return null; // Or a default placeholder
}
