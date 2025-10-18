"use client";
import { useEffect, useRef } from "react";

// 공통 훅: HiDPI 대응 및 자동 리사이즈 처리 (JS 버전)
function useHiDPICanvas(canvasRef, onDraw, dprMax = 2) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const DPR = Math.min(window.devicePixelRatio || 1, dprMax);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.round(width * DPR);
      canvas.height = Math.round(height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (onDraw) onDraw(ctx, width, height);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvasRef, onDraw, dprMax]);
}

/**
 * 포인트: 도형이 경계에 딱 맞도록 그리고,
 * 선이 잘리지 않게 lineWidth/2 만큼 안쪽으로 보정.
 */

// 가로 선(Line) — 캔버스 = 선
export function CanvasLine({
  width = 400,
  height = 8,         // 선 두께 정도로 얇게
  color = "white",
  lineWidth = 1,
} = {}) {
  const ref = useRef(null);

  useHiDPICanvas(ref, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const y = h / 2;
    const inset = lineWidth / 2;
    ctx.beginPath();
    ctx.moveTo(inset, y);
    ctx.lineTo(w - inset, y);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.stroke();
  });

  return <canvas ref={ref} style={{ width, height, display: "block" }} />;
}

// 원(Circle) — 지름이 정확히 캔버스에 맞게
export function CanvasCircle({ width = 240, height = 240, lineWidth = 1 }) {
  const ref = useRef(null);

  useHiDPICanvas(ref, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    // ✅ 안전 클램프
    let r = Math.min(w || 0, h || 0) / 3;
    if (!isFinite(r)) r = 0;
    r = Math.max(0.5, r);

    ctx.beginPath();
    ctx.arc((w || 0) / 2, (h || 0) / 2, r, 0, Math.PI * 2);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "white";
    ctx.stroke();
  });

  return <canvas ref={ref} style={{ width, height }} />;
}

// 정사각형(Square) — 변이 정확히 캔버스에 맞게 (라운드 코너 지원)
export function CanvasSquare({
  size = 240,
  color = "#ffffff",
  lineWidth = 1,
  fill = "transparent",
  radius = 0,
} = {}) {
  const ref = useRef(null);

  useHiDPICanvas(ref, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const side = Math.min(w, h) - lineWidth; // 테두리 보정
    const x = (w - side) / 2;
    const y = (h - side) / 2;
    const r = Math.max(0, Math.min(radius, side / 2));

    const drawRoundedRect = (x, y, w, h, r) => {
      if (r <= 0) {
        ctx.rect(x, y, w, h);
      } else {
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      }
    };

    if (fill !== "transparent") {
      ctx.beginPath();
      drawRoundedRect(x, y, side, side, r);

    }

    ctx.beginPath();
    drawRoundedRect(x, y, side, side, r);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "white";
    ctx.stroke();
  });

  return <canvas ref={ref} style={{ width: size, height: size, display: "block" }} />;
}
