"use client";

import { useEffect, useState } from "react";
import Main from "./main/page";
import Mobile from "./mobile/page";

const MOBILE_MAX_WIDTH = 768;

export default function Home() {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);

    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  if (isMobile === null) {
    return null;
  }

  return isMobile ? <Mobile /> : <Main />;
}
