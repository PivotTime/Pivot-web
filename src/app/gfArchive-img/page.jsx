"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import responses from "../../../lib/data/gpArchive.json";
import "../../../styles/gpArchiveImg.scss";
gsap.registerPlugin(ScrollTrigger);

// 학기 ID와 이미지 폴더명 매핑
const SEMESTER_TO_FOLDER = {
  "01": "1-1", // 1학년 1학기 → 폴더 1-1
  "02": "1-2", // 1학년 2학기 → 폴더 1-2
  "03": "2-1", // 2학년 1학기 → 폴더 2-1
  "04": "2-2", // 2학년 2학기 → 폴더 2-2
};

const SEMESTER_COPY = {
  "01": {
    title: "1학년 1학기",
    description: "낯설지만 설레는 첫걸음",
  },
  "02": {
    title: "1학년 2학기",
    description: "관심 분야를 찾아가는 길",
  },
  "03": {
    title: "2학년 1학기",
    description: "세부 전공에 몰입하는 시간",
  },
  "04": {
    title: "2학년 2학기",
    description: "졸업 작업으로 완성한 방향성",
  },
};

// 해당 학기의 모든 닉네임과 role 정보 추출
function getNicNamesBySemester(semesterId) {
  const folderName = SEMESTER_TO_FOLDER[semesterId];
  if (!folderName) return new Map();

  const questionGroup = folderName; // "1-1", "1-2", "2-1", "2-2"
  const nicNameMap = new Map(); // Map<nicName, role>

  // semesterId에 따라 적절한 nickName 필드 선택
  // 01, 02 → nickName01 / 03, 04 → nickName02
  const nickNameField = (semesterId === "01" || semesterId === "02") ? "nickName01" : "nickName02";

  responses.forEach((res) => {
    const nickName = res[nickNameField];
    if (!nickName) return;
    
    // 해당 학기의 질문에 답변이 있는지 확인
    const hasAnswer = res.answers.some((entry) => {
      const [key] = Object.entries(entry)[0];
      return key && key.startsWith(questionGroup + "-");
    });

    if (hasAnswer) {
      nicNameMap.set(nickName, res.role || "default");
    }
  });

  // 디버깅: 개수 확인
  console.log(`[gfArchive-img] 학기 ${semesterId} (${folderName}): 총 ${nicNameMap.size}개의 고유 닉네임 발견`);

  return nicNameMap;
}

