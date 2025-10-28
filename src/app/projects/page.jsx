"use client";
import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { gsap } from "gsap";
import projects from "../../../lib/data/project.json"; // 경로 맞는지 확인
import Image from "next/image";
import { ProjectDetail } from "../../../components/pjDetail";
import "../../../styles/projects.scss";


// 무작위 셔플 함수 (Fisher–Yates)
export function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function Projects() {
  // 전체 프로젝트 데이터
  const allProjects = projects;

  // ----------------------------
  // 1) 필터 상태 및 유틸들
  // ----------------------------

  // 활성 필터 (topic / field 각각 Set으로 관리)
  const [activeFilters, setActiveFilters] = useState({
    topic: new Set(),
    field: new Set(),
  });

  const [reappearingFilter, setReappearingFilter] = useState(null);
  const [reentryKeys, setReentryKeys] = useState({}); // 새로 추가

  const [removingFilters, setRemovingFilters] = useState({
  topic: new Set(),
  field: new Set(),
});

  // 필터 토글
function toggleFilter(type, value) {
  setReappearingFilter(null); // 새 필터 토글 시 re-entering 상태 초기화
  setActiveFilters((prevActive) => {
    const nextActive = {
      topic: new Set(prevActive.topic),
      field: new Set(prevActive.field),
    };

    setRemovingFilters((prevRemoving) => {
      const nextRemoving = {
        topic: new Set(prevRemoving.topic),
        field: new Set(prevRemoving.field),
      };

      if (nextActive[type].has(value)) {
        // 이미 활성화된 값을 눌렀다 = 제거 요청
        // 1) active에서는 지금은 아직 안 뺀다
        // 2) 대신 removing에 넣어서 "사라지는 애니메이션" 클래스를 줄 수 있게 함
        nextRemoving[type].add(value);
      } else {
        // 새로운 값 추가
        nextActive[type].add(value);

        // 만약 이 값이 방금까지 제거 애니메이션 중이었다면 취소
        nextRemoving[type].delete(value);
      }

      // removingFilters 실제 업데이트 반영
      setRemovingFilters(nextRemoving);

      // activeFilters는 여기서 return 할거라서 외부로 넘김
      return nextActive;
    });

    // 이 return은 activeFilters용
    return nextActive;
  });
}

  // chip의 X 눌러서 특정 필터 제거
  function removeFilter(type, value) {
    setReappearingFilter({ type, value }); // 다시 나타날 필터 추적

    // Generate a new unique key for this specific filter button
    setReentryKeys(prevKeys => ({
      ...prevKeys,
      [`${type}-${value}`]: Date.now(), // Use timestamp for uniqueness
    }));

    setActiveFilters((prev) => {
      const next = {
        topic: new Set(prev.topic),
        field: new Set(prev.field),
      };
      next[type].delete(value);
      return next;
    });
  }

  // "All" 눌러서 전체 초기화
  function clearAllFilters() {
    setReappearingFilter(null); // 전체 클리어 시에도 초기화
    setReentryKeys({}); // Clear all reentry keys
    setActiveFilters({
      topic: new Set(),
      field: new Set(),
    });
  }

  // 모든 topic 키워드 목록 추출 (중복 제거)

  // ----------------------------
  // 2) 정렬/필터링된 프로젝트 리스트 만들기
  // ----------------------------

  const projectList = useMemo(() => {
    // 필터가 하나도 없으면 전부 랜덤으로
    if (activeFilters.topic.size === 0 && activeFilters.field.size === 0) {
      return shuffle(allProjects);
    }

    // 필터 적용
    const filtered = allProjects.filter((p) => {
      const pTopics = Array.isArray(p.topic) ? p.topic : [];
      const pFields = Array.isArray(p.field) ? p.field : [];

      // topic 필터 검사: 활성 topic 중 최소 하나는 포함해야 함
      if (activeFilters.topic.size > 0) {
        let ok = false;
        for (const t of activeFilters.topic) {
          if (pTopics.includes(t)) {
            ok = true;
            break;
          }
        }
        if (!ok) return false;
      }

      // field 필터 검사: 활성 field 중 최소 하나 포함
      if (activeFilters.field.size > 0) {
        let ok = false;
        for (const f of activeFilters.field) {
          if (pFields.includes(f)) {
            ok = true;
            break;
          }
        }
        if (!ok) return false;
      }

      return true;
    });

    return shuffle(filtered);
  }, [allProjects, activeFilters]);

const allTopic = useMemo(() => {
  const s = new Set();

  allProjects.forEach((p) => {
    if (Array.isArray(p.topic)) {
      p.topic
        
        .forEach((t) => s.add(t));
    }
  });

  return Array.from(s);
}, [allProjects, activeFilters]);

  // 모든 field 키워드 목록 추출 (중복 제거)
  const allField = useMemo(() => {
    const s = new Set();
    allProjects.forEach((p) => {
      if (Array.isArray(p.field)) {
        p.field
        .forEach((t) => s.add(t));
      }
    });
    return Array.from(s);
  }, [allProjects, activeFilters]);


  // projectList가 바뀔 때마다 re-key해서 등장 애니메이션 유도
  const [animationKey, setAnimationKey] = useState(0);
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [projectList]);

  // projectList 안에 포함된 프로젝트만 우측 이름리스트에서 강조하기 위해 Set으로 관리
  const filteredProjectsSet = useMemo(() => {
    return new Set(projectList);
  }, [projectList]);

  // ----------------------------
  // 3) 토글 가능한 정렬바 (주제/분야)
  // ----------------------------

  const [topicSortingBar, setTopicSortingBar] = useState(false);
  const [fieldSortingBar, setFieldSortingBar] = useState(false);

  const topicToggle = () => setTopicSortingBar((prev) => !prev);
  const fieldToggle = () => setFieldSortingBar((prev) => !prev);

  // ----------------------------
  // 4) 모달 상태
  // ----------------------------

  const [modalState, setModalState] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // ----------------------------
  // 5) 오른쪽 고정 리스트 스크롤 따라오기
  // ----------------------------

  const projectNameListRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const target = projectNameListRef.current;
    if (!target) return;

    let currentY = 0;
    let targetY = 0;
    const easing = 0.05; // 반응 속도 조절
    let animationFrameId;

    // 요소의 초기 top (문서 기준 절대 위치)
    const initialTop = target.getBoundingClientRect().top + window.scrollY;

    const animate = () => {
      currentY += (targetY - currentY) * easing;
      target.style.transform = `translateY(${currentY}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const vhUnit = window.innerHeight / 100;
      const scrollY = window.scrollY;
      const topOffset = 20 * vhUnit; // 화면 상단에서 어느 정도 떨어져 있게 할지

      const stickyPoint = initialTop - topOffset;

      if (scrollY > stickyPoint) {
        targetY = scrollY - stickyPoint;
      } else {
        targetY = 0;
      }
    };

    window.addEventListener("scroll", handleScroll);
    animate();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // ----------------------------
  // 6) 오른쪽 이름 hover → 하이라이트 마커 GSAP 애니메이션
  // ----------------------------

  const [hoveredProjectCard, setHoveredProjectCard] = useState(null);
  const nameMarkerRef = useRef(null);
  const nameTabRefs = useRef({}); // {idx: DOMElement}

  const animateNameMarker = useCallback(() => {
    const marker = nameMarkerRef.current;
    const container = projectNameListRef.current;
    if (!marker || !container) return;

    if (hoveredProjectCard === null) {
      gsap.to(marker, { opacity: 0, duration: 0.25, ease: "power2.out" });
      return;
    }

    const targetEl = nameTabRefs.current[hoveredProjectCard];
    if (!targetEl) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const y = targetRect.top - containerRect.top;
    const height = targetRect.height;

    gsap.killTweensOf(marker);
    gsap.to(marker, {
      y,
      height,
      opacity: 1,
      duration: 0.3,
      ease: "back.out(1.2)",
    });
  }, [hoveredProjectCard]);

  useLayoutEffect(() => {
    animateNameMarker();
  }, [animateNameMarker]);

  // ----------------------------
  // RENDER
  // ----------------------------

  return (
    <div className="projects blackBg">
      {/* 모달 */}
      {modalState && selectedProject && (
        <ProjectDetail
          project={selectedProject}
          closeModal={() => setModalState(false)}
        />
      )}

      {/* 필터 선택 영역 */}
      <div className="SortingBarList">
        {/* 토픽 필터 바 */}
        <div
          className={`SortingBar ${topicSortingBar ? "is-open" : ""}`}
          onClick={topicToggle}
        >
          주제
          {topicSortingBar && (
            <div className="keyWardList">
              <button onClick={clearAllFilters} className="sortButton">
                All
              </button>
              {allTopic.map((topicName, index) => {
                const isReappearing =
                  reappearingFilter?.type === "topic" &&
                  reappearingFilter?.value === topicName;

                return (
                  <button
                    className={`sortButton ${
                      activeFilters.topic.has(topicName) ? "active" : ""
                    } ${isReappearing ? "re-entering" : ""}`}
                    key={`${topicName}-${reentryKeys[`topic-${topicName}`] || 'initial'}`}
                    onClick={(e) => {
                      e.stopPropagation(); // 부모 클릭(열고닫기) 막기
                      toggleFilter("topic", topicName);
                    }}
                  >
                    {topicName}
                  </button>
                );
              })}
            </div>
          )}

          <svg
            width="13"
            height="8"
            viewBox="0 0 13 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.466553 0.466797L6.41699 6.41724L12.3674 0.466797"
              stroke="white"
              strokeWidth="1.32"
            />
          </svg>
        </div>

        {/* 필드 필터 바 */}
        <div
          className={`SortingBar ${fieldSortingBar ? "is-open" : ""}`}
          onClick={fieldToggle}
        >
          분야
          {fieldSortingBar && (
            <div className="keyWardList">
              <button onClick={clearAllFilters} className="sortButton">
                All
              </button>
              {allField.map((fieldName, index) => {
                const isReappearing =
                  reappearingFilter?.type === "field" &&
                  reappearingFilter?.value === fieldName;
                return (
                  <button
                    className={`sortButton ${
                      activeFilters.field.has(fieldName) ? "active" : ""
                    } ${isReappearing ? "re-entering" : ""}`}
                    key={`${fieldName}-${reentryKeys[`field-${fieldName}`] || 'initial'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilter("field", fieldName);
                    }}
                  >
                    {fieldName}
                  </button>
                );
              })}
            </div>
          )}

          <svg
            width="13"
            height="8"
            viewBox="0 0 13 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.466553 0.466797L6.41699 6.41724L12.3674 0.466797"
              stroke="white"
              strokeWidth="1.32"
            />
          </svg>
        </div>

        {/* 현재 활성화된 필터 chip들 */}
        <div className="activeFilterChips">
          {[...activeFilters.topic].map((t) => (
            <button
              key={`topic-${t}`}
              className="chip chip-topic"
              onClick={() => removeFilter("topic", t)}
            >
              <span className="chipLabel">{t}</span>
              <span className="chipRemove">×</span>
            </button>
          ))}

          {[...activeFilters.field].map((f) => (
            <button
              key={`field-${f}`}
              className="chip chip-field"
              onClick={() => {
                removeFilter("field", f)}}
            >
              <span className="chipLabel">{f}</span>
              <span className="chipRemove">×</span>
            </button>
          ))}
        </div>
      </div>

      {/* 본문 레이아웃: 왼쪽 카드 리스트 / 오른쪽 이름 리스트 */}
      <div className="projectListPlaceHolder">
        {/* 왼쪽: 카드들 */}
        <div className="projectList">
          <p className="ShowingCount">{`Showing ${projectList.length} of ${allProjects.length} results`}</p>

          <div className="mapProjectList">
            {projectList.map((p, idx) => (
              <div
                key={`${idx}-${animationKey}`}
                className="ImagePlaceHolder project"
                style={{ "--animation-delay": `${idx * 0.1}s` }}
                onClick={() => {
                  setSelectedProject(p);
                  setModalState(true);
                }}
              >
                <Image
                  alt={`${p.name} Thumbnail image`}
                  src={`/images/project/${p.id}.png`}
                  fill
                  sizes="auto"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 이름 리스트 (스크롤 따라다님) */}
        <div
          className="projectNameListPlaceHolder"
          ref={projectNameListRef}
          onMouseLeave={() => setHoveredProjectCard(null)}
        >
          <div className="marker-mask">
            <div className="marker" ref={nameMarkerRef} />
          </div>

          {allProjects.map((p, idx) => {
            const isVisible = filteredProjectsSet.has(p);
            return (
              <div
                key={idx}
                className={`projectNameCard ${
                  isVisible ? "is-visible" : "is-hidden"
                }`}
                ref={(node) => {
                  if (node) {
                    nameTabRefs.current[idx] = node;
                  } else {
                    delete nameTabRefs.current[idx];
                  }
                }}
                onMouseEnter={() => setHoveredProjectCard(idx)}
                onClick={() => {
                  setSelectedProject(p);
                  setModalState(true);
                }}
              >
                <p className="num">{p.number}</p>
                <p className="name">{p.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
