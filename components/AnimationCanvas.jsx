'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import ShapeRenderer from './ShapeRenderer';

const MAX = 200;
const CAM_DIST = 800;
const Z_EPS = 1;
const AUTO_SPEED_Y = 0.003;

export default function AnimationCanvas({ trajectories, arrangement, customObjects, animationRefs, selectedIndex, latestObjectsRef }) {
  const holderRef = useRef(null);
  const dragModeRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, ax: 0, ay: 0 });
  const lastAngleUpdateRef = useRef(0);
  const shapeNodesRef = useRef([]);
  const [renderedObjects, setRenderedObjects] = useState([]); // 렌더링될 오브젝트들의 상태
  const [objectCustomShapes, setObjectCustomShapes] = useState(Array(MAX).fill(null));

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
      const basis = getPivot();
      if (!basis) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const dx = mx - basis.cx;
      const dy = my - basis.cy;
      const dist = Math.hypot(dx, dy);

      const maxRBySize = Math.min(basis.w, basis.h) * 0.6;
      const maxRByCam = CAM_DIST - 40;
      const maxR = Math.max(40, Math.min(maxRBySize, maxRByCam));

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

        const now = performance.now();
        if (now - lastAngleUpdateRef.current > 50) {
          lastAngleUpdateRef.current = now;
          const angleDisplay = document.getElementById('angle-display');
          if (angleDisplay) {
            angleDisplay.innerText = `X: ${selectedAnim.angleX.toFixed(2)}, Y: ${selectedAnim.angleY.toFixed(2)}`;
          }
        }
      }
    }, [getPivot, selectedIndex, animationRefs]);

  const onMouseDown = useCallback((e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const selectedAnim = animationRefs.current[selectedIndex];

      if (e.button === 0) {
        dragModeRef.current = "size";
        dragStartRef.current = { x, y, ax: selectedAnim.angleX, ay: selectedAnim.angleY };
      } else if (e.button === 2) {
        e.preventDefault();
        dragModeRef.current = "rotate";
        dragStartRef.current = { x, y, ax: selectedAnim.angleX, ay: selectedAnim.angleY };
      }
    }, [selectedIndex, animationRefs]);

  const onMouseUp = useCallback(() => {
    dragModeRef.current = null;
  }, []);

  const onContextMenu = useCallback((e) => e.preventDefault(), []);

  useEffect(() => {
    let frameId;
    const tick = () => {
      const basis = getPivot();
      const newRenderedObjects = [];
      if (basis) {
        const { cx, cy } = basis;

        animationRefs.current.forEach((anim, i) => {
          anim.angleY += AUTO_SPEED_Y * (i % 2 === 0 ? 1 : -1.2);
        });

        let objIndex = 0;

        trajectories.forEach((traj, trajIndex) => {
          const anim = animationRefs.current[trajIndex];
          const { count, objectType, pointToCenter, customObjectId } = traj;
          if (count === 0) return;

          const { radius, sizeFactor, angleX, angleY } = anim;

          const currentCustomObject =
            objectType === 'custom'
              ? customObjects.find((co) => co.id === customObjectId)
              : null;
          const customShapes = currentCustomObject ? currentCustomObject.shapes : null;
         

          const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
          const cosX = Math.cos(angleX), sinX = Math.sin(angleX);

          for (let i = 0; i < count; i++) {
            if (objIndex >= MAX) continue;

            let x, y, z;

            if (arrangement === 'orbit') {
              const slice = (Math.PI * 2) / count;
              x = Math.cos(i * slice) * radius;
              y = 0;
              z = Math.sin(i * slice) * radius;
            } else {
              const maxLayerHeight = 20;
              const minLayerHeight = 2;
              const layerHeight = Math.max(
                minLayerHeight,
                maxLayerHeight - (maxLayerHeight - minLayerHeight) * Math.pow(count / MAX, 0.5)
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

            let individualRotationStyle = '';
            if (arrangement === 'stack') {
              const rotationPerLayer = 0.15;
              const individualAngle = i * rotationPerLayer;
              individualRotationStyle = ` rotate(${individualAngle}rad)`;
            }

            let pointToCenterRotationStyle = '';
            if (arrangement === 'orbit' && pointToCenter && (objectType === 'line' || objectType === 'square' || objectType === 'custom')) {
              const angle = Math.atan2(cy - py, cx - px);
              pointToCenterRotationStyle = ` rotate(${angle}rad)`;
            }

            const finalRotationStyle = `${individualRotationStyle}${pointToCenterRotationStyle}`;

            const normZ = zz2 / radius;
            const opacity = 0.25 + ((normZ + 1) / 2) * 0.75;

            newRenderedObjects.push({
              key: `${trajIndex}-${i}`,
              left: px,
              top: py,
              transform: `translate(-50%, -50%) scale(${scale.toFixed(3)})${finalRotationStyle}`,
              opacity: Math.max(0, Math.min(1, opacity)).toFixed(3),
              type: objectType,
              customShapes: customShapes,
            });

            // Update objectCustomShapes for the current object
            if (objectType === 'custom' && JSON.stringify(objectCustomShapes[objIndex]) !== JSON.stringify(customShapes)) {
              setObjectCustomShapes(prev => {
                const newArr = [...prev];
                newArr[objIndex] = customShapes;
                return newArr;
              });
            }

            const node = shapeNodesRef.current[objIndex];
            if (node) {
              node.style.display = 'block';
              node.style.left = `${px}px`;
              node.style.top = `${py}px`;
              node.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})${finalRotationStyle}`;
              node.style.opacity = Math.max(0, Math.min(1, opacity)).toFixed(3);

              const containers = node.querySelectorAll('.shape-container');
              containers.forEach(c => {
                if (c.dataset.type === objectType) {
                  c.style.display = 'block';
                } else {
                  c.style.display = 'none';
                }
              });
            }
            objIndex++;
          }
        });

        for (let i = objIndex; i < MAX; i++) {
          const node = shapeNodesRef.current[i];
          if (node) {
            node.style.display = 'none';
          }
        }
        if(latestObjectsRef) latestObjectsRef.current = newRenderedObjects;
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [getPivot, trajectories, customObjects, arrangement, animationRefs, latestObjectsRef]);

  return (
    <div
      ref={holderRef}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onContextMenu={onContextMenu}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: MAX }).map((_, i) => (
        <div key={i} ref={el => shapeNodesRef.current[i] = el} style={{ position: 'absolute', display: 'none' }}>
          <div className="shape-container" data-type="circle">
            <ShapeRenderer type="circle" width={240} height={240} />
          </div>
          <div className="shape-container" data-type="square" style={{display: 'none'}}>
            <ShapeRenderer type="square" width={120} height={120} />
          </div>
          <div className="shape-container" data-type="line" style={{display: 'none'}}>
            <ShapeRenderer type="line" width={160} height={60} />
          </div>
          <div className="shape-container" data-type="custom" style={{display: 'none'}}>
            <ShapeRenderer type="custom" customShapes={objectCustomShapes[i]} width={240} height={240} />
          </div>
        </div>
      ))}
    </div>
  );
}
