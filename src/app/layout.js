'use client';
import { usePathname } from "next/navigation";
import { useState } from "react";
import Nav from "../../components/nav";
import MouseParticlesToggle from "../../components/MouseParticlesToggle";
import '../../styles/globals.scss';

export default function Layout({ children }) {
  const pathname = usePathname();
  const hideNavA = pathname.startsWith("/goPivot");
  const hideNavB = pathname.startsWith("/countDown");
  const hideNavC = pathname.startsWith("/gpArchive");
  const [mouseParticlesEnabled, setMouseParticlesEnabled] = useState(false);

  return (
    <html lang="ko">
      <body>
        <MouseParticlesToggle enabled={mouseParticlesEnabled} />
       {!hideNavA && !hideNavB && !hideNavC && (
  <Nav setMouseParticlesEnabled={setMouseParticlesEnabled} />
)}

        {children}
      </body>
    </html>
  );
}
