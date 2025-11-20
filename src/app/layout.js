'use client';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "../../components/nav";
import MouseParticlesToggle from "../../components/MouseParticlesToggle";
import '../../styles/globals.scss';


const MOBILE_MAX_WIDTH = 768;

export default function Layout({ children }) {
  const pathname = usePathname();
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const handleChange = (event) => setIsMobileViewport(event.matches);

    setIsMobileViewport(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const shouldHideNav =
    pathname.startsWith("/goPivot") ||
    pathname.startsWith("/countDown") ||
    pathname.startsWith("/gfArchive-img") ||
    pathname.startsWith("/gfArchive-txt") ||
    pathname.startsWith("/mobile") ||
    isMobileViewport;

  const [mouseParticlesEnabled, setMouseParticlesEnabled] = useState(false);


  return (
    <html lang="ko">
      <body>
        {!shouldHideNav && (
          <MouseParticlesToggle enabled={mouseParticlesEnabled} />
        )}
        {!shouldHideNav && (
          <Nav setMouseParticlesEnabled={setMouseParticlesEnabled} />
        )}

        <div key={pathname}>{children}</div>
      </body>
    </html>
  );
}


