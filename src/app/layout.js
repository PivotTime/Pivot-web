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
  const [mouseParticlesEnabled, setMouseParticlesEnabled] = useState(false);

  return (
    <html lang="ko">
      <body>
        <MouseParticlesToggle enabled={mouseParticlesEnabled} />
       {!hideNavA && !hideNavB && (
  <Nav setMouseParticlesEnabled={setMouseParticlesEnabled} />
)}

        {children}
      </body>
    </html>
  );
}
