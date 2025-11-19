"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

const DPR_MAX = 2;

function useHiDPICanvas(canvasRef, onDraw, dprMax = DPR_MAX) {
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

function CanvasLine({
  width = 400,
  height = 8,
  color = "white",
  lineWidth = 2.5,
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

function CanvasCircle({ width = 240, height = 240, lineWidth = 2.5 }) {
  const ref = useRef(null);

  useHiDPICanvas(ref, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
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

function CanvasSquare({
  size = 240,
  color = "#ffffff",
  lineWidth = 2.5,
  fill = "transparent",
  radius = 0,
} = {}) {
  const ref = useRef(null);

  useHiDPICanvas(ref, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const side = Math.min(w, h) - lineWidth;
    const x = (w - side) / 2;
    const y = (h - side) / 2;
    const r = Math.max(0, Math.min(radius, side / 2));

    const drawRoundedRect = (x0, y0, width0, height0, radius0) => {
      if (radius0 <= 0) {
        ctx.rect(x0, y0, width0, height0);
      } else {
        ctx.moveTo(x0 + radius0, y0);
        ctx.arcTo(x0 + width0, y0, x0 + width0, y0 + height0, radius0);
        ctx.arcTo(x0 + width0, y0 + height0, x0, y0 + height0, radius0);
        ctx.arcTo(x0, y0 + height0, x0, y0, radius0);
        ctx.arcTo(x0, y0, x0 + width0, y0, radius0);
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
    ctx.strokeStyle = color;
    ctx.stroke();
  });

  return <canvas ref={ref} style={{ width: size, height: size, display: "block" }} />;
}

function VectorPreview({ shapes, width, height }) {
  if (!shapes || shapes.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  shapes.forEach((s) => {
    if (s.type === "line") {
      s.points.forEach((p) => {
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
      });
    } else if (s.type === "rect") {
      minX = Math.min(minX, s.x, s.x + s.w);
      maxX = Math.max(maxX, s.x, s.x + s.w);
      minY = Math.min(minY, s.y, s.y + s.h);
      maxY = Math.max(maxY, s.y, s.y + s.h);
    } else if (s.type === "circle") {
      minX = Math.min(minX, s.cx - s.r);
      maxX = Math.max(maxX, s.cx + s.r);
      minY = Math.min(minY, s.cy - s.r);
      maxY = Math.max(maxY, s.cy + s.r);
    }
  });

  const effectiveMinX = isFinite(minX) ? minX : 0;
  const effectiveMinY = isFinite(minY) ? minY : 0;
  const effectiveMaxX = isFinite(maxX) ? maxX : width;
  const effectiveMaxY = isFinite(maxY) ? maxY : height;

  const viewBoxWidth = effectiveMaxX - effectiveMinX;
  const viewBoxHeight = effectiveMaxY - effectiveMinY;

  const finalViewBoxWidth = Math.max(viewBoxWidth, 1);
  const finalViewBoxHeight = Math.max(viewBoxHeight, 1);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`${effectiveMinX} ${effectiveMinY} ${finalViewBoxWidth} ${finalViewBoxHeight}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible" }}
    >
      {shapes.map((s) => {
        if (s.type === "line") {
          const d = s.points.map((p, i) => (i ? `L${p.x},${p.y}` : `M${p.x},${p.y}`)).join(" ");
          return (
            <path
              key={s.id}
              d={d}
              fill="none"
              stroke={s.style.stroke}
              strokeWidth={s.style.lineWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
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

function ShapeRenderer({ type, customShapes, width, height }) {
  if (type === "line") {
    return <CanvasLine width={width || 160} height={height || 60} />;
  }
  if (type === "square") {
    const size = width || height || 120;
    return <CanvasSquare size={size} />;
  }
  if (type === "circle") {
    return <CanvasCircle width={width || 120} height={height || 120} />;
  }
  if (type === "custom" && customShapes) {
    return <VectorPreview shapes={customShapes} width={width || 100} height={height || 100} />;
  }
  return null;
}

const MAX_NODES = 200;
const CAM_DIST = 800;
const Z_EPS = 1;
const AUTO_SPEED_Y = 0.003;
const CLUSTER_SCALE = 0.35;
const IMMERSIVE_PANEL_SIZE = 960;

const TEAM_SLOTS = [
  { angleDeg: -160, radius: 1350, yOffset: -280, tiltDeg: 14 },
  { angleDeg: -130, radius: 1250, yOffset: -260, tiltDeg: 10 },
  { angleDeg: -100, radius: 1200, yOffset: -240, tiltDeg: 6 },
  { angleDeg: -70, radius: 1150, yOffset: -180, tiltDeg: 4 },
  { angleDeg: -40, radius: 1100, yOffset: -140, tiltDeg: 2 },
  { angleDeg: -10, radius: 1080, yOffset: -60, tiltDeg: 0 },
  { angleDeg: 20, radius: 1080, yOffset: 0, tiltDeg: -1 },
  { angleDeg: 50, radius: 1100, yOffset: 40, tiltDeg: -2 },
  { angleDeg: 80, radius: 1120, yOffset: 80, tiltDeg: -4 },
  { angleDeg: 110, radius: 1180, yOffset: 140, tiltDeg: -8 },
  { angleDeg: 140, radius: 1250, yOffset: 220, tiltDeg: -10 },
  { angleDeg: 170, radius: 1350, yOffset: 280, tiltDeg: -14 },
  { angleDeg: 200, radius: 1500, yOffset: -220, tiltDeg: 12 },
  { angleDeg: 230, radius: 1450, yOffset: -160, tiltDeg: 8 },
  { angleDeg: 260, radius: 1400, yOffset: -80, tiltDeg: 4 },
  { angleDeg: 290, radius: 1380, yOffset: 0, tiltDeg: 0 },
  { angleDeg: 320, radius: 1380, yOffset: 60, tiltDeg: -4 },
  { angleDeg: 350, radius: 1400, yOffset: 140, tiltDeg: -8 },
  { angleDeg: -190, radius: 1450, yOffset: 200, tiltDeg: -12 },
];

function TeamPlayback({ trajectories = [], customObjects = [], arrangement = "orbit" }) {
  const holderRef = useRef(null);
  const shapeNodesRef = useRef([]);
  const animationRefs = useRef([]);
  const [customObjectForNode, setCustomObjectForNode] = useState(() => Array(MAX_NODES).fill(null));

  const getPivot = () => {
    const holder = holderRef.current;
    if (!holder) return null;
    const width = holder.clientWidth;
    const height = holder.clientHeight;
    return { cx: width / 2, cy: height / 2 };
  };

  const customObjectMap = useMemo(() => {
    const map = new Map();
    (customObjects ?? []).forEach((obj) => {
      if (obj?.id) {
        map.set(obj.id, obj);
      }
    });
    return map;
  }, [customObjects]);

  useEffect(() => {
    animationRefs.current = trajectories.map((traj, index) => ({
      radius: traj.radius ?? (index === 0 ? 220 : index === 1 ? 300 : 150),
      sizeFactor: (traj.sizeFactor ?? (index === 0 ? 1 : index === 1 ? 0.8 : 1.2)) * 1.0,
      angleX: traj.angleX ?? (index === 0 ? 0 : index === 1 ? 0.2 : -0.2),
      angleY: traj.angleY ?? (index === 0 ? 0 : index === 1 ? 1.5 : -1.5),
    }));
  }, [trajectories]);

  useEffect(() => {
    setCustomObjectForNode(Array(MAX_NODES).fill(null));
  }, [customObjects]);

  const step = useCallback(() => {
    const basis = getPivot();
    if (!basis) return;

    const { cx, cy } = basis;

    animationRefs.current.forEach((anim, index) => {
      anim.angleY += AUTO_SPEED_Y * (index % 2 === 0 ? 1 : -1.2);
    });

    let nodeIndex = 0;

    trajectories.forEach((trajectory, trajectoryIndex) => {
      const anim = animationRefs.current[trajectoryIndex];
      if (!anim) return;

      const count = trajectory.count ?? 0;
      if (!count) return;

      const { objectType = "circle", pointToCenter, customObjectId } = trajectory;
      const { radius, sizeFactor, angleX, angleY } = anim;

      const currentCustomObject = objectType === "custom" ? customObjectMap.get(customObjectId) : null;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      for (let i = 0; i < count; i++) {
        if (nodeIndex >= MAX_NODES) continue;

        let x;
        let y;
        let z;

        if (arrangement === "orbit") {
          const slice = (Math.PI * 2) / count;
          x = Math.cos(i * slice) * radius;
          y = 0;
          z = Math.sin(i * slice) * radius;
        } else {
          const maxLayerHeight = 20;
          const minLayerHeight = 2;
          const layerHeight =
            Math.max(minLayerHeight, maxLayerHeight - (maxLayerHeight - minLayerHeight) * Math.pow(count / MAX_NODES, 0.5));
          const rotationPerLayer = 0.15;
          const angle = i * rotationPerLayer;
          x = Math.cos(angle) * radius;
          y = (i - count / 2) * layerHeight;
          z = Math.sin(angle) * radius;
        }

        const xz = x * cosY - z * sinY;
        const zz = x * sinY + z * cosY;
        const yz = y * cosX - zz * sinX;
        const zz2 = y * sinX + zz * cosX;

        const denom = Math.max(Z_EPS, CAM_DIST - zz2);
        const persp = CAM_DIST / denom;
        let scale = persp * 0.85 * sizeFactor;
        if (!isFinite(scale) || scale < 0) scale = 0;

        const px = cx + xz * persp;
        const py = cy + yz * persp;

        let individualRotationStyle = "";
        if (arrangement === "stack") {
          const rotationPerLayer = 0.15;
          const individualAngle = i * rotationPerLayer;
          individualRotationStyle = ` rotate(${individualAngle}rad)`;
        }

        let pointToCenterRotationStyle = "";
        const shouldPointToCenter = (objectType === "square" ? true : pointToCenter) && (objectType === "line" || objectType === "square" || objectType === "custom");
        if (arrangement === "orbit" && shouldPointToCenter) {
          const angle = Math.atan2(cy - py, cx - px);
          pointToCenterRotationStyle = ` rotate(${angle}rad)`;
        }

        const finalRotationStyle = `${individualRotationStyle}${pointToCenterRotationStyle}`;

        const normZ = radius ? zz2 / radius : 0;
        const opacity = 0.25 + ((normZ + 1) / 2) * 0.75;

        if (objectType === "custom" && customObjectForNode[nodeIndex]?.id !== currentCustomObject?.id) {
          setCustomObjectForNode((prev) => {
            const next = [...prev];
            next[nodeIndex] = currentCustomObject ?? null;
            return next;
          });
        }

        const node = shapeNodesRef.current[nodeIndex];
        if (node) {
          const sizeMap = {
            line: { width: 160, height: 60 },
            square: { width: 240, height: 240 },
            circle: { width: 240, height: 240 },
            custom: {
              width: customObjectForNode[nodeIndex]?.width || 240,
              height: customObjectForNode[nodeIndex]?.height || 240,
            },
          };
          const targetSize = sizeMap[objectType] || sizeMap.circle;
          node.style.width = `${targetSize.width}px`;
          node.style.height = `${targetSize.height}px`;
          node.style.display = "block";
          node.style.left = `${px}px`;
          node.style.top = `${py}px`;
          node.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})${finalRotationStyle}`;
          node.style.opacity = Math.max(0, Math.min(1, opacity)).toFixed(3);

          const containers = node.querySelectorAll(".shape-container");
          containers.forEach((container) => {
            if (container.dataset.type === objectType) {
              container.style.display = "flex";
            } else {
              container.style.display = "none";
            }
          });
        }

        nodeIndex++;
      }
    });

    for (let i = nodeIndex; i < MAX_NODES; i++) {
      const node = shapeNodesRef.current[i];
      if (node) node.style.display = "none";
    }
  }, [trajectories, arrangement, customObjectMap, customObjectForNode]);

  useEffect(() => {
    let frameId;
    const loop = () => {
      step();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [step]);

  return (
    <div className="team-playback" ref={holderRef}>
      {Array.from({ length: MAX_NODES }).map((_, index) => (
        <div
          key={index}
          ref={(el) => (shapeNodesRef.current[index] = el)}
          className="team-playback__node"
          style={{ position: "absolute", display: "none" }}
        >
          <div className="shape-container" data-type="circle">
            <ShapeRenderer type="circle" width={240} height={240} />
          </div>
          <div className="shape-container" data-type="square" style={{ display: "none" }}>
            <ShapeRenderer type="square" width={240} height={240} />
          </div>
          <div className="shape-container" data-type="line" style={{ display: "none" }}>
            <ShapeRenderer type="line" width={160} height={60} />
          </div>
          <div className="shape-container" data-type="custom" style={{ display: "none" }}>
            <ShapeRenderer
              type="custom"
              customShapes={customObjectForNode[index]?.shapes}
              width={customObjectForNode[index]?.width || 240}
              height={customObjectForNode[index]?.height || 240}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function useClusterStyle() {
  return useCallback((slotIndex) => {
    const slot = TEAM_SLOTS[slotIndex % TEAM_SLOTS.length];
    const { angleDeg, radius, yOffset, tiltDeg } = slot;

    return {
      position: "absolute",
      width: `${IMMERSIVE_PANEL_SIZE}px`,
      height: `${IMMERSIVE_PANEL_SIZE * 0.6}px`,
      top: "50%",
      left: "50%",
      transform: [
        "translate(-50%, -50%)",
        `rotateX(${tiltDeg}deg)`,
        `rotateY(${angleDeg}deg)`,
        `translateZ(${radius}px)`,
        `translateY(${yOffset}px)`,
        `rotateY(${-angleDeg}deg)`,
        `rotateX(${-tiltDeg}deg)`,
        `scale(${CLUSTER_SCALE})`,
      ].join(" "),
      transformOrigin: "center",
      transformStyle: "preserve-3d",
      zIndex: -1,
    };
  }, []);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function TeamObjects({ submissions, isZoomed }) {
  const safeSubmissions = submissions ?? [];
  const getClusterStyle = useClusterStyle();

  const [shuffledSubmissions, setShuffledSubmissions] = useState(
    () => safeSubmissions
  );

  useEffect(() => {
    // 클라이언트에서만 셔플하여 SSR과의 초기 순서를 맞춤
    setShuffledSubmissions(shuffleArray(safeSubmissions));
  }, [safeSubmissions]);

  const slottedTeams = useMemo(() => {
    if (shuffledSubmissions.length === 0) return [];
    return TEAM_SLOTS.map((slot, index) => ({
      slotIndex: index,
      submission: shuffledSubmissions[index % shuffledSubmissions.length],
    }));
  }, [shuffledSubmissions]);

  return (
    <div className={`team-object-wrap ${isZoomed ? "is-visible" : ""}`}>
      {slottedTeams.map(({ slotIndex, submission }, index) =>
        submission ? (
          <div className="team-object" key={submission.id ?? slotIndex ?? index} style={getClusterStyle(slotIndex)}>
            <TeamPlayback
              trajectories={submission.trajectories ?? []}
              arrangement={submission.arrangement ?? "orbit"}
              customObjects={submission.customObjects ?? []}
            />
            <span className="team-object__label">{submission.name}</span>
          </div>
        ) : null
      )}
    </div>
  );
}

export default memo(TeamObjects);

export const PlaybackAnimation = memo(function PlaybackAnimation({ trajectories = [], customObjects = [], arrangement = "orbit" }) {
  const holderRef = useRef(null);
  const animationRefs = useRef(
    trajectories.map((traj, i) => ({
      radius: traj.radius || (i === 0 ? 220 : i === 1 ? 300 : 150),
      sizeFactor: (traj.sizeFactor || (i === 0 ? 1 : i === 1 ? 0.8 : 1.2)) * 1.0,
      angleX: traj.angleX !== undefined ? traj.angleX : i === 0 ? 0 : i === 1 ? 0.2 : -0.2,
      angleY: traj.angleY !== undefined ? traj.angleY : i === 0 ? 0 : i === 1 ? 1.5 : -1.5,
    }))
  );
  const shapeNodesRef = useRef([]);
  const [customObjectForNode, setCustomObjectForNode] = useState(Array(MAX_NODES).fill(null));

  const getPivot = () => {
    const holder = holderRef.current;
    if (!holder) return null;
    const hr = holder.getBoundingClientRect();
    return { cx: hr.width / 2, cy: hr.height / 2, w: hr.width, h: hr.height };
  };

  useEffect(() => {
    let frameId;
    const tick = () => {
      const basis = getPivot();
      if (basis) {
        const { cx, cy } = basis;

        animationRefs.current.forEach((anim, i) => {
          anim.angleY += AUTO_SPEED_Y * (i % 2 === 0 ? 1 : -1.2);
        });

        let objIndex = 0;

        trajectories.forEach((traj, trajIndex) => {
          const anim = animationRefs.current[trajIndex];
          const { count, objectType = "circle", pointToCenter, customObjectId } = traj;
          if (!count) return;

          const { radius, sizeFactor, angleX, angleY } = anim;

          const currentCustomObject =
            objectType === "custom" ? customObjects.find((co) => co.id === customObjectId) : null;
          const customShapes = currentCustomObject ? currentCustomObject.shapes : null;

          const cosY = Math.cos(angleY);
          const sinY = Math.sin(angleY);
          const cosX = Math.cos(angleX);
          const sinX = Math.sin(angleX);

          for (let i = 0; i < count; i++) {
            if (objIndex >= MAX_NODES) continue;

            let x;
            let y;
            let z;
            if (arrangement === "orbit") {
              const slice = (Math.PI * 2) / count;
              x = Math.cos(i * slice) * radius;
              y = 0;
              z = Math.sin(i * slice) * radius;
            } else {
              const maxLayerHeight = 20;
              const minLayerHeight = 2;
              const layerHeight = Math.max(
                minLayerHeight,
                maxLayerHeight - (maxLayerHeight - minLayerHeight) * Math.pow(count / MAX_NODES, 0.5)
              );
              const rotationPerLayer = 0.15;
              const angle = i * rotationPerLayer;
              x = Math.cos(angle) * radius;
              y = (i - count / 2) * layerHeight;
              z = Math.sin(angle) * radius;
            }

            const xz = x * cosY - z * sinY;
            const zz = x * sinY + z * cosY;
            const yz = y * cosX - zz * sinX;
            const zz2 = y * sinX + zz * cosX;

            const denom = Math.max(Z_EPS, CAM_DIST - zz2);
            const persp = CAM_DIST / denom;
            let scale = persp * 0.85 * sizeFactor;
            if (!isFinite(scale) || scale < 0) scale = 0;

            const px = cx + xz * persp;
            const py = cy + yz * persp;

            let individualRotationStyle = "";
            if (arrangement === "stack") {
              const rotationPerLayer = 0.15;
              const individualAngle = i * rotationPerLayer;
              individualRotationStyle = ` rotate(${individualAngle}rad)`;
            }

            let pointToCenterRotationStyle = "";
            if (
              arrangement === "orbit" &&
              pointToCenter &&
              (objectType === "line" || objectType === "square" || objectType === "custom")
            ) {
              const angle = Math.atan2(cy - py, cx - px);
              pointToCenterRotationStyle = ` rotate(${angle}rad)`;
            }

            const finalRotationStyle = `${individualRotationStyle}${pointToCenterRotationStyle}`;

            const normZ = zz2 / radius;
            const opacity = 0.25 + ((normZ + 1) / 2) * 0.75;

            if (objectType === "custom" && JSON.stringify(customObjectForNode[objIndex]) !== JSON.stringify(currentCustomObject)) {
              setCustomObjectForNode((prev) => {
                const newArr = [...prev];
                newArr[objIndex] = currentCustomObject;
                return newArr;
              });
            }

            const node = shapeNodesRef.current[objIndex];
            if (node) {
              node.style.display = "block";
              node.style.left = `${px}px`;
              node.style.top = `${py}px`;
              node.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})${finalRotationStyle}`;
              node.style.opacity = Math.max(0, Math.min(1, opacity)).toFixed(3);

              const containers = node.querySelectorAll(".shape-container");
              containers.forEach((container) => {
                if (container.dataset.type === objectType) {
                  container.style.display = "block";
                } else {
                  container.style.display = "none";
                }
              });

              if (objectType === "custom") {
                const customContainer = node.querySelector('.shape-container[data-type="custom"] canvas');
                if (customContainer && currentCustomObject) {
                  customContainer.style.width = `${currentCustomObject.width || 240}px`;
                  customContainer.style.height = `${currentCustomObject.height || 240}px`;
                }
              }
            }
            objIndex++;
          }
        });

        for (let i = objIndex; i < MAX_NODES; i++) {
          const node = shapeNodesRef.current[i];
          if (node) node.style.display = "none";
        }
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [trajectories, customObjects, arrangement]);

  return (
    <div ref={holderRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      {Array.from({ length: MAX_NODES }).map((_, i) => (
        <div key={i} ref={(el) => (shapeNodesRef.current[i] = el)} style={{ position: "absolute", display: "none" }}>
          <div className="shape-container" data-type="circle">
            <ShapeRenderer type="circle" width={240} height={240} />
          </div>
          <div className="shape-container" data-type="square" style={{ display: "none" }}>
            <ShapeRenderer type="square" width={240} height={240} />
          </div>
          <div className="shape-container" data-type="line" style={{ display: "none" }}>
            <ShapeRenderer type="line" width={160} height={60} />
          </div>
          <div className="shape-container" data-type="custom" style={{ display: "none" }}>
            <ShapeRenderer
              type="custom"
              customShapes={customObjectForNode[i]?.shapes}
              width={customObjectForNode[i]?.width || 240}
              height={customObjectForNode[i]?.height || 240}
            />
          </div>
        </div>
      ))}
    </div>
  );
});
