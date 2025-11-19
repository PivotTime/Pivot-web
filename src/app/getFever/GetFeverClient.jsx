// src/app/getFever/GetFeverClient.jsx
"use client"; // Next.js 클라이언트 컴포넌트 선언

import { useEffect, useRef, useState } from "react"; // React 훅 불러오기
import "../../../styles/getFever.scss"; // 스타일 시트 불러오기
import InfoBox from "../../../components/infoBox"; // 하단 고정 정보 박스 컴포넌트
import { GETFEVER2 } from "../../../components/svgCode"; // SVG 로고 컴포넌트 불러오기
import { gsap } from "gsap"; // GSAP 애니메이션 라이브러리
import { ScrollTrigger } from "gsap/ScrollTrigger"; // 스크롤 위치 기반 애니메이션 플러그인
import { ScrollToPlugin } from "gsap/ScrollToPlugin"; // 부드러운 스크롤 이동 플러그인
import { useRouter, useSearchParams } from "next/navigation";
import archiveResponses from "../../../lib/data/gpArchive.json";

// ScrollTrigger, ScrollToPlugin 플러그인 등록
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const TIMELINE_MARKS = [
  { label: "2023", className: "yearMarker-2023" },
  { label: "2024", className: "yearMarker-2024" },
  { label: "2025", className: "yearMarker-2025" },
];

