"use client";

import { useEffect, useState } from "react";

export function useWindowLoaded() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 이미 다 로딩된 상태라면 바로 true
    if (document.readyState === "complete") {
      setLoaded(true);
      return;
    }

    // 아직이면 load 이벤트 기다리기
    const handleLoad = () => {
      setLoaded(true);
    };

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return loaded;
}