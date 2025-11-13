"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import AnimationCanvas from "../../../components/AnimationCanvas";
import "../../../styles/gopivot.scss";
import Link from "next/link";
import Nav from "../../../components/nav";
import DrawingCanvas from "../../../components/makObject.jsx"; // makObject 컴포넌트 임포트
import InfoBox from "../../../components/infoBox";

const MAX = 50;

const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

function ControlBox({ name, element }) {
  return (
    <div className="ControlBox">
      <p className="name">{name}</p>

      {element}
    </div>
  );
}

export default function GoPivot() {
  const [shape, setShape] = useState("")
  const [pivotStep, setPivotStep] = useState("make");
  const [arrangement, setArrangement] = useState("orbit");
  const [displayAngles, setDisplayAngles] = useState({ x: 0, y: 0 });
  const [trajectories, setTrajectories] = useState([
    {
      id: 0,
      objectType: "circle",
      count: 15,
      pointToCenter: true,
      customObjectId: null,
    },
    {
      id: 1,
      objectType: "square",
      count: 0,
      pointToCenter: true,
      customObjectId: null,
    },
    {
      id: 2,
      objectType: "line",
      count: 0,
      pointToCenter: false,
      customObjectId: null,
    },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [customObjects, setCustomObjects] = useState([]);
  const [loadingCustomObjects, setLoadingCustomObjects] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [pivotCount, setPivotCount] = useState(1);
  const [makerName, setMakerName] = useState("");
  const debouncedSetMakerName = useCallback(
    debounce((value) => setMakerName(value), 300),
    []
  );
  const [interactionState, setInteractionState] = useState(true);
  const [pivotMessage, setPivotMessage] = useState(""); // New state variable
  const [generatedTag, setGeneratedTag] = useState(null);
  const [makePivotModal, setMakePivotModal] = useState(false);

  const handleCustomObjectSave = useCallback(async (newCustomObject) => {
    // Firestore에서 최신 커스텀 오브젝트 목록을 다시 불러옵니다.
    try {
      setLoadingCustomObjects(true);
      const response = await fetch("/api/get_custom_objects");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCustomObjects(data);

      // 새로 저장된 커스텀 오브젝트를 선택된 궤적에 적용
      setTrajectories(prevTrajectories => {
        const updatedTrajectories = prevTrajectories.map((traj, i) => {
          if (i === selectedIndex) {
            return { ...traj, objectType: "custom", customObjectId: newCustomObject.id };
          }
          return traj;
        });
        return updatedTrajectories;
      });

    } catch (error) {
      console.error("Error refetching custom objects:", error);
      setFetchError(`커스텀 오브젝트를 다시 불러오는 데 실패했습니다: ${error.message}`);
    } finally {
      setLoadingCustomObjects(false);
      setMakePivotModal(false); // 모달 닫기
    }
  }, [selectedIndex]);

  const MESSAGEBANK = {
    // 단일 타입만 사용
    onlyOne: {
      circle: [
        `${makerName} 님은 원처럼 시작과 끝이 이어지는 집중력을 가지고 있습니다.`,
        `${makerName} 님의 탐구는 같은 곳을 돌아도 매번 새로운 길을 냅니다.`,
      ],
      square: [
        `${makerName} 님은 안정적 구조 위에 창의성을 쌓습니다.`,
        `정교한 기준과 균형. ${makerName} 님의 한 번의 선택이 전체를 정렬합니다.`,
      ],
      line: [
        `${makerName} 님은 방향을 잃지 않습니다. 한 줄로도 충분히 세계를 가릅니다.`,
        `목표를 향해 흔들림 없이. ${makerName} 님의 선은 의지의 궤적입니다.`,
      ],
    },

    // 특정 타입이 우세(지배)할 때
    dominant: {
      circle: [
        `원이 주도하는 화면. ${makerName}은(는) 유연하지만 중심을 잃지 않습니다.`,
        `순환의 리듬이 강합니다. 반복 속에서 더 멀리 가는 방식.`,
      ],
      square: [
        `구조가 말합니다. ${makerName}은(는) 안정으로 속도를 올립니다.`,
        `질서 있는 확장. 프레임 안에서 더 크게 자랍니다.`,
      ],
      line: [
        `방향성이 전체를 이끕니다. 직진이 곧 진보.`,
        `집중의 선이 화면을 관통합니다. 주저함 없이 앞으로.`,
      ],
    },

    // 타입별 카운트가 ‘많음/적음’일 때
    typeMany: {
      circle: [
        `원 다루기의 달인. 수많은 반복이 감각을 정교하게 만듭니다.`,
        `동그라미가 리듬을 만들고, 리듬이 힘을 만듭니다.`,
      ],
      square: [
        `구조가 촘촘합니다. ${makerName}의 설계는 흔들림이 없습니다.`,
        `정확한 모듈링. 스택이 쌓일수록 전체가 선명해집니다.`,
      ],
      line: [
        `수많은 선이 네비게이션을 완성합니다.`,
        `스트로크가 켜켜이 쌓여 방향을 증명합니다.`,
      ],
    },
    typeFew: {
      circle: [
        `필요할 때만 쓰는 절제된 원. 선택이 우아합니다.`,
        `최소한의 동그라미가 화면의 긴장을 잡습니다.`,
      ],
      square: [
        `필요한 자리만 정확히 메우는 사각형. 절제가 곧 미학.`,
        `군더더기 없는 구조. 꼭 필요한 블록만.`,
      ],
      line: [
        `선 몇 개로도 메시지를 명확히.`,
        `한두 줄의 스트로크가 방향을 정리합니다.`,
      ],
    },

    // 총합 기준
    totalMany: [
      `${makerName}님은 도전은 당신에게 두려움이 아니라 성장의 신호입니다.`,
      `에너지가 폭발합니다. 반복과 누적이 새로운 돌파구를 만듭니다.`,
    ],
    totalFew: [
      `시작이 이미 절반입니다. ${makerName}의 한 걸음이 전체의 방향을 정합니다.`,
      `작게 시작해도 충분합니다. 중요한 건 계속 나아가는 것.`,
    ],

    // 균형(세 타입이 모두 사용 & 편차 작음)
    balanced: [
      `균형이 놀랍습니다. 다양한 도구를 상황에 맞춰 쓰는 능력.`,
      `원·사각·선이 서로 보완하며 화면을 완성합니다.`,
    ],

    // pointToCenter 경향 (중심 지향 ↑ / 자유 탐색 ↑)
    centerSeeking: [
      `중심을 향해 모이는 힘. 분산된 것을 모아 의미를 만듭니다.`,
      `집중력이 디자인을 수렴시킵니다. 중심에서 답을 찾습니다.`,
    ],
    exploring: [
      `확산과 탐색이 이어집니다. 경로 자체가 결과를 만듭니다.`,
      `중심에서 벗어나며 발견되는 것들. 탐험은 계속됩니다.`,
    ],

    fixedLine: [
      `넘어져도 다시 일어나며, 새로운 방법을 찾아냅니다.`,
    ],

    concludingMessage: {
      circle: [
        `유연함이 당신의 길을 밝힙니다.`,
        `순환 속에서 새로운 의미를 찾으세요.`,
      ],
      square: [
        `견고한 구조가 당신의 도전을 지지합니다.`,
        `질서 속에서 더 큰 가능성을 발견하세요.`,
      ],
      line: [
        `명확한 방향성이 당신을 이끌 것입니다.`,
        `흔들림 없는 의지로 목표를 향해 나아가세요.`,
      ],
      default: [
        `당신의 피벗은 계속될 것입니다.`,
        `새로운 궤적을 기대합니다.`,
      ]
    },

    // 최신 타입(마지막 작업) 강조
    lastTouch: {
      circle: [
        `마무리는 원으로. 여운이 한 번 더 돌아옵니다.`,
        `끝맺음이 부드럽습니다. 유연함이 인상을 남깁니다.`,
      ],
      square: [
        `마무리는 구조로. 디자인이 단단히 잠깁니다.`,
        `정리의 한 수. 프레임이 전체를 붙잡습니다.`,
      ],
      line: [
        `마무리는 선으로. 방향이 또렷해집니다.`,
        `결정적인 스트로크. 시선이 길을 압니다.`,
      ],
    },
  };

  const animationRefs = useRef([
    { radius: 220, sizeFactor: 1, angleX: 0, angleY: 0 },
    { radius: 300, sizeFactor: 0.8, angleX: 0.2, angleY: 1.5 },
    { radius: 150, sizeFactor: 1.2, angleX: -0.2, angleY: -1.5 },
  ]);
  const wheelTS = useRef(0);
  const holderRef = useRef(null);

  useEffect(() => {
    const fetchCustomObjects = async () => {
      try {
        setLoadingCustomObjects(true);
        const response = await fetch("/api/get_custom_objects");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCustomObjects(data);
      } catch (error) {
        console.error("Error fetching custom objects:", error);
        setFetchError(
          `커스텀 오브젝트를 불러오는 데 실패했습니다: ${error.message}`
        );
      } finally {
        setLoadingCustomObjects(false);
      }
    };
    fetchCustomObjects();
  }, []);

  useEffect(() => {
    const onWheel = (e) => {
      const el = holderRef.current;
      if (!el || !el.contains(e.target)) {
        return;
      }

      e.preventDefault();
      const now = performance.now();
      if (now - wheelTS.current < 60) return;
      wheelTS.current = now;

      setTrajectories((current) =>
        current.map((traj, i) => {
          if (i === selectedIndex) {
            const newCount = traj.count + (e.deltaY < 0 ? 1 : -1);
            const otherCounts = current
              .filter((_, idx) => idx !== i)
              .reduce((sum, t) => sum + t.count, 0);
            const maxAllowed = MAX - otherCounts;
            return {
              ...traj,
              count: Math.max(0, Math.min(maxAllowed, newCount)),
            };
          }
          return traj;
        })
      );
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [selectedIndex, pivotStep]);

  const latestObjectsRef = useRef();

  const submitData = useCallback(async () => {
    if (!latestObjectsRef.current || latestObjectsRef.current.length === 0) {
      alert("전송할 데이터가 없습니다. 오브젝트 개수를 늘려주세요.");
      return;
    }

    if (!makerName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    try {
      const trajectoriesToSave = trajectories.map((traj, index) => ({
        ...traj,
        angleX: animationRefs.current[index].angleX,
        angleY: animationRefs.current[index].angleY,
        radius: animationRefs.current[index].radius, // Add radius
        sizeFactor: animationRefs.current[index].sizeFactor, // Add sizeFactor
      }));

      const response = await fetch("/api/save_trajectories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: makerName,
          tags: [generatedTag],
          objects: latestObjectsRef.current,
          trajectories: trajectoriesToSave, // Use the new array with angles
        }),
      });
      const result = await response.json();
      if (response.ok) {
      } else {
        alert(`데이터 전송 실패: ${result.message}`);
      }
    } catch (error) {
      console.error("Failed to submit data:", error);
      alert("데이터 전송 중 오류가 발생했습니다.");
    }
  }, [makerName, generatedTag, trajectories, animationRefs]); // Add animationRefs to dependencies

  const getPivotMessage = useCallback(() => {
    // 집계
    const typeCounts = { circle: 0, square: 0, line: 0, custom: 0 };
    let totalCount = 0;

    trajectories.forEach((t) => {
      totalCount += t.count;
      if (t.count > 0) {
        typeCounts[t.objectType] = (typeCounts[t.objectType] || 0) + 1;
      }
    });

    // 메시지 카테고리/키 결정
    const activeTrajectories = trajectories.filter((t) => t.count > 0);
    const activeTypes = Object.keys(typeCounts).filter(
      (k) => typeCounts[k] > 0
    );

    let messageCategory = "";
    let messageKey = "";

    if (activeTrajectories.length === 1) {
      messageCategory = "onlyOne";
      messageKey = activeTrajectories[0].objectType;
    } else if (activeTypes.length === 1 && activeTrajectories.length > 1) {
      messageCategory = "dominant";
      messageKey = activeTypes[0];
    } else if (totalCount > 100) {
      messageCategory = "totalMany";
    } else if (totalCount < 10) {
      messageCategory = "totalFew";
    } else {
      messageCategory = "totalMany"; // 임시 기본값 (원래 로직 유지)
    }

    // MESSAGEBANK에서 문구 뽑기
    const pick = (arr) =>
      Array.isArray(arr) && arr.length
        ? arr[Math.floor(Math.random() * arr.length)]
        : null;

    let primaryMessage = "피벗에 대한 메시지를 생성할 수 없습니다.";

    if (MESSAGEBANK[messageCategory]) {
      if (messageKey && MESSAGEBANK[messageCategory][messageKey]) {
        primaryMessage = pick(MESSAGEBANK[messageCategory][messageKey]) ?? primaryMessage;
      } else {
        primaryMessage = pick(MESSAGEBANK[messageCategory]) ?? primaryMessage;
      }
    }

    const fixedLineMessage = pick(MESSAGEBANK.fixedLine);

    let finalConcludingMessage = pick(MESSAGEBANK.concludingMessage.default);
    if (messageKey && MESSAGEBANK.concludingMessage[messageKey]) {
      finalConcludingMessage = pick(MESSAGEBANK.concludingMessage[messageKey]) ?? finalConcludingMessage;
    }

    let fullMessage = `${primaryMessage}\n${fixedLineMessage}\n${finalConcludingMessage}`;

    // ${makerName} 치환
    if (makerName && fullMessage.includes("${makerName}")) {
      fullMessage = fullMessage.replace(/\${makerName}/g, makerName);
    }

    return fullMessage;
  }, [trajectories, makerName]);

  const getPivotTag = useCallback(() => {
    const predefinedTags = ['호기심', '도전', '열정', '협업', '창의성', '영향력', '추진력', '비전', '공감'];
    const scores = predefinedTags.reduce((acc, tag) => ({ ...acc, [tag]: 0 }), {});

    const typeCounts = { circle: 0, square: 0, line: 0, custom: 0 };
    let totalCount = 0;
    let activeTrajectories = 0;
    let pointToCenterCount = 0;

    trajectories.forEach(t => {
      if (t.count > 0) {
        typeCounts[t.objectType] = (typeCounts[t.objectType] || 0) + 1; // Count trajectories per type
        totalCount += t.count;
        activeTrajectories++;
        if (t.pointToCenter) {
          pointToCenterCount++;
        }
      }
    });

    const activeTypes = Object.keys(typeCounts).filter(k => typeCounts[k] > 0);
    const typeRatios = {
        line: (typeCounts.line / activeTrajectories) || 0,
        circle: (typeCounts.circle / activeTrajectories) || 0,
        square: (typeCounts.square / activeTrajectories) || 0,
    };

    // Scoring based on trajectories analysis
    if (totalCount > 150) scores['열정']++;
    if (totalCount < 20 && totalCount > 0) scores['호기심']++;
    if (typeRatios.line > 0.6) scores['추진력']++;
    if (typeRatios.circle > 0.6) scores['공감']++;
    if (typeRatios.square > 0.6) scores['비전']++;
    if (typeCounts.custom > 0) scores['창의성']++;
    if (activeTypes.length >= 3) scores['협업']++;
    if (pointToCenterCount / activeTrajectories > 0.6) scores['도전']++;
    if (activeTrajectories === 3 && totalCount > 100) scores['영향력']++;

    let maxScore = 0;
    let selectedTag = null;
    for (const tag of predefinedTags) {
      if (scores[tag] > maxScore) {
        maxScore = scores[tag];
        selectedTag = tag;
      }
    }

    // If no tag has a clear high score, use a fallback logic
    if (!selectedTag) {
      if (typeCounts.custom > 0) return '창의성';
      if (activeTypes.length >= 3) return '협업';
      const dominantType = activeTypes.sort((a, b) => typeCounts[b] - typeCounts[a])[0];
      if (dominantType === 'line') return '추진력';
      if (dominantType === 'circle') return '공감';
      if (dominantType === 'square') return '비전';
    }

    return selectedTag || predefinedTags[Math.floor(Math.random() * predefinedTags.length)];

  }, [trajectories]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log("Key pressed:", e.key); // Debug log
      if (e.key === " ") {
        // Check for spacebar
        setInteractionState((prev) => !prev); // Toggle controlsDisabled
        e.preventDefault(); // Prevent default spacebar action (e.g., scrolling)
      } else if (e.key >= "1" && e.key <= "3") {
        setSelectedIndex(parseInt(e.key, 10) - 1);
      } else if (e.key.toLowerCase() === "p") {
        submitData();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [submitData, setInteractionState]);

  const handleSetObjectType = (type) => {
    setTrajectories((current) =>
      current.map((traj, i) =>
        i === selectedIndex
          ? { ...traj, objectType: type, customObjectId: null }
          : traj
      )
    );
  };

  const handleSetCustomObject = (customObjId) => {
    setTrajectories((current) =>
      current.map((traj, i) =>
        i === selectedIndex
          ? { ...traj, objectType: "custom", customObjectId: customObjId }
          : traj
      )
    );
  };

  const handleSetPointToCenter = () => {
    setTrajectories((current) =>
      current.map((traj, i) =>
        i === selectedIndex
          ? { ...traj, pointToCenter: !traj.pointToCenter }
          : traj
      )
    );
  };

  const selectedTrajectory = trajectories[selectedIndex];

  if (loadingCustomObjects) {
    return (
      <div>
        <h1>로딩 중...</h1>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div>
        <h1>오류 발생</h1>
        <p>{fetchError}</p>
        <Link href="/">홈으로</Link>
      </div>
    );
  }

  return (
    <>
      {/* {pivotStep !== "make" && <Nav />} */}
      <div
        className={`${pivotStep === "intro" && `introBg`} ${
          pivotStep === "make" && `makeBg`
        } ${pivotStep === "done" && `doneBg`}`}
      >
        {pivotStep === "intro" && (
          <div className="goPivotHero">
            <div className="titleBox">
              <svg
                width="592"
                height="90"
                viewBox="0 0 592 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 22.4627C0 16.2599 5.02843 11.2314 11.2313 11.2314V78.6193C5.02843 78.6193 0 73.5908 0 67.388V22.4627Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M56.1564 -4.90936e-07C62.3593 -2.198e-07 67.3877 5.02843 67.3877 11.2313L11.2312 11.2313C11.2312 5.02843 16.2596 -2.23488e-06 22.4625 -1.96374e-06L56.1564 -4.90936e-07Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M56.1564 89.8506C62.3593 89.8506 67.3877 84.8222 67.3877 78.6193L11.2312 78.6193C11.2312 84.8222 16.2596 89.8506 22.4625 89.8506L56.1564 89.8506Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M67.3877 33.7627L67.3877 44.994L33.6938 44.994L33.6938 33.7627L67.3877 33.7627Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M78.6191 22.4629L67.3878 22.4629L67.3878 11.2316C73.5907 11.2316 78.6191 16.26 78.6191 22.4629Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M78.6191 44.9941L67.3878 44.9941L67.3878 78.619C73.5907 78.619 78.6191 73.5905 78.6191 67.3877L78.6191 44.9941Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M132.181 0.108398H144.411C156.265 0.108422 165.875 9.71874 165.875 21.5732V56.1562H165.876V68.3857C165.876 80.2401 156.266 89.8501 144.412 89.8506H132.182V89.7812H120.951V89.8506H108.721C96.8667 89.8505 87.2566 80.2402 87.2563 68.3857V28.0781C87.2564 20.4759 92.2919 14.0498 99.2095 11.9531C98.7401 13.5017 98.4878 15.1448 98.4878 16.8467V64.3086C98.4878 71.7331 104.142 77.8376 111.379 78.5498H141.743C148.985 77.8422 154.645 71.7372 154.645 64.3096V33.8027H154.644V25.6504C154.644 17.7473 148.238 11.3399 140.334 11.3398H132.181V11.2314H104.103C102.401 11.2315 100.758 11.4838 99.2095 11.9531C101.306 5.03556 107.732 5.97337e-05 115.334 0H132.181V0.108398Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M285.579 11.24C285.579 5.03229 290.611 0 296.819 0V89.7814H285.579V11.24Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M194.562 22.4802C194.562 16.2725 199.594 11.2402 205.801 11.2402V89.92H194.562V22.4802Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M250.759 -4.91315e-07C256.967 -2.19969e-07 261.999 5.03231 261.999 11.24L205.799 11.24C205.799 5.03231 210.831 -2.2366e-06 217.039 -1.96526e-06L250.759 -4.91315e-07Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M261.999 44.9609C261.999 51.1686 256.967 56.2009 250.759 56.2009L228.279 56.2009L228.279 44.9609L261.999 44.9609Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M273.24 33.721C273.24 39.9286 268.207 44.9609 262 44.9609L262 11.241C268.207 11.241 273.24 16.2733 273.24 22.481L273.24 33.721Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M320.397 44.9707H331.637V78.6906C325.429 78.6906 320.397 73.6583 320.397 67.4506V44.9707Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M365.357 44.9707H376.597V67.4506C376.597 73.6583 371.565 78.6906 365.357 78.6906V44.9707Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M365.357 78.6611C365.357 84.8688 360.325 89.9011 354.117 89.9011L342.877 89.9011C336.67 89.9011 331.638 84.8688 331.638 78.6611L365.357 78.6611Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M387.839 33.7307C387.839 39.9384 382.807 44.9707 376.599 44.9707L376.599 0.0108328L387.839 0.0108337L387.839 33.7307Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M320.397 44.9707C314.189 44.9707 309.157 39.9384 309.157 33.7307L309.157 0.0108328L320.397 0.0108337L320.397 44.9707Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M506.272 -4.91314e-07C512.479 -2.19969e-07 517.512 5.03231 517.512 11.24L483.792 11.24L483.792 -1.47394e-06L506.272 -4.91314e-07Z"
                  fill="#E1E1E1"
                />
                <path
                  d="M562.471 0L562.471 11.24L528.751 11.24C528.751 5.03231 533.783 -1.25397e-06 539.991 -9.8263e-07L562.471 0Z"
                  fill="#E1E1E1"
                />
                <rect
                  x="528.75"
                  y="89.9209"
                  width="11.24"
                  height="78.6798"
                  transform="rotate(-180 528.75 89.9209)"
                  fill="#E1E1E1"
                />
                <path
                  d="M441.436 0.110352H453.674C465.538 0.110354 475.155 9.72792 475.155 21.5918V67.4443H475.154V68.4434C475.154 80.3072 465.537 89.9248 453.673 89.9248H441.435V89.8555H430.198V89.9229H417.96C406.096 89.9229 396.479 80.3053 396.479 68.4414V56.2031H407.719V64.3623C407.719 71.8036 413.395 77.9178 420.653 78.6152H451.003C458.251 77.9072 463.914 71.7969 463.914 64.3633V56.2051H463.915V25.5967C463.875 17.7217 457.479 11.3506 449.595 11.3506H441.437V33.8301H441.436V11.2422H413.336C411.633 11.2422 409.988 11.4951 408.438 11.9648C410.537 5.04194 416.967 0.00208924 424.575 0.00195312H441.436V0.110352ZM408.438 11.9648C407.969 13.5147 407.716 15.1591 407.716 16.8623V56.2012H396.476V28.1016C396.476 20.4935 401.516 14.0631 408.438 11.9648Z"
                  fill="#E1E1E1"
                />
                <rect
                  x="580.471"
                  width="11.24"
                  height="56.1998"
                  fill="#E1E1E1"
                />
                <path
                  d="M580.471 67.4404H591.711V78.6804C591.711 84.8881 586.678 89.9204 580.471 89.9204V67.4404Z"
                  fill="#E1E1E1"
                />
              </svg>

              <p className="comment">
                나만의 피벗을 만들고, 궤적을 남겨보세요.
              </p>
            </div>
            <button
              className="startBtn"
              onClick={() => {
                setPivotStep("make");
                console.log(pivotStep);
              }}
            >
              START
            </button>
            <Link
              href="/gpArchive"
              className="startBtn goArchive" // 버튼 스타일을 여기로 옮기기
            >
              PIVOT ARCHIVE
            </Link>
            <div className="samplePivotPlace">
              <svg
                className="A"
                width="326"
                height="334"
                viewBox="0 0 326 334"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    d="M0.5404 147.558C0.540397 228.753 73.0894 294.575 162.583 294.575C252.077 294.575 324.626 228.753 324.626 147.558C324.626 66.3627 252.077 0.541012 162.583 0.541007C73.0894 0.541003 0.540403 66.3627 0.5404 147.558Z"
                    stroke="white"
                    strokeWidth="1.08105"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M0.5404 170.743C0.540398 241.786 73.0894 299.379 162.583 299.379C252.077 299.379 324.626 241.786 324.626 170.743C324.626 99.6988 252.077 42.1064 162.583 42.1064C73.0894 42.1064 0.540403 99.6988 0.5404 170.743Z"
                    stroke="white"
                    strokeWidth="1.08105"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M0.540402 217.116C0.5404 267.861 73.0894 308.998 162.583 308.998C252.077 308.998 324.626 267.861 324.626 217.116C324.626 166.371 252.077 125.234 162.583 125.234C73.0894 125.234 0.540404 166.371 0.540402 217.116Z"
                    stroke="white"
                    strokeWidth="1.08105"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M0.540403 263.49C0.540402 293.936 73.0894 318.618 162.583 318.618C252.077 318.618 324.626 293.936 324.626 263.49C324.626 233.044 252.077 208.362 162.583 208.362C73.0894 208.362 0.540404 233.044 0.540403 263.49Z"
                    stroke="white"
                    strokeWidth="1.08105"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M0.540404 301.022C0.540404 316.049 73.0894 328.231 162.583 328.231C252.077 328.231 324.626 316.049 324.626 301.022C324.626 285.995 252.077 273.812 162.583 273.812C73.0894 273.812 0.540405 285.995 0.540404 301.022Z"
                    stroke="white"
                    strokeWidth="1.08105"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M162.583 333.046C73.0944 333.046 0.540407 333.046 0.540407 333.046C0.540407 333.046 73.0864 333.046 162.583 333.046ZM162.583 333.046C252.08 333.046 324.626 333.046 324.626 333.046"
                    stroke="white"
                    strokeWidth="1.08105"
                    strokeMiterlimit="10"
                  />
                </g>
              </svg>

              <svg
                className="B"
                width="428"
                height="433"
                viewBox="0 0 428 433"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.6">
                  <line
                    x1="245.952"
                    y1="400.31"
                    x2="181.015"
                    y2="32.0331"
                    stroke="white"
                  />
                  <line
                    x1="180.842"
                    y1="400.134"
                    x2="245.779"
                    y2="31.8564"
                    stroke="white"
                  />
                  <line
                    x1="119.881"
                    y1="377.759"
                    x2="306.861"
                    y2="53.901"
                    stroke="white"
                  />
                  <line
                    x1="70.246"
                    y1="335.88"
                    x2="356.715"
                    y2="95.5037"
                    stroke="white"
                  />
                  <line
                    x1="37.9296"
                    y1="279.561"
                    x2="389.336"
                    y2="151.66"
                    stroke="white"
                  />
                  <line
                    x1="26.8247"
                    y1="215.581"
                    x2="400.783"
                    y2="215.581"
                    stroke="white"
                  />
                  <line
                    x1="38.2706"
                    y1="151.659"
                    x2="389.677"
                    y2="279.56"
                    stroke="white"
                  />
                  <line
                    x1="70.8912"
                    y1="95.5105"
                    x2="357.36"
                    y2="335.886"
                    stroke="white"
                  />
                  <line
                    x1="120.747"
                    y1="53.9023"
                    x2="307.727"
                    y2="377.76"
                    stroke="white"
                  />
                  <line
                    x1="213.305"
                    y1="361.944"
                    x2="213.305"
                    y2="70.2369"
                    stroke="white"
                  />
                  <line
                    x1="163.45"
                    y1="352.977"
                    x2="263.219"
                    y2="78.8621"
                    stroke="white"
                  />
                  <line
                    x1="119.668"
                    y1="327.496"
                    x2="307.174"
                    y2="104.035"
                    stroke="white"
                  />
                  <line
                    x1="87.2417"
                    y1="288.582"
                    x2="339.868"
                    y2="142.728"
                    stroke="white"
                  />
                  <line
                    x1="70.0797"
                    y1="240.922"
                    x2="357.355"
                    y2="190.267"
                    stroke="white"
                  />
                  <line
                    x1="70.2533"
                    y1="190.267"
                    x2="357.529"
                    y2="240.922"
                    stroke="white"
                  />
                  <line
                    x1="87.7417"
                    y1="142.728"
                    x2="340.368"
                    y2="288.582"
                    stroke="white"
                  />
                  <line
                    x1="120.434"
                    y1="104.035"
                    x2="307.94"
                    y2="327.496"
                    stroke="white"
                  />
                  <line
                    x1="164.387"
                    y1="78.8622"
                    x2="264.157"
                    y2="352.977"
                    stroke="white"
                  />
                </g>
              </svg>

              <svg
                className="C"
                width="535"
                height="451"
                viewBox="0 0 535 451"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.6">
                  <circle
                    cx="182.13"
                    cy="175.952"
                    r="122.628"
                    transform="rotate(30 182.13 175.952)"
                    stroke="#D9D9D9"
                  />
                  <circle
                    cx="206.045"
                    cy="189.759"
                    r="122.628"
                    transform="rotate(30 206.045 189.759)"
                    stroke="#D9D9D9"
                  />
                  <circle
                    cx="255.138"
                    cy="218.104"
                    r="122.628"
                    transform="rotate(30 255.138 218.104)"
                    stroke="#D9D9D9"
                  />
                  <circle
                    cx="291.643"
                    cy="239.18"
                    r="122.628"
                    transform="rotate(30 291.643 239.18)"
                    stroke="#D9D9D9"
                  />
                  <circle
                    cx="328.147"
                    cy="260.256"
                    r="122.628"
                    transform="rotate(30 328.147 260.256)"
                    stroke="#D9D9D9"
                  />
                  <circle
                    cx="352.063"
                    cy="274.063"
                    r="122.628"
                    transform="rotate(30 352.063 274.063)"
                    stroke="#D9D9D9"
                  />
                  <circle
                    cx="167.513"
                    cy="167.513"
                    r="122.628"
                    transform="rotate(30 167.513 167.513)"
                    stroke="#D9D9D9"
                  />
                  <circle
                    cx="366.678"
                    cy="282.501"
                    r="122.628"
                    transform="rotate(30 366.678 282.501)"
                    stroke="#D9D9D9"
                  />
                </g>
              </svg>

              <svg
                className="D"
                width="372"
                height="372"
                viewBox="0 0 372 372"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <rect
                    x="96.0608"
                    y="83.8301"
                    width="117.472"
                    height="136.641"
                    transform="rotate(-45 96.0608 83.8301)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="96.0608"
                    y="83.8301"
                    width="117.472"
                    height="136.641"
                    transform="rotate(-45 96.0608 83.8301)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="275.75"
                    y="287.981"
                    width="117.472"
                    height="136.641"
                    transform="rotate(135 275.75 287.981)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="287.986"
                    y="96.0632"
                    width="117.472"
                    height="136.641"
                    transform="rotate(45 287.986 96.0632)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="287.986"
                    y="96.0632"
                    width="117.472"
                    height="136.641"
                    transform="rotate(45 287.986 96.0632)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="83.8301"
                    y="275.751"
                    width="117.472"
                    height="136.641"
                    transform="rotate(-135 83.8301 275.751)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="159.137"
                    y="52.5814"
                    width="117.472"
                    height="136.641"
                    transform="rotate(-15 159.137 52.5814)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="159.137"
                    y="52.5814"
                    width="117.472"
                    height="136.641"
                    transform="rotate(-15 159.137 52.5814)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="212.674"
                    y="319.23"
                    width="117.472"
                    height="136.641"
                    transform="rotate(165 212.674 319.23)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="319.234"
                    y="159.136"
                    width="117.472"
                    height="136.641"
                    transform="rotate(75 319.234 159.136)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="319.234"
                    y="159.136"
                    width="117.472"
                    height="136.641"
                    transform="rotate(75 319.234 159.136)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="52.5814"
                    y="212.675"
                    width="117.472"
                    height="136.641"
                    transform="rotate(-105 52.5814 212.675)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="229.387"
                    y="57.0595"
                    width="117.472"
                    height="136.641"
                    transform="rotate(15 229.387 57.0595)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="229.387"
                    y="57.0595"
                    width="117.472"
                    height="136.641"
                    transform="rotate(15 229.387 57.0595)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="142.425"
                    y="314.752"
                    width="117.472"
                    height="136.641"
                    transform="rotate(-165 142.425 314.752)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="314.756"
                    y="229.385"
                    width="117.472"
                    height="136.641"
                    transform="rotate(105 314.756 229.385)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="314.756"
                    y="229.385"
                    width="117.472"
                    height="136.641"
                    transform="rotate(105 314.756 229.385)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                  <rect
                    x="57.059"
                    y="142.425"
                    width="117.472"
                    height="136.641"
                    transform="rotate(-75 57.059 142.425)"
                    stroke="#D9D9D9"
                    strokeWidth="1.08105"
                  />
                </g>
              </svg>

              <svg
                className="bg"
                width="1920"
                height="512"
                viewBox="0 0 1920 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <mask
                    id="mask0_1405_5348"
                    style={{ maskType: 'alpha' }} // style="mask-type:alpha" → maskType 속성으로
                    maskUnits="userSpaceOnUse"
                    x="-53"
                    y="0"
                    width="2028"
                    height="512"
                  >
                    <path opacity="0.3" d="M0 0.5H1922" stroke="#E1E1E1" />
                    <path opacity="0.3" d="M0 128.25H1922" stroke="#E1E1E1" />
                    <path
                      opacity="0.3"
                      d="M961 0.5L961 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M858 0.5L768 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M1064 0.5L1154 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M744 0.5L535 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M1178 0.5L1387 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M605 0.5L256 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M1325 0.5L1666 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M450 0.5L-52 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M1484 0.5L1974 511.5"
                      stroke="#E1E1E1"
                    />
                    <path opacity="0.3" d="M0 256H1922" stroke="#E1E1E1" />
                    <path opacity="0.3" d="M0 383.75H1922" stroke="#E1E1E1" />
                    <path opacity="0.3" d="M0 511.5H1922" stroke="#E1E1E1" />
                  </mask>

                  <g mask="url(#mask0_1405_5348)">
                    <rect
                      x="1"
                      y="-127.5"
                      width="2186"
                      height="699"
                      fill="url(#paint0_linear_1405_5348)"
                    />
                  </g>
                </g>

                <defs>
                  <linearGradient
                    id="paint0_linear_1405_5348"
                    x1="1094"
                    y1="-127.5"
                    x2="1094"
                    y2="571.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" stopOpacity="0" />
                    {/* stopColor / stop-opacity → camelCase */}
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <InfoBox/>
          </div>
        )}
        {pivotStep === "make" && (
          <div className="makePivot">
            <div className="topBar">
              {/* <div className="backBtn" onClick={() => setPivotStep("intro")}>
                <svg
                  style={{
                    width: "clamp(23px, 2.45vw, 47px)",
                    height: "clamp(23px, 2.45vw, 47px)",
                  }}
                  viewBox="0 0 47 47"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.9678 12.5449L15.3193 23.1934L25.9678 33.8418"
                    stroke="white"
                  />
                  <circle
                    cx="23.1931"
                    cy="23.1931"
                    r="22.6931"
                    stroke="white"
                  />
                </svg>
                <p>BACK TO MAIN</p>
              </div> */}
              <div
                style={{
                  padding: 12,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                
              </div>

              <div className="addPivotSlots">
                <div className="addListPlaceHolder">
                  <div className="PivotLength">
                    {Array.from({ length: pivotCount }).map((_, i) => (
                      <div
                        key={i}
                        className={`${
                          selectedIndex === i && `selected`
                        } LengthCard`}
                        onClick={() => setSelectedIndex(i)}
                      >
                        <p className="text">궤적</p>
                        <p className="text">{i + 1}</p>
                      </div>
                    ))}
                  </div>

                  <div className="BtnList">
                    {/* ➕ 추가: 최대 3개 */}
                    <div
                      className="Btn add"
                      onClick={() => {
                        if (pivotCount >= 3) return;
                        const newPivotCount = pivotCount + 1;
                        setTrajectories((prevTrajectories) =>
                          prevTrajectories.map((traj, i) => {
                            if (i === newPivotCount - 1) {
                              return { ...traj, count: 3 };
                            }
                            return traj;
                          })
                        );
                        setPivotCount(newPivotCount);
                        setSelectedIndex(newPivotCount - 1);
                      }}
                    >
                      <div className="line A"></div>
                      <div className="line B"></div>
                    </div>

                    {/* ➖ 제거: 최소 1개 */}
                    <div
                      className="Btn remove"
                      onClick={() => {
                        setPivotCount((prevPivotCount) => {
                          const newPivotCount = Math.max(1, prevPivotCount - 1);
                          if (newPivotCount < prevPivotCount) {
                            setTrajectories((prevTrajectories) =>
                              prevTrajectories.map((traj, i) => {
                                if (i === prevPivotCount - 1) {
                                  return { ...traj, count: 0 };
                                }
                                return traj;
                              })
                            );
                          }
                          return newPivotCount;
                        });
                      }}
                    >
                      <div className="line A"></div>
                    </div>
                  </div>
                </div>
                <p className="max-3">
                  *궤적은 최대 3개까지 추가 할 수 있습니다.
                </p>
              </div>
            </div>

            {makePivotModal && (
                        <div className="modal-overlay">
                          <div className="modal-content">
                            <button className="modal-close-btn" onClick={() => setMakePivotModal(false)}><svg style={{width: 'clamp(15px, 1.51vw, 29px)', height: 'clamp(15px, 1.51vw, 29px)'}} viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.353516 0.353516L28.3535 28.3535" stroke="#E1E1E1"/>
<path d="M28.3535 0.353516L0.353513 28.3535" stroke="#E1E1E1"/>
</svg>
</button>
                            <DrawingCanvas onSave={handleCustomObjectSave} />
                          </div>
                        </div>
                      )}

            <div className="PivotInfoPlaceHolder">
              <div className="leftLine">
                <div className="NameInput">
                  <input
                    type="text"
                    placeholder="Your name"
                    className="Input"
                    onChange={(e) => setMakerName(e.target.value)}
                    name="nameInput"
                  ></input>
                  <span className="whoIsMaker">'s PIVOT</span>
                </div>

                <div className="mouseBox">
                  <div className="mouseInteraction">
                    <div className="svgPlaceHolder">
                      <svg
                        style={{width: 'clamp(26px, 2.71vw, 52px)', height: 'clamp(25px, 2.60vw, 50px)'}}
                        viewBox="0 0 52 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="0.450195"
                          y="4.44922"
                          width="32.4492"
                          height="44.3577"
                          rx="16.2246"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M0.513672 22.0566H33.0609"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M16.792 4.44922L16.792 22.0568"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <rect
                          x="13.3525"
                          y="14.2217"
                          width="6.64453"
                          height="11.9902"
                          rx="3.32227"
                          fill="#7A7A7A"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M38.7188 16.3283V0.636719"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M47.2051 0.636518L47.2051 16.3281"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M35.2148 4.14062L38.7189 0.636618L42.2229 4.14062"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M50.7109 12.8223L47.2044 16.3288L43.6979 12.8223"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                      </svg>
                    </div>
                    <p className="text">
                      <span>마우스 휠</span>
                      도형 개수
                    </p>
                  </div>
                  <div className="middleLine"></div>
                  {/* <div className="mouseInteraction">
                    <div className="svgPlaceHolder">
                      <svg
                        style={{width: 'clamp(24px, 2.5vw, 48px)', height: 'clamp(23px, 2.4vw, 46px)'}}
                        viewBox="0 0 48 46"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.4511 17.9181H0.741211V14.201L1.82033 9.84436L4.77802 5.28791L10.0139 1.77065L16.6488 0.211914V10.1642L14.9701 10.6437L13.4511 12.3225V17.9181Z"
                          fill="#7A7A7A"
                        />
                        <rect
                          x="0.450195"
                          y="0.450195"
                          width="32.4492"
                          height="44.3577"
                          rx="16.2246"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M0.513672 18.0576H33.0609"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M16.792 0.450195L16.792 18.0578"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <rect
                          x="13.3525"
                          y="10.2227"
                          width="6.64453"
                          height="11.9902"
                          rx="3.32227"
                          fill="#222222"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M47.3122 8.51562L35.9229 8.51562"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M41.6172 14.2109L35.922 8.51578L41.6172 2.82061"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                      </svg>
                    </div>
                    <p className="text">
                      <span>좌 드래그</span>
                      크기 변경
                    </p>
                  </div> */}
                  {/* <div className="middleLine"></div> */}

                  <div className="mouseInteraction">
                    <div className="svgPlaceHolder">
                      <svg
                        style={{width: 'clamp(24px, 2.5vw, 48px)', height: 'clamp(23px, 2.4vw, 46px)'}}
                        viewBox="0 0 48 46"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.9542 17.9191H32.6641V14.2019L31.5849 9.84534L28.6273 5.28888L23.3913 1.77162L16.7565 0.212891V10.1651L18.4352 10.6447L19.9542 12.3235V17.9191Z"
                          fill="#7A7A7A"
                        />
                        <rect
                          x="0.450195"
                          y="0.450195"
                          width="32.4492"
                          height="44.3577"
                          rx="16.2246"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M0.513672 18.0576H33.0609"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M16.792 0.450195L16.792 18.0578"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <rect
                          x="13.3525"
                          y="10.2227"
                          width="6.64453"
                          height="11.9902"
                          rx="3.32227"
                          fill="#222222"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M35.9203 8.38379L47.3096 8.38379"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                        <path
                          d="M41.6162 2.68945L47.3114 8.38462L41.6162 14.0798"
                          stroke="white"
                          strokeWidth="0.9"
                        />
                      </svg>
                    </div>
                    <p className="text">
                      <span>우 드래그</span>
                      각도 변경
                    </p>
                  </div>
                </div>
                <ControlBox
                  name={"SYSTEM"}
                  element={
                    <div className="borderBox system">
                      <div
                        className={`Button ${
                          selectedTrajectory.pointToCenter ? "active" : ""
                        }`}
                        onClick={handleSetPointToCenter}
                      >
                        <svg
                          style={{width: 'clamp(23px, 2.45vw, 47px)', height: 'clamp(23px, 2.45vw, 47px)'}}
                          viewBox="0 0 47 47"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="23.1931"
                            cy="23.1931"
                            r="22.6931"
                            stroke="white"
                          />
                          <rect
                            x="12.8486"
                            y="12.8467"
                            width="20.6904"
                            height="20.6904"
                            stroke="white"
                          />
                          <circle
                            cx="23.1929"
                            cy="23.1909"
                            r="1.65869"
                            fill="white"
                          />
                        </svg>

                        <p>중심점 정렬</p>
                      </div>
                      <div className="middleLine"></div>
                      <div
                        className="Button"
                        onClick={() =>
                          setTrajectories([
                            {
                              id: 0,
                              objectType: "circle",
                              count: 15,
                              pointToCenter: true,
                              customObjectId: null,
                            },
                            {
                              id: 1,
                              objectType: "square",
                              count: 0,
                              pointToCenter: true,
                              customObjectId: null,
                            },
                            {
                              id: 2,
                              objectType: "line",
                              count: 0,
                              pointToCenter: false,
                              customObjectId: null,
                            },
                          ])
                        }
                      >
                        <svg
                          style={{width: 'clamp(23px, 2.45vw, 47px)', height: 'clamp(23px, 2.45vw, 47px)'}}
                          viewBox="0 0 47 47"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="23.1931"
                            cy="23.1931"
                            r="22.6931"
                            stroke="white"
                          />
                          <path
                            d="M23.796 33.2695C29.0995 33.2695 33.3987 28.9703 33.3987 23.6668C33.3987 18.3634 29.0995 14.0642 23.796 14.0642C18.4926 14.0642 14.1934 18.3634 14.1934 23.6668"
                            stroke="white"
                          />
                          <path
                            d="M12.4106 15.4288L13.6519 24.2621L22.1236 20.9489"
                            stroke="white"
                          />
                        </svg>

                        <p>RESET</p>
                      </div>
                    </div>
                  }
                ></ControlBox>

                <div className="leftBottom">
                  <div className="ControlBoxList">
                    <ControlBox
                      name="SHAPE"
                      element={
                        <>
                          <div className="middleLine"></div>
                          <p className="Property">
                            {trajectories[selectedIndex].objectType
                              .charAt(0)
                              .toUpperCase() +
                              trajectories[selectedIndex].objectType.slice(1)}
                          </p>
                        </>
                      }
                    />
                    <ControlBox
                      name="Total"
                      element={
                        <>
                          <div className="middleLine"></div>
                          <p className="Property">{selectedTrajectory.count}</p>
                        </>
                      }
                    />
                    <ControlBox
                      name="Angle"
                      element={
                        <>
                          <div className="middleLine"></div>
                          <p id="angle-display" className="Property">
                            X: 0.00, Y: 0.00
                          </p>
                        </>
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="rightLine">
                <ControlBox
                  name="MODE"
                  element={
                    <div
                      className="borderBox modeToggle"
                      style={{ display: "flex" }}
                    >
                      <div
                        onClick={() => setArrangement("stack")}
                        className={arrangement === "stack" ? `active` : ""}
                      >
                        AXIS
                      </div>
                      <div className="line"></div>
                      <div
                        onClick={() => setArrangement("orbit")}
                        className={arrangement === "orbit" ? `active` : ""}
                      >
                        ORBIT
                      </div>
                    </div>
                  }
                />
                <ControlBox
                  name="SHAPE"
                  element={
                    <div className="shapeGrid">
                      <div className={shape==="line" ? "active":""} 
                      onClick={() => {handleSetObjectType("line")
                        setShape("line")}
                      }>
                        <svg
                          className="Icon"
                          style={{width: 'clamp(15px, 1.56vw, 30px)', height: 'clamp(15px, 1.56vw, 30px)'}}
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.529901 29.3672L29.3672 0.529901"
                            stroke="#E1E1E1"
                            strokeWidth="1.5"
                          />
                        </svg>
                        DIRECTION
                        <div className="line"></div>
                      </div>
                      <div className={shape==="circle" ? "active":""}
                      onClick={() => {handleSetObjectType("circle")
                        setShape("circle")
                      }}>
                        <svg
                          className="Icon"
                          style={{width: 'clamp(16px, 1.67vw, 32px)', height: 'clamp(16px, 1.67vw, 32px)'}}
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="31.1221"
                            y="31.1221"
                            width="30.3725"
                            height="30.3725"
                            rx="15.1863"
                            transform="rotate(-180 31.1221 31.1221)"
                            stroke="#E1E1E1"
                            strokeWidth="1.5"
                          />
                        </svg>
                        BALANCE
                      </div>
                      <div className={shape==="square" ? "active":""} 
                      onClick={() => {handleSetObjectType("square")
                        setShape("square")
                      }}>
                        <svg
                          className="Icon"
                          style={{width: 'clamp(15px, 1.56vw, 30px)', height: 'clamp(15px, 1.56vw, 30px)'}}
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="28.7676"
                            y="28.7676"
                            width="28.0173"
                            height="28.0173"
                            transform="rotate(-180 28.7676 28.7676)"
                            stroke="#E1E1E1"
                            strokeWidth="1.5"
                          />
                        </svg>
                        RULE
                        <div className="lineBot"></div>
                        <div className="line right"></div>
                      </div>
                      <div className={shape==="custom" ? "active":""} onClick={() => {setMakePivotModal(true)
                        setShape("custom")
                      }}>
                          <svg className="Icon" style={{width: 'clamp(18px, 1.93vw, 37px)', height: 'clamp(18px, 1.88vw, 36px)'}} viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.5488 6.13867H21.7988V6.6508L22.2758 6.83722L22.5488 6.13867ZM25.8018 8.01855L25.3328 8.60385L25.7327 8.92428L26.1766 8.66818L25.8018 8.01855ZM30.4717 5.32422L31.1212 4.94921L30.7463 4.2999L30.0969 4.67459L30.4717 5.32422ZM35.0049 13.1758L35.3797 13.8254L36.0295 13.4505L35.6544 12.8008L35.0049 13.1758ZM30.3389 15.8682L29.964 15.2186L29.5207 15.4744L29.5973 15.9805L30.3389 15.8682ZM30.4805 17.75H31.2305V17.75L30.4805 17.75ZM30.3389 19.6318L29.5973 19.5196L29.5207 20.0255L29.9639 20.2813L30.3389 19.6318ZM35.002 22.3242L35.6515 22.6992L36.0265 22.0497L35.377 21.6747L35.002 22.3242ZM30.4688 30.1758L30.0937 30.8253L30.7432 31.2004L31.1183 30.5508L30.4688 30.1758ZM25.8018 27.4805L26.1768 26.831L25.7328 26.5746L25.3327 26.8952L25.8018 27.4805ZM22.5488 29.3613L22.2758 28.6628L21.7988 28.8492V29.3613H22.5488ZM22.5488 34.749V35.499H23.2988V34.749H22.5488ZM13.4824 34.749H12.7324V35.499H13.4824V34.749ZM13.4824 29.3633H14.2324V28.851L13.7553 28.6647L13.4824 29.3633ZM10.2256 27.4814L10.6946 26.8962L10.2945 26.5755L9.85048 26.832L10.2256 27.4814ZM5.56055 30.1758L4.91101 30.5508L5.28606 31.2004L5.93565 30.8252L5.56055 30.1758ZM1.02734 22.3232L0.65221 21.6738L0.0029304 22.0488L0.377808 22.6982L1.02734 22.3232ZM5.68848 19.6309L6.06361 20.2803L6.50656 20.0244L6.43004 19.5187L5.68848 19.6309ZM5.54785 17.75L4.79785 17.75V17.75H5.54785ZM5.68848 15.8691L6.43003 15.9814L6.50661 15.4754L6.06343 15.2196L5.68848 15.8691ZM1.02441 13.1768L0.374899 12.8018L-0.000136256 13.4513L0.649457 13.8263L1.02441 13.1768ZM5.55762 5.3252L5.9326 4.67567L5.2831 4.3007L4.9081 4.95019L5.55762 5.3252ZM10.2246 8.01953L9.84963 8.66906L10.2936 8.92539L10.6937 8.60475L10.2246 8.01953ZM13.4824 6.13672L13.7552 6.83534L14.2324 6.649V6.13672H13.4824ZM13.4824 0.75V0H12.7324V0.75H13.4824ZM22.5488 0.75H23.2988V0H22.5488V0.75ZM18.0146 12.083V11.333H18.0146L18.0146 12.083ZM12.3486 17.749L11.5986 17.749V17.749H12.3486ZM18.0146 23.416L18.0146 24.166H18.0146V23.416ZM23.6816 17.749H24.4316V17.749L23.6816 17.749ZM22.5488 6.13867L22.2758 6.83722C23.3875 7.2717 24.4164 7.86963 25.3328 8.60385L25.8018 8.01855L26.2707 7.43326C25.2369 6.6049 24.076 5.93028 22.8218 5.44012L22.5488 6.13867ZM25.8018 8.01855L26.1766 8.66818L30.8465 5.97385L30.4717 5.32422L30.0969 4.67459L25.427 7.36892L25.8018 8.01855ZM30.4717 5.32422L29.8222 5.69922L34.3554 13.5508L35.0049 13.1758L35.6544 12.8008L31.1212 4.94921L30.4717 5.32422ZM35.0049 13.1758L34.63 12.5262L29.964 15.2186L30.3389 15.8682L30.7137 16.5178L35.3797 13.8254L35.0049 13.1758ZM30.3389 15.8682L29.5973 15.9805C29.6847 16.5575 29.7304 17.1484 29.7305 17.75L30.4805 17.75L31.2305 17.75C31.2304 17.0722 31.1789 16.4063 31.0804 15.7559L30.3389 15.8682ZM30.4805 17.75H29.7305C29.7305 18.3514 29.6847 18.9426 29.5973 19.5196L30.3389 19.6318L31.0804 19.7441C31.1789 19.0939 31.2305 18.4277 31.2305 17.75H30.4805ZM30.3389 19.6318L29.9639 20.2813L34.6269 22.9737L35.002 22.3242L35.377 21.6747L30.7139 18.9823L30.3389 19.6318ZM35.002 22.3242L34.3524 21.9492L29.8192 29.8008L30.4688 30.1758L31.1183 30.5508L35.6515 22.6992L35.002 22.3242ZM30.4688 30.1758L30.8438 29.5263L26.1768 26.831L25.8018 27.4805L25.4267 28.1299L30.0937 30.8253L30.4688 30.1758ZM25.8018 27.4805L25.3327 26.8952C24.4161 27.6298 23.3875 28.2283 22.2758 28.6628L22.5488 29.3613L22.8219 30.0599C24.0765 29.5695 25.237 28.8942 26.2708 28.0657L25.8018 27.4805ZM22.5488 29.3613H21.7988V34.749H22.5488H23.2988V29.3613H22.5488ZM22.5488 34.749V33.999H13.4824V34.749V35.499H22.5488V34.749ZM13.4824 34.749H14.2324V29.3633H13.4824H12.7324V34.749H13.4824ZM13.4824 29.3633L13.7553 28.6647C12.6421 28.2299 11.612 27.6314 10.6946 26.8962L10.2256 27.4814L9.75656 28.0667C10.7915 28.8961 11.9538 29.5715 13.2096 30.0619L13.4824 29.3633ZM10.2256 27.4814L9.85048 26.832L5.18545 29.5263L5.56055 30.1758L5.93565 30.8252L10.6007 28.1309L10.2256 27.4814ZM5.56055 30.1758L6.21008 29.8008L1.67688 21.9483L1.02734 22.3232L0.377808 22.6982L4.91101 30.5508L5.56055 30.1758ZM1.02734 22.3232L1.40248 22.9727L6.06361 20.2803L5.68848 19.6309L5.31334 18.9814L0.65221 21.6738L1.02734 22.3232ZM5.68848 19.6309L6.43004 19.5187C6.34289 18.9426 6.29785 18.3517 6.29785 17.75H5.54785H4.79785C4.79785 18.4266 4.8485 19.0925 4.94691 19.743L5.68848 19.6309ZM5.54785 17.75L6.29785 17.75C6.29787 17.1481 6.34283 16.5575 6.43003 15.9814L5.68848 15.8691L4.94692 15.7569C4.84843 16.4076 4.79788 17.0733 4.79785 17.75L5.54785 17.75ZM5.68848 15.8691L6.06343 15.2196L1.39937 12.5272L1.02441 13.1768L0.649457 13.8263L5.31352 16.5187L5.68848 15.8691ZM1.02441 13.1768L1.67393 13.5518L6.20713 5.7002L5.55762 5.3252L4.9081 4.95019L0.374899 12.8018L1.02441 13.1768ZM5.55762 5.3252L5.18263 5.97472L9.84963 8.66906L10.2246 8.01953L10.5996 7.37L5.9326 4.67567L5.55762 5.3252ZM10.2246 8.01953L10.6937 8.60475C11.6113 7.86922 12.6418 7.27012 13.7552 6.83534L13.4824 6.13672L13.2096 5.4381C11.9533 5.92868 10.7907 6.60463 9.75554 7.43432L10.2246 8.01953ZM13.4824 6.13672H14.2324V0.75H13.4824H12.7324V6.13672H13.4824ZM13.4824 0.75V1.5H22.5488V0.75V0H13.4824V0.75ZM22.5488 0.75H21.7988V6.13867H22.5488H23.2988V0.75H22.5488ZM18.0146 12.083L18.0146 11.333C14.4713 11.3333 11.5989 14.2057 11.5986 17.749L12.3486 17.749L13.0986 17.7491C13.0989 15.0341 15.2997 12.8332 18.0147 12.833L18.0146 12.083ZM12.3486 17.749H11.5986C11.5986 21.2925 14.471 24.1657 18.0146 24.166L18.0146 23.416L18.0147 22.666C15.2997 22.6658 13.0986 20.4643 13.0986 17.749H12.3486ZM18.0146 23.416V24.166C21.5584 24.166 24.4316 21.2928 24.4316 17.749H23.6816H22.9316C22.9316 20.4643 20.73 22.666 18.0146 22.666V23.416ZM23.6816 17.749L24.4316 17.749C24.4313 14.2054 21.5581 11.333 18.0146 11.333V12.083V12.833C20.7299 12.833 22.9314 15.0341 22.9316 17.7491L23.6816 17.749Z" fill="#E1E1E1"/>
                          </svg>
                        <span className="CUSTOMtextLine">
                          CUSTOM
  

                        </span>

                        <div className="line"></div>
                      </div>
                      
                    </div>
                    
                  }
                />
         
                <button
                  className="startBtn"
                  onClick={() => {
                    const message = getPivotMessage(); // 문자열만 반환됨
                    const tag = getPivotTag();
                    setPivotMessage(message); // 상태에 메시지 저장
                    setGeneratedTag(tag);
                    setPivotStep("done");
                    setInteractionState(false);
                    submitData();
                    alert(`${makerName} 팀 오브젝트 저장 완료!`)
                  }}
                >
                  팀 오브젝트!
                </button>
              </div>
              
            </div>
          </div>
        )}
        {(pivotStep === "make" || pivotStep === "done") && (
          
          <>
          <div
            ref={holderRef}
            className={`objectControl ${interactionState ? "" : "off"} ${
              pivotStep === "done" ? "done" : ""
            }`}
          >
            <AnimationCanvas
              trajectories={trajectories}
              arrangement={arrangement}
              customObjects={customObjects}
              animationRefs={animationRefs}
              selectedIndex={selectedIndex}
              latestObjectsRef={latestObjectsRef}
            />
            
          </div>
          <div className="background">

                                <svg
                className="bg"
                width="1920"
                height="512"
                viewBox="0 0 1920 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <mask
                    id="mask0_1405_5348"
                    style={{ maskType: 'alpha' }} // style="mask-type:alpha" → maskType 속성으로
                    maskUnits="userSpaceOnUse"
                    x="-53"
                    y="0"
                    width="2028"
                    height="512"
                  >
                    <path opacity="0.3" d="M0 0.5H1922" stroke="#E1E1E1" />
                    <path opacity="0.3" d="M0 128.25H1922" stroke="#E1E1E1" />
                    <path
                      opacity="0.3"
                      d="M961 0.5L961 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M858 0.5L768 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M1064 0.5L1154 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M744 0.5L535 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M1178 0.5L1387 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M605 0.5L256 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M1325 0.5L1666 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M450 0.5L-52 511.5"
                      stroke="#E1E1E1"
                    />
                    <path
                      opacity="0.3"
                      d="M1484 0.5L1974 511.5"
                      stroke="#E1E1E1"
                    />
                    <path opacity="0.3" d="M0 256H1922" stroke="#E1E1E1" />
                    <path opacity="0.3" d="M0 383.75H1922" stroke="#E1E1E1" />
                    <path opacity="0.3" d="M0 511.5H1922" stroke="#E1E1E1" />
                  </mask>

                  <g mask="url(#mask0_1405_5348)">
                    <rect
                      x="1"
                      y="-127.5"
                      width="2186"
                      height="699"
                      fill="url(#paint0_linear_1405_5348)"
                    />
                  </g>
                </g>

                <defs>
                  <linearGradient
                    id="paint0_linear_1405_5348"
                    x1="1094"
                    y1="-127.5"
                    x2="1094"
                    y2="571.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" stopOpacity="0" />
                    {/* stopColor / stop-opacity → camelCase */}
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                </defs>
              </svg>

              </div>
              </>
        )}
        {pivotStep === "done" && (

          <>
           <div className="backBtn" onClick={() => setPivotStep("make")}>
                <svg
                  width="47"
                  height="47"
                  viewBox="0 0 47 47"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.9678 12.5449L15.3193 23.1934L25.9678 33.8418"
                    stroke="white"
                  />
                  <circle
                    cx="23.1931"
                    cy="23.1931"
                    r="22.6931"
                    stroke="white"
                  />
                </svg>
                <p>BACK TO MAKE</p>
              </div>
          <div className="goPivotDone" style={{ color: "white" }}>
            
           
            <div className="ResultContainer">
              <div className="TitleText">
                            <p className="MakersPivot">{`${makerName}'s`} <br />PIVOT TIME</p>
              <p className="Result">{pivotMessage}</p>
              <div className="buttonList">
              <div className="btn">저장하기</div>
              <Link  href="/gpArchive" className="btn" 
              // onClick={submitData}
              >공유하기</Link>

               <div className="eventCard">
                <p>오프라인전시(11.21) 한정 <br></br> My Pivot Time 카드를 받아가세요!</p>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.5">
                <path d="M11.3535 0.354492L0.353516 11.3537" stroke="white"/>
                <path d="M11.3535 11.3535L0.354345 0.353515" stroke="white"/>
                </g>
                </svg>
                <div className="Triangle"></div>
                </div>
              </div>
             
              
              
              

            </div>
            
          </div>
        </div>
        <InfoBox/>
     </>)}
     
     </div>
     

  </>);
}
