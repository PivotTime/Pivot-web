'use client';
import { usePathname } from "next/navigation";
import { useState } from "react";
import Nav from "../../components/nav";
import MouseParticlesToggle from "../../components/MouseParticlesToggle";
import '../../styles/globals.scss';
import { PageTransitionProvider, usePageTransition } from "./context/pageTransitionContext";

function LayoutContent({ children }) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/goPivot") || pathname.startsWith("/countDown")||pathname.startsWith("/gfArchive-img")||pathname.startsWith("/gfArchive-txt");
  
  const [mouseParticlesEnabled, setMouseParticlesEnabled] = useState(false);
  const { isTransitioning } = usePageTransition();

  return (
    <html lang="ko">
      <body className={isTransitioning ? "transitioning" : ""}>
        {!hideNav && <MouseParticlesToggle enabled={mouseParticlesEnabled} />}
        {!hideNav && (
          <Nav setMouseParticlesEnabled={setMouseParticlesEnabled} />
        )}

        <div key={pathname}>
          {children}
        </div>
      </body>
    </html>
  );
}

export default function Layout({ children }) {
  return (
    <PageTransitionProvider>
      <LayoutContent>{children}</LayoutContent>
    </PageTransitionProvider>
  );
}
