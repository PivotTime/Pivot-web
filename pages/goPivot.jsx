'use client';
import { useEffect, useRef, useState, useCallback } from "react";
import ShapeRenderer from '../components/ShapeRenderer'; // New import

import Link from 'next/link';

const MAX      = 200;
const CAM_DIST = 800;  // 카메라 거리
const Z_EPS    = 1;    // 카메라 평면과 최소 간격(분모 0/음수 방지)
const AUTO_SPEED_Y = 0.003; // 항상 천천히 회전 (Y축 기준)

export default function GoPivot() {
  const holderRef = useRef(null);

  const [arrangement, setArrangement] = useState('orbit'); // 'orbit' or 'stack'

  // State for trajectories' UI-facing properties
  const [trajectories, setTrajectories] = useState([
    { id: 0, objectType: 'circle', count: 15, pointToCenter: true, customObjectId: null }, // Added customObjectId
    { id: 1, objectType: 'square', count: 0, pointToCenter: true, customObjectId: null },
    { id: 2, objectType: 'line', count:0, pointToCenter: false, customObjectId: null },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // State for the final objects to be rendered. This will be updated every frame.
  const [renderedObjects, setRenderedObjects] = useState([]);

  // Custom objects fetched from Firestore
  const [customObjects, setCustomObjects] = useState([]);
  const [loadingCustomObjects, setLoadingCustomObjects] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Refs for properties that change every frame, to avoid re-renders from the animation loop
  const animationRefs = useRef([
    { radius: 220, sizeFactor: 1, angleX: 0, angleY: 0 },
    { radius: 300, sizeFactor: 0.8, angleX: 0.2, angleY: 1.5 },
    { radius: 150, sizeFactor: 1.2, angleX: -0.2, angleY: -1.5 },
  ]);
  const wheelTS = useRef(0);

  // Fetch custom objects on component mount
  useEffect(() => {
    const fetchCustomObjects = async () => {
      try {
        setLoadingCustomObjects(true);
        const response = await fetch('/api/get_custom_objects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCustomObjects(data);
      } catch (error) {
        console.error('Error fetching custom objects:', error);
        setFetchError(`커스텀 오브젝트를 불러오는 데 실패했습니다: ${error.message}`);
      } finally {
        setLoadingCustomObjects(false);
      }
    };
    fetchCustomObjects();
  }, []);

  // Refs for drag handling
  const dragModeRef  = useRef(null);
  const dragStartRef = useRef({ x:0, y:0, ax:0, ay:0 });

  const getPivot = useCallback(() => {
    const holder = holderRef.current;
    if (!holder) return null;
    const hr = holder.getBoundingClientRect();
    return {
      cx: hr.width / 2,
      cy: hr.height / 2,
      w: hr.width,
      h: hr.height,
    };
  }, []);

  const onMouseMove = useCallback((e) => {
    const holder = holderRef.current;
    const basis = getPivot();
    if (!holder || !basis) return;
    
    const rect = holder.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const dx = mx - basis.cx;
    const dy = my - basis.cy;
    const dist = Math.hypot(dx, dy);

    const maxRBySize = Math.min(basis.w, basis.h) * 0.6;
    const maxRByCam  = CAM_DIST - 40;
    const maxR       = Math.max(40, Math.min(maxRBySize, maxRByCam));

    const selectedAnim = animationRefs.current[selectedIndex];

    const targetR = Math.max(40, Math.min(maxR, dist * 0.5));
    selectedAnim.radius += (targetR - selectedAnim.radius) * 0.25;

    if (dragModeRef.current === "size") {
      const norm = Math.min(1, dist / maxR);
      const targetSize = 0.5 + 1.5 * norm;
      selectedAnim.sizeFactor += (targetSize - selectedAnim.sizeFactor) * 0.35;
    } else if (dragModeRef.current === "rotate") {
      const dxDrag = e.clientX - dragStartRef.current.x;
      const dyDrag = e.clientY - dragStartRef.current.y;
      const sens = 0.005;
      selectedAnim.angleY = dragStartRef.current.ay + dxDrag * sens;
      selectedAnim.angleX = dragStartRef.current.ax + dyDrag * sens;
    }
  }, [getPivot, selectedIndex]);

  const onMouseDown = useCallback((e) => {
    const rect = holderRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.left ?? 0);
    const y = e.clientY - (rect?.top ?? 0);
    
    const selectedAnim = animationRefs.current[selectedIndex];

    if (e.button === 0) {
      dragModeRef.current = "size";
      dragStartRef.current = { x, y, ax: selectedAnim.angleX, ay: selectedAnim.angleY };
    } else if (e.button === 2) {
      e.preventDefault();
      dragModeRef.current = "rotate";
      dragStartRef.current = { x, y, ax: selectedAnim.angleX, ay: selectedAnim.angleY };
    }
  }, [selectedIndex]);

  const onMouseUp = useCallback(() => { dragModeRef.current = null; }, []);
  const onContextMenu = useCallback((e) => e.preventDefault(), []);

  // Wheel handler for count
  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const now = performance.now();
      if (now - wheelTS.current < 60) return;
      wheelTS.current = now;

      setTrajectories(current => current.map((traj, i) => {
        if (i === selectedIndex) {
          const newCount = traj.count + (e.deltaY < 0 ? +1 : -1);
          // Ensure total count does not exceed MAX
          const otherCounts = current.filter((_, idx) => idx !== i).reduce((sum, t) => sum + t.count, 0);
          const maxAllowed = MAX - otherCounts;
          return { ...traj, count: Math.max(0, Math.min(maxAllowed, newCount)) };
        }
        return traj;
      }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [selectedIndex]);

  // Animation Loop
  useEffect(() => {
    let frameId;
    const tick = () => {
      const basis = getPivot();
      const newRenderedObjects = [];

      if (basis) {
        const { cx, cy } = basis;

        // Apply auto-rotation to all trajectories
        animationRefs.current.forEach((anim, i) => {
            anim.angleY += (AUTO_SPEED_Y * (i % 2 === 0 ? 1 : -1.2));
        });

        trajectories.forEach((traj, trajIndex) => {
          const anim = animationRefs.current[trajIndex];
          const { count, objectType, pointToCenter, customObjectId } = traj; // Get customObjectId
          if (count === 0) return;
          const { radius, sizeFactor, angleX, angleY } = anim;

          // Find custom shapes if objectType is 'custom'
          const currentCustomObject = objectType === 'custom' 
            ? customObjects.find(co => co.id === customObjectId) 
            : null;
          const customShapes = currentCustomObject ? currentCustomObject.shapes : null;

          const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
          const cosX = Math.cos(angleX), sinX = Math.sin(angleX);

          for (let i = 0; i < count; i++) {
            let x, y, z;

            if (arrangement === 'orbit') {
              const slice = (Math.PI * 2) / count;
              x = Math.cos(i * slice) * radius;
              y = 0;
              z = Math.sin(i * slice) * radius;
            } else { // stack mode
              const layerHeight = 15;
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
            if (arrangement === 'stack') {
              const rotationPerLayer = 0.15; // Same as used for position
              const individualAngle = i * rotationPerLayer;
              individualRotationStyle = ` rotate(${individualAngle}rad)`;
            }

            let pointToCenterRotationStyle = "";
            if (arrangement === 'orbit' && pointToCenter && (objectType === "line" || objectType === "square" || objectType === "custom")) {
              const angle = Math.atan2(cy - py, cx - px);
              pointToCenterRotationStyle = ` rotate(${angle}rad)`;
            }

            const finalRotationStyle = `${individualRotationStyle}${pointToCenterRotationStyle}`;

            const normZ = (zz2 / radius);
            const opacity = 0.25 + ((normZ + 1) / 2) * 0.75;

            newRenderedObjects.push({
              key: `${trajIndex}-${i}`,
              left: px,
              top: py,
              transform: `translate(-50%, -50%) scale(${scale.toFixed(3)})${finalRotationStyle}`,
              opacity: Math.max(0, Math.min(1, opacity)).toFixed(3),
              type: objectType,
              customShapes: customShapes, // Pass custom shapes to rendered object
            });
          }
        });
      }
      setRenderedObjects(newRenderedObjects);
      latestObjectsRef.current = newRenderedObjects;
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [getPivot, trajectories, customObjects, arrangement]); // Added customObjects and arrangement to dependencies

  const latestObjectsRef = useRef(); // Moved up for clarity, but was already there

  const submitData = useCallback(async () => {
    console.log("Attempting to submit data...", latestObjectsRef.current);
    if (!latestObjectsRef.current || latestObjectsRef.current.length === 0) {
      alert("전송할 데이터가 없습니다. 오브젝트 개수를 늘려주세요.");
      return;
    }

    try {
      const response = await fetch('/api/save_trajectories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(latestObjectsRef.current),
      });

      const result = await response.json();

      if (response.ok) {
        alert('데이터 전송 성공! (서버 콘솔을 확인하세요)');
      } else {
        alert(`데이터 전송 실패: ${result.message}`);
      }
    } catch (error) {
      console.error("Failed to submit data:", error);
      alert('데이터 전송 중 오류가 발생했습니다.');
    }
  }, []);

  // Keyboard controls for trajectory selection
  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log(`Key pressed: ${e.key}`);
      if (e.key >= '1' && e.key <= '3') {
        setSelectedIndex(parseInt(e.key, 10) - 1);
      } else if (e.key.toLowerCase() === 'p') {
        console.log("'P' key detected, calling submitData...");
        submitData();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [submitData]);

  // UI Handlers for buttons
  const handleSetObjectType = (type) => {
    setTrajectories(current => current.map((traj, i) => 
      i === selectedIndex ? { ...traj, objectType: type, customObjectId: null } : traj // Reset customObjectId
    ));
  };

  const handleSetCustomObject = (customObjId) => {
    setTrajectories(current => current.map((traj, i) => 
      i === selectedIndex ? { ...traj, objectType: 'custom', customObjectId: customObjId } : traj
    ));
  };

  const handleSetPointToCenter = () => {
    setTrajectories(current => current.map((traj, i) =>
      i === selectedIndex ? { ...traj, pointToCenter: !traj.pointToCenter } : traj
    ));
  };

  const selectedTrajectory = trajectories[selectedIndex];

  if (loadingCustomObjects) {
    return (
      <div style={{ width:"100vw", height:"100vh", background:"#202225", color:"#ccc", padding: "24px" }}>
        <h1 style={{ color: 'white' }}>로딩 중...</h1>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={{ width:"100vw", height:"100vh", background:"#202225", color:"#ccc", padding: "24px" }}>
        <h1 style={{ color: 'red' }}>오류 발생</h1>
        <p>{fetchError}</p>
        <Link href="/" style={{ color: '#9ef' }}>홈으로</Link>
      </div>
    );
  }

  return (
    <div style={{ width:"100vw", height:"100vh", background:"#202225", color:"#ccc" }}>
      <div style={{ padding:12, display:"flex", gap:8, flexWrap: "wrap", alignItems: 'center' }}>
        {/* Arrangement mode switcher */}
        <button onClick={() => setArrangement(a => a === 'orbit' ? 'stack' : 'orbit')}>
          {arrangement === 'orbit' ? '레이어 모드로' : '궤도 모드로'}
        </button>

        {/* Trajectory selectors */}
        {trajectories.map((traj, i) => (
          <button key={traj.id} onClick={() => setSelectedIndex(i)} disabled={i === selectedIndex}>
            궤적 {i + 1}
          </button>
        ))}
        <div style={{width: '100%', height: 8}}></div>

        {/* Controls for selected trajectory */}
        <button onClick={() => handleSetObjectType("line")}>선</button>
        <button onClick={() => handleSetObjectType("circle")}>원</button>
        <button onClick={() => handleSetObjectType("square")}>네모</button>
        
        {/* Custom Object Selector */}
        {customObjects.length > 0 && (
          <select 
            value={selectedTrajectory.objectType === 'custom' ? selectedTrajectory.customObjectId : ''}
            onChange={(e) => handleSetCustomObject(e.target.value)}
            style={{ marginLeft: 16, padding: '4px 8px', borderRadius: '4px', background: '#333', color: '#eee', border: '1px solid #555' }}
          >
            <option value="">커스텀 오브젝트 선택</option>
            {customObjects.map(co => (
              <option key={co.id} value={co.id}>
                {co.id} (저장: {new Date(co.createdAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        )}
        {customObjects.length === 0 && (
          <span style={{ marginLeft: 16, color: '#aaa' }}>커스텀 오브젝트 없음</span>
        )}

        <button onClick={handleSetPointToCenter} style={{ marginLeft: 16 }} disabled={arrangement === 'stack'}>
          중심점 바라보기: {selectedTrajectory.pointToCenter ? "ON" : "OFF"}
        </button>
        <span style={{ marginLeft:16, color:"#aaa" }}>
          [궤적 {selectedIndex+1}] 도형:{selectedTrajectory.objectType} / 개수:{selectedTrajectory.count}
          <span style={{ opacity:0.7 }}> (휠=개수, 좌드래그=크기, 우드래그=회전)</span>
        </span>
      </div>

      <div
        ref={holderRef}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onContextMenu={onContextMenu}
        style={{ position:"relative", width:"100%", height:"calc(100vh - 56px)", overflow:"hidden", cursor: "crosshair" }}
      >
        {/* Render objects */}
        {renderedObjects.map(obj => (
          <div
            key={obj.key}
            style={{
              position: "absolute",
              left: `${obj.left}px`,
              top: `${obj.top}px`,
              transform: obj.transform,
              opacity: obj.opacity,
              pointerEvents: "none"
            }}
          >
            <ShapeRenderer 
              type={obj.type} 
              customShapes={obj.customShapes} 
              width={obj.type === 'line' ? 160 : (obj.type === 'square' ? 120 : 120)} // Pass original dimensions for scaling
              height={obj.type === 'line' ? 60 : (obj.type === 'square' ? 120 : 120)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
