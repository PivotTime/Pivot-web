
'use client';
import { useEffect, useRef, useState } from 'react';
import ShapeRenderer from './ShapeRenderer';

const MAX = 200;
const CAM_DIST = 800;
const Z_EPS = 1;
const AUTO_SPEED_Y = 0.003;

export default function PlaybackAnimation({ trajectories, customObjects, arrangement = 'orbit' }) {
  const holderRef = useRef(null);
  const animationRefs = useRef(
    trajectories.map((traj, i) => ({
      radius: (traj.radius || (i === 0 ? 220 : i === 1 ? 300 : 150)) * 0.3, // Revert radius scaling to 0.2
      sizeFactor: (traj.sizeFactor || (i === 0 ? 1 : i === 1 ? 0.8 : 1.2)) * 1.0, // Set sizeFactor scaling to 1.0 (no additional scaling)
      angleX: traj.angleX !== undefined ? traj.angleX : (i === 0 ? 0 : i === 1 ? 0.2 : -0.2), // Use saved angleX or default
      angleY: traj.angleY !== undefined ? traj.angleY : (i === 0 ? 0 : i === 1 ? 1.5 : -1.5), // Use saved angleY or default
    }))
  );
  const shapeNodesRef = useRef([]);
  const [objectCustomShapes, setObjectCustomShapes] = useState(Array(MAX).fill(null));

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
              const layerHeight = Math.max(minLayerHeight, maxLayerHeight - (maxLayerHeight - minLayerHeight) * Math.pow(count / MAX, 0.5));
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
            let scale = persp * 0.85 * sizeFactor; // sizeFactor already scaled by 0.6
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
          if (node) node.style.display = 'none';
        }
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [trajectories, customObjects, arrangement]);

  return (
    <div ref={holderRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
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
