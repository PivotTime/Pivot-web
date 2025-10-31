"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import AnimationCanvas from "../../../components/AnimationCanvas";
import "../../../styles/gopivot.scss";
import Link from "next/link";
import Nav from "../../../components/nav";

const MAX = 200;

function ControlBox({ name, element }) {
  return (
    <div className="ControlBox">
      <p className="name">{name}</p>
      <div className="middleLine"></div>
      {element}
    </div>
  );
}

export default function GoPivot() {

  

  const [pivotStep, setPivotStep] = useState("intro");
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
  const [makerName, setMakerName] = useState('')
  const [interactionState, setInteractionState] = useState(false)
  const [pivotMessage, setPivotMessage] = useState(""); // New state variable

const MESSAGEBANK = {
  // 단일 타입만 사용
  onlyOne: {
    circle: [
      `${makerName}은(는) 반복 속에서도 본질을 발견합니다. 원처럼 시작과 끝이 이어지는 집중력.`,
      `${makerName}의 탐구는 선형이 아니라 순환적입니다. 같은 곳을 돌아도 매번 새로운 길을 냅니다.`,
    ],
    square: [
      `${makerName}은(는) 안정적 구조 위에 창의성을 쌓습니다. 단단한 바닥은 큰 도전을 가능케 하죠.`,
      `정교한 기준과 균형. ${makerName}의 한 번의 선택이 전체를 정렬합니다.`,
    ],
    line: [
      `${makerName}은(는) 방향을 잃지 않습니다. 한 줄로도 충분히 세계를 가릅니다.`,
      `목표를 향해 흔들림 없이. ${makerName}의 선은 의지의 궤적입니다.`,
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
    `${makerName}은(는) 어려움 앞에서 멈추지 않는 사람입니다. 넘어져도 다시 일어납니다. 도전은 두려움이 아니라 성장의 신호입니다.`,
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
    const el = holderRef.current;
    if (!el) return;
    const onWheel = (e) => {
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
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [selectedIndex]);

  const latestObjectsRef = useRef();

  const submitData = useCallback(async () => {
    if (!latestObjectsRef.current || latestObjectsRef.current.length === 0) {
      alert("전송할 데이터가 없습니다. 오브젝트 개수를 늘려주세요.");
      return;
    }
    try {
      const response = await fetch("/api/save_trajectories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(latestObjectsRef.current),
      });
      const result = await response.json();
      if (response.ok) {
        alert("데이터 전송 성공! (서버 콘솔을 확인하세요)");
      } else {
        alert(`데이터 전송 실패: ${result.message}`);
      }
    } catch (error) {
      console.error("Failed to submit data:", error);
      alert("데이터 전송 중 오류가 발생했습니다.");
    }
  }, []);

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
  const activeTypes = Object.keys(typeCounts).filter((k) => typeCounts[k] > 0);

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
  const pick = (arr) => (Array.isArray(arr) && arr.length ? arr[Math.floor(Math.random() * arr.length)] : null);

  let message = "피벗에 대한 메시지를 생성할 수 없습니다.";

  if (MESSAGEBANK[messageCategory]) {
    if (messageKey && MESSAGEBANK[messageCategory][messageKey]) {
      message = pick(MESSAGEBANK[messageCategory][messageKey]) ?? message;
    } else {
      message = pick(MESSAGEBANK[messageCategory]) ?? message;
    }
  }

  // ${makerName} 치환
  if (makerName && message.includes("${makerName}")) {
    message = message.replace(/\${makerName}/g, makerName);
  }

  return message;
}, [trajectories, makerName]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log("Key pressed:", e.key); // Debug log
      if (e.key === " ") { // Check for spacebar
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
      {pivotStep !== "make" && <Nav />}
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
                console.log(pivotStep)
              }}
            >
              START
            </button>
            <div className="samplePivotPlace"></div>
          </div>
        )}
        {pivotStep === "make" && (
          <div className="makePivot">
            <div className="topBar">
              <div className="backBtn" onClick={() => setPivotStep("intro")}>
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
                <p>BACK TO MAIN</p>
              </div>
                          <div
              style={{
                padding: 12,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              

              {customObjects.length > 0 && (
                <select
                  value={
                    selectedTrajectory.objectType === "custom"
                      ? selectedTrajectory.customObjectId
                      : ""
                  }
                  onChange={(e) => handleSetCustomObject(e.target.value)}
                  style={{
                    marginLeft: 16,
                    padding: "4px 8px",
                    borderRadius: "4px",
                    background: "#333",
                    color: "#eee",
                    border: "1px solid #555",
                  }}
                >
                  <option value="" style={{ background: "#333", color: "#eee" }}>커스텀 오브젝트 선택</option>
                  {customObjects.map((co) => (
                    <option key={co.id} value={co.id} style={{ background: "#333", color: "#eee" }}>
                      {co.id} (저장:{" "}
                      {new Date(co.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              )}
              
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
                        onClick={() => setSelectedIndex(i)
                          
                        }
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
                        setPivotCount((prevPivotCount) => {
                          const newPivotCount = Math.min(3, prevPivotCount + 1);
                          if (newPivotCount > prevPivotCount) {
                            setTrajectories((prevTrajectories) =>
                              prevTrajectories.map((traj, i) => {
                                if (i === newPivotCount - 1) {
                                  return { ...traj, count: 3 };
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
                <p className="max-3">*궤적은 최대 3개까지 추가 할 수 있습니다.</p>
              </div>
            </div>

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
                      <div className="leftBottom">
                        <ControlBox
                  name="mode"
                  element={
                    <div style={{display:"flex"}}>
                    <div onClick={()=>setArrangement("stack")} 
                    style={{cursor:"pointer", height:"50px", width:"50px", border:"solid #ffffff 1px", borderRadius:"100"}}></div>
                    <div onClick={()=>setArrangement("orbit")} 
                    style={{height:"50px",cursor:"pointer", width:"50px", border:"solid #ffffff 1px", borderRadius:"100"}}></div>
                    </div>
                  }
                />
                <ControlBox
                  name="SHAPE MODE"
                  element={
                    <div className="objectSelectList">
                      <div onClick={() => handleSetObjectType("line")}>
                        <svg
                          width="47"
                          height="47"
                          viewBox="0 0 47 47"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="23.1931"
                            cy="23.1936"
                            r="22.6931"
                            transform="rotate(-180 23.1931 23.1936)"
                            stroke="white"
                          />
                          <path
                            d="M12.5981 33.7891L33.7886 12.5986"
                            stroke="white"
                          />
                        </svg>
                      </div>
                      <div onClick={() => handleSetObjectType("circle")}>
                        <svg
                          width="47"
                          height="47"
                          viewBox="0 0 47 47"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="23.1931"
                            cy="23.1936"
                            r="22.6931"
                            transform="rotate(-180 23.1931 23.1936)"
                            stroke="white"
                          />
                          <rect
                            x="34.8442"
                            y="34.8467"
                            width="23.3037"
                            height="23.3037"
                            rx="11.6519"
                            transform="rotate(-180 34.8442 34.8467)"
                            stroke="white"
                          />
                        </svg>
                      </div>
                      <div onClick={() => handleSetObjectType("square")}>
                        <svg
                          width="47"
                          height="47"
                          viewBox="0 0 47 47"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="23.1931"
                            cy="23.1936"
                            r="22.6931"
                            transform="rotate(-180 23.1931 23.1936)"
                            stroke="white"
                          />
                          <rect
                            x="34.1748"
                            y="34.1768"
                            width="21.9648"
                            height="21.9648"
                            transform="rotate(-180 34.1748 34.1768)"
                            stroke="white"
                          />
                        </svg>
                      </div>
                      
                    </div>
                  }
                />

                <div className="ControlBoxList">
                   
                <ControlBox
                  name="SHAPE"
                  element={
                    <p className="Property">
                      {trajectories[selectedIndex].objectType
                        .charAt(0)
                        .toUpperCase() +
                        trajectories[selectedIndex].objectType.slice(1)}
                    </p>
                  }
                />
                <ControlBox
                  name="Total"
                  element={
                    <p className="Property">{selectedTrajectory.count}</p>
                  }
                />
                <ControlBox
                  name="Angle"
                  element={
                    <p id="angle-display" className="Property">
                      X: 0.00, Y: 0.00
                    </p>
                  }
                />
                </div>
                </div>
              </div>
              <div className="rightLine">
                <div className="mouseBox">
                <div className="mouseInteraction">
                  <div className="svgPlaceHolder">
                    <svg
                      width="52"
                      height="50"
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
                <div className="mouseInteraction">
                  <div className="svgPlaceHolder">
                    <svg
                      width="48"
                      height="46"
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
                </div>
                <div className="middleLine"></div>

                <div className="mouseInteraction">
                  <div className="svgPlaceHolder">
                    <svg
                      width="48"
                      height="46"
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
                

                <div className="rightBotBox">
                  <div
                    className={`Button ${selectedTrajectory.pointToCenter ? 'active' : ''}`}
                    onClick={handleSetPointToCenter}
                  >
                    <svg
                      width="47"
                      height="47"
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
                      width="47"
                      height="47"
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
                      <button className="startBtn" onClick={() => {
  const message = getPivotMessage(); // 문자열만 반환됨
  setPivotMessage(message);          // 상태에 메시지 저장
  setPivotStep("done");
  setInteractionState(false);
}}>
              GO PIVOT!
            </button>
                </div>
                        
              </div>
            </div>


            

          </div>
        )}
        { (pivotStep === "make" || pivotStep === "done") &&
          <div ref={holderRef} className={`objectControl ${interactionState ? "" : "off" } ${pivotStep === "done" ? "done" : "" }`}>
              <AnimationCanvas
                trajectories={trajectories}
                arrangement={arrangement}
                customObjects={customObjects}
                animationRefs={animationRefs}
                selectedIndex={selectedIndex}
                latestObjectsRef={latestObjectsRef}
              />
            </div>}
            {pivotStep === "done" && 
            <div className="goPivotDone" style={{color:"white"}}>
                {pivotMessage}
            </div>
            
            }
      </div>
    </>
  );
}