// 이미지 경로 생성
function getImagePath(folderName, nicName) {
  // 특수문자(# 등)만 선택적으로 인코딩 (공백은 유지)
  // # 문자는 URL fragment로 해석될 수 있으므로 %23으로 인코딩
  const encodedNicName = nicName.replace(/#/g, '%23');
  return `/images/${folderName} imges/${folderName} ${encodedNicName}.webp`;
}

function getRoleClass(role = "") {
  const lower = role.toLowerCase();
  if (lower.includes("plan")) return "roleBadge-planner";
  if (lower.includes("design")) return "roleBadge-designer";
  if (lower.includes("dev")) return "roleBadge-developer";
  return "roleBadge-default";
}

// 원형 레이아웃 위치 계산 (20개 이미지를 하단 반원에 배치)
// 이미지 자체는 회전하지 않고, x/y 좌표로 직접 배치
function calculateCirclePositions(count = 20, radius = 200) {
  const positions = [];
  const angleStep = (2 * Math.PI) / count;
  
  for (let i = 0; i < count; i++) {
    // 각 이미지의 초기 각도 (0도가 위쪽, 180도가 아래쪽)
    const angle = i * angleStep - Math.PI / 2; // 시작점을 위쪽으로
    const angleDeg = (angle * 180) / Math.PI;
    
    // x, y 좌표 계산 (이미지 자체는 회전하지 않음)
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    positions.push({ 
      angle: angleDeg, // 원 둘레 기준 각도 (archive-rotation과 합쳐져서 최종 위치 결정)
      radius: radius, // 원의 반지름 (vw 단위)
      x: x, // x 좌표 (vw 단위)
      y: y, // y 좌표 (vw 단위)
    });
  }
  
  return positions;
}

function getSemesterSVG(semesterId) {
  const svgMap = {
    "01": (
        <svg className="semester-svg-01"viewBox="0 0 151 90" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M116.763 0L127.959 0V78.3712H116.763V0Z" fill="#005CFF"/>
<path d="M105.567 33.5873C105.567 39.7706 100.554 44.7832 94.371 44.7832L94.371 22.3914L105.567 22.3914L105.567 33.5873Z" fill="#005CFF"/>
<path d="M139.155 89.5674C132.972 89.5674 127.959 84.5548 127.959 78.3715L150.351 78.3715L150.351 89.5674L139.155 89.5674Z" fill="#005CFF"/>
<path d="M105.567 89.5674C111.75 89.5674 116.763 84.5548 116.763 78.3715L94.3709 78.3715L94.3709 89.5674L105.567 89.5674Z" fill="#005CFF"/>
<path d="M116.763 22.3916L105.567 22.3916L105.567 11.1957L116.763 11.1957L116.763 22.3916Z" fill="#005CFF"/>
<path d="M0 22.3922C0 16.2089 5.01257 11.1963 11.1959 11.1963L11.1959 78.3716C5.01257 78.3716 0 73.3591 0 67.1757L0 22.3922Z" fill="#005CFF"/>
<path d="M55.9794 -4.89387e-07C62.1627 -2.19106e-07 67.1753 5.01257 67.1753 11.1959L11.1958 11.1959C11.1958 5.01257 16.2084 -2.22783e-06 22.3917 -1.95755e-06L55.9794 -4.89387e-07Z" fill="#005CFF"/>
<path d="M55.9794 89.5674C62.1627 89.5674 67.1753 84.5548 67.1753 78.3715L11.1958 78.3715C11.1958 84.5548 16.2084 89.5674 22.3917 89.5674L55.9794 89.5674Z" fill="#005CFF"/>
<path d="M78.3711 22.3916L67.1752 22.3916L67.1752 11.1957C73.3585 11.1957 78.3711 16.2083 78.3711 22.3916Z" fill="#005CFF"/>
<path d="M78.3711 22.3916L67.1752 22.3916L67.1752 78.3711C73.3585 78.3711 78.3711 73.3585 78.3711 67.1752L78.3711 22.3916Z" fill="#005CFF"/>
</svg>

    ),
    "02": (
        <svg viewBox="0 0 170 90" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M169.907 22.3932C169.907 16.2098 164.895 11.1973 158.711 11.1973V33.589H169.907V22.3932Z" fill="#005CFF"/>
<path d="M113.928 0.00195281C107.744 0.00195298 102.732 5.01452 102.732 11.1978L158.711 11.1978C158.711 5.01452 153.699 0.0019517 147.515 0.00195187L113.928 0.00195281Z" fill="#005CFF"/>
<path d="M102.732 78.373L102.732 89.5689L169.908 89.5689L169.908 78.373L102.732 78.373Z" fill="#005CFF"/>
<path d="M125.124 33.5879L125.124 44.7838L158.712 44.7838L158.712 33.5879L125.124 33.5879Z" fill="#005CFF"/>
<path d="M113.928 44.7852C107.745 44.7852 102.732 49.7977 102.732 55.981L125.124 55.981L125.124 44.7852L113.928 44.7852Z" fill="#005CFF"/>
<path d="M91.5361 22.3926L102.732 22.3926L102.732 11.1967C96.5487 11.1967 91.5361 16.2093 91.5361 22.3926Z" fill="#005CFF"/>
<path d="M91.5366 78.373L102.733 78.373L102.733 55.9812C96.5492 55.9812 91.5366 60.9938 91.5366 67.1771L91.5366 78.373Z" fill="#005CFF"/>
<path d="M0 22.3932C0 16.2098 5.01257 11.1973 11.1959 11.1973V78.3726C5.01257 78.3726 0 73.36 0 67.1767V22.3932Z" fill="#005CFF"/>
<path d="M55.9794 -3.13541e-07C62.1627 -1.40377e-07 67.1753 5.01257 67.1753 11.1959L11.1958 11.1959C11.1958 5.01257 16.2084 -1.42733e-06 22.3917 -1.25416e-06L55.9794 -3.13541e-07Z" fill="#005CFF"/>
<path d="M55.9794 89.5684C62.1627 89.5684 67.1753 84.5558 67.1753 78.3725L11.1958 78.3725C11.1958 84.5558 16.2084 89.5684 22.3917 89.5684L55.9794 89.5684Z" fill="#005CFF"/>
<path d="M78.3711 22.3926L67.1752 22.3926L67.1752 11.1967C73.3585 11.1967 78.3711 16.2093 78.3711 22.3926Z" fill="#005CFF"/>
<path d="M78.3711 22.3926L67.1752 22.3926L67.1752 78.3721C73.3585 78.3721 78.3711 73.3595 78.3711 67.1762L78.3711 22.3926Z" fill="#005CFF"/>
</svg>
    ),
    "03": (
        <svg viewBox="0 0 170 90" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M169.908 22.3912C169.908 16.2079 164.895 11.1953 158.712 11.1953V33.5871H169.908V22.3912Z" fill="#005CFF"/>
<path d="M170 67.4727C170 73.5478 165.076 78.4727 159 78.4727V44.4727H170V67.4727Z" fill="#005CFF"/>
<path d="M113.928 -3.13541e-07C107.744 -1.40377e-07 102.732 5.01257 102.732 11.1959L158.711 11.1959C158.711 5.01257 153.699 -1.42733e-06 147.515 -1.25416e-06L113.928 -3.13541e-07Z" fill="#005CFF"/>
<path d="M103 78.4727C103 84.5478 107.925 89.4727 114 89.4727L148 89.4727C154.076 89.4727 159 84.5478 159 78.4727L103 78.4727Z" fill="#005CFF"/>
<path d="M114 33.4727L114 44.4727L159 44.4727L159 33.4727L114 33.4727Z" fill="#005CFF"/>
<path d="M91.5361 22.3906L102.732 22.3906L102.732 11.1947C96.5487 11.1947 91.5361 16.2073 91.5361 22.3906Z" fill="#005CFF"/>
<path d="M91.5366 55.9805L102.733 55.9805L102.733 78.3723C96.5492 78.3723 91.5366 73.3598 91.5366 67.1764L91.5366 55.9805Z" fill="#005CFF"/>
<path d="M0 22.3912C0 16.2079 5.01257 11.1953 11.1959 11.1953L11.1959 78.3707C5.01257 78.3707 0 73.3581 0 67.1748L0 22.3912Z" fill="#005CFF"/>
<path d="M55.9794 -3.13541e-07C62.1627 -1.40377e-07 67.1753 5.01257 67.1753 11.1959L11.1958 11.1959C11.1958 5.01257 16.2084 -1.42733e-06 22.3917 -1.25416e-06L55.9794 -3.13541e-07Z" fill="#005CFF"/>
<path d="M55.9794 89.5664C62.1627 89.5664 67.1753 84.5538 67.1753 78.3705L11.1958 78.3705C11.1958 84.5538 16.2084 89.5664 22.3917 89.5664L55.9794 89.5664Z" fill="#005CFF"/>
<path d="M78.3711 22.3906L67.1752 22.3906L67.1752 11.1947C73.3585 11.1947 78.3711 16.2073 78.3711 22.3906Z" fill="#005CFF"/>
<path d="M78.3711 22.3906L67.1752 22.3906L67.1752 78.3701C73.3585 78.3701 78.3711 73.3575 78.3711 67.1742L78.3711 22.3906Z" fill="#005CFF"/>
</svg>

    ),
    "04": (
        <svg viewBox="0 0 170 90" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 22.3912C0 16.2079 5.01257 11.1953 11.1959 11.1953L11.1959 78.3707C5.01257 78.3707 0 73.3581 0 67.1748L0 22.3912Z" fill="#005CFF"/>
<path d="M55.9794 -3.13541e-07C62.1627 -1.40377e-07 67.1753 5.01257 67.1753 11.1959L11.1958 11.1959C11.1958 5.01257 16.2084 -1.42733e-06 22.3917 -1.25416e-06L55.9794 -3.13541e-07Z" fill="#005CFF"/>
<path d="M55.9794 89.5664C62.1627 89.5664 67.1753 84.5538 67.1753 78.3705L11.1958 78.3705C11.1958 84.5538 16.2084 89.5664 22.3917 89.5664L55.9794 89.5664Z" fill="#005CFF"/>
<path d="M78.3711 22.3906L67.1752 22.3906L67.1752 11.1947C73.3585 11.1947 78.3711 16.2073 78.3711 22.3906Z" fill="#005CFF"/>
<path d="M78.3711 22.3906L67.1752 22.3906L67.1752 78.3701C73.3585 78.3701 78.3711 73.3575 78.3711 67.1742L78.3711 22.3906Z" fill="#005CFF"/>
<path d="M158.705 89.5614V0H147.51V55.974H169.901V67.1698H113.882C107.725 67.1698 102.731 62.1762 102.731 56.0188V0H91.5356V44.828C91.5356 50.9854 96.5292 55.979 102.687 55.979H147.515V89.5664H158.71L158.705 89.5614Z" fill="#005CFF"/>
      </svg>
    ),
  };
  
  return svgMap[semesterId] || svgMap["01"];
}

const CIRCLE_IMAGES_COUNT = 120;
const BACKGROUND_IMAGES_COUNT = 240;

// 배열 셔플 함수
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Intersection Observer를 사용한 지연 로딩 이미지 컴포넌트
function LazyImage({ src, alt, className, style, onLoad, onError, nicName }) {
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // 뷰포트 밖 50px 전에 미리 로드
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div
      ref={imgRef}
      className={className}
      style={style}
    >
      {isInView && (
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: "cover" }}
          onLoad={() => {
            if (onLoad && nicName) {
              onLoad(nicName);
            }
          }}
          onError={() => {
            if (onError && nicName) {
              onError(nicName);
            }
          }}
          loading="lazy"
          unoptimized
        />
      )}
    </div>
  );
}

