"use client";

import { useEffect, useRef } from "react";

export default function MouseParticlesToggle({ enabled }) {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const mouseHistory = useRef([]);

  const shapeRef = useRef(null);    // 뱀 전체 모양 (토글 켤 때 한 번 결정)
  const enabledRef = useRef(false); // 애니메이션 루프에서 enabled 상태 읽기
  const timeRef = useRef(0);        // 회전 애니메이션용 시간

  // 설정값들
  const SEGMENT_COUNT = 30;          // 뱀 몸통 조각 개수
  const SEGMENT_SPACING = 8;         // 궤적에서 조각 간 간격
  const OBJECT_SIZE = 72;            // 🔹 크기 4배로 키움
  const STROKE_WIDTH = 3;            // 테두리 두께
  const ROTATION_SPEED = 0.03;       // 회전 속도 (라디안/frame)
  const ROTATION_DELAY = 4;          // 세그먼트 간 회전 시작 딜레이 (프레임 단위)
  const MAX_HISTORY =
    SEGMENT_COUNT * SEGMENT_SPACING + 50; // 궤적 최대 길이

  // 마우스 위치 추적
  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePos.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // enabled 변경 감지 + 모양 선택
  useEffect(() => {
    enabledRef.current = enabled;

    if (enabled) {
      const shapes = ["line", "square", "circle"];
      shapeRef.current =
        shapes[Math.floor(Math.random() * shapes.length)];
    } else {
      shapeRef.current = null;
    }
  }, [enabled]);

  // 캔버스 & 애니메이션 루프
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const drawSegment = (x, y, opacity, index) => {
      const shape = shapeRef.current || "circle";

      // 회전 딜레이: index가 클수록 더 늦게 회전 시작
      const t = timeRef.current - index * ROTATION_DELAY;
      const angle = t > 0 ? t * ROTATION_SPEED : 0;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.strokeStyle = `rgba(0, 81, 255, ${opacity})`;
      ctx.lineWidth = STROKE_WIDTH;

      switch (shape) {
        case "line": {
          // 가로 선 (path만, fill 없이 stroke만)
          ctx.moveTo(-OBJECT_SIZE / 2, 0);
          ctx.lineTo(OBJECT_SIZE / 2, 0);
          break;
        }
        case "square": {
          const half = OBJECT_SIZE / 2;
          ctx.rect(-half, -half, OBJECT_SIZE, OBJECT_SIZE);
          break;
        }
        case "circle":
        default: {
          ctx.arc(0, 0, OBJECT_SIZE / 2, 0, Math.PI * 2);
          break;
        }
      }

      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      timeRef.current += 1; // 회전용 시간 증가
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 마우스 궤적 추가
      mouseHistory.current.push({ ...mousePos.current });
      if (mouseHistory.current.length > MAX_HISTORY) {
        mouseHistory.current.shift();
      }

      const history = mouseHistory.current;

      if (enabledRef.current && history.length > 0) {
        // 머리(가장 최근 위치)에서 꼬리로
        for (let i = 0; i < SEGMENT_COUNT; i++) {
          const idx = history.length - 1 - i * SEGMENT_SPACING;
          if (idx < 0) break;

          const pos = history[idx];
          const opacity = 1 - i / SEGMENT_COUNT; // 앞쪽 진하고 뒤쪽 옅게

          drawSegment(pos.x, pos.y, opacity, i);
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
