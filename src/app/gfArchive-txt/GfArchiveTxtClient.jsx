"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import responses from "../../../lib/data/gfArchive.json";
import "../../../styles/gfArchiveTxt.scss";

gsap.registerPlugin(ScrollToPlugin);

// 학기 ID와 질문 그룹 매핑
const SEMESTER_TO_QUESTION_GROUP = {
  "01": "1-1", // 1학년 1학기 → 질문 그룹 1-1
  "02": "1-2", // 1학년 2학기 → 질문 그룹 1-2
  "03": "2-1", // 2학년 1학기 → 질문 그룹 2-1
  "04": "2-2", // 2학년 2학기 → 질문 그룹 2-2
};

// 각 학기별 질문 메타데이터 (나중에 수정 가능)
const QUESTIONS_BY_SEMESTER = {
  "01": [
    {
      id: "1-1-1",
      label: "01",
      title: "다시 신입생이 된다면<br/>나에게 해주고 싶은 말은?",
    },
    {
      id: "1-1-2",
      label: "02",
      title: "나만의 학교 적응<br/>팁을 공유해주세요!",
    },
    {
      id: "1-1-3",
      label: "03",
      title: "첫 동기와 함께 했던<br/>잊을 수 없는 추억은?",
    },
    {
      id: "1-1-4",
      label: "04",  
      title: "가장 첫인상이 강렬했던<br/>교수님 또는 친구는?",
    },
  ],
  "02": [
    {
      id: "1-2-1",
      label: "01",
      title: "1학년 2학기 나의 <br/>필수템은 무엇이었나요?",
    },
    {
      id: "1-2-2",
      label: "02",
      title: "가장 힘들었던 <br/>전공 수업은?",
    },
    {
      id: "1-2-3",
      label: "03",
      title: '내가 "디미디에 왔구나..."<br/>라고 느낀 순간은?',
    },
    {
      id: "1-2-4",
      label: "04",
      title: "1학년 2학기를 색깔로<br/>표현한다면 무슨 색인가요?",
    },
  ],
  "03": [
    {
      id: "2-1-1",
      label: "01",
      title: "세부전공을 잘<br/>선택했다고 느낀 순간은?",
    },
    {
      id: "2-1-2",
      label: "02",
      title: "나만의 집중 꿀팁을<br/>공유해주세요!",
    },
    {
      id: "2-1-3",
      label: "03",
      title: "2학년이 된 친구들을 <br/>보며 든 생각은?",
    },
    {
      id: "2-1-4",
      label: "04",
      title: "팀 프로젝트에서 기억나는 <br/>일화는 무엇이었나요?",
    },
  ],
  "04": [
    {
      id: "2-2-1",
      label: "01",
      title: "밤샘 작업할 때<br/>자주 먹은 음식은?",
    },
    {
      id: "2-2-2",
      label: "02",
      title: "학교 생활 중 내가<br/>해보지 못해 아쉬운 것이 있다면?",
    },
    {
      id: "2-2-3",
      label: "03",
      title: "작업하며 가장<br/>자주 들은 노래 제목",
    },
    {
      id: "2-2-4",
      label: "04",
      title: "1차 심사 끝내고<br/>가장 먼저 한 일은?",
    },
  ],
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

// 선택된 학기의 질문 그룹에 해당하는 답변만 필터링
function buildAnswersBySemester(semesterId) {
  const questionGroup = SEMESTER_TO_QUESTION_GROUP[semesterId];
  if (!questionGroup) return {};

  const grouped = {};

  // semesterId에 따라 적절한 nickName 필드 선택
  // 01, 02 → nickName01 / 03, 04 → nickName02
  const nickNameField = (semesterId === "01" || semesterId === "02") ? "nickName01" : "nickName02";

  responses.forEach((res) => {
    res.answers.forEach((entry) => {
      const [key, text] = Object.entries(entry)[0];
      if (!key || !text) return;
      
      // 키가 선택된 질문 그룹으로 시작하는지 확인 (예: "1-1-1", "1-1-2" 등)
      if (key.startsWith(questionGroup + "-")) {
        if (!grouped[key]) {
          grouped[key] = [];
        }
        
        grouped[key].push({
          text,
          nicName: res[nickNameField] || res.name || "익명",
          role: res.role || "default",
        });
      }
    });
  });

  // 각 질문 그룹의 답변 배열을 랜덤으로 섞기
  Object.keys(grouped).forEach((key) => {
    // Fisher-Yates shuffle 알고리즘
    const array = grouped[key];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  });

  return grouped;
}

export default function GfArchiveTxt() {
  const searchParams = useSearchParams();
  const semesterId = searchParams?.get("id") ?? "01";
  const semesterInfo = SEMESTER_COPY[semesterId] ?? SEMESTER_COPY["01"];
  
  // 선택된 학기의 질문만 가져오기
  const currentQuestions = QUESTIONS_BY_SEMESTER[semesterId] ?? QUESTIONS_BY_SEMESTER["01"];
  
  // 선택된 학기의 답변만 필터링 (랜덤으로 섞기)
  const [groupedAnswers, setGroupedAnswers] = useState({});
  
  useEffect(() => {
    const answers = buildAnswersBySemester(semesterId);
    setGroupedAnswers(answers);
  }, [semesterId]);
  
  // 각 컬럼의 cards 요소에 대한 ref 배열
  const cardsRefs = useRef([]);
  const animationRefs = useRef([]);
  
  // 선택된 카드 상태: { questionId: string, cardIndex: number } | null
  const [selectedCard, setSelectedCard] = useState(null);
  
  const clearSelection = () => {
    if (!selectedCard) return;
    setSelectedCard(null);
    animationRefs.current.forEach((anim) => {
      if (anim && anim.resume) {
        anim.resume();
      }
    });
  };

  // 카드 클릭 핸들러
  const handleCardClick = (questionId, cardIndex) => {
    if (
      selectedCard &&
      selectedCard.questionId === questionId &&
      selectedCard.cardIndex === cardIndex
    ) {
      clearSelection();
    } else {
      // 새로운 카드 선택
      setSelectedCard({ questionId, cardIndex });
      // 모든 플로우 애니메이션 일시정지
      animationRefs.current.forEach((anim) => {
        if (anim && anim.pause) {
          anim.pause();
        }
      });
    }
  };

  const handleBackgroundClick = (event) => {
    if (!selectedCard) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest(".card")) {
      return;
    }
    clearSelection();
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // 각 컬럼마다 독립적인 플로우 애니메이션 설정
  useEffect(() => {
    const animations = [];
    
    // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 실행
    const timer = setTimeout(() => {
      cardsRefs.current.forEach((cardsEl, index) => {
        if (!cardsEl) return;
        
        const wrapperEl = cardsEl.parentElement;
        if (!wrapperEl || !wrapperEl.classList.contains("cardsWrapper")) return;
        
        // 실제 전체 높이 계산 (scrollHeight 사용)
        const totalHeight = cardsEl.scrollHeight;
        const wrapperHeight = wrapperEl.clientHeight;
        const maxScroll = Math.max(0, totalHeight - wrapperHeight);
        
        if (maxScroll <= 0) {
          return; // 스크롤할 필요가 없으면 애니메이션 없음
        }
        
        // 초기 위치 및 방향 설정
        // 01(index 0), 03(index 2): 위로 시작 (-1) - 맨 아래에서 시작해서 위로
        // 02(index 1), 04(index 3): 아래로 시작 (1) - 맨 위에서 시작해서 아래로
        let direction = index % 2 === 0 ? -1 : 1;
        let isAnimating = false;
        let userScrolling = false;
        let scrollTimeout = null;
        let animationTween = null;
        let isPaused = false; // 외부에서 일시정지된 상태인지 확인
        
        // 초기 위치 설정: 위로 시작하는 컬럼은 맨 아래, 아래로 시작하는 컬럼은 맨 위
        if (direction === -1) {
          // 위로 시작: 맨 아래에서 시작
          wrapperEl.scrollTop = maxScroll;
        } else {
          // 아래로 시작: 맨 위에서 시작
          wrapperEl.scrollTop = 0;
        }
        
        // 애니메이션 함수: wrapper의 scrollTop을 직접 조작
        const animate = () => {
          if (isAnimating || userScrolling || isPaused) return;
          isAnimating = true;
          
          const currentScroll = wrapperEl.scrollTop;
          // direction이 1이면 아래로 (maxScroll로), -1이면 위로 (0으로)
          const targetScroll = direction === 1 ? maxScroll : 0;
          const baseDuration = 600; // 40초에 걸쳐 전체 이동
          
          // 거리 계산 및 duration 계산 (최소 0.1초 보장)
          const distance = Math.abs(targetScroll - currentScroll);
          const actualDuration = maxScroll > 0 
            ? Math.max(0.1, (distance / maxScroll) * baseDuration)
            : baseDuration;
          
          animationTween = gsap.to(wrapperEl, {
            scrollTo: { y: targetScroll, autoKill: false },
            duration: actualDuration,
            ease: "none",
            onComplete: () => {
              // 방향 전환 후 즉시 반대 방향으로 시작 (멈추지 않음)
              direction *= -1;
              isAnimating = false;
              // requestAnimationFrame으로 즉시 다음 애니메이션 시작
              requestAnimationFrame(() => {
                animate();
              });
            },
          });
        };
        
        // 사용자 스크롤 감지 플래그
        let isUserInteraction = false;
        
        // 마우스 휠, 터치 이벤트로 사용자 상호작용 감지
        const handleWheel = () => {
          isUserInteraction = true;
          if (isAnimating && animationTween) {
            userScrolling = true;
            animationTween.kill();
            isAnimating = false;
          }
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            isUserInteraction = false;
            userScrolling = false;
            if (!isAnimating) {
              animate();
            }
          }, 200); // 0.8초 후 재개 (원하면 더 줄일 수 있음)
        };
        
        const handleTouchStart = () => {
          isUserInteraction = true;
          if (isAnimating && animationTween) {
            userScrolling = true;
            animationTween.kill();
            isAnimating = false;
          }
        };
        
        const handleTouchEnd = () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            isUserInteraction = false;
            userScrolling = false;
            if (!isAnimating) {
              animate();
            }
          }, 800); // 0.8초 후 재개
        };
        
        // 스크롤 이벤트: 사용자가 직접 스크롤하는 경우만 감지
        const handleScroll = () => {
          if (isUserInteraction && isAnimating) {
            userScrolling = true;
            if (animationTween) {
              animationTween.kill();
              isAnimating = false;
            }
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              userScrolling = false;
              if (!isAnimating) {
                animate();
              }
            }, 800); // 0.8초 후 재개
          }
        };
        
        wrapperEl.addEventListener("wheel", handleWheel, { passive: true });
        wrapperEl.addEventListener("touchstart", handleTouchStart, { passive: true });
        wrapperEl.addEventListener("touchend", handleTouchEnd, { passive: true });
        wrapperEl.addEventListener("scroll", handleScroll, { passive: true });
        
        // 초기 애니메이션 시작
        animate();
        
        animations.push({
          pause: () => {
            isPaused = true;
            if (animationTween) {
              animationTween.pause();
            }
            // 스크롤 타임아웃도 정리
            clearTimeout(scrollTimeout);
            userScrolling = false;
          },
          resume: () => {
            isPaused = false;
            if (animationTween && animationTween.paused()) {
              animationTween.resume();
            } else if (!isAnimating && !userScrolling) {
              // 애니메이션이 없으면 다시 시작
              animate();
            }
          },
          kill: () => {
            clearTimeout(scrollTimeout);
            if (animationTween) {
              animationTween.kill();
            }
            wrapperEl.removeEventListener("wheel", handleWheel);
            wrapperEl.removeEventListener("touchstart", handleTouchStart);
            wrapperEl.removeEventListener("touchend", handleTouchEnd);
            wrapperEl.removeEventListener("scroll", handleScroll);
          },
        });
      });
    }, 500); // DOM 렌더링 대기 시간 증가
    
    animationRefs.current = animations;
    
    return () => {
      clearTimeout(timer);
      animations.forEach((anim) => anim.kill());
    };
  }, [groupedAnswers, currentQuestions]);

  return (
    <section className="gfArchiveTxt" onClick={handleBackgroundClick}>
      {/* <img className="webImage" src="/images/GET FEVER TXT.png" alt="GET FEVER TXT.png" /> */}
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


      <div className="columns">
        {currentQuestions.map((question, columnIndex) => {
          const isSelectedColumn = selectedCard && selectedCard.questionId === question.id;
          // 선택된 컬럼이 아니면 전체 컬럼을 어둡게
          const isColumnDimmed = selectedCard && !isSelectedColumn;
          // 선택된 컬럼도 틀은 어둡게, 타이틀/번호만 선명하게
          const isSelectedColumnDimmed = selectedCard && isSelectedColumn;
          
          return (
            <React.Fragment key={question.id}>
              <header className={`columnHeader columnHeader--${columnIndex + 1} ${
                isSelectedColumn ? "is-selected" : ""
              } ${
                (isColumnDimmed || isSelectedColumnDimmed) && !isSelectedColumn ? "is-dimmed" : ""
              }`}>
                <div className="columnLabel">{question.label}</div>
                <div className="columnTitle">
                  <p dangerouslySetInnerHTML={{ __html: question.title }} />
                </div>
              </header>
              
              <div
                className={`column column--${columnIndex + 1} ${
                  isColumnDimmed || isSelectedColumnDimmed ? "is-dimmed" : ""
                }`}
              >
                <div className="cardsWrapper">
                <div
                  className="cards"
                  ref={(el) => (cardsRefs.current[columnIndex] = el)}
                >
                  {groupedAnswers[question.id]?.length ? (
                    groupedAnswers[question.id].map((answer, idx) => {
                      const isThisCardSelected = selectedCard && 
                        selectedCard.questionId === question.id && 
                        selectedCard.cardIndex === idx;
                      // 선택된 컬럼 내에서도 선택되지 않은 카드는 어둡게
                      // 단, 선택된 카드 자체는 dimmed 되지 않음
                      const isCardDimmed = selectedCard && 
                        !isThisCardSelected && 
                        (isColumnDimmed || isSelectedColumn);
                      
                      return (
                        <article
                          className={`card ${
                            isCardDimmed ? "is-dimmed" : ""
                          } ${isThisCardSelected ? "is-selected" : ""}`}
                          key={`${question.id}-${idx}`}
                          onClick={() => handleCardClick(question.id, idx)}
                        >
                          <p className="cardText">{answer.text}</p>
                          <div className={`roleBadge ${getRoleClass(answer.role)}`}>
                            <span className="roleBadge-name">{answer.nicName}</span>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <p className="gfArchiveTxt-empty">답변이 아직 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="overlay-top"></div>
      <div className="overlay-bottom"></div>

      <footer className={`gfFooter ${selectedCard ? "is-dimmed" : ""}`}>
        <div className="semesterBadge">
          {getSemesterSVG(semesterId)}

          <div className="semesterInfo">
          <div>{semesterInfo.title}</div>
          <p>{semesterInfo.description}</p>
        </div>
        </div>

        <Link href={`/gfArchive-img?id=${semesterId}`} className="button">
          <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="35.7" cy="35.7" r="35.7" fill="#0051FF"/>
<path d="M18.1372 20.0156H52.8635M18.1372 53.571H52.8635M15.3433 24.1265V49.624M56.0569 24.1265V49.624" stroke="#E1E1E1" strokeWidth="1.5"/>
<path d="M20.1123 47.8333L26.7015 41.6133" stroke="#E1E1E1" strokeWidth="1.5"/>
<path d="M34.1548 41.9577L40.5509 35.9199" stroke="#E1E1E1" strokeWidth="1.5"/>
<path d="M28.1723 39.5645L35.8809 47.658" stroke="#E1E1E1" strokeWidth="1.5"/>
<path d="M42.022 33.3437L52.6543 44.3638" stroke="#E1E1E1" strokeWidth="1.5"/>
<circle cx="28.811" cy="30.8989" r="4.80125" stroke="#E1E1E1" strokeWidth="1.5"/>
</svg>
        </Link>
      </footer>

      <div className="click-none-top"></div>
      <div className="click-none-bottom"></div>
    </section>
  );
}

function getRoleClass(role = "") {
  const lower = role.toLowerCase();
  if (lower.includes("plan")) return "roleBadge-planner";
  if (lower.includes("design")) return "roleBadge-designer";
  if (lower.includes("dev")) return "roleBadge-developer";
  return "roleBadge-default";
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