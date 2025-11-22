"use client";

import "../../styles/mainSections/_slogan.scss";
import { useEffect, useRef } from "react";

export default function SloganSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const videoEl = videoRef.current;
    if (!sectionEl || !videoEl) return;

    // IntersectionObserver: 섹션이 30% 이상 보이면 재생, 아니면 일시정지/리셋
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.3) {
            // 보이기 시작하면 재생
            const playPromise = videoEl.play();
            if (playPromise && typeof playPromise.then === "function") {
              playPromise.catch(() => {});
            }
          } else {
            // 보이지 않으면 일시정지 후 처음으로
            videoEl.pause();
            videoEl.currentTime = 0;
          }
        });
      },
      { threshold: [0, 0.3, 1] }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mainSlogan" ref={sectionRef}>
      <div className="slogan-container">
        <div className="slogan-video">
          <video
            ref={videoRef}
            src="/videos/SloganVideo.mp4"
            muted
            playsInline
          />
        </div>
      </div>
    </div>
  );
}