export default function GfArchiveImg() {
  const searchParams = useSearchParams();
  const semesterId = searchParams?.get("id") ?? "01";
  const semesterInfo = SEMESTER_COPY[semesterId] ?? SEMESTER_COPY["01"];
  const folderName = SEMESTER_TO_FOLDER[semesterId] ?? "1-1";
  
  const [searchNotFound, setSearchNotFound] = useState(false); // 검색 결과 없음 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [showLoadingScreen, setShowLoadingScreen] = useState(true); // 로딩 화면 표시 여부
  const [imageAspectRatios, setImageAspectRatios] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [shuffledCircleImages, setShuffledCircleImages] = useState([]);
  const [shuffledBackgroundImages, setShuffledBackgroundImages] = useState([]);
  const hasShuffledRef = useRef(false);
  
  const circleContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const backgroundImagesRef = useRef(null);
  const rotationTweenRef = useRef(null);
  const rotationProxyRef = useRef({ value: 0 });
  const backgroundAnimationsRef = useRef([]);
  const imageRefs = useRef([]);
  const searchInputRef = useRef(null);

  // 해당 학기의 모든 닉네임과 role 정보 가져오기
  const nicNameRoleMap = useMemo(() => {
    return getNicNamesBySemester(semesterId);
  }, [semesterId]);

  // 닉네임 목록만 추출
  const allNicNames = useMemo(() => {
    const names = Array.from(nicNameRoleMap.keys());
    console.log(`[gfArchive-img] 학기 ${semesterId}: 최종 ${names.length}개의 이미지 로드 예정`);
    return names;
  }, [nicNameRoleMap, semesterId]);

  // 이미지 로드 상태 관리
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [failedImages, setFailedImages] = useState(new Set());

  // 이미지 로드 핸들러
  const handleImageLoad = (nicName) => {
    setLoadedImages((prev) => {
      const newSet = new Set(prev).add(nicName);
      return newSet;
    });
  };

  const handleCircleImageLoad = (event, nicName) => {
    handleImageLoad(nicName);
    const target = event?.currentTarget;
    if (target?.naturalWidth && target?.naturalHeight) {
      const ratio = target.naturalWidth / target.naturalHeight;
      setImageAspectRatios((prev) => {
        if (prev[nicName]) return prev;
        return { ...prev, [nicName]: ratio || 1 };
      });
    }
  };

  const handleImageError = (nicName) => {
    setFailedImages((prev) => {
      const newSet = new Set(prev).add(nicName);
      return newSet;
    });
  };

  // 클라이언트에서만 실행
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 원형 이미지 목록 (최대 120) - 검색과 무관하게 항상 모든 이미지 표시, 랜덤 순서
  useEffect(() => {
    if (!isClient || allNicNames.length === 0 || hasShuffledRef.current) return;
    // 정말 한 번만 셔플 실행
    hasShuffledRef.current = true;
    const shuffled = shuffleArray([...allNicNames]);
    const selected = shuffled.slice(0, CIRCLE_IMAGES_COUNT);
    setShuffledCircleImages(selected);
  }, [allNicNames, isClient]);

  // failedImages 필터링은 렌더링 시점에만 처리 (셔플은 이미 완료됨)
  const circleImages = useMemo(() => {
    if (!isClient || shuffledCircleImages.length === 0) return [];
    return shuffledCircleImages.filter(
      (nicName) => !failedImages.has(nicName)
    );
  }, [shuffledCircleImages, failedImages.size, isClient]);

  // 배경 이미지들: 검색과 무관하게 항상 모든 이미지 표시 (240개), 랜덤 순서
  useEffect(() => {
    if (!isClient || allNicNames.length === 0 || shuffledCircleImages.length === 0) return;
    
    // 원형 이미지 셔플이 완료된 후에만 배경 이미지 셔플 실행 (한 번만)
    if (shuffledBackgroundImages.length > 0) return;
    
    // 원형 이미지와 다른 순서로 셔플
    const shuffled = shuffleArray([...allNicNames]);
    const allForBackground = shuffled.slice(0, BACKGROUND_IMAGES_COUNT);
    
    // 랜덤 배치를 위한 위치 정보 추가
    const backgroundImagesData = allForBackground.map((nicName) => ({
      nicName,
      top: Math.random() * 100, // 0% ~ 100%
      left: Math.random() * 100, // 0% ~ 100%
      rotation: 0, // 회전 없음
      scale: 0.25 + Math.random() * 0.35, // 0.25 ~ 0.6
      zIndex: Math.floor(Math.random() * 10) + 1, // 1 ~ 10 (3D 공간감)
      initialY: Math.random() * 100, // 초기 Y 위치 (플로우 애니메이션용)
    }));
    
    setShuffledBackgroundImages(backgroundImagesData);
  }, [allNicNames, shuffledCircleImages.length, shuffledBackgroundImages.length, isClient]);

  // failedImages 필터링은 렌더링 시점에만 처리 (셔플은 이미 완료됨)
  const backgroundImages = useMemo(() => {
    if (!isClient || shuffledBackgroundImages.length === 0) return [];
    return shuffledBackgroundImages.filter(
      (imageData) => !failedImages.has(imageData.nicName)
    );
  }, [shuffledBackgroundImages, failedImages.size, isClient]);

  // 표시할 배경 이미지 (점진적 로딩)
const displayedBackgroundImages = backgroundImages;

// 모든 이미지 로드 완료 확인 (셔플된 배열 기준으로 체크)
const allImagesLoaded = useMemo(() => {
  // 셔플이 완료되지 않았으면 false
  if (!isClient || shuffledCircleImages.length === 0 || shuffledBackgroundImages.length === 0) {
    return false;
  }

  const allCircleLoaded =
    shuffledCircleImages.length > 0 &&
    shuffledCircleImages.every(
      (nicName) => loadedImages.has(nicName) || failedImages.has(nicName)
    );

  const allBackgroundLoaded =
    shuffledBackgroundImages.length > 0 &&
    shuffledBackgroundImages.every(
      (imageData) =>
        loadedImages.has(imageData.nicName) || failedImages.has(imageData.nicName)
    );

  return allCircleLoaded && allBackgroundLoaded;
}, [shuffledCircleImages, shuffledBackgroundImages, loadedImages.size, failedImages.size, isClient]);

// 원형 위치 계산 (하단 반원) - 반지름을 크게 유지하여 거리감 확보
const circlePositions = useMemo(() => {
  const count = Math.max(circleImages.length, 1);
  return calculateCirclePositions(count, 700); // 반지름을 크게 유지하여 거리감 확보 (값을 키우면 이미지들이 더 멀어짐)
}, [circleImages.length]);

  // 회전 적용 헬퍼 (리렌더링 방지)
  const applyRotation = useCallback(
    (rotationDeg) => {
      if (!circleContainerRef.current || !imageRefs.current.length) return;
      
      rotationProxyRef.current.value = rotationDeg;

      // 각 이미지의 CSS 변수를 직접 업데이트하여 리렌더링 방지
      circleImages.forEach((nicName, index) => {
        const imageRef = imageRefs.current[index];
        const position = circlePositions[index];

        if (!imageRef || !position) return;

        const totalAngle = (position.angle + rotationDeg) * (Math.PI / 180);
        const rotatedX = Math.cos(totalAngle) * position.radius;
        const rotatedY = Math.sin(totalAngle) * position.radius;
        
        const baseAngle = position.angle + rotationDeg;
        const centerAngle = -90;
        const rotationAngle = baseAngle - centerAngle;

        const style = imageRef.style;
        style.setProperty("--rotated-x", `${rotatedX}vw`);
        style.setProperty("--rotated-y", `${rotatedY}vh`);
        style.setProperty("--rotation-angle", `${rotationAngle}deg`);
      });
    },
    [circleImages, circlePositions]
  );

  // 검색 시 해당 이미지를 화면 중앙 상단(-90도 위치, 위쪽)으로 회전
  const focusOnNic = useCallback(
    (query) => {
      if (!query.trim()) return false;
      const normalized = query.trim().toLowerCase();
      const targetIndex = circleImages.findIndex((nicName) =>
        nicName.toLowerCase().includes(normalized)
      );
      if (targetIndex === -1) {
        console.log(`[검색] "${query}"에 해당하는 이미지를 찾을 수 없습니다.`);
        setSearchNotFound(true);
        return false;
      }
      
      setSearchNotFound(false);
      
      const targetAngle = circlePositions[targetIndex]?.angle ?? 0;
      const currentRotationValue = rotationProxyRef.current.value;
      
      // 목표: 검색한 이미지를 화면 중앙 상단(-90도 위치, 위쪽)으로 이동
      // calculateCirclePositions에서 -90도가 위쪽이므로, 목표는 -90도
      // 현재: currentRotation + targetAngle = 실제 화면상 각도
      // 목표: 실제 화면상 각도 = -90도
      // 따라서: currentRotation + targetAngle = -90
      // targetRotation = -90 - targetAngle
      const targetRotation = -90 - targetAngle;

      console.log(`[검색] "${query}" → 인덱스: ${targetIndex}, 각도: ${targetAngle}도, 현재 회전: ${currentRotationValue}도, 목표 회전: ${targetRotation}도`);

      rotationTweenRef.current?.kill();
      const proxy = { value: currentRotationValue };
      rotationTweenRef.current = gsap.to(proxy, {
        value: targetRotation,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => {
          applyRotation(proxy.value);
        },
        onComplete: () => {
          rotationProxyRef.current.value = targetRotation;
        },
      });
      return true;
    },
    [circleImages, circlePositions, applyRotation]
  );

  const handleSearchInput = useCallback(() => {
    // 입력 시 검색 결과 없음 상태만 초기화 (재렌더링 최소화)
    if (searchNotFound) {
      setSearchNotFound(false);
    }
    // onChange에서는 검색 실행하지 않음, value는 ref로 직접 관리
  }, [searchNotFound]);

  const handleSearch = useCallback(() => {
    const query = searchInputRef.current?.value?.trim() || "";
    if (query) {
      const found = focusOnNic(query);
      if (!found) {
        // 검색 결과가 없으면 input value를 비우고 placeholder에 메시지 표시, 포커스 제거
        if (searchInputRef.current) {
          searchInputRef.current.value = "";
        }
        setSearchNotFound(true);
        // 포커스 제거하여 placeholder가 보이도록
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.blur();
          }
        }, 0);
      } else {
        setSearchNotFound(false);
      }
    }
  }, [focusOnNic]);

  const handleFocus = useCallback(() => {
    // 포커스 시 searchNotFound 상태만 초기화하여 placeholder가 사라지고 바로 입력 가능하게
    if (searchNotFound) {
      setSearchNotFound(false);
    }
  }, [searchNotFound]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  useEffect(() => {
    applyRotation(rotationProxyRef.current.value);
  }, [applyRotation, circleImages.length]);

  // 휠 이벤트 기반 원형 이미지 회전 애니메이션
  useEffect(() => {
    if (!circleContainerRef.current || circleImages.length === 0 || !allImagesLoaded) return;

    let isAnimating = false;

    // 휠 이벤트 핸들러
    const handleWheel = (e) => {
      e.preventDefault(); // 기본 스크롤 방지

      if (isAnimating) return;

      const delta = e.deltaY; // 휠 방향 (양수: 아래, 음수: 위)
      const rotationSpeed = 2; // 회전 속도 (조절 가능)

      // 현재 회전값 가져오기
      const currentRotation = rotationProxyRef.current.value;
      
      // 휠 아래로 내리면 반시계 방향 (음수 감소), 위로 올리면 시계 방향 (양수 증가) - 방향 반대
      const targetRotation = currentRotation + (delta > 0 ? -rotationSpeed : rotationSpeed);

      isAnimating = true;

      // GSAP로 부드럽게 회전
      gsap.to(rotationProxyRef.current, {
        value: targetRotation,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: () => {
          applyRotation(rotationProxyRef.current.value);
        },
        onComplete: () => {
          isAnimating = false;
        },
      });
    };

    // 휠 이벤트 리스너 추가
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [circleImages.length, applyRotation, allImagesLoaded]);

  // 로딩 완료 체크: 모든 이미지가 로드되면 로딩 화면 숨김
  useEffect(() => {
    if (allImagesLoaded && shuffledCircleImages.length > 0 && shuffledBackgroundImages.length > 0) {
      // 로딩 화면 페이드아웃
      setIsLoading(false);
      // 페이드아웃 애니메이션 후 로딩 화면 제거
      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [allImagesLoaded, shuffledCircleImages.length, shuffledBackgroundImages.length]);

  // 배경 이미지는 초기 로딩 시 모두 표시

  // 배경 이미지 플로우 애니메이션 (위로 천천히 흐르는 모션)
  useEffect(() => {
    if (!backgroundImagesRef.current || displayedBackgroundImages.length === 0 || !allImagesLoaded) return;

    // 기존 애니메이션 정리
    backgroundAnimationsRef.current.forEach((anim) => {
      if (anim) anim.kill();
    });
    backgroundAnimationsRef.current = [];

    const backgroundImages = backgroundImagesRef.current.querySelectorAll('.background-image');
    
    backgroundImages.forEach((imgEl, index) => {
      const imageData = displayedBackgroundImages[index];
      if (!imageData) return;

      const { initialY, scale } = imageData;
      // 각 이미지마다 다른 속도로 위로 이동 (30~60초 사이)
      const duration = 30 + Math.random() * 30;
      // 이동 거리: 화면 높이의 100vh만큼 위로 이동
      const translateY = initialY - 100;

      // 초기 위치 및 스케일 설정 (회전 없음)
      gsap.set(imgEl, {
        y: `${initialY}vh`,
        rotation: 0, // 회전 없음
        scale: scale,
      });

      // 무한 반복 애니메이션 (y만 변경, rotation과 scale은 유지)
      const anim = gsap.to(imgEl, {
        y: `${translateY}vh`,
        duration: duration,
        ease: "none",
        repeat: -1, // 무한 반복
        onRepeat: () => {
          // 반복될 때마다 초기 위치로 리셋
          gsap.set(imgEl, {
            y: `${initialY}vh`,
          });
        },
      });

      backgroundAnimationsRef.current.push(anim);
    });

    return () => {
      backgroundAnimationsRef.current.forEach((anim) => {
        if (anim) anim.kill();
      });
      backgroundAnimationsRef.current = [];
    };
  }, [displayedBackgroundImages, allImagesLoaded]);

  // 로드된 이미지 개수 추적
  useEffect(() => {
    if (allNicNames.length > 0 && (loadedImages.size > 0 || failedImages.size > 0)) {
      const failedList = Array.from(failedImages);
      const failedPaths = failedList.map(nicName => getImagePath(folderName, nicName));
      
      console.log(`[gfArchive-img] 학기 ${semesterId} (${folderName}):`);
      console.log(`  - 전체 닉네임: ${allNicNames.length}개`);
      console.log(`  - 로드 성공: ${loadedImages.size}개`);
      console.log(`  - 로드 실패: ${failedImages.size}개`);
      console.log(`  - 예상 이미지 파일: ${allNicNames.length}개 (각 폴더에 ${allNicNames.length}개 파일 존재해야 함)`);
      
      if (failedList.length > 0) {
        console.warn(`[gfArchive-img] 로드 실패한 파일 목록:`);
        failedList.forEach((nicName, index) => {
          console.warn(`  ${index + 1}. 닉네임: "${nicName}"`);
          console.warn(`     경로: ${failedPaths[index]}`);
        });
      }
    }
  }, [allNicNames.length, loadedImages.size, failedImages.size, semesterId, folderName]);

  return (
    <>
      {showLoadingScreen && (
        <div className={`loading-screen ${isLoading ? "" : "fade-out"}`}>
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p className="loading-text">이미지를 불러오는 중...</p>
            <p className="loading-progress">
              {(() => {
                const totalImages = circleImages.length + backgroundImages.length;
                const loadedCount = 
                  circleImages.filter(n => loadedImages.has(n) || failedImages.has(n)).length +
                  backgroundImages.filter(img => loadedImages.has(img.nicName) || failedImages.has(img.nicName)).length;
                return totalImages > 0 ? `${loadedCount} / ${totalImages}` : "0 / 0";
              })()}
            </p>
          </div>
        </div>
      )}

      <section 
        className={`gfArchiveImg ${isLoading ? "is-loading" : "is-loaded"}`} 
        ref={scrollContainerRef}
      >
      <Link
        href="/getFever?section=archive"
        className="undo"
        aria-label="돌아가기"
        onClick={(e) => {
          e.preventDefault();
          // body overflow 복원
          document.body.style.overflow = "";
          // 새로고침하며 이동
          window.location.href = "/getFever?section=archive";
        }}
      >
        <svg
          viewBox="0 0 29 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0.353516 0.353516L28.3535 28.3535" stroke="#E1E1E1" />
          <path d="M28.3535 0.353516L0.353513 28.3535" stroke="#E1E1E1" />
        </svg>
      </Link>

      {/* 검색 바 */}
      <div className="gf-searchBox">
        <input
          ref={searchInputRef}
          name="gf-searchInput"
          type="text"
          placeholder={searchNotFound ? "등록되지 않은 닉네임입니다." : "닉네임을 입력해 주세요."}
          onChange={handleSearchInput}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          autoComplete="off"
          className={`gf-searchInput ${searchNotFound ? 'not-found' : ''}`}
        />
        <svg
        className="gf-search-icon"
          viewBox="0 0 22 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleSearch}
          style={{ cursor: 'pointer' }}
        >
          <circle
            cx="9"
            cy="9"
            r="8.25"
            stroke="white"
            strokeWidth="1.5"
          />
          <path
            d="M14.2695 14.9482L21.0016 21.6803"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* 배경 이미지들 (점진적 로딩) */}
      <div className="background-images" ref={backgroundImagesRef}>
        {displayedBackgroundImages.map((imageData, index) => {
          const { nicName, top, left, rotation, scale, zIndex, initialY } = imageData;
          const imagePath = getImagePath(folderName, nicName);
          return (
            <LazyImage
              key={`bg-${nicName}-${index}`}
              src={imagePath}
              alt={nicName}
              className="background-image"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                zIndex: zIndex,
              }}
              data-rotation={rotation}
              data-scale={scale}
              data-initial-y={initialY}
              onLoad={() => handleImageLoad(nicName)}
              onError={() => handleImageError(nicName)}
              nicName={nicName}
              data-index={index}
            />
          );
        })}
      </div>

      {/* 원형 레이아웃 이미지들 (하단 반원) */}
      <div className="circle-container" ref={circleContainerRef}>
        {circleImages.map((nicName, index) => {
          const imagePath = getImagePath(folderName, nicName);
          const position = circlePositions[index];
          
          // 초기 렌더링 시의 위치 계산 (회전값 0 기준)
          const initialRotation = rotationProxyRef.current.value;
          const totalAngle = (position.angle + initialRotation) * (Math.PI / 180);
          const rotatedX = Math.cos(totalAngle) * position.radius;
          const rotatedY = Math.sin(totalAngle) * position.radius;
          const baseAngle = position.angle + initialRotation;
          const centerAngle = -90;
          const rotationAngle = baseAngle - centerAngle;
          
          return (
            <div
              ref={el => imageRefs.current[index] = el}
              key={`circle-${nicName}-${index}`}
              className="circle-image"
              style={{
                "--image-aspect": imageAspectRatios[nicName] ?? 0.66,
                "--rotated-x": `${rotatedX}vw`,
                "--rotated-y": `${rotatedY}vh`,
                "--rotation-angle": `${rotationAngle}deg`,
              }}
            >
              <Image
                src={imagePath}
                alt={nicName}
                fill
                style={{ objectFit: "cover" }}
                onLoad={(event) => handleCircleImageLoad(event, nicName)}
                onError={() => handleImageError(nicName)}
                priority={index < 5} // 처음 5개는 우선 로드
                loading={index < 5 ? "eager" : "lazy"}
                unoptimized
              />
              <div className={`roleBadge ${getRoleClass(nicNameRoleMap.get(nicName))}`}>
                <span className="roleBadge-name">{nicName}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 스크롤 영역 (높이를 충분히 확보하여 스크롤 가능하게) */}
      <div className="scroll-spacer" style={{ height: "300vh" }} />

      {/* 푸터 */}
      <footer className="gfFooter">
        <div className="semesterBadge">
          {getSemesterSVG(semesterId)}
        </div>
        <div className="semesterInfo">
          <div>{semesterInfo.title}</div>
          <p>{semesterInfo.description}</p>
        </div>
      </footer>
    </section>
    </>
  );
}