const SEMESTERS = [
  {
    id: "01",
    title: "1학년 1학기",
    description: "낯설지만 설레는 첫걸음",
    angle: 0,
    tilt: 0,
    radiusFactor: 1.05,
    icon: (
      <svg
        viewBox="0 0 151 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        aria-hidden="true"
      >
        <path d="M116.763 0L127.959 0V78.3712H116.763V0Z" fill="#E1E1E1" />
        <path
          d="M105.567 33.5873C105.567 39.7706 100.554 44.7832 94.3711 44.7832L94.3711 22.3914L105.567 22.3914L105.567 33.5873Z"
          fill="#E1E1E1"
        />
        <path
          d="M139.155 89.5674C132.972 89.5674 127.959 84.5548 127.959 78.3715L150.351 78.3715L150.351 89.5674L139.155 89.5674Z"
          fill="#E1E1E1"
        />
        <path
          d="M105.567 89.5674C111.75 89.5674 116.763 84.5548 116.763 78.3715L94.371 78.3715L94.371 89.5674L105.567 89.5674Z"
          fill="#E1E1E1"
        />
        <path
          d="M116.763 22.3916L105.567 22.3916L105.567 11.1957L116.763 11.1957L116.763 22.3916Z"
          fill="#E1E1E1"
        />
        <path
          d="M0 22.3922C0 16.2089 5.01257 11.1963 11.1959 11.1963L11.1959 78.3716C5.01257 78.3716 0 73.3591 0 67.1757L0 22.3922Z"
          fill="#E1E1E1"
        />
        <path
          d="M55.9795 -4.89387e-07C62.1628 -2.19106e-07 67.1754 5.01257 67.1754 11.1959L11.1959 11.1959C11.1959 5.01257 16.2085 -2.22783e-06 22.3918 -1.95755e-06L55.9795 -4.89387e-07Z"
          fill="#E1E1E1"
        />
        <path
          d="M55.9794 89.5674C62.1627 89.5674 67.1753 84.5548 67.1753 78.3715L11.1958 78.3715C11.1958 84.5548 16.2084 89.5674 22.3917 89.5674L55.9794 89.5674Z"
          fill="#E1E1E1"
        />
        <path
          d="M78.3712 22.3918L67.1753 22.3918L67.1753 11.196C73.3586 11.196 78.3712 16.2085 78.3712 22.3918Z"
          fill="#E1E1E1"
        />
        <path
          d="M78.3712 22.3916L67.1753 22.3916L67.1753 78.3711C73.3586 78.3711 78.3712 73.3585 78.3712 67.1752L78.3712 22.3916Z"
          fill="#E1E1E1"
        />
      </svg>
    ),
  },
  {
    id: "02",
    title: "1학년 2학기",
    description: "관심 분야를 찾아가는 길",
    angle: 28,
    tilt: 0,
    radiusFactor: 1.09,
    icon: (
      <svg viewBox="0 0 170 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M169.907 22.3932C169.907 16.2098 164.895 11.1973 158.711 11.1973V33.589H169.907V22.3932Z"
          fill="#E1E1E1"
        />
        <path
          d="M113.928 0.00195281C107.744 0.00195298 102.732 5.01452 102.732 11.1978L158.711 11.1978C158.711 5.01452 153.699 0.0019517 147.515 0.00195187L113.928 0.00195281Z"
          fill="#E1E1E1"
        />
        <path
          d="M102.732 78.373L102.732 89.5689L169.908 89.5689L169.908 78.373L102.732 78.373Z"
          fill="#E1E1E1"
        />
        <path
          d="M125.124 33.5879L125.124 44.7838L158.712 44.7838L158.712 33.5879L125.124 33.5879Z"
          fill="#E1E1E1"
        />
        <path
          d="M113.928 44.7852C107.745 44.7852 102.732 49.7977 102.732 55.981L125.124 55.981L125.124 44.7852L113.928 44.7852Z"
          fill="#E1E1E1"
        />
        <path
          d="M91.5361 22.3926L102.732 22.3926L102.732 11.1967C96.5487 11.1967 91.5361 16.2093 91.5361 22.3926Z"
          fill="#E1E1E1"
        />
        <path
          d="M91.5366 78.373L102.733 78.373L102.733 55.9812C96.5492 55.9812 91.5366 60.9938 91.5366 67.1771L91.5366 78.373Z"
          fill="#E1E1E1"
        />
        <path
          d="M0 22.3932C0 16.2098 5.01257 11.1973 11.1959 11.1973V78.3726C5.01257 78.3726 0 73.36 0 67.1767V22.3932Z"
          fill="#E1E1E1"
        />
        <path
          d="M55.9792 -3.13541e-07C62.1625 -1.40377e-07 67.175 5.01257 67.175 11.1959L11.1956 11.1959C11.1956 5.01257 16.2082 -1.42733e-06 22.3915 -1.25416e-06L55.9792 -3.13541e-07Z"
          fill="#E1E1E1"
        />
        <path
          d="M55.9794 89.5684C62.1627 89.5684 67.1753 84.5558 67.1753 78.3725L11.1958 78.3725C11.1958 84.5558 16.2084 89.5684 22.3917 89.5684L55.9794 89.5684Z"
          fill="#E1E1E1"
        />
        <path
          d="M78.3711 22.3926L67.1752 22.3926L67.1752 11.1967C73.3585 11.1967 78.3711 16.2093 78.3711 22.3926Z"
          fill="#E1E1E1"
        />
        <path
          d="M78.3711 22.3926L67.1752 22.3926L67.1752 78.3721C73.3585 78.3721 78.3711 73.3595 78.3711 67.1762L78.3711 22.3926Z"
          fill="#E1E1E1"
        />
      </svg>
    ),
  },
  {
    id: "03",
    title: "2학년 1학기",
    description: "세부 전공에 몰입하는 시간",
    angle: 40,
    tilt: 0,
    radiusFactor: 1.0,
    icon: (
      <svg viewBox="0 0 170 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M169.908 22.3912C169.908 16.2079 164.895 11.1953 158.712 11.1953V33.5871H169.908V22.3912Z"
          fill="#E1E1E1"
        />
        <path
          d="M170 67.4727C170 73.5478 165.076 78.4727 159 78.4727V44.4727H170V67.4727Z"
          fill="#E1E1E1"
        />
        <path
          d="M113.928 -3.13541e-07C107.744 -1.40377e-07 102.732 5.01257 102.732 11.1959L158.711 11.1959C158.711 5.01257 153.699 -1.42733e-06 147.515 -1.25416e-06L113.928 -3.13541e-07Z"
          fill="#E1E1E1"
        />
        <path
          d="M103 78.4727C103 84.5478 107.925 89.4727 114 89.4727L148 89.4727C154.076 89.4727 159 84.5478 159 78.4727L103 78.4727Z"
          fill="#E1E1E1"
        />
        <path
          d="M114 33.4727L114 44.4727L159 44.4727L159 33.4727L114 33.4727Z"
          fill="#E1E1E1"
        />
        <path
          d="M91.5361 22.3906L102.732 22.3906L102.732 11.1947C96.5487 11.1947 91.5361 16.2073 91.5361 22.3906Z"
          fill="#E1E1E1"
        />
        <path
          d="M91.5366 55.9805L102.733 55.9805L102.733 78.3723C96.5492 78.3723 91.5366 73.3598 91.5366 67.1764L91.5366 55.9805Z"
          fill="#E1E1E1"
        />
        <path
          d="M0.000244141 22.3912C0.000244141 16.2079 5.01282 11.1953 11.1961 11.1953L11.1961 78.3707C5.01282 78.3707 0.000244141 73.3581 0.000244141 67.1748L0.000244141 22.3912Z"
          fill="#E1E1E1"
        />
        <path
          d="M55.9794 -3.13541e-07C62.1627 -1.40377e-07 67.1753 5.01257 67.1753 11.1959L11.1958 11.1959C11.1958 5.01257 16.2084 -1.42733e-06 22.3917 -1.25416e-06L55.9794 -3.13541e-07Z"
          fill="#E1E1E1"
        />
        <path
          d="M55.9794 89.5664C62.1627 89.5664 67.1753 84.5538 67.1753 78.3705L11.1958 78.3705C11.1958 84.5538 16.2084 89.5664 22.3917 89.5664L55.9794 89.5664Z"
          fill="#E1E1E1"
        />
        <path
          d="M78.3711 22.3906L67.1752 22.3906L67.1752 11.1947C73.3585 11.1947 78.3711 16.2073 78.3711 22.3906Z"
          fill="#E1E1E1"
        />
        <path
          d="M78.3711 22.3906L67.1752 22.3906L67.1752 78.3701C73.3585 78.3701 78.3711 73.3575 78.3711 67.1742L78.3711 22.3906Z"
          fill="#E1E1E1"
        />
      </svg>
    ),
  },
  {
    id: "04",
    title: "2학년 2학기",
    description: "졸업 작업으로 완성한 방향성",
    angle: 60,
    tilt: 0,
    radiusFactor: 1,
    icon: (
      <svg
        viewBox="0 0 170 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        aria-hidden="true"
      >
        <path
          d="M0 22.3912C0 16.2079 5.01257 11.1953 11.1959 11.1953V78.3707C5.01257 78.3707 0 73.3581 0 67.1748V22.3912Z"
          fill="#E1E1E1"
        />
        <path
          d="M55.9794 0C62.1627 0 67.1753 5.01257 67.1753 11.1959H11.1958C11.1958 5.01257 16.2084 0 22.3917 0H55.9794Z"
          fill="#E1E1E1"
        />
        <path
          d="M55.9794 89.5664C62.1627 89.5664 67.1753 84.5538 67.1753 78.3705H11.1958C11.1958 84.5538 16.2084 89.5664 22.3917 89.5664H55.9794Z"
          fill="#E1E1E1"
        />
        <path
          d="M78.3711 22.3906H67.1752V11.1947C73.3585 11.1947 78.3711 16.2073 78.3711 22.3906Z"
          fill="#E1E1E1"
        />
        <path
          d="M78.3711 22.3906H67.1752V78.3701C73.3585 78.3701 78.3711 73.3575 78.3711 67.1742V22.3906Z"
          fill="#E1E1E1"
        />
        <path
          d="M158.705 89.5614V0H147.51V55.974H169.901V67.1698H113.882C107.725 67.1698 102.731 62.1762 102.731 56.0188V0H91.5356V44.828C91.5361 50.9854 96.5292 55.979 102.687 55.979H147.515V89.5664H158.71L158.705 89.5614Z"
          fill="#E1E1E1"
        />
      </svg>
    ),
  },
];

