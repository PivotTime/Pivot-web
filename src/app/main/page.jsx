"use client";
import { useEffect, useRef, useState } from "react"; // 1. useRef 임포트 확인
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";


import "../../../styles/main.scss";

// import Nav from "../components/nav";
import HeroSection from "../../../components/mainSections/HeroSection";
import VideoSection from "../../../components/mainSections/VideoSection";
import KeywordsSection from "../../../components/mainSections/KeywordsSection";
import ConceptSection from "../../../components/mainSections/conceptSection";
import VisualSection from "../../../components/mainSections/VisualSection";
import TypographySection from "../../../components/mainSections/TypographySection";
import SloganSection from "../../../components/mainSections/SloganSection";
import MainFooterSection from "../../../components/mainSections/MainFooterSection";
import { Footer } from "../../../components/footer";
import WindowIntroWrapper from "../../../components/loading";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Main() {
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const topBtnRef = useRef(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return;
      const triggerTop = videoRef.current.getBoundingClientRect().top;
      const shouldShow = triggerTop <= window.innerHeight * 0.8;
      setShowTopBtn(shouldShow);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const scrollToHero = () => {
    if (!heroRef.current) return;
    const top = heroRef.current.getBoundingClientRect().top + window.scrollY;
    gsap.to(window, {
      scrollTo: { y: top, autoKill: true },
      duration: 1,
      ease: "power2.out",
    });
  };

  return (
        <WindowIntroWrapper
        children={
    <main ref={mainRef}>
      {showTopBtn && (
        <button className="topBtn" ref={topBtnRef} onClick={scrollToHero} aria-label="맨 위로">
          <svg viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="23.1929" cy="23.1929" r="22.6929" stroke="white" />
            <path d="M20.817 12.707H25.5717V17.4618H20.817V12.707Z" fill="white" />
            <path d="M11.3074 26.9725C11.3074 24.3466 13.4362 22.2178 16.0621 22.2178L16.0621 31.7273L11.3074 31.7273L11.3074 26.9725Z" fill="white" />
            <path d="M35.0813 26.9725C35.0813 24.3466 32.9525 22.2178 30.3265 22.2178L30.3265 31.7273L35.0813 31.7273L35.0813 26.9725Z" fill="white" />
            <path d="M20.8179 22.2178L16.0632 22.2178L16.0632 17.463L20.8179 17.463L20.8179 22.2178Z" fill="white" />
            <path d="M25.5717 22.2178L30.3265 22.2178L30.3265 17.463L25.5717 17.463L25.5717 22.2178Z" fill="white" />
          </svg>
        </button>
      )}
      <div>
        <section className="hero-section" ref={heroRef}>
          <HeroSection />
        </section>

        <section className="video-section" ref={videoRef}>
          <VideoSection />
        </section>

        <section className="keywords-section">
          <KeywordsSection />
        </section>

        <section className="concept-section">
          <ConceptSection />
        </section>

        <section className="visual-section">
          <VisualSection />
        </section>

        <section className="typography-section">
          <TypographySection />
        </section>

        <section className="slogan-section">
          <SloganSection />
        </section>

        <section className="footer-section">
          <MainFooterSection />
        </section>
      </div>
      <Footer/>
    </main>}/>
  );
}