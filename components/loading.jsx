"use client";

import { useEffect, useState } from "react";
import { useWindowLoaded } from "../src/hooks/windowLoaded";
import "../styles/loading.scss";
import Image from "next/image";

const LOADING_VIDEOS = [
  "/videos/LOADING_CIRCLE.webp",
  "/videos/LOADING_LINE.webp",
  "/videos/LOADING_SQUARE.webp",
];

export default function WindowIntroWrapper({ children, pageName }) {
  const windowLoaded = useWindowLoaded();
  const [showIntro, setShowIntro] = useState(true);
  const [progress, setProgress] = useState(0);

  // ✅ 서버/클라이언트 첫 렌더에서 동일하게 쓰는 고정 초기값
  const [videoSrc, setVideoSrc] = useState(LOADING_VIDEOS[0]);

  // ✅ 클라이언트에서만 랜덤 비디오 선택
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * LOADING_VIDEOS.length);
    const randomVideo = LOADING_VIDEOS[randomIndex];
    setVideoSrc(randomVideo);
  }, []);

  // Animate to 90% on mount
  useEffect(() => {
    const fastInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(fastInterval);
          return 90;
        }
        return prev + 3; // increment by 3 for speed
      });
    }, 15); // 30 * 15 = 450ms to reach ~90.

    return () => clearInterval(fastInterval);
  }, []);

  // When window is loaded, animate from 90 to 100
  useEffect(() => {
    if (windowLoaded) {
      const finalInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(finalInterval);
            // Hide the intro after a short delay
            setTimeout(() => setShowIntro(false), 200);
            return 100;
          }
          return prev + 1;
        });
      }, 60); // 10 * 20 = 200ms to reach 100 from 90.

      return () => {
        clearInterval(finalInterval);
      };
    }
  }, [windowLoaded]);

  return (
    <>
      <div
        style={{
          opacity: showIntro ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      >
        {children}
      </div>


      {showIntro && (
        <div className="loadingVideoBox">
            <Image
            alt="로딩 이미지"
            src={videoSrc}
            fill
            priority
            style={{ objectFit: "cover" }}
            />

          <p className="loadingPercentage">{`${pageName ? `${pageName} 불러오는 중` : `${progress}%` }`}</p>
          
        </div>
      )}
    </>
  );
}