const STEP_STYLES = [
  [
    { angle: -0.2, tilt: 0, radiusFactor: 1.05 },
    { angle: 27.85, tilt: 0, radiusFactor: 1.09 },
    { angle: 60, tilt: 0, radiusFactor: 1.0 },
    { angle: 90, tilt: 0, radiusFactor: 0.95 },
  ],
  [
    { angle: -6, tilt: 0, radiusFactor: 1.08 },
    { angle: 22.5, tilt: 0, radiusFactor: 1.065 },
    { angle: 50.1, tilt: 0, radiusFactor: 1.1 },
    { angle: 80, tilt: 0, radiusFactor: 0.95 },
  ],
  [
    { angle: -20, tilt: 0, radiusFactor: 1.02 },
    { angle: 16.7, tilt: 0, radiusFactor: 1.09 },
    { angle: 44.73, tilt: 0, radiusFactor: 1.075 },
    { angle: 72.4, tilt: 0, radiusFactor: 1.11 },
  ],
  [
    { angle: -30, tilt: 0, radiusFactor: 0.98 },
    { angle: 10, tilt: 0, radiusFactor: 1.02 },
    { angle: 39.6, tilt: 0, radiusFactor: 1.1 },
    { angle: 67.3, tilt: 0, radiusFactor: 1.09 },
  ],
];

