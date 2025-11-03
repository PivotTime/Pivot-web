import React from 'react';
import { CanvasLine, CanvasCircle, CanvasSquare } from './basicObject'; // Assuming basicObject is in the same directory

// Helper component to render custom SVG shapes
function VectorPreview({ shapes, width, height }) {
  if (!shapes || shapes.length === 0) return null;

  // Find min/max dimensions to scale correctly
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  shapes.forEach(s => {
    if (s.type === "line") {
      s.points.forEach(p => {
        minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
      });
    } else if (s.type === "rect") {
      minX = Math.min(minX, s.x, s.x + s.w); maxX = Math.max(maxX, s.x, s.x + s.w);
      minY = Math.min(minY, s.y, s.y + s.h); maxY = Math.max(maxY, s.y, s.y + s.h);
    } else if (s.type === "circle") {
      minX = Math.min(minX, s.cx - s.r); maxX = Math.max(maxX, s.cx + s.r);
      minY = Math.min(minY, s.cy - s.r); maxY = Math.max(maxY, s.cy + s.r);
    }
  });

  // Fallback for empty shapes or shapes with zero dimensions
  const effectiveMinX = isFinite(minX) ? minX : 0;
  const effectiveMinY = isFinite(minY) ? minY : 0;
  const effectiveMaxX = isFinite(maxX) ? maxX : width;
  const effectiveMaxY = isFinite(maxY) ? maxY : height;

  const viewBoxWidth = effectiveMaxX - effectiveMinX;
  const viewBoxHeight = effectiveMaxY - effectiveMinY;

  // Use calculated viewBox dimensions directly
  const finalViewBoxWidth = Math.max(viewBoxWidth, 1);
  const finalViewBoxHeight = Math.max(viewBoxHeight, 1);

  return (
    <svg
      width="100%" // Scale to fit parent div
      height="100%"
      viewBox={`${effectiveMinX} ${effectiveMinY} ${finalViewBoxWidth} ${finalViewBoxHeight}`}
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
