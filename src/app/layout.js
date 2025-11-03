'use client';
import { usePathname } from "next/navigation";
import Nav from "../../components/nav";
import '../../styles/globals.scss';

export default function Layout({ children }) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/goPivot");

  return (
    <html lang="ko">
      <body>
        {!hideNav && <Nav />} 
        {children}
      </body>
    </html>
  );
}