const QUESTION_GROUPS = [
  {
    id: "1-1",
    label: "01",
    title: "다시 신입생이 된다면",
    subtitle: "나에게 해주고 싶은 말은?",
  },
  {
    id: "1-2",
    label: "02",
    title: "나만의 학교 적응",
    subtitle: "팁을 공유해주세요!",
  },
  {
    id: "2-1",
    label: "03",
    title: "첫 동기와 함께 했던",
    subtitle: "잊을 수 없는 추억은?",
  },
  {
    id: "2-2",
    label: "04",
    title: "가장 첫인상이 강렬했던",
    subtitle: "교수님 또는 친구는?",
  },
];

const SEMESTER_TO_GROUP = ["1-1", "1-2", "2-1", "2-2"];

function buildAnswersByGroup() {
  const grouped = QUESTION_GROUPS.reduce((acc, group) => {
    acc[group.id] = [];
    return acc;
  }, {});

  archiveResponses.forEach((person) => {
    person.answers.forEach((entry) => {
      const [key, value] = Object.entries(entry)[0];
      if (!key || !value) return;
      const [section, question] = key.split("-");
      if (!section || !question) return;
      const groupId = `${section}-${question}`;
      if (!grouped[groupId]) return;

      // "1-1", "1-2" → nickName01 / "2-1", "2-2" → nickName02
      const nickNameField =
        groupId === "1-1" || groupId === "1-2" ? "nickName01" : "nickName02";
      const nickName = person[nickNameField] || person.name;

      grouped[groupId].push({
        text: value,
        nicName: nickName,
        role: person.role || "",
      });
    });
  });

  return grouped;
}

const ANSWERS_BY_GROUP = buildAnswersByGroup();

