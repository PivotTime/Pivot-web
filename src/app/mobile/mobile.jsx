"use client";

import { useEffect, useState } from "react";
import { PIVOTTIME } from "../components/svgCode";
import Line3D from "../components/mainSections/3dKeyVisual/line3D";
import "../styles/mobile.scss";

const MOBILE_AUTO_ROTATE_SPEED = 0.003;

export default function Mobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const updateMatch = (event) => setIsMobile(event.matches);

    // 초기 상태 동기화
    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMatch);
    } else {
      mediaQuery.addListener(updateMatch);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", updateMatch);
      } else {
        mediaQuery.removeListener(updateMatch);
      }
    };
  }, []);

  const cameraDistance = isMobile ? 650 : 400;

  return (
    <div className="d-day">
      <div className="delight">2025 DELIGHT INSIGHT</div>
      <div className="logo">
        <PIVOTTIME />
      </div>
      <div className="object">
        <Line3D
          cameraDistance={cameraDistance}
          interactive={!isMobile}
          enableHover={!isMobile}
          autoRotate={isMobile}
          autoRotateSpeed={MOBILE_AUTO_ROTATE_SPEED}
        />
      </div>
      <div className="countDown" role="status" aria-live="polite">
        다양한 인터랙션 체험을 위해
        <br/> PC로 접속해주세요.
      </div>
      <div className="info">
        <p>
          Kaywon University of Arts & Design
          <br /> 32nd Delight Insight
        </p>
        <p>
          66 Kaywondaehangno, Uiwang-si, Gyeonggi-do, Korea
          <br /> ©2025. Delight Insight PIVOTTIME All Right Reserved.
        </p>
        <p>
          Kaywon Design Hall 5F
          <br /> Nov. 21. FRI - Nov. 23. SUN
        </p>
      </div>
    </div>
  );
}
