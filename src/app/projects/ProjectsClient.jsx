// src/app/projects/ProjectsClient.jsx
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
import projects from "../../../lib/data/project.json";
import Image from "next/image";
import { ProjectDetail } from "../../../components/pjDetail";
import "../../../styles/projects.scss";
import { Footer } from "../../../components/footer";
import WindowIntroWrapper from "../../../components/loading";
import { shuffle } from "../../../lib/util/shuffle";

export default function ProjectsClient() {
  const allProjects = projects;

  // 1) 안정적인 초기 순서(SSR/CSR 동일)
  const stableBase = useMemo(() => {
    return [...allProjects].sort((a, b) =>
      String(a.id).localeCompare(String(b.id))
    );
  }, [allProjects]);

  const [clientProjects, setClientProjects] = useState(stableBase);
  useEffect(() => {
    setClientProjects(shuffle([...stableBase]));
  }, [stableBase]);

  // 2) 필터 상태
  const [activeFilters, setActiveFilters] = useState({
    topic: new Set(),
    field: new Set(),
    target: new Set(),
    media: new Set(),
  });

  const [reappearingFilter, setReappearingFilter] = useState(null);
  const [reentryKeys, setReentryKeys] = useState({});
  const [removingFilters, setRemovingFilters] = useState({
    topic: new Set(),
    field: new Set(),
    target: new Set(),
    media: new Set(),
  });

  function toggleFilter(type, value) {
    setReappearingFilter(null);
    setActiveFilters((prevActive) => {
      const nextActive = {
        topic: new Set(prevActive.topic),
        field: new Set(prevActive.field),
        target: new Set(prevActive.target),
        media: new Set(prevActive.media),
      };

      const isCurrentlyActive = nextActive[type].has(value);
      const currentTotalActiveFilters =
        nextActive.topic.size +
        nextActive.field.size +
        nextActive.target.size +
        nextActive.media.size;

      // 6개 이상이면 추가 막기
      if (!isCurrentlyActive && currentTotalActiveFilters >= 6) {
        return prevActive;
      }

      setRemovingFilters((prevRemoving) => {
        const nextRemoving = {
          topic: new Set(prevRemoving.topic),
          field: new Set(prevRemoving.field),
          target: new Set(prevRemoving.target),
          media: new Set(prevRemoving.media),
        };
        if (isCurrentlyActive) {
          nextActive[type].delete(value);
          nextRemoving[type].add(value);
        } else {
          nextActive[type].add(value);
          nextRemoving[type].delete(value);
        }
        return nextRemoving;
      });
      return nextActive;
    });
  }

  function removeFilter(type, value) {
    setReappearingFilter({ type, value });
    setReentryKeys((prev) => ({
      ...prev,
      [`${type}-${value}`]: Date.now(),
    }));
    setActiveFilters((prev) => {
      const next = {
        topic: new Set(prev.topic),
        field: new Set(prev.field),
        target: new Set(prev.target),
        media: new Set(prev.media),
      };
      next[type].delete(value);
      return next;
    });
  }

  function clearAllFilters() {
    setReappearingFilter(null);
    setReentryKeys({});
    setActiveFilters({
      topic: new Set(),
      field: new Set(),
      target: new Set(),
      media: new Set(),
    });
  }

  // 3) 키워드 목록(데이터로만 계산)
  const allTopic = useMemo(() => {
    const s = new Set();
    allProjects.forEach((p) =>
      Array.isArray(p.topic) && p.topic.forEach((t) => s.add(t))
    );
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [allProjects]);

  const allTarget = useMemo(() => {
    const s = new Set();
    allProjects.forEach((p) => {
      const arr = Array.isArray(p.target) ? p.target : [];
      arr.forEach((v) => s.add(v));
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [allProjects]);

  const allMedia = useMemo(() => {
    // 언어 우선순위: 영어(0) → 한글(1) → 기타(2)
    const getPriority = (str) => {
      const first = str?.[0];

      if (/[A-Za-z]/.test(first)) return 0; // 영어
      if (/^[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(first)) return 1; // 한글
      return 2; // 나머지
    };

    const sortPriority = (a, b) => {
      const pa = getPriority(a);
      const pb = getPriority(b);

      if (pa !== pb) return pa - pb;
      return a.localeCompare(b, "ko-KR");
    };

    const s = new Set();
    allProjects.forEach((p) => {
      const raw = Array.isArray(p.media)
        ? p.media
        : Array.isArray(p.Media)
        ? p.Media
        : [];
      raw.forEach((v) => s.add(v));
    });

    return Array.from(s).sort(sortPriority);
  }, [allProjects]);

  // 4) 표시용 리스트
  const [displayedProjects, setDisplayedProjects] = useState(stableBase);

  const buildFiltered = useCallback(() => {
    const hasAnyFilter =
      activeFilters.topic.size > 0 ||
      activeFilters.field.size > 0 ||
      activeFilters.target.size > 0 ||
      activeFilters.media.size > 0;

    if (!hasAnyFilter) {
      return clientProjects;
    }

    return clientProjects.filter((p) => {
      const pTopics = Array.isArray(p.topic) ? p.topic : [];
      const pFields = Array.isArray(p.field) ? p.field : [];
      const pTargets = Array.isArray(p.target) ? p.target : [];
      const pMedias = Array.isArray(p.media)
        ? p.media
        : Array.isArray(p.Media)
        ? p.Media
        : [];

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

      if (activeFilters.target.size > 0) {
        let ok = false;
        for (const tg of activeFilters.target) {
          if (pTargets.includes(tg)) {
            ok = true;
            break;
          }
        }
        if (!ok) return false;
      }

      if (activeFilters.media.size > 0) {
        let ok = false;
        for (const m of activeFilters.media) {
          if (pMedias.includes(m)) {
            ok = true;
            break;
          }
        }
        if (!ok) return false;
      }

      return true;
    });
  }, [clientProjects, activeFilters]);

  useEffect(() => {
    setDisplayedProjects(buildFiltered());
  }, [buildFiltered]);

  // 5) 애니메이션 트리거용 키(렌더키로 쓰지 않음)
  const [animationKey, setAnimationKey] = useState(0);
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [displayedProjects]);

  // 6) 오른쪽 이름 리스트 가시성
  const visibleIdSet = useMemo(
    () => new Set(displayedProjects.map((p) => p.id)),
    [displayedProjects]
  );

  // 7) 정렬바 토글
  const [topicSortingBar, setTopicSortingBar] = useState(false);
  const [fieldSortingBar, setFieldSortingBar] = useState(false);
  const [targetSortingBar, setTargetSortingBar] = useState(false);
  const [mediaSortingBar, setMediaSortingBar] = useState(false);

  const topicToggle = () => setTopicSortingBar((v) => !v);
  const fieldToggle = () => setFieldSortingBar((v) => !v);
  const targetToggle = () => setTargetSortingBar((v) => !v);
  const mediaToggle = () => setMediaSortingBar((v) => !v);

  // 8) 모달
  const [modalState, setModalState] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // 9) 오른쪽 리스트 스크롤 따라오기
  const projectNameListRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    let currentY = 0;
    let targetY = 0;
    const easing = 0.05;
    let raf;
    let initialTop;

    const animate = () => {
      currentY += (targetY - currentY) * easing;
      if (projectNameListRef.current) {
        projectNameListRef.current.style.transform = `translateY(${currentY}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    const onScroll = () => {
      if (
        typeof window === "undefined" ||
        !projectNameListRef.current ||
        !footerRef.current
      )
        return;

      const target = projectNameListRef.current;
      const footer = footerRef.current;

      const vh = window.innerHeight / 100;
      const scrollY = window.scrollY;
      const topOffset = 20 * vh;
      const stickyPoint = initialTop - topOffset;

      const footerTop = footer.getBoundingClientRect().top + window.scrollY;
      const targetHeight = target.offsetHeight;

      const maxTargetY = footerTop - (initialTop + targetHeight);

      let newTargetY = scrollY > stickyPoint ? scrollY - stickyPoint : 0;

      targetY = Math.min(newTargetY, maxTargetY);
    };

    if (typeof window === "undefined") return;
    const target = projectNameListRef.current;
    const footer = footerRef.current;
    if (!target || !footer) return;

    initialTop = target.getBoundingClientRect().top + window.scrollY;

    onScroll();
    window.addEventListener("scroll", onScroll);
    animate();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // 10) 이름 마커 GSAP
  const [hoveredProjectCard, setHoveredProjectCard] = useState(null);
  const nameMarkerRef = useRef(null);
  const nameTabRefs = useRef({});

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

  // 오른쪽 리스트용
  const rightList = useMemo(() => {
    return [...stableBase].sort((a, b) => a.number - b.number);
  }, [stableBase]);

  return (
    <WindowIntroWrapper
      // pageName={"작품"}
      children={
        <>
          <div className="projects blackBg">
            {modalState && selectedProject && (
              <ProjectDetail
                project={selectedProject}
                closeModal={() => setModalState(false)}
              />
            )}

            {/* 필터 선택 영역 */}
            <div className="SortingBarList">
              {/* Media */}
              <div
                className={`SortingBar ${mediaSortingBar ? "is-open" : ""}`}
                onClick={mediaToggle}
              >
                매체
                {mediaSortingBar && (
                  <div className="keyWardList">
                    {allMedia.map((mediaName) => {
                      const isReappearing =
                        reappearingFilter?.type === "media" &&
                        reappearingFilter?.value === mediaName;
                      return (
                        <div
                          className={`sortButton ${
                            activeFilters.media.has(mediaName) ? "active" : ""
                          } ${isReappearing ? "re-entering" : ""}`}
                          key={`media-${mediaName}-${
                            reentryKeys[`media-${mediaName}`] || "initial"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFilter("media", mediaName);
                          }}
                        >
                          {mediaName}
                        </div>
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

              {/* Topic */}
              <div
                className={`SortingBar ${topicSortingBar ? "is-open" : ""}`}
                onClick={topicToggle}
              >
                주제
                {topicSortingBar && (
                  <div className="keyWardList">
                    {allTopic.map((topicName) => {
                      const isReappearing =
                        reappearingFilter?.type === "topic" &&
                        reappearingFilter?.value === topicName;
                      return (
                        <div
                          className={`sortButton ${
                            activeFilters.topic.has(topicName)
                              ? "active"
                              : ""
                          } ${isReappearing ? "re-entering" : ""}`}
                          key={`topic-${topicName}-${
                            reentryKeys[`topic-${topicName}`] || "initial"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFilter("topic", topicName);
                          }}
                        >
                          {topicName}
                        </div>
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

              {/* Target */}
              <div
                className={`SortingBar ${targetSortingBar ? "is-open" : ""}`}
                onClick={targetToggle}
              >
                대상
                {targetSortingBar && (
                  <div className="keyWardList">
                    {allTarget.map((targetName) => {
                      const isReappearing =
                        reappearingFilter?.type === "target" &&
                        reappearingFilter?.value === targetName;
                      return (
                        <div
                          className={`sortButton ${
                            activeFilters.target.has(targetName)
                              ? "active"
                              : ""
                          } ${isReappearing ? "re-entering" : ""}`}
                          key={`target-${targetName}-${
                            reentryKeys[`target-${targetName}`] || "initial"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFilter("target", targetName);
                          }}
                        >
                          {targetName}
                        </div>
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

              {/* 활성 필터 chips */}
              <div className="activeFilterChips">
                {[...activeFilters.topic].map((t) => (
                  <div
                    key={`topic-${t}`}
                    className="chip chip-topic"
                    onClick={() => removeFilter("topic", t)}
                  >
                    <span className="chipLabel">{t}</span>
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M0.459473 0.459717L10.4341 10.4343"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <path
                          d="M10.4341 0.459717L0.459478 10.4343"
                          stroke="white"
                          strokeWidth="2"
                        />
                      </g>
                    </svg>
                  </div>
                ))}

                {[...activeFilters.field].map((f) => (
                  <div
                    key={`field-${f}`}
                    className="chip chip-field"
                    onClick={() => removeFilter("field", f)}
                  >
                    <span className="chipLabel">{f}</span>
                    <span className="chipRemove">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M0.459473 0.459717L10.4341 10.4343"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <path
                            d="M10.4341 0.459717L0.459478 10.4343"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                ))}

                {[...activeFilters.target].map((tg) => (
                  <div
                    key={`target-${tg}`}
                    className="chip chip-target"
                    onClick={() => removeFilter("target", tg)}
                  >
                    <span className="chipLabel">{tg}</span>
                    <span className="chipRemove">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M0.459473 0.459717L10.4341 10.4343"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <path
                            d="M10.4341 0.459717L0.459478 10.4343"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                ))}

                {[...activeFilters.media].map((m) => (
                  <div
                    key={`media-${m}`}
                    className="chip chip-media"
                    onClick={() => removeFilter("media", m)}
                  >
                    <span className="chipLabel">{m}</span>
                    <span className="chipRemove">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M0.459473 0.459717L10.4341 10.4343"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <path
                            d="M10.4341 0.459717L0.459478 10.4343"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 본문 */}
            <div className="projectListPlaceHolder">
              {/* 왼쪽 카드들 */}
              <div className="projectList">
                {(activeFilters.topic.size > 0 ||
                  activeFilters.field.size > 0 ||
                  activeFilters.target.size > 0 ||
                  activeFilters.media.size > 0) && (
                  <div onClick={clearAllFilters} className="chip ClearAll">
                    Clear All
                  </div>
                )}

                <div className="mapProjectList">
                  {displayedProjects.map((p, idx) => (
                    <div
                      key={p.id}
                      className="ImagePlaceHolder project"
                      style={{ ["--animation-delay"]: `${idx * 0.1}s` }}
                      onClick={() => {
                        setSelectedProject(p);
                        setModalState(true);
                      }}
                    >
                      <div className="LogoBox">
                        <Image
                          className="Logo"
                          alt={`${p.name} 로고`}
                          src={`/images/project/hoverCaed/${p.id}.webp`}
                          fill
                          sizes="100vw"
                          style={{
                            objectFit: "contain",
                            pointerEvents: "none",
                          }}
                        />
                      </div>

                      <Image
                        className="Thumbnail"
                        alt={`${p.name} Thumbnail image`}
                        src={`/images/project/${p.id}.webp`}
                        fill
                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover", pointerEvents: "none" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 오른쪽 이름 리스트 */}
              <div
                className="projectNameListPlaceHolder"
                ref={projectNameListRef}
                onMouseLeave={() => setHoveredProjectCard(null)}
              >
                <div className="marker-mask">
                  <div className="marker" ref={nameMarkerRef} />
                </div>

                {rightList.map((p, idx) => {
                  const isVisible = visibleIdSet.has(p.id);
                  return (
                    <div
                      key={p.id}
                      className={`projectNameCard ${
                        isVisible ? "is-visible" : "is-hidden"
                      }`}
                      ref={(node) => {
                        if (node) nameTabRefs.current[idx] = node;
                        else delete nameTabRefs.current[idx];
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
          <Footer ref={footerRef} />
        </>
      }
    />
  );
}
