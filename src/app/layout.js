'use client';
import { usePathname } from "next/navigation";
import { useState } from "react";
import Nav from "../../components/nav";
import MouseParticlesToggle from "../../components/MouseParticlesToggle";
import '../../styles/globals.scss';

export default function Layout({ children }) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/goPivot") || pathname.startsWith("/countDown")||pathname.startsWith("/gpArchive-img")||pathname.startsWith("/gpArchive-txt");
  

  const [mouseParticlesEnabled, setMouseParticlesEnabled] = useState(false);

  return (
    <html lang="ko">
      <body>
        <MouseParticlesToggle enabled={mouseParticlesEnabled} />
       {!hideNav && (
  <Nav setMouseParticlesEnabled={setMouseParticlesEnabled} />
)}

        {children}
      </body>
    </html>
  );
}
