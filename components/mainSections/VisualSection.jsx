"use client";
import { useEffect, useRef } from "react";
import "../../styles/mainSections/_visual.scss";
import { GOPIVOT } from "../svgCode";
import Line3D from "./3dKeyVisual/line3D";
import Circle3D from "./3dKeyVisual/circle3D";
import Square3D from "./3dKeyVisual/square3D";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// MotionPathPlugin은 더 이상 필요 없으므로 제거합니다.

export default function VisualSection() {
  const sectionRef = useRef(null);
  const objectsRef = useRef(null);
  const labelKorRef = useRef(null); // 1. 한글 라벨 Ref 추가
  const labelEngRef = useRef(null); // 2. 영문 라벨 Ref 추가
  const finalLabelsRef = useRef(null); // 최종 고정 라벨 컨테이너
  const graphicLabelsRef = useRef(null);

  const labelStateRef = useRef("line");
  const setLabelState = (state) => {
    if (labelStateRef.current === state) return;
    labelStateRef.current = state;
    if (graphicLabelsRef.current) {
      graphicLabelsRef.current.dataset.state = state;
    }
  };

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const objectsEl = objectsRef.current;
    if (!sectionEl || !objectsEl) return;
    setLabelState("line");

    // 섹션 페이드인을 위한 IntersectionObserver
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.8) {
            gsap.to(sectionEl, {
              opacity: 1,
              duration: 1,
              ease: "power2.out",
            });
          }
        });
      },
      { threshold: [0, 0.8, 1] }
    );

    // 초기 상태: 투명하게 설정
    gsap.set(sectionEl, { opacity: 0 });
    fadeObserver.observe(sectionEl);

    // 3. ScrollTrigger만 등록
    gsap.registerPlugin(ScrollTrigger);

    const line = objectsEl.querySelector(".line");
    const circle = objectsEl.querySelector(".circle");
    const square = objectsEl.querySelector(".square");
    const labelKor = labelKorRef.current; // 4. 라벨 element 가져오기
    const labelEng = labelEngRef.current; // 4. 라벨 element 가져오기
    const finalLabels = finalLabelsRef.current; // 최종 라벨 래퍼

    // --- 5. [수정] 초기 상태 설정 ---
    gsap.set(line, { autoAlpha: 1 });
    gsap.set(circle, { autoAlpha: 0 });
    gsap.set(square, { autoAlpha: 0 });
    // 라벨은 기본 텍스트("도전")로 보이게 설정
    gsap.set([labelKor, labelEng], { autoAlpha: 1 });
    // 최종 라벨은 처음엔 숨김
    if (finalLabels) {
      gsap.set(finalLabels, { autoAlpha: 0 });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: "top top",
        end: "+=4000", // 스크롤 길이
        scrub: 1,
        pin: true, // 섹션 고정
      },
    });

    // --- 6. [수정] 라벨 텍스트를 포함한 페이드인/아웃 타임라인 ---
    const fadeDuration = 0.8; // 교체(페이드)되는 시간 (스크롤 기준)
    const holdDuration = 5.0; // 각 위치에서 잠시 머무는 시간 (스크롤 기준)

    // 1. "Line" + "도전" 상태로 1초간 머뭄
    tl.to({}, { duration: holdDuration });

    // 2. "Line" + "도전" -> "Circle" + "창의성" 교체
    tl.addLabel("change1");
    // "Line"과 "도전" 라벨 동시 페이드 아웃
    tl.to(
      [line, labelKor, labelEng],
      {
        autoAlpha: 0,
        duration: fadeDuration,
      },
      "change1"
    );

    // 페이드 아웃 직후, 텍스트와 *위치*를 즉시 변경(set)
    tl.set(labelKor, {
      textContent: "창의성",
    });
    tl.set(
      labelEng,
      {
        textContent: "CREATIVITY",
      },
      "<"
    );

    // "Circle"과 "창의성" 라벨 동시 페이드 인
    tl.to([circle, labelKor, labelEng], {
      autoAlpha: 1,
      duration: fadeDuration,
    });

    // 3. "Circle" + "창의성" 상태로 1초간 머뭄
    tl.to({}, { duration: holdDuration });

    // 4. "Circle" + "창의성" -> "Square" + "균형" 교체
    tl.addLabel("change2");
    // "Circle"과 "창의성" 라벨 동시 페이드 아웃
    tl.to(
      [circle, labelKor, labelEng],
      {
        autoAlpha: 0,
        duration: fadeDuration,
      },
      "change2"
    );

    // 페이드 아웃 직후, 텍스트와 *위치*를 즉시 변경(set)
    tl.set(labelKor, {
      textContent: "균형",
    });
    tl.set(
      labelEng,
      {
        textContent: "BALANCE",
      },
      "<"
    );

    // "Square"와 "균형" 라벨 동시 페이드 인 (새 위치에서)
    tl.to([square, labelKor, labelEng], {
      autoAlpha: 1,
      duration: fadeDuration,
    });

    // 5. "Square" + "균형" 상태로 1초간 머뭄
    tl.to({}, { duration: 1.0 });

    // 6. 최종 단계: 사각형과 기존 라벨 먼저 페이드아웃 → 숨긴 상태에서 최종 위치/스케일 세팅 → 세 오브젝트 동시 페이드인
    tl.addLabel("final");
    tl.to(
      [labelKor, labelEng, square],
      { autoAlpha: 0, duration: fadeDuration },
      "final"
    );

    // 페이드인 전에 오브젝트 자체도 숨김 상태 보장
    tl.set([line, circle, square], { autoAlpha: 0 });
    // 세 오브젝트 동시 페이드인
    tl.to([line, circle, square], { autoAlpha: 1, duration: fadeDuration });
    tl.to([labelKor, labelEng], { autoAlpha: 0, duration: fadeDuration }, "<");
    if (finalLabels) {
      tl.to(finalLabels, { autoAlpha: 1, duration: fadeDuration }, "<");
    }


    const change1Progress = tl.labels.change1 / tl.duration();
    const change2Progress = tl.labels.change2 / tl.duration();
    const finalProgress = tl.labels.final / tl.duration();
    let isFinalActive = false;
    const updateLabelStateByProgress = (progress) => {
      if (progress < change1Progress - 0.001) {
        setLabelState("line");
      } else if (progress < change2Progress - 0.001) {
        setLabelState("circle");
      } else {
        setLabelState("square");
      }

      const shouldBeFinal = progress >= finalProgress - 0.001;
      if (shouldBeFinal && !isFinalActive) {
        isFinalActive = true;
        objectsEl.classList.add("no-interaction");
      } else if (!shouldBeFinal && isFinalActive) {
        isFinalActive = false;
        objectsEl.classList.remove("no-interaction");
      }
    };

    updateLabelStateByProgress(0);
    tl.eventCallback("onUpdate", () => {
      updateLabelStateByProgress(tl.progress());
    });

    return () => {
      fadeObserver.disconnect();
      if (objectsEl) {
        objectsEl.classList.remove("no-interaction");
      }
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, []); // useEffect 끝

  return (
    <div className="visual" ref={sectionRef}>

<img className="webImage" src="/images/visual.png" alt="visual.png" />

      <div className="txt-wrap">
        <div className="logo">
          <GOPIVOT />
        </div>
        <p>
          세 가지 원동력은 각자의 방향과 힘을 지닌 채 움직이며,
          <br /> 다양한 열정이 하나의 궤적을 이루는 순간을 표현합니다.
        </p>
      </div>

      <div className="graphic">
        <div className="graphic-objects" ref={objectsRef}>
          <div className="graphic-slot line">
            <div className="graphic-slot__inner">
              <Line3D />
            </div>
          </div>
          <div className="graphic-slot circle">
            <div className="graphic-slot__inner">
              <Circle3D interactive={true} isZoomed={false} />
            </div>
          </div>
          <div className="graphic-slot square">
            <div className="graphic-slot__inner">
              <Square3D
                interactive={true}
                cameraOverrides={{
                  interactive: { x: 300, y: 0, z: 800 },
                }}
              />
            </div>
          </div>
        </div>

        {/* 최종 상태에서만 보이는 새 라벨 세트 */}
        <div className="final-labels" ref={finalLabelsRef}>
          <div className="final-label planning">
            <div>기획</div>
            <svg
              viewBox="0 0 233 78"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.9">
                <circle
                  cx="3.33333"
                  cy="3.33333"
                  r="3.33333"
                  transform="matrix(1 0 0 -1 219.167 70.833)"
                  fill="currentColor"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="9.5"
                  transform="matrix(1 0 0 -1 212.5 77.5)"
                  stroke="currentColor"
                />
                <path
                  d="M222 67.5L155 0.500006L0 0.500183"
                  stroke="currentColor"
                  fill="transparent"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
            <p>PLANNING</p>
          </div>
          <div className="final-label design">
            <div>디자인</div>
            <svg
              viewBox="0 0 233 78"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.9">
                <circle
                  cx="3.33333"
                  cy="3.33333"
                  r="3.33333"
                  transform="matrix(1 0 0 -1 219.167 70.833)"
                  fill="currentColor"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="9.5"
                  transform="matrix(1 0 0 -1 212.5 77.5)"
                  stroke="currentColor"
                />
                <path
                  d="M222 67.5L155 0.500006L0 0.500183"
                  stroke="currentColor"
                  fill="transparent"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
            <p>DESIGN</p>
          </div>
          <div className="final-label programming">
            <div>프로그래밍</div>
            <svg
              viewBox="0 0 233 78"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.9">
                <circle
                  cx="3.33333"
                  cy="3.33333"
                  r="3.33333"
                  transform="matrix(1 0 0 -1 219.167 70.833)"
                  fill="currentColor"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="9.5"
                  transform="matrix(1 0 0 -1 212.5 77.5)"
                  stroke="currentColor"
                />
                <path
                  d="M222 67.5L155 0.500006L0 0.500183"
                  stroke="currentColor"
                  fill="transparent"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
            <p>PROGRAMMING</p>
          </div>
        </div>
      </div>

      <div className="graphic-labels" ref={graphicLabelsRef} data-state="line">
        <div className="label kor" ref={labelKorRef}>
          도전
        </div>
        <div className="label en" ref={labelEngRef}>
          CHALLENGE
        </div>
      </div>
    </div>
  );
}
