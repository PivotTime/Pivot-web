// "use client"와 GSAP, React 훅들을 import 합니다.
"use client";
import { GETFEVER2 } from "../svgCode";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // ScrollTrigger 플러그인 import
import "../../styles/mainSections/_concept.scss";

gsap.registerPlugin(ScrollTrigger); // ScrollTrigger 플러그인을 GSAP에 등록

export default function ConceptSection() {
  const sectionRef = useRef(null);
  const graphicTxtRef = useRef(null);
  const graphicTxtSecondaryRef = useRef(null);
  const orbitTextRef = useRef(null);
  const horizontalLineRef = useRef(null); // 가로선
  const radialGroupRef = useRef(null); // 방사형 선들을 담을 그룹

  const mainCircleRef = useRef(null); // 399px 크기 원
  const otherCirclesGroupRef = useRef(null); // 6개의 271px 원을 담을 그룹

  const frameRef = useRef(null); // <<<< [추가] 사각형 틀 Ref >>>>
  const frameTopEdgeRef = useRef(null);

  const descriptionRef = useRef(null);

  // SVG 그래픽의 기준점
  const center_x = 961;
  const center_y = 371.5;
  const horizontal_length = 1922;
  const numRadialLines = 12;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const conceptSection = sectionRef.current;
      const graphicTxt = graphicTxtRef.current;
      const graphicTxtSecondary = graphicTxtSecondaryRef.current;
      const orbitText = orbitTextRef.current;
      const horizontalLine = horizontalLineRef.current;
      const radialLines = gsap.utils.toArray(radialGroupRef.current.children);

      const mainCircle = mainCircleRef.current;
      const otherCircles = gsap.utils.toArray(
        otherCirclesGroupRef.current.children
      );

      // 바깥쪽 4개 원만 변수로 정의
      const outerCircles = [
        otherCircles[0],
        otherCircles[1],
        otherCircles[4],
        otherCircles[5],
      ];
      // const innerCircles = [otherCircles[2], otherCircles[3]]; // <- 이제 필요 없음

      // [5단계 로직을 위한 변수 정의]
      const verticalCircles = [
        // 5-3에서 나타날 2개 원 (T/B)
        otherCircles[0], // 0번 원을 Top으로 재사용
        otherCircles[1], // 1번 원을 Bottom으로 재사용
      ];
      const circleSpacing = 252.7; // 280 * 0.95 * 0.95
      const finalSpacing = 283.385; // 314 * 0.95 * 0.95 최종 간격

      // [8단계 이후 그리드 정렬을 위한 변수]
      const finalCircleSize = 216.8; // 그리드 정렬 기준 크기 (271 * 0.8)
      const final_frame_width = finalCircleSize * 4 * 0.8; // 271 * 4 * 0.8 = 867.2 (80%)
      const final_frame_height = finalCircleSize * 2 * 0.8; // 271 * 2 * 0.8 = 433.6 (80%)

      // --- [준비] ---
      // (모든 준비 로직 동일)
      gsap.set(horizontalLine, {
        strokeDasharray: horizontal_length,
        strokeDashoffset: horizontal_length,
        autoAlpha: 0,
      });
      gsap.set(radialLines, {
        rotation: 0,
        autoAlpha: 0,
        transformOrigin: "center center",
      });
      gsap.set(graphicTxt, { opacity: 0, y: 0 });
      if (graphicTxtSecondary) {
        gsap.set(graphicTxtSecondary, { opacity: 0 });
      }
      if (orbitText) {
        gsap.set(orbitText, { autoAlpha: 0 });
      }

      const mainCircleLength = mainCircle.getTotalLength();
      gsap.set(mainCircle, {
        strokeDasharray: mainCircleLength,
        strokeDashoffset: -mainCircleLength,
        fill: "none",
        autoAlpha: 0,
        scale: 1,
        transformOrigin: "center center",
      });
      gsap.set(otherCircles, {
        autoAlpha: 0,
        transformOrigin: "center center",
      });
      if (graphicTxt) {
        gsap.set(graphicTxt, { opacity: 0 });
      }
      if (graphicTxtSecondary) {
        gsap.set(graphicTxtSecondary, { opacity: 0 });
      }
      if (orbitText) {
        gsap.set(orbitText, { autoAlpha: 0 });
      }

      // --- [스토리텔링] ---
      const tl = gsap.timeline();

      // --- 1. 선 애니메이션 (정재생) ---

      // (동일)
      tl.to(horizontalLine, {
        autoAlpha: 1,
        strokeDashoffset: 0,
        duration: 2,
        ease: "power1.inOut",
      });

      tl.to(
        radialLines,
        {
          autoAlpha: 1,
          rotation: (i) => -(i + 1) * 9.74,
          duration: 2.5,
          ease: "power2.out",
          stagger: 0.1,
        },
        "-=0.5"
      );
      // --- 2. 선 애니메이션 (역재생) ---
      // (동일)
      tl.addLabel("linePauseStart");
      if (graphicTxt) {
        tl.to(
          graphicTxt,
          {
            x: "-=4vw",
            y: "+=0",
            duration: 8,
            ease: "power2.out",
          },
          "linePauseStart"
        );
        tl.fromTo(
          graphicTxt,
          { opacity: 0 },
          { opacity: 1, duration: 4, ease: "power2.out" },
          "linePauseStart"
        );
      }
      tl.to({}, { duration: 2 });
      if (graphicTxt) {
        tl.to(
          graphicTxt,
          { opacity: 0, duration: 1 },
          ">"
        );
      }
      tl.to(
        radialLines,
        {
          autoAlpha: 0,
          rotation: 0,
          duration: 3.5,
          ease: "power2.inOut",
          stagger: { each: 0.05, from: "end" },
        },
        "-=2.5"
      );
      tl.to(
        horizontalLine,
        {
          strokeDashoffset: horizontal_length,
          autoAlpha: 0,
          duration: 3,
          ease: "power1.inOut",
        },
        "-=2.0"
      );

      tl.to(
        mainCircle,
        {
          autoAlpha: 1,
          strokeDashoffset: 0,
          duration: 2.4, // 2 * 1.2
          ease: "none",
        },
        "-=0.5"
      );

      tl.to(mainCircle, {
        fill: "black",
        duration: 0.6, // 0.5 * 1.2
        ease: "none",
      });
      tl.to(mainCircle, {
        scale: 271 / 399,
        duration: 1.2, // 1 * 1.2
        ease: "power2.out",
      });

      // --- 4. [원 애니메이션 3] 7개 원 정렬 및 롤링 ---

      // 회전 시간 계산 변수 (모든 섹션에서 사용)
      const orbitRotationDuration = 5.4; // 회전 시간 (4.5 * 1.2)
      const orbitPauseDuration = 0.96; // 멈춤 시간 (0.8 * 1.2)
      const orbitFadeInDuration = 0.72; // 페이드인 시간 (0.6 * 1.2)
      const orbitFadeOutDuration = 3; // 페이드아웃 시간 (0.72 * 2 = 1.44초, 더 스르륵 사라지게)
      const circleAlignDuration = 3.0; // 원 정렬 시간 (2.5 * 1.2, stagger 포함)
      // 원 퍼지는 속도는 그대로 유지 (원래 값: 1.5초)
      const circleSpreadDuration = 1.8; // 벌어지는 시간 (1.5 * 1.2)
      // 바깥 원 사라지는 시간은 회전 시간에 맞춰 조정
      const totalOrbitTime = orbitFadeInDuration + orbitPauseDuration + orbitRotationDuration + orbitFadeOutDuration; // 6.5초
      const remainingTime = totalOrbitTime - circleAlignDuration - circleSpreadDuration; // 1.5초 (바깥 원 사라짐)
      const outerCircleFadeOutDuration = remainingTime; // 바깥 원 사라지는 시간

      // 4-1. 7개 원 정렬 (초기 간격, 좌우 동일하게) - 페이드인 효과
      tl.addLabel("circleSpreadHold"); // 레이블을 먼저 추가
      tl.fromTo(
        otherCircles,
        {
          autoAlpha: 0, // 시작: 투명
        },
        {
          autoAlpha: 1, // 끝: 보이기
          x: (i) => {
            if (i < 3) {
              return -circleSpacing * (3 - i); // 좌측: -circleSpacing * 3, -circleSpacing * 2, -circleSpacing * 1
            } else {
              return circleSpacing * (3 - (5 - i)); // 우측: circleSpacing * 1, circleSpacing * 2, circleSpacing * 3 (좌측과 동일한 패턴)
            }
          },
          duration: 2.4, // 2 * 1.2
        ease: "power2.inOut",
        stagger: 0.1,
        }
      );

      // [추가] 4-2. 6개 원이 모두 최종 간격으로 벌어짐 (좌우 동일하게)
      // 회전 시간에 맞춰 조정된 duration 사용
      tl.to(otherCircles, {
        x: (i) => {
          if (i < 3) {
            return -finalSpacing * (3 - i); // 좌측: -finalSpacing * 3, -finalSpacing * 2, -finalSpacing * 1
          } else {
            return finalSpacing * (3 - (5 - i)); // 우측: finalSpacing * 1, finalSpacing * 2, finalSpacing * 3 (좌측과 동일한 패턴)
          }
        },
        duration: circleSpreadDuration, // 회전 시간에 맞춰 조정된 벌어지는 시간
        ease: "power2.inOut",
      }, `circleSpreadHold+=${circleAlignDuration}`); // 원 정렬이 끝난 후 시작

      // 4-3. 원 그래픽 텍스트 나타남 및 회전 (벌어지는 애니메이션과 동시에 시작)
      if (orbitText) {
        // 현재 위치에서 메인 원의 중심까지의 반지름 계산
        const orbitTextX = center_x - 40; // 현재 x 위치
        const orbitTextY = center_y - 130; // 현재 y 위치
        const radius = Math.sqrt(
          Math.pow(orbitTextX - center_x, 2) + Math.pow(orbitTextY - center_y, 2)
        ); // 반지름 계산
        const startAngle = Math.atan2(orbitTextY - center_y, orbitTextX - center_x); // 시작 각도 (라디안)
        
        // 페이드인
        tl.to(
          orbitText,
          { autoAlpha: 1, duration: 0.72, ease: "power2.out" }, // 0.6 * 1.2
          "circleSpreadHold" // 벌어지는 애니메이션과 동시에 시작
        );
        
        // 텍스트가 뜬 후 멈춤 시간
        tl.to({}, { duration: 0.96 }, "circleSpreadHold+=0.72"); // 0.8 * 1.2, offset도 조정
        
        // 원의 둘레를 따라 360도 회전 (원들이 벌어지고 세 개만 남을 때까지)
        tl.to(
          { angle: 0 }, // 가상의 객체에 각도 저장
          {
            angle: 360,
            duration: orbitRotationDuration, // 회전 시간 (4.5초)
            ease: "none", // 일정한 속도로 회전
            onUpdate: function () {
              const currentAngle = startAngle + (this.targets()[0].angle * Math.PI) / 180;
              const x = center_x + radius * Math.cos(currentAngle);
              const y = center_y + radius * Math.sin(currentAngle);
              // SVG transform translate로 위치 설정 + 텍스트 자체도 360도 회전
              orbitText.setAttribute(
                "transform",
                `translate(${x} ${y}) rotate(${this.targets()[0].angle})`
              );
            },
          },
          `circleSpreadHold+=${orbitFadeInDuration + orbitPauseDuration}` // 페이드인 + 멈춤 후 시작
        );
        
        // 회전이 끝나자마자 페이드아웃
        tl.to(
          orbitText,
          { autoAlpha: 0, duration: orbitFadeOutDuration, ease: "power2.in" },
          `circleSpreadHold+=${orbitFadeInDuration + orbitPauseDuration + orbitRotationDuration}` // 회전이 끝난 직후
        );
      }

      // [수정] 4-4. 4개 바깥쪽 원만 프레임 아웃 (회전 시간에 맞춰 조정)
      tl.to(outerCircles, {
        autoAlpha: 0,
        rotation: (i) => (i < 2 ? -360 : 360),
        x: (i) => (i < 2 ? "-=1000" : "+=1000"),
        duration: outerCircleFadeOutDuration, // 회전 시간에 맞춰 조정된 바깥 원 사라지는 시간
        ease: "power1.in",
        stagger: 0.1,
      }, `circleSpreadHold+=${circleAlignDuration + circleSpreadDuration}`); // 원 정렬 + 벌어짐 후 시작

      // [삭제] 안쪽 원(innerCircles)을 따로 움직이는 로직 제거

      // --- 6. [새 원 2개를 좌우 원과 '완전히 겹치게' 만든 후 위/아래로 보낸다] ---

      const svgNS2 = "http://www.w3.org/2000/svg"; // SVG 요소 만들 때 필요한 네임스페이스를 다시 선언함
      const groupEl2 = otherCirclesGroupRef.current; // 기존 6개 원이 들어있는 <g> 요소를 가져옴

      let topClone = null; // 위로 올라갈 새 원을 담을 변수
      let bottomClone = null; // 아래로 내려갈 새 원을 담을 변수
      let middleClone = null; // 추가 스택 용도의 새 원
      let extraDropClones = []; // 최종 드롭 단계에서 사용할 추가 클론들

      if (groupEl2) {
        // 그룹이 실제로 존재할 때만 실행
        const createCircle2 = () => {
          const c = document.createElementNS(svgNS2, "circle"); // 새 <circle> SVG 요소를 하나 만듦
          c.setAttribute("cx", String(center_x)); // 중심 x좌표를 기존 원들과 동일하게 설정
          c.setAttribute("cy", String(center_y)); // 중심 y좌표를 기존 원들과 동일하게 설정
          c.setAttribute("r", "108"); // 반지름을 108로 설정해서 216px 원을 만듦 (271 * 0.8)
          c.setAttribute("transform", `rotate(-90 ${center_x} ${center_y})`); // 기존 원과 똑같이 -90도 회전시켜서 스타일을 맞춤
          c.setAttribute("fill", "black"); // 내부 색을 검정으로 설정
          c.setAttribute("stroke", "url(#paint0_linear_472_4801)"); // 외곽선에 그라데이션 스트로크를 넣음
          c.setAttribute("class", "__clone2"); // 나중에 정리할 수 있도록 클래스명을 붙여둠
          return c; // 만들어진 원을 반환
        };

        // 여기서 기준이 되는 좌우 원은 애니메이션 이후에도 남아 있는 애들(가운데 3개 중 좌/우)입니다.
        const leftBase = otherCircles[2]; // 왼쪽에 남아 있는 원을 가져옴
        const rightBase = otherCircles[3]; // 오른쪽에 남아 있는 원을 가져옴
        const centerBase = leftBase || rightBase; // 새 원을 삽입할 기준

        topClone = createCircle2(); // 위로 올릴 복제 원 하나를 생성
        bottomClone = createCircle2(); // 아래로 내릴 복제 원 하나를 생성
        middleClone = createCircle2(); // 추가 스택을 위한 복제 원
        const additionalClones = Array.from({ length: 3 }, () =>
          createCircle2()
        ); // 최종 그리드를 채우기 위한 추가 복제 원
        extraDropClones = additionalClones;

        // 기준 원 바로 앞에 넣어서 z순서를 비슷하게 맞춰줌
        if (leftBase) groupEl2.insertBefore(topClone, leftBase);
        else groupEl2.appendChild(topClone); // 왼쪽 기준 원 앞에 위 원을 끼워 넣음
        if (rightBase) groupEl2.insertBefore(bottomClone, rightBase);
        else groupEl2.appendChild(bottomClone); // 오른쪽 기준 원 앞에 아래 원을 끼워 넣음
        if (centerBase) groupEl2.insertBefore(middleClone, centerBase);
        else groupEl2.appendChild(middleClone);
        additionalClones.forEach((clone) => {
          groupEl2.appendChild(clone);
        });

        //    이미 위에서 otherCircles들을 -finalSpacing / +finalSpacing 으로 벌려놨으니까
        //    그대로 그 값을 써주면 겹쳐 보임
        gsap.set(topClone, {
          autoAlpha: 0, // 처음에는 안 보이게 숨김
          x: -finalSpacing, // 왼쪽 원과 똑같은 x 위치로 강제 지정
          y: 270, // 가운데 라인과 똑같은 y
          rotation: 0, // 시작할 때는 회전 0
          scale: 1, // 기존 원들과 동일한 초기 scale
          transformOrigin: "center center",
          svgOrigin: `${center_x} ${center_y}`, // 회전 기준을 SVG 전체 중앙으로 잡음
        });
        gsap.set(bottomClone, {
          autoAlpha: 0, // 처음에는 안 보이게 숨김
          x: finalSpacing, // 오른쪽 원과 똑같은 x 위치로 강제 지정
          y: 270, // 가운데 라인과 똑같은 y
          rotation: 0, // 시작할 때는 회전 0
          scale: 1, // 기존 원들과 동일한 초기 scale
          transformOrigin: "center center",
          svgOrigin: `${center_x} ${center_y}`, // 회전 기준을 SVG 전체 중앙으로 잡음
        });
        gsap.set(middleClone, {
          autoAlpha: 0,
          x: 0,
          y: 270,
          rotation: 0,
          scale: 1, // 기존 원들과 동일한 초기 scale
          transformOrigin: "center center",
          svgOrigin: `${center_x} ${center_y}`,
        });
        additionalClones.forEach((clone) => {
          gsap.set(clone, {
            autoAlpha: 0,
            x: 0,
            y: 270,
            rotation: 0,
            scale: 1, // 기존 원들과 동일한 초기 scale
            transformOrigin: "center center",
            svgOrigin: `${center_x} ${center_y}`,
          });
        });
      }

      // 두 개 원을 위/아래로 동시에 이동시키는 애니메이션
      // ... (이전 코드: SVG 요소 생성, gsap.set()으로 초기 위치 설정 부분은 그대로 유지) ...

      // 두 원이 실제로 만들어졌을 때만 실행
      if (topClone && bottomClone) {
        // 1. 페이드 인 (동일)
        tl.to([topClone, bottomClone], {
          autoAlpha: 1,
          duration: 0.36, // 0.3 * 1.2
        });

        // 2. X축 (수평 이동)과 Rotation은 부드럽게 진행 (Power1.inOut)
        tl.to(
          [topClone, bottomClone],
          {
            x: 0, // 중앙으로 이동
            rotation: (i) => (i === 0 ? -360 : 360), // 회전은 유지
            duration: 3.6, // 3 * 1.2
            ease: "power1.inOut", // X축 이동은 부드럽게 시작/종료
          },
          "<"
        );

        // 3. Y축 (수직 이동)을 2단계로 분리하여 중간 정점을 만듭니다 (더 큰 포물선)

        // TopClone의 Y축 이동 (시작 위치 Y=270, 최종 Y=-40)
        // 포물선 정점을 Y=150 (중앙선보다 아래)으로 설정하여 궤적을 깊게 함
        tl.to(
          topClone,
          {
            y: -100, // 수정: 중앙선(0)을 넘어 최종 목표보다 더 위로 솟아오르도록 설정
            duration: 1.8, // 1.5 * 1.2
            ease: "power1.out",
          },
          "<" // X축 이동과 동시에 시작
        );
        tl.to(
          topClone,
          {
            y: -40, // 최종 위치
            duration: 1.8, // 1.5 * 1.2
            ease: "power1.in",
          },
          "-=1.2" // 이전 Y축 트윈이 끝나는 시점과 동시에 시작 (이어지도록)
        );

        // BottomClone의 Y축 이동 (시작 위치 y=270, 최종 y=finalSpacing*1.85)
        // 정점: 최종 목표(약 580)보다 더 아래(800)로 파고들도록 설정
        // finalSpacing*1.85는 약 580px이므로, 800px은 더 아래입니다.
        tl.to(
          bottomClone,
          {
            y: 550, // 수정: 최종 목표보다 더 아래로 파고들도록 설정 (800px로 임의 설정)
            duration: 1.8, // 1.5 * 1.2
            ease: "power1.out",
          },
          "<-2" // TopClone 시작 시점에 맞춰 시작
        );
        tl.to(
          bottomClone,
          {
            y: 475, // 최종 위치
            duration: 1.8, // 1.5 * 1.2
            ease: "power1.in",
          },
          "-=1.2" // 이전 Y축 트윈이 끝나는 시점과 동시에 시작 (이어지도록)
        );
      }

      tl.to({}, { duration: 0.7 });

      // [6단계 계산]: 목표 크기(212px)에 도달하기 위한 최종 스케일 비율을 계산합니다.
      const mainCircleStartSize = 319.2; // 399 * 0.8
      const otherCircleStartSize = 216.8; // 271 * 0.8
      const targetSize = 169.6; // 212 * 0.8

      // 1. 중앙 원의 최종 스케일:
      //    (현재: 271/399) 에서 목표 크기(212px)로 축소해야 함. 최종 비율: 212/399
      const mainCircleFinalScale = targetSize / mainCircleStartSize;

      // 2. 나머지 4개 원의 최종 스케일:
      //    (현재: 1) 상태에서 목표 크기(212px)로 축소해야 함. 최종 비율: 212/271
      const otherCircleFinalScale = targetSize / otherCircleStartSize;

      // 1. 중앙 원 애니메이션 (기준)
      tl.to(
        mainCircle,
        {
          // scale: 현재 누적된 비율(271/399)에서 최종 목표 비율(212/399)로 축소
          scale: mainCircleFinalScale,
          y: "+=10",
          duration: 1.8, // 1.5 * 1.2
          ease: "back.out(3)",
        },
        // 5단계 끝난 후 즉시 시작 (">")
        ">"
      );

      // 2. 주변 원 애니메이션 (중앙 원의 중간 시점에 시작)
      const resizeTargets = [
        otherCircles[2],
        otherCircles[3],
        topClone,
        bottomClone,
        middleClone,
        ...extraDropClones,
      ].filter(Boolean);
      tl.to(
        resizeTargets,
        {
          // scale: 현재 scale: 1에서 otherCircleFinalScale 비율로 축소
          scale: otherCircleFinalScale,
          y: "+=10",
          duration: 1.8, // 1.5 * 1.2
          ease: "back.out(3)",
        },
        "<.6" // 중앙 원 애니메이션 시작 시점에서 0.6초 후 시작 (0.5 * 1.2)
      );

      // // 3. 완성된 형태를 잠깐 보여주기 위한 대기
      // tl.to({}, { duration: 1.0 });
      // --- 7. 중앙을 기준으로 네 원이 서서히 가까워지는 애니메이션 ---
      // 이동 거리값을 정의 (314px → 240px 정도로 줄이기)
      const compactSpacing = finalSpacing - 74; // 약 240px, 거리감을 줄일 목표 간격
      // 1. 상하좌우 원을 모두 모아 배열로 저장
      const surroundingCircles = [
        otherCircles[2], // 좌측 원
        otherCircles[3], // 우측 원
        topClone, // 위 원
        bottomClone, // 아래 원
      ];

      // 2. 네 원이 모두 중앙으로 서서히 이동 (거리가 줄어드는 모션)
      tl.to(
        surroundingCircles,
        {
          x: (i) => {
            const anchorX = Number(gsap.getProperty(mainCircle, "x")) || 0; // 중앙 원의 현재 x 좌표
            if (i === 0) return anchorX - compactSpacing; // 왼쪽 원은 중앙 기준 왼쪽으로
            if (i === 1) return anchorX + compactSpacing; // 오른쪽 원은 중앙 기준 오른쪽으로
            return anchorX; // 위/아래 원은 x 변화 없음(중앙 값 유지)
          },

          y: (i) => {
            const anchorY = 225 || 0; // 중앙 원의 현재 y 좌표
            // i에 따라 위/아래 방향 구분
            if (i === 2) return anchorY - compactSpacing; // 위 원은 중앙 기준 위로
            if (i === 3) return anchorY + compactSpacing; // 아래 원은 중앙 기준 아래로
            return anchorY; // 좌/우 원은 y 변화 없음(중앙 값 유지)
          },
          duration: 2.64, // 2.2 * 1.2
          ease: "power3.inOut", // 천천히 시작해서 천천히 멈추는 자연스러운 이징
        },
        "< 1.2" // 바로 이전 스케일 축소 애니메이션이 끝난 직후 실행 (1 * 1.2)
      );

      // 3. 마지막 형태 유지 (5개 원이 근접한 십자 형태로 고정)
      tl.to({}, { duration: 1.5 }); // 1초 동안 정지해 결과를 보여줌

      // --- 7. 십자 원들의 낙하 애니메이션 ---
      const frame = frameRef.current;
      const [upperLeftClone, upperRightClone, bottomRightClone] =
        extraDropClones;
      const dropElements = [
        upperLeftClone,
        mainCircle,
        upperRightClone,
        otherCircles[2],
        middleClone,
        otherCircles[3],
        topClone,
        bottomClone,
        bottomRightClone,
      ];

      if (frame && dropElements.every(Boolean)) {
        const stackCandidates = dropElements;
        // 7-1. 사각 프레임 초기 상태와 낙하 전 미세 흔들림 준비
        const frameWidth = 600; // 640 * 0.8
        const frameHeight = 420; // 422 * 0.8
        const frameFinalWidth = 1100; // 1120 * 0.8
        const frameScaleDuration = 1.5;
        const frameStartY = 760; // 화면 아래에서 살짝 숨김
        const frameReadyY = 200; // 원이 떨어지기 직전 고정될 위치
        const frameFinalY = frameReadyY; // 준비 위치를 최종 위치로 사용
        const hoverLift = -570; // 낙하 전 원들을 더 높이 들어 올림
        const wobbleDistance = 0; // 원이 아래로 출렁일 거리(10~20px 사이)

        gsap.set(frame, {
          autoAlpha: 0,
          x: 705,
          y: frameStartY,
          transformOrigin: "center center",
          scaleX: 1,
        });
        const topEdge = frameTopEdgeRef.current;
        if (topEdge) {
          gsap.set(topEdge, {
            opacity: 0,
            strokeDasharray: frameFinalWidth,
            strokeDashoffset: frameFinalWidth,
          });
        }

        const circleRadius = targetSize / 2;
        const frameHalfWidth = frameFinalWidth / 2;
        const edgeX = frameHalfWidth - circleRadius;
        
        // 9개 원의 낙하지점 X, Y 값을 각각 지정
        const circleDropPositions = [
          { x: edgeX * 0.44, y: 296 }, // 0번 원 5번
          { x: -edgeX * 0.79, y: 400 }, // 1번 원 2번
          { x: -edgeX * 0.55, y: 170 }, // 2번 원 6번
          { x: -edgeX * 0.3, y: 296 }, // 3번 원 3번
          { x: edgeX * 0.07, y: 296 },  // 4번 원 1번
          { x: edgeX * 0.81, y: 296 },   // 5번 원 4번
          { x: -edgeX * 0.115, y: 148 },   // 6번 원 7번
          { x: edgeX * 0.26, y: 148 },   // 7번 원 8번
          { x: edgeX * 0.63, y: 148 },   // 8번 원 9번
        ];
        
        const dropInterval = frameScaleDuration / dropElements.length;

        const dropSequence = dropElements.map((el, idx) => ({
          el,
          targetX: circleDropPositions[idx]?.x ?? 0,
          targetY: circleDropPositions[idx]?.y ?? 296,
          offset: idx * dropInterval,
        }));

        tl.addLabel("lift", ">");
        tl.to(
          stackCandidates,
          {
            y: `+=${hoverLift}`, // 위쪽으로 살짝 이동
            duration: 1.2, // 1 * 1.2
            ease: "power2.out",
          },
          "lift"
        );
        tl.addLabel("wobbleStart", "lift+=0.6"); // 0.5 * 1.2
        tl.to(
          middleClone,
          {
            autoAlpha: 1,
            duration: 0.36, // 0.3 * 1.2
            ease: "power1.out",
          },
          "lift+=0.24" // 0.2 * 1.2
        );

        const wobbleKeyframes = [
          { y: `+=${wobbleDistance}`, duration: 0.36, ease: "sine.in" }, // 0.3 * 1.2
          { y: `-=${wobbleDistance}`, duration: 0.3, ease: "sine.out" }, // 0.25 * 1.2
          { y: `+=${wobbleDistance * 0.5}`, duration: 0.24, ease: "sine.inOut" }, // 0.2 * 1.2
          { y: `-=${wobbleDistance * 0.5}`, duration: 0.24, ease: "sine.out" }, // 0.2 * 1.2
          { y: `+=${wobbleDistance * 0.2}`, duration: 0.216, ease: "sine.in" }, // 0.18 * 1.2
          { y: `-=${wobbleDistance * 0.2}`, duration: 0.216, ease: "sine.out" }, // 0.18 * 1.2
        ];

        // 중앙 → 좌우 → 상하 순으로 흔들림 확산
        tl.to(mainCircle, { keyframes: wobbleKeyframes }, "wobbleStart");
        tl.to(
          [otherCircles[2], otherCircles[3]],
          { keyframes: wobbleKeyframes },
          "wobbleStart+=0.144" // 0.12 * 1.2
        );
        tl.to(
          [
            topClone,
            bottomClone,
            middleClone,
            upperLeftClone,
            upperRightClone,
            bottomRightClone,
          ],
          { keyframes: wobbleKeyframes },
          "wobbleStart+=0.288" // 0.24 * 1.2
        );

        // 프레임이 살짝 떠올라 등장 (크기 변화 없이)
        tl.to(
          frame,
          {
            autoAlpha: 1,
            duration: 0.96, // 0.8 * 1.2
            ease: "power2.out",
            y: frameReadyY,
          },
          "lift+=0.24" // 0.2 * 1.2
        );

        // 프레임이 준비된 뒤 0.24초 뒤에 첫 낙하 시작
        tl.addLabel("frameReady", "wobbleStart+=0.78"); // 0.65 * 1.2
        tl.addLabel("fall", "frameReady+=0.24"); // 0.2 * 1.2

        const dropDuration = 1.26; // 1.05 * 1.2


        const circleTargets = new Map();
        dropElements.forEach((el, idx) => {
          circleTargets.set(el, {
            targetX: circleDropPositions[idx]?.x ?? 0,
            targetY: circleDropPositions[idx]?.y ?? 296,
          });
        });

        const dropSchedule = [
          { elements: [middleClone], offset: 0 },
          { elements: [mainCircle], offset: 0.288 }, // 0.24 * 1.2
          { elements: [otherCircles[2], otherCircles[3]], offset: 0.576 }, // 0.48 * 1.2
          { elements: [upperLeftClone, upperRightClone], offset: 0.888 }, // 0.74 * 1.2
          { elements: [topClone, bottomClone], offset: 1.2 }, // 1.0 * 1.2
          { elements: [bottomRightClone], offset: 1.464 }, // 1.22 * 1.2
        ];

        dropSchedule.forEach(({ elements, offset }) => {
          const group = (elements || []).filter(Boolean);
          group.forEach((el, idx) => {
            const startOffset = offset + idx * 0.06; // 0.05 * 1.2
            const startPoint = `fall+=${startOffset}`;
            const { targetX = 0, targetY = 296 } =
              circleTargets.get(el) || {};
            // 현재 위치에서 최종 낙하지점까지 한 번에 부드럽게 낙하
            const currentY = gsap.getProperty(el, "y");
            const currentX = gsap.getProperty(el, "x");

            // 위에서부터 최종 낙하지점까지 스르륵 한 번에 떨어지도록
            tl.to(
              el,
              {
                duration: dropDuration,
                ease: "power4.in",
                x: targetX,
                y: targetY,
                autoAlpha: 1,
              },
              startPoint
            );

            // settleKeyframes 제거 - 원들이 최종 위치에 도달하면 그대로 유지
          });
        });

        const lastPhase = dropSchedule[dropSchedule.length - 1];
        const lastPhaseSize = (lastPhase?.elements || []).filter(
          Boolean
        ).length;
        const lastDropStartOffset =
          (lastPhase?.offset || 0) + Math.max(0, (lastPhaseSize - 1) * 0.06); // 0.05 * 1.2
        const postDropDelay = 0.144; // 0.12 * 1.2
        const totalDropTime =
          lastDropStartOffset +
          dropDuration;
        const frameLiftDuration = totalDropTime;

        // 낙하와 동시에 프레임을 최종 위치로 이동
        tl.to(
          frame,
          {
            y: frameFinalY,
            duration: frameLiftDuration,
            ease: "power3.out",
          },
          "fall"
        );

        // 프레임 가로 확장 (640 -> 1120)
        tl.to(
          frame,
          {
            scaleX: frameFinalWidth / frameWidth,
            duration: frameScaleDuration,
            ease: "power3.inOut",
          },
          "fall"
        );

        // [프레임 윗변 그리기 로직 수정]
        if (frameTopEdgeRef.current) {
          // 1. 선의 투명도(opacity)를 나타나게 함
          tl.to(
            frameTopEdgeRef.current,
            {
              opacity: 1,
              duration: 1.8, // 1.5 * 1.2
              ease: "sine.out",
            },
            `fall+=${totalDropTime}`
          ); // 2. strokeDashoffset을 변경하여 오른쪽에서 왼쪽으로 선을 그음

          //    (초기 설정: offset: frameFinalWidth, offset을 0으로 줄이면 L->R 진행)
          //    (수정: offset을 -frameFinalWidth로 초기 설정하고 0으로 줄이면 R->L 진행)

          // 2-1. 초기 offset을 음수값으로 재설정하여 오른쪽 끝을 기준으로 만듭니다.
          gsap.set(frameTopEdgeRef.current, {
            strokeDashoffset: -frameFinalWidth,
          });

          tl.to(
            frameTopEdgeRef.current,
            {
              strokeDashoffset: 0, // <<<< 목표는 0으로 동일, 시작점만 음수 >>>>
              duration: 0.96, // 0.8 * 1.2
              ease: "power2.inOut",
            },
            `fall+=${totalDropTime + 0.12}` // 0.1 * 1.2
          );

        }

        // 7-4. [대기] 모든 원과 프레임이 안정된 후 잠시 상태를 보여줌
        const settleEnd = totalDropTime;
        const frameAnimationEnd = Math.max(
          frameLiftDuration,
          frameScaleDuration
        );
        const holdStart =
          Math.max(settleEnd, frameAnimationEnd) + postDropDelay;
        tl.to({}, { duration: 1.2 }, `fall+=${holdStart}`); // 1.0 * 1.2
        
        // 대기 시간 후 네모 그래픽 텍스트 페이드인 (타임라인에 추가하여 역재생 시에도 자동 제어)
        // 윗변 그리기 완료 시점: totalDropTime + 0.12 + 0.96
        // 대기 시간 시작: holdStart
        // 대기 시간 후: holdStart + 1.2
        const frameTopEdgeCompleteTime = totalDropTime + 0.12 + 0.96;
        const graphicTextFadeInTime = Math.max(holdStart + 1.2, frameTopEdgeCompleteTime);
        
        // "프로그래밍" 상태의 그래픽 텍스트를 타임라인에 추가
        // 주의: 텍스트 내용은 상태 변경 로직에서만 변경하고, 여기서는 페이드인만 처리
        if (graphicTxt && graphicTxtSecondary) {
          // 페이드인 전에 rotation을 0으로 미리 설정
          tl.set(
            [graphicTxt, graphicTxtSecondary],
            {
              rotation: 0,
            },
            `fall+=${graphicTextFadeInTime}`
          );
          
          // 페이드인 애니메이션 (rotation은 이미 0으로 설정됨)
          tl.to(
            [graphicTxt, graphicTxtSecondary],
            {
              opacity: 1,
              duration: 2,
              ease: "power2.out",
            },
            `fall+=${graphicTextFadeInTime}`
          );
        }
      }

      // --- [NEW] 8. 원들이 담긴 후 프레임 확장 ---
      // 이 단계는 현재 요청에서 제외되었으므로 나중을 위해 주석으로 남겨둡니다.
      /*
      tl.to(frame, {
        width: 500, // 목표 너비
        height: 300, // 목표 높이
        x: center_x - 250, // 너비의 절반만큼 왼쪽으로 이동하여 중앙 정렬 유지
        duration: 1.5,
        ease: "power3.inOut"
      }, ">");
      */

      // 3. 마지막 형태 유지 (5개 원이 근접한 십자 형태로 고정)
      tl.to({}, { duration: 1.0 }); // 1초 동안 정지해 결과를 보여줌

      // === 텍스트 동기화 로직 ===
      const sectionStates = [
        {
          name: "기획",
          sub: "사고의 궤적",
          desc: `아이디어의 출발점과 도착점을 잇는 선은 방향을 제시하고, 흐름을 만듭니다.<br/>
           선들이 모여 스토리라인이 되고, 그 안에서 연결과 구조가 생겨납니다.<br/>
           플로우차트처럼 서로 이어지는 선 위에서, 기획은 전체를 조율하는 길을 그립니다.`,
          progress: 0.1, // forward 진입
          exitProgress: 0, // 역재생 시 빠르게 복귀
          offsetX: "0",
        },
        {
          name: "디자인",
          sub: "감각의 순환",
          desc: `디자인은 모든 요소가 하나의 중심을 기준으로 균형을 이루는 과정입니다.<br/>
           원의 순환처럼, 시선과 감정은 끊임없이 돌고 흐르며 감각의 리듬을 형성합니다.<br/>
           이 순환 속에서 디자인은 단순한 형태를 넘어 완성된 조화의 세계로 확장됩니다.`,
          progress: 0.18, // forward 진입
          exitProgress: 0.35, // 역재생 시 조금 더 빠르게 종료
          offsetX: "-0.9vw",
        },
        {
          name: "프로그래밍",
          sub: "인터랙션의 틀",
          desc: `사각형은 그리드와 창을 상징하며, 각 요소 사이의 틀을 만듭니다.<br/>
           틀 안의 모든 요소는 정해진 규칙에 따라 배치되어 사용자와의 소통을 연결합니다.<br/>
           이 체계 속에서 프로그래밍은 구조의 언어로 생동하는 질서를 완성합니다.`,
          progress: 0.77, // forward 진입
          exitProgress: 0.88,
          offsetX: "0",
        },
      ];

      const graphicTextLayouts = {
        default: {
          primary: {
            text: "생각을 잇고, 방향을 만드는 시작의 선",
            x: "11vw",
            y: "46.4vh",
            rotation: 0,
          },
        },
        디자인: {
          primary: null,
        },
        프로그래밍: {
          primary: {
            text: "질서와 구조 속에서",
            x: "13.8vw",
            y: "49vh",
            rotation: 0,
          },
          secondary: {
            text: "인터랙션을 구현하는 사각형",
            x: "80vw",
            y: "49vh",
            rotation: 0,
          },
        },
      };

      const descEl = descriptionRef.current;
      const mainEl = descEl.querySelector(".main-title");
      const subEl = descEl.querySelector(".sub-title");
      const bodyEl = descEl.querySelector(".desc-text");
      const graphicTxtEl = graphicTxtRef.current;
      const lastStateRef = { current: null };
      let lastProgress = 0;

      if (graphicTxtEl) {
        gsap.set(graphicTxtEl, {
          transformOrigin: "left center",
          x: "9vw",
          y: "46.4vh",
          rotation: 0,
        });
      }

      const updateGraphicTextElement = (element, config, immediate = false) => {
        if (!element) return;
        if (!config) {
          // 이미 opacity가 0이면 애니메이션하지 않음 (깜빡임 방지)
          const currentOpacity = gsap.getProperty(element, "opacity") ?? 0;
          if (currentOpacity <= 0) {
            gsap.set(element, { opacity: 0 });
            return;
          }
          if (immediate) {
            gsap.set(element, { opacity: 0 });
          } else {
            gsap.to(element, { opacity: 0, duration: 0.4, ease: "power2.in" });
          }
          return;
        }

        const textNode = element.querySelector("p");
        if (textNode && typeof config.text === "string") {
          textNode.textContent = config.text;
        }

        const target = {
          x: config.x ?? 0,
          y: config.y ?? 0,
          rotation: config.rotation ?? 0,
          opacity: config.opacity ?? 1,
        };

        if (immediate) {
          gsap.set(element, target);
        } else {
          gsap.to(element, {
            ...target,
            duration: config.duration ?? 0.6,
            ease: config.ease ?? "power2.out",
          });
        }
      };

      const applyGraphicLayout = (stateName, immediate = false) => {
        const layout =
          graphicTextLayouts[stateName] || graphicTextLayouts.default;
        
        // "기획" 상태일 때는 텍스트 내용과 위치 복원 (opacity는 타임라인에서 제어)
        if (stateName === "기획") {
          const primaryConfig = layout.primary;
          
          // "질서와 구조 속에서" 텍스트가 페이드아웃되면서 rotation을 0으로 설정
          if (graphicTxtEl) {
            gsap.set(graphicTxtEl, {
              rotation: 0,
            });
          }
          if (graphicTxtSecondaryRef.current) {
            gsap.set(graphicTxtSecondaryRef.current, {
              rotation: 0,
            });
          }
          
          if (primaryConfig && graphicTxtEl) {
            const textNode = graphicTxtEl.querySelector("p");
            if (textNode && typeof primaryConfig.text === "string") {
              textNode.textContent = primaryConfig.text;
            }
            // 페이드아웃 후 깜빡임 방지: opacity를 현재 타임라인 상태에 맞게 유지
            const currentOpacity = gsap.getProperty(graphicTxtEl, "opacity") ?? 0;
            gsap.set(graphicTxtEl, {
              x: primaryConfig.x ?? 0,
              y: primaryConfig.y ?? 0,
              rotation: primaryConfig.rotation ?? 0,
              opacity: currentOpacity, // 현재 opacity 유지 (타임라인에서 제어)
              transformOrigin: "left center",
            });
          }
          
          // secondary는 기획 상태에서는 없음
          if (graphicTxtSecondaryRef.current) {
            const textNode = graphicTxtSecondaryRef.current.querySelector("p");
            if (textNode) {
              textNode.textContent = "";
            }
            gsap.set(graphicTxtSecondaryRef.current, {
              opacity: 0,
            });
          }
          return;
        }
        
        // "프로그래밍" 상태일 때는 텍스트 내용과 위치 설정 (페이드인은 타임라인에서 처리)
        if (stateName === "프로그래밍") {
          // 텍스트 내용과 위치만 설정 (opacity는 타임라인에서 제어)
          const primaryConfig = layout.primary;
          const secondaryConfig = layout.secondary;
          
          if (primaryConfig && graphicTxtEl) {
            const textNode = graphicTxtEl.querySelector("p");
            if (textNode && typeof primaryConfig.text === "string") {
              textNode.textContent = primaryConfig.text;
            }
            gsap.set(graphicTxtEl, {
              x: primaryConfig.x ?? 0,
              y: primaryConfig.y ?? 0,
              rotation: primaryConfig.rotation ?? 0,
              transformOrigin: "left center",
            });
          }
          
          if (secondaryConfig && graphicTxtSecondaryRef.current) {
            const textNode = graphicTxtSecondaryRef.current.querySelector("p");
            if (textNode && typeof secondaryConfig.text === "string") {
              textNode.textContent = secondaryConfig.text;
            }
            gsap.set(graphicTxtSecondaryRef.current, {
              x: secondaryConfig.x ?? 0,
              y: secondaryConfig.y ?? 0,
              rotation: secondaryConfig.rotation ?? 0,
              transformOrigin: "left center",
            });
          }
          return;
        }
        
        // "디자인" 상태일 때는 그래픽 텍스트 숨김
        updateGraphicTextElement(graphicTxtEl, null, immediate);
        updateGraphicTextElement(
          graphicTxtSecondaryRef.current,
          null,
          immediate
        );
      };

      const applyState = (state, immediate = false) => {
        if (!state) return;

        applyGraphicLayout(state.name, immediate);

        if (immediate) {
          mainEl.textContent = state.name;
          subEl.textContent = state.sub;
          bodyEl.innerHTML = state.desc;
          descEl.style.transform = `translateX(${state.offsetX ?? "0"})`;
          mainEl.style.opacity = "1";
          subEl.style.opacity = "0.8";
          bodyEl.style.opacity = "1";
          lastStateRef.current = state.name;
          return;
        }

          gsap.to([mainEl, subEl, bodyEl], {
            opacity: 0,
          duration: 0.6,
          ease: "power2.in",
            onComplete: () => {
            mainEl.textContent = state.name;
            subEl.textContent = state.sub;
            bodyEl.innerHTML = state.desc;
              gsap.to(descEl, {
              x: state.offsetX ?? "0vw",
                duration: 0.8,
                ease: "power2.out",
              });
            gsap.to(mainEl, {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            });
            gsap.to(subEl, {
              opacity: 0.8,
              duration: 0.6,
              ease: "power2.out",
            });
            gsap.to(bodyEl, {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            });
            },
          });

      };

      applyState(sectionStates[0], true);

      // 타임라인 진행도 기반으로 실시간 텍스트 변경
      tl.eventCallback("onUpdate", () => {
        const p = tl.progress();
        const goingForward = p >= lastProgress;
        lastProgress = p;

        const thresholdKey = goingForward ? "progress" : "exitProgress";
        const current =
          sectionStates.findLast(
            (s) => p >= (s[thresholdKey] ?? s.progress)
          ) || sectionStates[0];

        if (current && lastStateRef.current !== current.name) {
          lastStateRef.current = current.name;
          
          // 역재생 시에도 상태 변경 적용 (그래픽 텍스트는 타임라인에서 제어)
          applyState(current);
        }
      });

      // --- [ScrollTrigger 연동] ---
      // ... (ScrollTrigger end 값 조정 필요: end: "bottom+=9000" 등으로 늘려야 합니다)

      ScrollTrigger.create({
        trigger: conceptSection,
        start: "top top",
        end: "bottom+=9000",
        pin: true,
        scrub: 1,
        animation: tl,
        // markers: true,
      });
    }, sectionRef);

    return () => {
      // 동적으로 생성한 클론 원 정리
      const groupEl = otherCirclesGroupRef.current;
      if (groupEl) {
        const clones = Array.from(
          groupEl.querySelectorAll("circle.__clone, circle.__clone2")
        );
        clones.forEach((el) => el.parentNode && el.parentNode.removeChild(el));
      }
      ctx.revert();
    };
  }, []); // [] : 처음 마운트될 때 한 번만 실행

  return (
    <div className="concept" ref={sectionRef}>

      <div className="graphic">
        <svg
          viewBox="0 0 1922 743"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* --- 선 그래픽 --- */}
          <line
            ref={horizontalLineRef}
            x1="0"
            y1={center_y}
            x2={horizontal_length}
            y2={center_y}
            stroke="url(#paint0_linear_469_4682)"
            strokeWidth="1.5"
          />
          <g ref={radialGroupRef}>
            {Array.from({ length: numRadialLines }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={center_y}
                x2={horizontal_length}
                y2={center_y}
                stroke="url(#paint0_linear_469_4682)"
                strokeWidth="1"
                strokeOpacity="0.7"
              />
            ))}
          </g>
          {/* --- [SVG 순서: 6개 그룹이 먼저 그려져야 중앙 원 뒤로 숨음] --- */}
          {/* 6개 원 (먼저 그려져서 뒤에 깔림) */}
          <g ref={otherCirclesGroupRef}>
            {Array.from({ length: 6 }).map((_, i) => (
              <circle
                key={i}
                cx={center_x}
                cy={center_y}
                r="108" // 271/2 * 0.8
                transform={`rotate(-90 ${center_x} ${center_y})`}
                fill="black"
                stroke="url(#paint0_linear_472_4801)" // 271px 그라데이션
              />
            ))}
          </g>
          {/* 메인 원 (나중에 그려져서 "위에" 올라옴) */}
          <circle
            ref={mainCircleRef}
            cx={center_x}
            cy={center_y}
            r="159.2" // 399/2 * 0.8
            transform={`rotate(-90 ${center_x} ${center_y})`}
            fill="black"
            stroke="url(#paint0_linear_472_4801)"
          />
          {/* 원 둘레 SVG 텍스트 */}
          <g
            className="orbit-text"
            ref={orbitTextRef}
            transform={`translate(${center_x - 40} ${center_y - 130})`}
          >
            <path d="M26.1769 10.5995L16.2125 12.0666L16.0724 11.1133L20.4749 10.4641L20.0965 7.87505L21.251 7.70685L21.6293 10.2959L26.0418 9.64596L26.182 10.5992L26.1769 10.5995ZM25.1444 6.57795L24.8174 7.56035C23.012 7.48055 21.2383 6.695 20.3232 5.36476C19.8251 6.91985 18.3678 8.21578 16.695 8.80618L16.0874 7.95802C18.0647 7.31825 19.7173 5.51394 19.4719 3.84321L19.4558 3.74801L15.9177 4.26741L15.7776 3.31415L24.0528 2.09423L24.193 3.04749L20.6549 3.5669L20.6709 3.6621C20.9163 5.33283 23.0191 6.54342 25.1438 6.56786L25.1444 6.57795Z" fill="white"/>
            <path d="M29.3412 8.68576L29.2613 7.56671C28.0104 7.48271 27.1504 6.79206 27.0834 5.71778C26.9805 4.47359 27.9886 3.57529 29.56 3.46209C31.1164 3.34983 32.2524 4.09921 32.3549 5.33836C32.4216 6.40759 31.6506 7.22529 30.4268 7.49402L30.5029 8.55254C31.4746 8.44637 32.4485 8.29448 33.3543 8.10128L33.4885 8.95872C31.1407 9.56084 28.5658 9.75688 26.6829 9.88951L26.4316 8.93305C27.295 8.86907 28.2991 8.79632 29.3462 8.68544L29.3412 8.68576ZM32.7983 2.66266L26.2162 3.13395L26.1476 2.19648L28.8537 2.00238L28.7638 0.721937L29.9286 0.639158L30.0186 1.9196L32.7247 1.7255L32.7929 2.65793L32.7983 2.66266ZM28.1728 5.63971C28.2216 6.34045 28.8659 6.72557 29.7849 6.66319C30.7036 6.59576 31.2844 6.1241 31.2356 5.42336C31.1869 4.72262 30.541 4.31228 29.622 4.37466C28.7033 4.44209 28.1241 4.93896 28.1728 5.63971ZM34.9194 4.89487L36.5762 4.77634L36.6476 5.75921L34.9908 5.87774L35.3798 11.3065L34.215 11.3893L33.4266 0.365292L34.5914 0.282514L34.9194 4.89487Z" fill="white"/>
            <path d="M43.5088 3.48332C43.5036 4.85577 42.5213 5.8436 41.1276 6.0571L41.1209 7.80938C42.0968 7.76877 43.0757 7.69759 43.9865 7.58508L44.0714 8.46078C41.7462 8.85897 39.1798 8.86715 37.2721 8.84436L37.0911 7.88352C37.9432 7.881 38.9313 7.87507 39.9539 7.85686L39.9575 6.05414C38.5323 5.8443 37.562 4.84155 37.5772 3.46848C37.5711 1.91446 38.8155 0.844461 40.5455 0.84795C42.2404 0.853631 43.5077 1.92899 43.5038 3.48363L43.5088 3.48332ZM38.7119 3.46859C38.708 4.45616 39.4801 5.11178 40.5388 5.10651C41.5837 5.12235 42.3497 4.46699 42.3641 3.48383C42.353 2.49721 41.5915 1.85104 40.5466 1.8352C39.4882 1.84552 38.7109 2.48134 38.7119 3.46859ZM45.8311 4.6549L47.531 4.66027L47.527 5.64784L45.8322 5.64216L45.8171 11.2227L44.6469 11.2198L44.6733 0.160127L45.8384 0.163403L45.8261 4.65522L45.8311 4.6549Z" fill="white"/>
            <path d="M51.3963 6.80858L51.0225 5.82938C53.7085 5.3935 55.3869 4.16479 55.7703 2.47002L51.9087 2.0881L52.0003 1.13051L57.1203 1.63647C56.8324 4.45943 54.745 6.24529 51.3963 6.80858ZM59.1492 12.092L52.1315 11.4006L52.537 7.22856L59.5547 7.91995L59.1492 12.092ZM53.3867 10.5831L58.0907 11.0492L58.3121 8.77718L53.6034 8.31645L53.382 10.5884L53.3867 10.5831ZM59.9504 3.83459L61.5385 3.9887L61.4426 4.95669L59.8545 4.80258L59.5961 7.45155L58.434 7.33669L59.0402 1.12686L60.2022 1.24172L59.9501 3.82955L59.9504 3.83459Z" fill="white"/>
            <path d="M62.155 7.88938L61.8372 6.91682C64.5565 6.69152 66.3428 5.57759 66.8378 3.89106L63.0088 3.22356L63.1723 2.2868L68.2349 3.16596C67.7495 5.97592 65.5261 7.60317 62.1597 7.88402L62.155 7.88938ZM69.4754 13.9187L68.3231 13.7172L68.8603 10.6053L62.8391 9.55807L63.0025 8.62131L70.171 9.87037L69.4754 13.9187ZM70.8901 5.71421L72.4657 5.99062L72.2994 6.96299L70.7242 6.69163L70.2579 9.4042L69.1056 9.20266L70.2009 2.83068L71.3533 3.03222L70.8905 5.71925L70.8901 5.71421Z" fill="white"/>
            <path d="M78.6986 9.57673C78.1215 11.8861 76.5904 13.0499 75.0023 12.6528C73.3934 12.2468 72.6033 10.4936 73.1807 8.18928C73.7534 5.89031 75.2742 4.72207 76.883 5.12804C78.4664 5.53054 79.2717 7.28281 78.6986 9.57673ZM74.2771 8.46519C73.8535 10.1625 74.2677 11.3872 75.2568 11.6395C76.2355 11.8873 77.1738 11.0035 77.6025 9.30586C78.0218 7.61899 77.6075 6.39422 76.6288 6.14641C75.6401 5.89922 74.6964 6.77832 74.2771 8.46519ZM80.1095 16.5114L78.9773 16.2276L81.6608 5.4832L82.793 5.767L80.1095 16.5114Z" fill="white"/>
            <circle cx="5.57769" cy="9.95117" r="5" transform="rotate(-7.07394 5.57769 9.95117)" fill="#0051FF"/>
            <path d="M92.0678 21.8416L85.0597 18.6363L86.3823 15.7177L87.4424 16.2045L86.5093 18.2585L92.4572 20.977L92.0627 21.8415L92.0678 21.8416ZM94.8639 18.3891L90.8821 16.5696L90.0022 18.5087L88.952 18.0271L89.832 16.083L85.696 14.1888L86.0904 13.3243L95.2585 17.5195L94.8641 18.384L94.8639 18.3891ZM95.4515 15.6642L94.6546 16.3163C93.1893 15.3289 92.1591 13.8571 92.029 12.4333C90.8642 13.2986 89.0773 13.4758 87.3621 13.0128L87.3428 11.9861C89.3773 12.5633 91.5083 12.1169 92.1002 10.8125L92.2977 10.3726L93.3827 10.8702L93.1853 11.3101C92.6146 12.5695 93.673 14.5172 95.4465 15.664L95.4515 15.6642Z" fill="white"/>
            <path d="M101.42 26.8704L94.8303 23.2459L96.1554 20.8228L97.1784 21.3845L96.3124 22.9751L101.874 26.0326L101.42 26.8653L101.42 26.8704ZM98.0288 20.0108L98.3933 19.3376C97.3593 18.6139 96.9496 17.6936 97.3926 16.9011C97.8949 15.9533 99.1199 15.8934 100.505 16.6715C101.891 17.4193 102.498 18.4862 101.986 19.4286C101.553 20.2163 100.572 20.3735 99.4163 19.8994L99.0731 20.5276C99.9635 20.9545 100.875 21.3567 101.753 21.6772L101.441 22.4478C99.1692 21.7028 96.8243 20.4555 95.1355 19.5433L95.475 18.6622C96.2199 19.0703 97.0891 19.5422 98.0189 20.0055L98.0288 20.0108ZM103.512 17.8294L97.9402 14.7615L98.3521 14.0036L100.626 15.2541L101.133 14.3217L102.156 14.8834L101.649 15.8159L103.924 17.0664L103.512 17.8243L103.512 17.8294ZM98.3709 17.4364C98.1121 17.9151 98.4502 18.4797 99.2795 18.9355C100.099 19.3859 100.754 19.3671 101.013 18.8883C101.282 18.3897 100.949 17.8252 100.13 17.3748C99.3004 16.919 98.6454 16.9378 98.3709 17.4364ZM104.441 20.5118L105.821 21.2696L105.357 22.1223L103.976 21.3645L102.123 24.7651L101.1 24.2033L105.234 16.6244L106.257 17.1861L104.441 20.5118Z" fill="white"/>
            <path d="M120.799 31.1166L122.78 32.6226L124.343 30.5492L125.261 31.2498L118.598 40.0841L117.679 39.3835L120.378 35.8021L118.402 34.2962L117.376 35.6553L113.301 32.5596L117.651 26.7958L121.726 29.8915L120.799 31.1217L120.799 31.1166ZM114.787 32.5062L117.03 34.2109L120.265 29.9203L118.023 28.2156L114.787 32.5062ZM120.951 35.0381L122.197 33.3863L120.216 31.8803L118.97 33.5321L120.951 35.0381Z" fill="white"/>
            <path d="M129.373 48.2292C128.489 49.0313 127.014 48.4668 125.473 46.7396C123.906 45.0246 123.482 43.4943 124.367 42.6873C125.258 41.8758 126.715 42.4585 128.276 44.1831C129.829 45.8964 130.27 47.4133 129.374 48.2242L129.373 48.2292ZM125.183 43.5969C124.711 44.0301 125.062 44.9718 126.136 46.1406C127.166 47.2992 128.067 47.7455 128.538 47.3123C129.02 46.8752 128.647 45.9462 127.606 44.7966C126.543 43.6189 125.66 43.1592 125.178 43.5963L125.183 43.5969ZM130.291 42.6026C129.374 43.4212 128.073 43.1926 127.072 42.0883C126.068 40.9734 125.973 39.6598 126.881 38.83C127.789 38.0002 129.092 38.2138 130.102 39.3243C131.098 40.4279 131.19 41.7616 130.291 42.5976L130.291 42.6026ZM127.617 39.6438C127.089 40.1263 127.142 40.8448 127.73 41.4887C128.309 42.1263 129.033 42.267 129.569 41.7956C130.088 41.3069 130.028 40.5621 129.45 39.9194C128.862 39.2706 128.145 39.1561 127.618 39.6387L127.617 39.6438ZM132.522 41.251L128.363 36.6529L129.055 36.0217L130.786 37.9391L131.717 37.0915L132.493 37.9507L131.562 38.7982L133.213 40.6248L132.521 41.2561L132.522 41.251ZM130.819 46.8365L130.033 45.9712L131.078 45.0148L129.88 43.6891L130.578 43.0484L131.776 44.3742L132.678 43.5538L131.489 42.2392L132.187 41.5985L133.376 42.9131L135.277 41.1819L136.062 42.0473L130.814 46.8309L130.819 46.8365Z" fill="white"/>
            <path d="M139.058 48.5064L136.939 45.9783L135.433 47.2512L137.437 49.6382L136.733 50.2355L134.728 47.8485L132.951 49.353C133.915 50.4902 134.594 51.204 135.491 51.9809L134.819 52.6771C133.811 51.8355 133.082 51.0468 131.953 49.6986L131.479 49.1331L136.93 44.5226L139.773 47.9099L139.057 48.5165L139.058 48.5064ZM135.28 57.7992L134.562 56.9403L138.913 53.2602L138.06 52.2436L134.121 55.5766L133.403 54.7177L141.254 48.0799L141.972 48.9388L138.786 51.6328L139.644 52.6499L142.992 49.8219L143.711 50.6808L135.285 57.8046L135.28 57.7992Z" fill="white"/>
            <path d="M142.672 64.4408L139.09 59.0439L138.331 59.5491L142.101 65.2331L141.413 65.6909L136.994 59.0291L139.08 57.6331L142.671 63.0412L143.348 62.5873L139.754 57.1685L140.448 56.7013L144.683 63.0867L142.667 64.4352L142.672 64.4408ZM146.019 63.6983L140.434 55.2849L141.182 54.7835L146.768 63.1968L146.019 63.6983ZM148.049 60.8147L144.524 55.5007L143.83 55.9679L147.458 61.4366L146.776 61.895L142.506 55.4597L144.533 54.1023L148.054 59.4057L148.709 58.9695L145.175 53.6443L145.863 53.1865L150.041 59.4889L148.059 60.8159L148.049 60.8147Z" fill="white"/>
            <path d="M147.407 79.0302L143.931 72.3512L146.665 70.9129L147.206 71.9513L145.321 72.9396L148.258 78.5802L147.408 79.0252L147.407 79.0302ZM153.203 72.6289C152.208 73.1366 151.084 72.7662 150.316 71.7237L149.455 72.1774C149.949 73.0213 150.481 73.8548 151.024 74.598L150.302 75.0749C148.863 73.2165 147.628 70.9259 146.751 69.2423L147.533 68.6917C147.909 69.4285 148.361 70.2823 148.861 71.1676L149.765 70.694C149.319 69.4385 149.644 68.2629 150.66 67.7478C151.822 67.1242 153.135 67.7279 153.877 69.1596C154.625 70.5919 154.365 72.0104 153.203 72.6339L153.203 72.6289ZM153.544 75.3587L154.27 76.7577L153.399 77.2151L152.672 75.8161L149.306 77.5851L148.765 76.5467L156.229 72.6246L156.769 73.663L153.544 75.3587ZM151.169 68.7158C150.479 69.0644 150.338 69.9174 150.789 70.7812C151.244 71.6557 152.01 72.005 152.696 71.6458C153.405 71.2741 153.543 70.4461 153.088 69.5717C152.637 68.7079 151.873 68.3335 151.169 68.7158Z" fill="white"/>
            <path d="M153.422 88.0617C152.201 88.591 150.945 87.592 150.04 85.4564C149.113 83.3333 149.252 81.7156 150.472 81.1963C151.7 80.6527 152.964 81.663 153.875 83.7942C154.791 85.9261 154.649 87.5281 153.416 88.0661L153.422 88.0617ZM150.933 82.2601C150.255 82.5542 150.251 83.6034 150.89 85.0879C151.529 86.5723 152.289 87.2877 152.967 86.9936C153.666 86.692 153.682 85.6341 153.047 84.1503C152.413 82.6665 151.637 81.9542 150.938 82.2557L150.933 82.2601ZM155.864 84.1138L154.777 83.8859C154.701 82.597 155.125 81.4393 155.945 80.5573C154.598 80.6166 153.322 80.1246 152.354 79.0918L152.965 78.1418C154.212 79.5218 155.962 79.8817 157.488 79.2291L158.483 78.7979L158.939 79.861L157.992 80.273C156.567 80.8878 155.702 82.355 155.864 84.1138ZM155.622 87.0686L155.158 85.9941L158.196 84.6769L157.277 82.5343L158.159 82.1546L159.078 84.2972L161.133 83.4074L161.597 84.4819L155.627 87.0692L155.622 87.0686Z" fill="white"/>
            <path d="M158.609 94.5481C157.134 94.8874 155.853 94.0007 155.484 92.4661C155.134 90.9152 155.884 89.5443 157.357 89.194C158.819 88.8463 160.111 89.7304 160.472 91.2787C160.83 92.8159 160.069 94.1894 158.609 94.5481ZM160.748 96.7155L161.154 98.4456L160.207 98.67L159.801 96.9399L154.37 98.2311L154.107 97.1053L164.826 94.5571L165.09 95.6829L160.748 96.7155ZM157.611 90.2917C156.678 90.5037 156.214 91.3345 156.44 92.2439C156.645 93.1586 157.421 93.6832 158.357 93.4614C159.278 93.241 159.755 92.4186 159.539 91.5065C159.324 90.5945 158.534 90.0616 157.611 90.2917ZM161.996 94.2363L160.501 87.8652L161.432 87.6423L162.056 90.2955L163.589 89.9332L163.854 91.0748L162.321 91.4371L162.926 94.0183L161.995 94.2413L161.996 94.2363Z" fill="white"/>
            <path d="M156.468 108.957L155.252 101.286L158.443 100.773L158.626 101.932L156.381 102.293L157.413 108.805L156.468 108.957ZM160.859 109.347L159.275 99.3638L160.198 99.2169L161.782 109.201L160.859 109.347ZM162.972 107.829L161.78 100.32L165.493 99.7208L165.675 100.864L162.886 101.316L163.896 107.682L162.977 107.83L162.972 107.829Z" fill="white"/>
            <path d="M157.568 122.757L157.062 114.79L160.292 114.577L160.366 115.736L158.083 115.886L158.514 122.693L157.568 122.757ZM163.481 120.006L162.65 120.133C162.439 119.201 162.272 118.217 162.147 117.248L160 117.389L159.927 116.22L162.012 116.08C161.895 115.015 161.826 113.986 161.772 113.091L162.695 112.882C162.837 114.924 163.036 117.67 163.482 120.001L163.481 120.006ZM159.964 122.327L159.892 121.158L160.947 121.088L160.805 118.87L161.63 118.814L161.772 121.033L168.225 120.609L168.297 121.778L159.964 122.327ZM165.757 119.05C164.592 119.124 163.773 118.055 163.67 116.443C163.568 114.805 164.242 113.649 165.408 113.57C166.573 113.495 167.417 114.549 167.519 116.187C167.622 117.8 166.919 118.969 165.752 119.048L165.757 119.05ZM165.483 114.683C164.83 114.711 164.471 115.406 164.53 116.39C164.592 117.339 165.037 117.978 165.691 117.944C166.351 117.886 166.729 117.196 166.656 116.25C166.609 115.263 166.148 114.626 165.483 114.683Z" fill="white"/>
            <path d="M110.171 27.2711C109.319 28.5226 107.776 28.7424 106.463 27.8673C105.152 26.9672 104.771 25.4516 105.614 24.1938C106.45 22.9455 107.999 22.7163 109.315 23.607C110.623 24.4914 110.998 26.0165 110.171 27.2711ZM113.213 27.408L114.686 28.4014L114.144 29.2095L112.67 28.2161L109.563 32.8536L108.605 32.2066L114.738 23.0534L115.696 23.7004L113.213 27.408ZM106.546 24.8263C106.005 25.6162 106.23 26.5408 107.014 27.0543C107.785 27.5865 108.711 27.4437 109.247 26.645C109.773 25.8581 109.564 24.9305 108.786 24.4076C108.009 23.8848 107.067 24.0306 106.546 24.8263ZM112.444 24.7411L107.018 21.0824L107.55 20.2861L109.81 21.8087L110.688 20.5017L111.658 21.1593L110.78 22.4664L112.978 23.9493L112.446 24.7455L112.444 24.7411Z" fill="white"/>
          </g>
          <g ref={frameRef} opacity="0">
            <line
              className="frame-left"
              x1="0"
              y1="0"
              x2="0"
              y2="337.6"
              stroke="url(#concept_frame_gradient)"
              strokeWidth="1.5"
            />
            <line
              className="frame-right"
              x1="512"
              y1="0"
              x2="512"
              y2="337.6"
              stroke="url(#concept_frame_gradient)"
              strokeWidth="1.5"
            />
            <line
              className="frame-bottom"
              x1="0"
              y1="337.6"
              x2="512"
              y2="337.6"
              stroke="url(#concept_frame_gradient)"
              strokeWidth="1.5"
            />
            <line
              x1="0"
              y1="0"
              x2="512"
              y2="0"
              stroke="url(#concept_frame_gradient)"
              strokeWidth="1.5"
              strokeDasharray="512"
              strokeDashoffset="512"
              opacity="0"
              ref={frameTopEdgeRef}
            />
          </g>
          <defs>
            {/* ... (defs 태그 내부는 동일) ... */}
            <linearGradient
              id="paint0_linear_469_4682"
              x1="960"
              y1="0.5"
              x2="960"
              y2="1.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A4A4A4" stopOpacity="0.6" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient
              id="paint0_linear_472_4802"
              x1="199.5"
              y1="0"
              x2="199.5"
              y2="399"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A4A4A4" stopOpacity="0.6" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient
              id="paint0_linear_472_4801"
              x1="135.5"
              y1="0"
              x2="135.5"
              y2="271"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A4A4A4" stopOpacity="0.6" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
            </linearGradient>

            {/* --- 사각형 틀 그라데이션 (새로 추가) --- */}
            <linearGradient
              id="concept_frame_gradient"
              x1="320"
              y1="0"
              x2="320"
              y2="422"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A4A4A4" stopOpacity="0.6" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
            </linearGradient>
            <clipPath id="orbitTextClip">
              <rect width="184" height="116" fill="white" />
            </clipPath>
          </defs>
        </svg>

        <div className="txt txt--primary" ref={graphicTxtRef}>
          <div className="txt-dot"></div>
          <p>생각을 잇고, 방향을 만드는 시작의 선</p>
        </div>
        <div className="txt txt--secondary" ref={graphicTxtSecondaryRef}>
          <p>인터랙션을 구현하는 사각형</p>
        </div>
      </div>

      {/* 고정될 텍스트 영역 */}
      <div className="txt-wrap">
        <div className="logo">
          <GETFEVER2 />
        </div>

        <div className="description" ref={descriptionRef}>
          <div className="title">
            <div className="main-title"></div>
            <p className="sub-title"></p>
          </div>

          <p className="desc-text"></p>
        </div>
      </div>
    </div>
  );
}