export default function GetFeverClient() {
  const heroRef = useRef(null); // Hero 섹션 참조
  const archiveRef = useRef(null); // Archive 섹션 참조
  const [activeSemester, setActiveSemester] = useState(0); // 현재 활성 학기 상태 저장
  const itemsRef = useRef([]); // 타임라인 아이템 참조 배열
  const archiveObjectRef = useRef(null);
  const archiveTitleRef = useRef(null);
  const infoBoxRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const masterTimelineRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const skipHeroIntro = searchParams?.get("section") === "archive";
  const [selectedGroupId, setSelectedGroupId] = useState(SEMESTER_TO_GROUP[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    let heroScrollTween;

    if (!skipHeroIntro) {
      // 처음 방문 시: Hero → Archive 자동 스크롤 + 등장 애니메이션
      heroScrollTween = gsap.to(window, {
        scrollTo: { y: archiveRef.current, offsetY: 0 },
        duration: 1.4,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "bottom bottom",
          once: true,
        },
      });

      gsap.to(":root", {
        "--object-translate-x": "0%",
        "--title-block-translate-x": "0%",
        "--title-block-opacity": "1",
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: archiveRef.current,
          start: "top bottom",
          toggleActions: "play none none reverse",
        },
      });
    } else if (archiveRef.current) {
      // section=archive 로 들어온 경우: 애니메이션 없이 즉시 최종 상태
      gsap.set(":root", {
        "--object-translate-x": "0%",
        "--title-block-translate-x": "0%",
        "--title-block-opacity": "1",
      });
    }

    // --- 회전 타임라인 마스터 타임라인 구성 ---
    const masterTl = gsap.timeline();
    const animationDuration = 3;
    const pauseDuration = 5;
    const initialPauseDuration = 5;

    const items = gsap.utils.toArray(".semesterItem");
    if (items.length !== 4) {
      console.error("Semester items not found or not fully rendered.");
      return;
    }
    masterTimelineRef.current = masterTl;

    // Step 1 시작 전 빈 시간
    masterTl.to({}, { duration: initialPauseDuration });

    // 1단계
    masterTl.add("step1").to(":root", {
      "--archive-rotation": "-22.5deg",
      ease: "power3.inOut",
      duration: animationDuration,
    });
    masterTl.to({}, { duration: pauseDuration });

    // 2단계
    masterTl.add("step2").to(":root", {
      "--archive-rotation": "-45deg",
      ease: "power3.inOut",
      duration: animationDuration,
    });
    masterTl.to({}, { duration: pauseDuration });

    // 3단계
    masterTl.add("step3").to(":root", {
      "--archive-rotation": "-67.5deg",
      ease: "power3.inOut",
      duration: animationDuration,
    });
    masterTl.to({}, { duration: pauseDuration });

    // 4단계
    masterTl.add("step4").to(":root", {
      "--archive-rotation": "-90deg",
      ease: "power3.inOut",
      duration: animationDuration,
    });

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: archiveRef.current,
      pin: true,
      scrub: 0.8,
      end: "+=2000",
      animation: masterTl,
      onUpdate: (self) => {
        const progress = self.progress;
        const index = Math.min(
          SEMESTERS.length - 1,
          Math.floor(progress * SEMESTERS.length)
        );
        setActiveSemester(index);
      },
      // markers: true,
    });

    ScrollTrigger.refresh();

    if (skipHeroIntro && archiveRef.current) {
      setTimeout(() => {
        gsap.to(window, {
          scrollTo: { y: archiveRef.current, offsetY: 0 },
          duration: 0,
        });
        ScrollTrigger.refresh();
      }, 100);
    }

    return () => {
      heroScrollTween?.kill();
      scrollTriggerRef.current?.kill();
      masterTimelineRef.current?.kill();
    };
  }, [skipHeroIntro]);

  useEffect(() => {
    itemsRef.current.forEach((item, index) => {
      const target = STEP_STYLES[activeSemester]?.[index];
      if (!item || !target) return;

      gsap.to(item, {
        "--semester-angle": `${target.angle}deg`,
        "--semester-tilt": `${target.tilt}deg`,
        "--semester-radius-factor": target.radiusFactor ?? 1,
        duration: 0.6,
        ease: "power2.inOut",
      });
    });
  }, [activeSemester]);

  const handleSemesterClick = (index) => {
    setIsTransitioning(true);
    scrollTriggerRef.current?.disable(false);
    masterTimelineRef.current?.pause();

    const targetSemester = SEMESTERS[index];

    // transition 충돌 방지
    gsap.set(archiveTitleRef.current, { transition: "none" });
    gsap.set(archiveObjectRef.current, { transition: "none" });

    gsap
      .timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.set(archiveTitleRef.current, { transition: "" });
          gsap.set(archiveObjectRef.current, { transition: "" });
          router.push(`/gfArchive-txt?id=${targetSemester.id}`);
        },
      })
      .to(window, {
        scrollTo: { y: archiveRef.current, offsetY: 0 },
        duration: 0.6,
        ease: "power3.inOut",
      })
      .to(
        archiveObjectRef.current,
        {
          xPercent: -60,
          autoAlpha: 0.2,
          duration: 0.9,
          delay: 0.2,
        },
        "archiveFade"
      )
      .to(
        archiveTitleRef.current,
        {
          xPercent: -60,
          autoAlpha: 0,
          duration: 0.8,
          delay: 0.2,
        },
        "archiveFade"
      )
      .to(infoBoxRef.current, { autoAlpha: 0, duration: 0.6 }, "<");
  };

  return (
    <div className="getFever">
      {/* Hero 섹션 */}
      <section className="gF-hero" ref={heroRef}>
        <div className="hero-txt">
          <div className="logo">
            <GETFEVER2 />
          </div>
          <div className="slogan">
            입학부터 졸업까지, 열정 가득한 우리의 이야기를 확인해 보세요.
          </div>
        </div>

        <div className="hero-object">
          <div className="object-shell">
            <div className="orbit-layer">
              <div className="svg-container">
                <svg
                  viewBox="0 0 1876 1876"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5">
                    <path
                      d="M939.665 1874.12C1456.79 1873.32 1875.36 1453.46 1874.56 936.339C1873.77 419.213 1453.91 0.645529 936.781 1.44182C419.656 2.2381 1.0879 422.097 1.88419 939.223C2.68048 1456.35 422.539 1874.92 939.665 1874.12Z"
                      stroke="#E1E1E1"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M939.589 1721.44C1372.3 1720.77 1722.55 1369.45 1721.88 936.734C1721.21 504.019 1369.89 153.775 937.176 154.441C504.461 155.108 154.217 506.432 154.883 939.147C155.55 1371.86 506.874 1722.11 939.589 1721.44Z"
                      stroke="#E1E1E1"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M938.689 1240.43C1105.84 1240.17 1241.13 1104.46 1240.87 937.315C1240.61 770.166 1104.91 634.874 937.757 635.131C770.608 635.389 635.316 771.098 635.573 938.247C635.831 1105.4 771.54 1240.69 938.689 1240.43Z"
                      stroke="#E1E1E1"
                      strokeMiterlimit="10"
                    />
                    <path
                      opacity="0.9"
                      d="M939.064 1484.39C1240.95 1483.93 1485.3 1238.82 1484.83 936.939C1484.37 635.055 1239.26 390.707 937.381 391.172C635.497 391.637 391.149 636.739 391.614 938.623C392.079 1240.51 637.181 1484.85 939.064 1484.39Z"
                      stroke="#E1E1E1"
                      strokeMiterlimit="10"
                    />
                    <path
                      opacity="0.45"
                      d="M938.87 1358.05C1170.98 1357.69 1358.85 1169.24 1358.49 937.134C1358.14 705.025 1169.68 517.154 937.576 517.511C705.468 517.869 517.596 706.32 517.954 938.428C518.311 1170.54 706.762 1358.41 938.87 1358.05Z"
                      stroke="#E1E1E1"
                      strokeMiterlimit="10"
                    />
                    <path
                      opacity="0.5"
                      d="M1042.25 937.62L1874.56 936.339"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M833.162 938L1.4419 939.281"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M938.388 1041.81L939.67 1874.13"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M938.056 833.161L936.776 1.44729"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M1011.81 1011.14L1601.34 1598.85"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M864.038 863.837L275.108 276.718"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M864.575 1011.67L277.154 1600.9"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M1011.88 863.898L1599.29 274.671"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M841.732 977.932L73.7107 1297.44"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M1034.42 897.758L1802.73 578.129"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M898.502 1034.1L581.235 1803.4"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M978.062 841.16L1295.2 72.1698"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M978.153 1033.77L1297.87 1802.29"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M897.979 841.083L578.557 73.276"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M841.39 897.862L72.5997 580.805"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.5"
                      d="M1034.33 977.423L1803.83 1294.77"
                      stroke="#E1E1E1"
                    />
                    <path
                      d="M938.088 1041.81C995.705 1041.72 1042.34 994.942 1042.25 937.325C1042.16 879.708 995.384 833.072 937.767 833.161C880.15 833.249 833.514 880.029 833.603 937.646C833.691 995.263 880.471 1041.9 938.088 1041.81Z"
                      stroke="#E1E1E1"
                      strokeMiterlimit="10"
                    />
                  </g>
                </svg>
              </div>

              {TIMELINE_MARKS.map((mark) => (
                <div
                  className={`yearMarker ${mark.className}`}
                  key={mark.label}
                >
                  <span />
                  <p>{mark.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="scrollGuide">
          <p>SCROLL DOWN</p>
          <svg
            viewBox="0 0 20 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.553 0.55L9.525 9.578L18.497 0.55"
              stroke="white"
              strokeWidth="1.56"
            />
          </svg>
        </div>
      </section>

      {/* Archive Nav 섹션 */}
      <section className="archive-nav" ref={archiveRef}>
        <div className="archive-object" ref={archiveObjectRef}>
          <svg
            viewBox="0 0 1876 1876"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.5">
              <path
                d="M939.665 1874.12C1456.79 1873.32 1875.36 1453.46 1874.56 936.339C1873.77 419.213 1453.91 0.645529 936.781 1.44182C419.656 2.2381 1.0879 422.097 1.88419 939.223C2.68048 1456.35 422.539 1874.92 939.665 1874.12Z"
                stroke="#E1E1E1"
                strokeMiterlimit="10"
              />
              <path
                d="M939.589 1721.44C1372.3 1720.77 1722.55 1369.45 1721.88 936.734C1721.21 504.019 1369.89 153.775 937.176 154.441C504.461 155.108 154.217 506.432 154.883 939.147C155.55 1371.86 506.874 1722.11 939.589 1721.44Z"
                stroke="#E1E1E1"
                strokeMiterlimit="10"
              />
              <path
                d="M938.689 1240.43C1105.84 1240.17 1241.13 1104.46 1240.87 937.315C1240.61 770.166 1104.91 634.874 937.757 635.131C770.608 635.389 635.316 771.098 635.573 938.247C635.831 1105.4 771.54 1240.69 938.689 1240.43Z"
                stroke="#E1E1E1"
                strokeMiterlimit="10"
              />
              <path
                opacity="0.9"
                d="M939.064 1484.39C1240.95 1483.93 1485.3 1238.82 1484.83 936.939C1484.37 635.055 1239.26 390.707 937.381 391.172C635.497 391.637 391.149 636.739 391.614 938.623C392.079 1240.51 637.181 1484.85 939.064 1484.39Z"
                stroke="#E1E1E1"
                strokeMiterlimit="10"
              />
              <path
                opacity="0.45"
                d="M938.87 1358.05C1170.98 1357.69 1358.85 1169.24 1358.49 937.134C1358.14 705.025 1169.68 517.154 937.576 517.511C705.468 517.869 517.596 706.32 517.954 938.428C518.311 1170.54 706.762 1358.41 938.87 1358.05Z"
                stroke="#E1E1E1"
                strokeMiterlimit="10"
              />
              <path
                opacity="0.5"
                d="M1042.25 937.62L1874.56 936.339"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M833.162 938L1.4419 939.281"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M938.388 1041.81L939.67 1874.13"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M938.056 833.161L936.776 1.44729"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M1011.81 1011.14L1601.34 1598.85"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M864.038 863.837L275.108 276.718"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M864.575 1011.67L277.154 1600.9"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M1011.88 863.898L1599.29 274.671"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M841.732 977.932L73.7107 1297.44"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M1034.42 897.758L1802.73 578.129"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M898.502 1034.1L581.235 1803.4"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M978.062 841.16L1295.2 72.1698"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M978.153 1033.77L1297.87 1802.29"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M897.979 841.083L578.557 73.276"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M841.39 897.862L72.5997 580.805"
                stroke="#E1E1E1"
              />
              <path
                opacity="0.5"
                d="M1034.33 977.423L1803.83 1294.77"
                stroke="#E1E1E1"
              />
              <path
                d="M938.088 1041.81C995.705 1041.72 1042.34 994.942 1042.25 937.325C1042.16 879.708 995.384 833.072 937.767 833.161C880.15 833.249 833.514 880.029 833.603 937.646C833.691 995.263 880.471 1041.9 938.088 1041.81Z"
                stroke="#E1E1E1"
                strokeMiterlimit="10"
              />
            </g>
          </svg>
        </div>
        <div className="archive-title" ref={archiveTitleRef}>
          {SEMESTERS.map((semester, index) => {
            const initialStyles = STEP_STYLES[0]?.[index] || {
              angle: 0,
              tilt: 0,
              radiusFactor: 1,
            };

            return (
              <div
                key={semester.id}
                ref={(el) => (itemsRef.current[index] = el)}
                data-semester-id={semester.id}
                className={`semesterItem${
                  index === activeSemester ? " is-active" : ""
                }`}
                onClick={() => handleSemesterClick(index)}
                style={{
                  "--semester-angle": `${initialStyles.angle}deg`,
                  "--semester-tilt": `${initialStyles.tilt}deg`,
                  "--semester-radius-factor":
                    initialStyles.radiusFactor ?? 1,
                }}
              >
                <div className="semesterItem-content">
                  <span className="semesterItem-dot" />
                  <div className={`digit digit-${semester.id}`}>
                    {semester.icon}
                  </div>
                  <div className="txt">
                    <div className="txt-lines">
                      <div>{semester.title}</div>
                      <p>{semester.description}</p>
                    </div>
                    <svg
                      className="txt-arrow"
                      aria-hidden="true"
                      viewBox="0 0 45 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.2">
                        <path
                          d="M44.7837 22.3916L44.7837 33.5875L33.5879 33.5875L33.5879 22.3916L44.7837 22.3916Z"
                          fill="white"
                        />
                        <path
                          d="M11.1959 11.1963C5.01257 11.1963 3.10427e-06 6.18372 3.91511e-06 0.000398686L22.3918 0.000401622L22.3918 11.1963L11.1959 11.1963Z"
                          fill="white"
                        />
                        <path
                          d="M11.1959 44.7842C5.01257 44.7842 3.10427e-06 49.7968 3.91511e-06 55.9801L22.3918 55.9801L22.3918 44.7842L11.1959 44.7842Z"
                          fill="white"
                        />
                        <path
                          d="M22.3921 22.3926L22.3921 11.1967L33.588 11.1967L33.588 22.3926L22.3921 22.3926Z"
                          fill="white"
                        />
                        <path
                          d="M22.3921 33.5879L22.3921 44.7838L33.588 44.7838L33.588 33.5879L22.3921 33.5879Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div style={{ height: "1700px" }} />

      <InfoBox />
    </div>
  );
}
