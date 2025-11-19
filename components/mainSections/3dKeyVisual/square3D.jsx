// 클라이언트 환경에서만 실행되도록 지정
"use client";

// React의 useEffect(렌더링 이후 실행용), useRef(DOM 요소를 직접 제어하기 위한 참조용) 불러오기
import { useEffect, useRef } from "react";

// three.js의 모든 기능을 불러옴 (3D 장면, 카메라, 오브젝트, 재질 등)
import * as THREE from "three";

// GSAP(자바스크립트 애니메이션 전용 라이브러리) 불러오기
import { gsap } from "gsap";
import seedrandom from "seedrandom"; // 랜덤 함수 생성을 위해 추가

// ThreeScene 컴포넌트를 정의 (3D 장면을 생성하고 렌더링하는 역할)
const DEFAULT_CAMERA = { x: 300, y: 0, z: 550 };

export default function Square3D({
  isZoomed = false,
  interactive = true,
  enableHover = true,
  cameraOverrides,
} = {}) {
  // ⚠️ isZoomed prop 추가
  // three.js가 생성한 캔버스를 붙일 HTML 요소를 가리키는 참조 생성
  const containerRef = useRef(null);
  const interactiveRef = useRef(interactive);
  const hoverEnabledRef = useRef(enableHover);
  interactiveRef.current = interactive;
  hoverEnabledRef.current = enableHover;

  // 컴포넌트가 처음 렌더링될 때 한 번만 실행되는 부분
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) {
      return undefined;
    }

    const getContainerSize = () => {
      const width =
        currentContainer.clientWidth ||
        currentContainer.offsetWidth ||
        window.innerWidth ||
        1;
      const height =
        currentContainer.clientHeight ||
        currentContainer.offsetHeight ||
        window.innerHeight ||
        1;
      return { width, height };
    };

    // 클린업을 위해 변수 선언
    let renderer, geometry, baseMaterial;
    let animationFrameId; // 애니메이션 프레임 ID 저장을 위해 추가

    // ===== Scene(3D 무대 역할) 생성 =====
    const scene = new THREE.Scene(); // 장면을 생성하여 모든 3D 객체를 담을 공간 생성

    // ===== 현재 화면 크기 가져오기 =====
    const { width: canvasWidth, height: canvasHeight } = getContainerSize();

    // ===== 원근 카메라 설정 =====
    const camera = new THREE.PerspectiveCamera(
      75, // 시야각(FOV)
      canvasWidth / canvasHeight, // 종횡비(가로/세로 비율)
      0.1, // 가까운 클리핑 평면 (이 거리보다 가까운 객체는 보이지 않음)
      3000 // 먼 클리핑 평면 (이 거리보다 먼 객체는 보이지 않음)
    );
    // ⚠️ [카메라 위치] 짤림 방지 기본값 유지
    const { x, y, z } = interactive && cameraOverrides?.interactive
      ? cameraOverrides.interactive
      : !interactive && cameraOverrides?.hero
      ? cameraOverrides.hero
      : DEFAULT_CAMERA;

    camera.position.set(x, y, z); // 카메라를 Z축 방향으로 뒤로 이동시켜 장면 전체를 볼 수 있게 설정

    // ===== 렌더러(WebGLRenderer) 설정 =====
    renderer = new THREE.WebGLRenderer({
      // 변수에 할당
      antialias: true, // 가장자리를 부드럽게 처리
      alpha: true, // 배경을 투명하게 설정
    });

    renderer.setSize(canvasWidth, canvasHeight); // 렌더러의 출력 크기를 현재 화면 크기에 맞게 설정
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 0); // 배경색을 투명으로 설정

    // ===== 렌더러 DOM에 추가 =====
    currentContainer.appendChild(renderer.domElement); // 렌더러가 생성한 캔버스를 HTML에 추가

    // ===== 3D 오브젝트 그룹 생성 (마우스 인터랙션으로 이 그룹이 회전함) =====
    const objectGroup = new THREE.Group(); // 여러 오브젝트를 하나로 묶기 위한 그룹 생성
    scene.add(objectGroup); // 그룹을 장면에 추가

    // ==================================================================
    // ▼▼▼▼▼▼▼▼▼▼▼▼▼ [Square3D 로직: "휘어진 리본" 궤적] ▼▼▼▼▼▼▼▼▼▼▼
    // ==================================================================

    const MIN_LINES = 10;
    const BASE_LINES = 40;
    const MAX_LINES = 160;
    const baseRotation = THREE.MathUtils.degToRad(3);
    const baseOpacity = 0.95;
    const baseDepth = 20;
    const baseScale = 1;

    // ===== 단일 사각형(프로필 형태) 정의 =====
    const squareSize = 300;
    const squarePoints = [
      new THREE.Vector3(-squareSize / 2, -squareSize / 2, 0),
      new THREE.Vector3(squareSize / 2, -squareSize / 2, 0),
      new THREE.Vector3(squareSize / 2, squareSize / 2, 0),
      new THREE.Vector3(-squareSize / 2, squareSize / 2, 0),
    ];
    geometry = new THREE.BufferGeometry().setFromPoints(squarePoints); // 변수에 할당

    // ===== 기준 재질 생성 =====
    baseMaterial = new THREE.LineBasicMaterial({
      // 변수에 할당
      color: 0xffffff,
      transparent: true,
      linewidth: 2,
    });

    // ===== 궤적을 구성할 사각형(선) 생성 =====
    const lineLoops = [];
    const lineLoopSet = new Set();

    const configureLine = (line, index) => {
      const scale = Math.pow(baseScale, index);
      line.scale.set(scale, scale, scale);
      line.rotation.z = index * baseRotation;
      const angle = index * 0.15;
      line.position.x = Math.sin(angle * 0.5) * 150;
      line.position.y = Math.cos(angle * 0.5) * 100;
      line.position.z = -index * baseDepth;
      line.userData.initialRotationZ = line.rotation.z;
      line.userData.orderIndex = index;
    };

    for (let i = 0; i < MAX_LINES; i++) {
      const material = baseMaterial.clone();
      material.opacity = Math.max(0.05, Math.pow(baseOpacity, i) * 0.9 + 0.05);

      const line = new THREE.LineLoop(geometry, material);
      configureLine(line, i);

      line.visible = i < BASE_LINES;
      lineLoops.push(line);
      lineLoopSet.add(line);
      objectGroup.add(line);
    }

    // ==================================================================
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲ [로직 종료] ▲▲▲▲▲▲▲▲▲▲▲▲▲
    // ==================================================================

    // ===== 1. 마우스 인터랙션 로직 수정 =====

    // 1-1. Raycaster와 마우스 좌표 변수 생성
    const raycaster = new THREE.Raycaster();
    raycaster.params.Line.threshold = 12; // 선과의 거리 여유 폭을 늘려 호버 감지 허용
    const mouse = new THREE.Vector2(-100, -100); // (초기값은 화면 밖)

    // 1-2. 현재 회전 중인 객체와 이탈 프레임 수를 추적
    const activeRotations = new Map();
    const EXIT_FRAME_THRESHOLD = 6; // 교차가 끊긴 프레임 허용치

    // 1-3. ⚠️ [수정] ⭐️ 호버 회전을 위한 초기값/목표값 추가 (Line3D.jsx 참고)
    const initialRotationX = THREE.MathUtils.degToRad(10);
    const initialRotationY = THREE.MathUtils.degToRad(-90);
    const initialRotationZ = THREE.MathUtils.degToRad(0);

    objectGroup.rotation.x = initialRotationX;
    objectGroup.rotation.y = initialRotationY;
    objectGroup.rotation.z = initialRotationZ;

    let targetX = initialRotationX;
    let targetY = initialRotationY;
    let targetZ = initialRotationZ;

    const sensitivity = Math.PI / 4;
    const sensitivityZ = Math.PI / 8;
    // (드래그 감도)
    const DRAG_SENSITIVITY = 0.35;

    const MIN_SCALE = 0.6;
    const BASE_SCALE = 1;
    const MAX_SCALE = 2;
    let targetScale = BASE_SCALE;
    let currentScale = BASE_SCALE;

    let targetLineCount = BASE_LINES;
    let currentLineCount = BASE_LINES;
    let lastAppliedLineCount = BASE_LINES;

    const normalizeRotation = (line) => {
      if (!line) return 0;
      const base = line.userData.initialRotationZ || 0;
      const offset = wrapAngle(line.rotation.z - base);
      line.rotation.z = base + offset;
      return base;
    };

    const startHoverRotation = (line) => {
      if (!line) return;
      if (line.userData.hoverTween) {
        activeRotations.set(line, 0);
        return;
      }
      const base = normalizeRotation(line);
      line.userData.hoverTween = gsap.to(line.rotation, {
        z: "+=" + Math.PI * 2,
        duration: 2,
        ease: "none",
        repeat: -1,
        modifiers: {
          z: (value) => base + wrapAngle(parseFloat(value) - base),
        },
      });
      activeRotations.set(line, 0);
    };

    const stopHoverRotation = (line) => {
      if (!line) return;
      if (line.userData.hoverTween) {
        line.userData.hoverTween.kill();
        line.userData.hoverTween = null;
      }
      const base = normalizeRotation(line);
      gsap.to(line.rotation, {
        z: base,
        duration: 0.5,
        ease: "power2.out",
      });
      activeRotations.delete(line);
    };

    const applyLineVisibility = (count) => {
      const clamped = THREE.MathUtils.clamp(count, MIN_LINES, MAX_LINES);
      lineLoops.forEach((line, index) => {
        const shouldShow = index < clamped;
        if (!shouldShow && activeRotations.has(line)) {
          stopHoverRotation(line);
        }
        line.visible = shouldShow;
      });
      lastAppliedLineCount = clamped;
    };
    applyLineVisibility(BASE_LINES);

    let isRightDragging = false;
    let rightDragStartX = 0;
    // ⚠️ [수정] ⭐️ X축 회전(Right-drag)을 위한 변수 추가
    let rightDragStartY = 0;
    let dragStartGroupRotationX = objectGroup.rotation.x;
    let targetGroupRotationX = objectGroup.rotation.x;
    let currentGroupRotationX = objectGroup.rotation.x;

    // ⚠️ [추가] ⭐️ Y축 드래그 회전 변수
    let dragStartGroupRotationY = objectGroup.rotation.y;
    let targetGroupRotationY = objectGroup.rotation.y;
    let currentGroupRotationY = objectGroup.rotation.y;

    let isLeftDragging = false;
    let leftDragStartY = 0;
    let leftDragStartScale = BASE_SCALE;
    let leftDragMoved = false;
    // ⚠️ [추가] ⭐️ Left-drag X 시작 위치 저장
    let leftDragStartX = 0;

    // (GSAP의 wrap 유틸리티 함수)
    const wrapAngle = gsap.utils.wrap(0, Math.PI * 2);

    // ===== 마우스 움직임 감지 함수 정의 =====
    const handleMouseMove = (e) => {
      // 호버(회전) 로직은 enableHover가 true일 때만 실행합니다.
      if (!hoverEnabledRef.current) {
        return;
      }
      // ⚠️ [수정 1/4] ⭐️
      // 호버(회전) 로직은 enableHover가 true일 때만 실행합니다.
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      // Raycaster용 마우스 좌표 (Y축 반전)
      mouse.x = x;
      mouse.y = -y;

      // ⚠️ [호버 회전 목표값 설정] ⭐️
      // Y축 회전만! 마우스 X축 움직임에 연결

      // 🛑 [수정] interactive=true (VisualSection) 일 때, 마우스에 따른 그룹 회전 목표값 업데이트를 막고 초기값으로 고정
      if (interactiveRef.current) {
          targetY = initialRotationY; // ⭐️ 그룹 Y축 회전 목표를 초기값으로 고정
      } else {
          targetY = initialRotationY + x * sensitivity; // HeroSection일 때만 마우스에 따라 Y축 회전
      }
      
      targetX = initialRotationX; // ⭐️ X축 회전 고정 
      targetZ = initialRotationZ;

      // ⚠️ [수정 2/4] ⭐️
      // 드래그(줌/라인 수 변경) 로직은 interactive가 false일 때만 (HeroSection) 실행합니다.
      if (!interactiveRef.current) {
        // (기존 Square3D의 Right-drag 로직: X축 회전)
        if (isRightDragging) {
          const deltaY = e.clientY - rightDragStartY; // ⚠️ [수정] Y 드래그 사용
          const rotationAmount = (deltaY / window.innerHeight) * Math.PI * 2;
          targetGroupRotationX = dragStartGroupRotationX + rotationAmount;
        }

        // ⚠️ [추가] ⭐️ Left-drag (좌클릭 드래그) 시 Y축 회전
        if (isLeftDragging) {
          const deltaX = e.clientX - leftDragStartX; // X 드래그 사용
          const rotationAmount = (deltaX / window.innerWidth) * Math.PI * 2;
          targetGroupRotationY = dragStartGroupRotationY + rotationAmount;
        }

        // (기존 Square3D의 Left-drag 로직: 스케일)
        if (isLeftDragging) {
          const deltaY = e.clientY - leftDragStartY;
          if (!leftDragMoved && Math.abs(deltaY) > 3) {
            leftDragMoved = true;
          }
          const ratio = THREE.MathUtils.clamp(
            -deltaY / (window.innerHeight * DRAG_SENSITIVITY),
            -1,
            1
          );
          const desiredScale =
            leftDragStartScale + ratio * (MAX_SCALE - MIN_SCALE);
          targetScale = THREE.MathUtils.clamp(
            desiredScale,
            MIN_SCALE,
            MAX_SCALE
          );
        }
      }
    };
    const handleMouseDown = (e) => {
      // ⚠️ [수정 3/4] ⭐️
      // interactive가 true일 때 (VisualSection)는 드래그 시작을 막습니다.
      if (interactiveRef.current) {
        return;
      }

      // interactive가 false일 때 (HeroSection) 드래그 로직이 실행됩니다.
      if (e.button === 2) {
        // Right Click (X축 회전)
        isRightDragging = true;
        rightDragStartY = e.clientY;
        dragStartGroupRotationX = objectGroup.rotation.x;
      }
      if (e.button === 0) {
        // Left Click (Y축 회전 및 스케일)
        isLeftDragging = true;
        leftDragStartY = e.clientY;
        leftDragStartX = e.clientX; // ⚠️ [추가] X 드래그 시작 위치 저장
        dragStartGroupRotationY = objectGroup.rotation.y; // ⚠️ [추가] Y회전 시작값 저장
        leftDragStartScale = targetScale;
        leftDragMoved = false;
      }
    };

    const handleMouseUp = (e) => {
      // ⚠️ [수정 4/4] ⭐️
      // interactive가 true일 때 (VisualSection)는 드래그 종료를 막습니다.
      if (interactiveRef.current) {
        return;
      }

      // interactive가 false일 때 (HeroSection) 드래그 로직이 실행됩니다.
      if (isRightDragging && e.button === 2) {
        isRightDragging = false;
      }
      if (isLeftDragging && e.button === 0) {
        isLeftDragging = false;
        if (leftDragMoved) {
          const suppressNextClick = (clickEvent) => {
            clickEvent.stopPropagation();
            clickEvent.preventDefault();
            window.removeEventListener("click", suppressNextClick, true);
          };
          window.addEventListener("click", suppressNextClick, true);
        }
        leftDragMoved = false;
      }
    };

    const handleContextMenu = (e) => {
      // 컨텍스트 메뉴는 항상 막습니다.
      if (containerRef.current && containerRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };

    // 이벤트 리스너는 항상 바인딩합니다.
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("contextmenu", handleContextMenu);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate); // 애니메이션 프레임 ID 저장

      // HeroSection에서 드래그 중이 아닐 때만 중앙으로 복귀/정지
      if (!interactiveRef.current && !isLeftDragging && !isRightDragging) {
        targetScale += (BASE_SCALE - targetScale) * 0.12;

        // ⚠️ [수정] ⭐️ (HeroSection일 때 호버 회전값도 복귀)
        targetX += (initialRotationX - targetX) * 0.08;
        targetY += (initialRotationY - targetY) * 0.08;
        targetZ += (initialRotationZ - targetZ) * 0.08;

        // ⚠️ [추가] ⭐️ (드래그 회전 복귀)
        targetGroupRotationX = initialRotationX;
        targetGroupRotationY = initialRotationY;
      }

      // ⚠️ [수정] ⭐️
      // 드래그 회전 업데이트 (HeroSection 전용)
      currentGroupRotationX +=
        (targetGroupRotationX - currentGroupRotationX) * 0.12;
      currentGroupRotationY +=
        (targetGroupRotationY - targetGroupRotationY) * 0.12; // ⚠️ [추가] Y축 업데이트

      raycaster.setFromCamera(mouse, camera); // Raycaster 업데이트

      const resolveLineLoop = (object) => {
        let current = object;
        while (current && !lineLoopSet.has(current)) {
          current = current.parent;
        }
        return current && lineLoopSet.has(current) ? current : null;
      };

      const intersects = raycaster.intersectObjects(objectGroup.children, true);
      const currentHits = new Set();
      if (intersects.length > 0) {
        let closestObj = null;
        let closestDistance = Infinity;
        intersects.forEach((hit) => {
          const lineLoop = resolveLineLoop(hit.object);
          if (!lineLoop) return;
          if (hit.distance < closestDistance) {
            closestDistance = hit.distance;
            closestObj = lineLoop;
          }
        });
        if (closestObj) {
          currentHits.add(closestObj);
        }
      }

      // 호버 로직 (항상 실행)
      currentHits.forEach((obj) => {
        startHoverRotation(obj);
      });

      activeRotations.forEach((missCount, obj) => {
        if (currentHits.has(obj)) {
          activeRotations.set(obj, 0);
        } else {
          const nextCount = missCount + 1;
          if (nextCount > EXIT_FRAME_THRESHOLD) {
            stopHoverRotation(obj);
          } else {
            activeRotations.set(obj, nextCount);
          }
        }
      });

      // (Line/Scale 값 업데이트는 항상 실행)
      currentLineCount += (targetLineCount - currentLineCount) * 0.12;
      const roundedCount = Math.round(currentLineCount);
      if (roundedCount !== lastAppliedLineCount) {
        applyLineVisibility(roundedCount);
      }

      currentScale += (targetScale - currentScale) * 0.12;
      objectGroup.scale.set(currentScale, currentScale, currentScale);

      // ⚠️ [수정] ⭐️ (그룹 회전 적용: 마우스 위치 따라 회전)
      if (interactiveRef.current) {
        // VisualSection(interactive=true)일 때: 그룹 회전을 초기값으로 고정 (요청 사항 반영)
        objectGroup.rotation.x = initialRotationX; 
        objectGroup.rotation.y = initialRotationY; // ⭐️ Y축 회전을 초기값으로 고정
        objectGroup.rotation.z = initialRotationZ;
      } else {
        // HeroSection(interactive=false)일 때: 드래그 회전(currentGroupRotationX/Y) 적용 및 마우스 Y축 회전 적용
        objectGroup.rotation.x = currentGroupRotationX;
        objectGroup.rotation.y = currentGroupRotationY; // Y축 드래그 적용
        objectGroup.rotation.z = initialRotationZ;
      }

      renderer.render(scene, camera); // 현재 장면을 카메라 시점에서 렌더링
    };

    animate(); // 애니메이션 실행 시작

    // ===== 창 크기 변경 시 반응형 처리 =====
    const handleResize = () => {
      if (!camera || !renderer) return;
      const { width, height } = getContainerSize();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // ===== 컴포넌트가 사라질 때 실행되는 정리 코드 =====
    return () => {
      cancelAnimationFrame(animationFrameId);

      // 이벤트 리스너 제거
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("contextmenu", handleContextMenu);

      window.removeEventListener("resize", handleResize);
      if (currentContainer && renderer.domElement) {
        currentContainer.removeChild(renderer.domElement);
      }
      if (geometry) geometry.dispose();
      if (baseMaterial) baseMaterial.dispose();
      activeRotations.forEach((_, obj) => stopHoverRotation(obj));
      activeRotations.clear();

      objectGroup.children.forEach((child) => {
        if (child.userData?.hoverTween) {
          child.userData.hoverTween.kill();
          child.userData.hoverTween = null;
        }
        if (child.material) child.material.dispose();
      });

      if (renderer) renderer.dispose();
    };
  }, []); // useEffect는 처음 렌더링될 때 한 번만 실행

  // ⚠️ [수정] ⭐️
  // (이 컴포넌트는 isZoomed prop을 사용하지 않으므로 관련 useEffect가 없습니다)

  // ===== three.js 캔버스를 표시할 HTML 요소 반환 =====
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "auto", // JS가 제어하므로 항상 'auto'
      }}
    />
  );
}