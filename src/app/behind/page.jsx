"use client";
import { CreditBox, NameList } from "../../../components/creditUi";
import WindowIntroWrapper from "../../../components/loading";
import CreditNames from "../../../lib/data/credit";
import "../../../styles/Credit.scss";
import { useState, useEffect } from "react";
import { useWindowLoaded } from "../../../src/hooks/windowLoaded";

export default function Behind() {
  const allCreditNames = CreditNames;
  const windowLoaded = useWindowLoaded();
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    if (!windowLoaded) return; // Don't start until the window is fully loaded

    let animationFrameId;
    const scrollStep = 0.5; // Adjust for speed

    const autoScroll = () => {
      if (isAutoScrolling) {
        if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight) {
          window.scrollBy(0, scrollStep);
          animationFrameId = requestAnimationFrame(autoScroll);
        } else {
          setIsAutoScrolling(false); // Stop at the bottom
        }
      }
    };

    const handleUserScroll = () => {
      if (isAutoScrolling) {
        setIsAutoScrolling(false);
      }
    };

    // Start auto-scrolling after a delay to allow the user to see the top of the page
    const startTimeout = setTimeout(() => {
        animationFrameId = requestAnimationFrame(autoScroll);
    }, 2000); // 2 second delay

    window.addEventListener("wheel", handleUserScroll);
    window.addEventListener("touchstart", handleUserScroll); // For touch devices

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("wheel", handleUserScroll);
      window.removeEventListener("touchstart", handleUserScroll);
    };
  }, [isAutoScrolling, windowLoaded]);

  return (
    <WindowIntroWrapper
      pageName={"비하인드"}
      children={
        <div className="BehindPage">
          <div className="videoPlaceHolder">
            <video
              src="/videos/mainVideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
            />
          </div>

          <div className="leftLogoBox">
            <p>
              계원예술대학교 <br />
              디지털미디어디자인과 <br />
              2025 졸업전시회
            </p>
            <svg
              width="100%"
              height="auto"
              viewBox="0 0 274 147"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M67.5518 8.34248C67.5518 3.73533 71.2866 0.000488281 75.8938 0.000488281V66.6339H67.5518V8.34248Z"
                fill="#0051FF"
              />
              <path
                d="M0.000976562 16.684C0.000976562 12.0769 3.73582 8.34204 8.34298 8.34204V66.7361H0.000976562V16.684Z"
                fill="#0051FF"
              />
              <path
                d="M41.7097 0.000487917C46.3169 0.000488118 50.0518 3.73533 50.0518 8.34249L8.34174 8.34249C8.34174 3.73533 12.0766 0.000486621 16.6837 0.000486823L41.7097 0.000487917Z"
                fill="#0051FF"
              />
              <path
                d="M50.0518 33.3696C50.0518 37.9768 46.3169 41.7116 41.7098 41.7116L25.0257 41.7116L25.0257 33.3696L50.0518 33.3696Z"
                fill="#0051FF"
              />
              <path
                d="M58.3945 25.0276C58.3945 29.6348 54.6597 33.3696 50.0525 33.3696L50.0525 8.34362C54.6597 8.34362 58.3945 12.0785 58.3945 16.6856L58.3945 25.0276Z"
                fill="#0051FF"
              />
              <path
                d="M93.3916 33.3782H101.734V58.4042C97.1264 58.4042 93.3916 54.6693 93.3916 50.0622V33.3782Z"
                fill="#0051FF"
              />
              <path
                d="M126.761 33.3782H135.103V50.0622C135.103 54.6693 131.368 58.4042 126.761 58.4042V33.3782Z"
                fill="#0051FF"
              />
              <path
                d="M126.761 58.3821C126.761 62.9892 123.026 66.7241 118.419 66.7241L110.077 66.7241C105.47 66.7241 101.735 62.9892 101.735 58.3821L126.761 58.3821Z"
                fill="#0051FF"
              />
              <path
                d="M143.446 25.0362C143.446 29.6433 139.711 33.3782 135.104 33.3782L135.104 0.0101654L143.446 0.0101662L143.446 25.0362Z"
                fill="#0051FF"
              />
              <path
                d="M93.3916 33.3782C88.7844 33.3782 85.0496 29.6433 85.0496 25.0362L85.0496 0.0101654L93.3916 0.0101662L93.3916 33.3782Z"
                fill="#0051FF"
              />
              <path
                d="M231.345 0.000487917C235.952 0.000488118 239.687 3.73533 239.687 8.34249L214.661 8.34249L214.661 0.000487187L231.345 0.000487917Z"
                fill="#0051FF"
              />
              <path
                d="M273.052 0.000488281L273.052 8.34249L248.026 8.34249C248.026 3.73533 251.761 0.000487351 256.368 0.000487552L273.052 0.000488281Z"
                fill="#0051FF"
              />
              <rect
                x="248.027"
                y="66.7373"
                width="8.342"
                height="58.394"
                transform="rotate(-180 248.027 66.7373)"
                fill="#0051FF"
              />
              <path
                d="M183.223 0.0800781H186.472C197.977 0.080218 207.397 9.00342 208.192 20.3066C208.228 20.5292 208.247 20.7577 208.247 20.9902V21.7764C208.247 21.8033 208.248 21.8304 208.248 21.8574V25.1064H208.247V41.7109H208.248V44.9609C208.248 55.2339 201.134 63.8436 191.563 66.1367V66.6875H187.931C187.448 66.7194 186.961 66.7373 186.471 66.7373H183.222V66.6875H174.882V66.7383H171.632C171.136 66.7383 170.644 66.7201 170.156 66.6875H166.537V66.1367C156.968 63.8427 149.856 55.234 149.855 44.9619V41.7119H174.882V58.3447H186.607C194.055 57.7251 199.905 51.4851 199.905 43.8779V41.7119H183.222V41.7109H199.905V22.8652C199.865 14.8818 193.381 8.42187 185.388 8.42188H183.223V8.3418H162.367C161.103 8.34183 159.883 8.52932 158.732 8.87793C160.29 3.73997 165.063 -2.46817e-07 170.71 0H183.223V0.0800781ZM158.197 43.8789C158.197 51.4845 164.046 57.7233 171.491 58.3447H174.881V41.7129H158.197V43.8789ZM158.732 8.87793C158.384 10.0281 158.196 11.2487 158.196 12.5127V41.709H149.854V20.8555C149.854 15.2089 153.594 10.4353 158.732 8.87793Z"
                fill="#0051FF"
              />
              <path
                d="M67.4023 80.1108H75.7443V138.402C75.7443 143.009 72.0095 146.744 67.4023 146.744V80.1108Z"
                fill="#0051FF"
              />
              <rect
                x="217.109"
                y="80.1121"
                width="8.342"
                height="41.71"
                fill="#0051FF"
              />
              <path
                d="M217.109 130.165H225.451V138.507C225.451 143.114 221.717 146.849 217.109 146.849V130.165Z"
                fill="#0051FF"
              />
              <path
                d="M84.7539 96.7956C84.7539 92.1884 88.4887 88.4536 93.0959 88.4536V146.848H84.7539V96.7956Z"
                fill="#0051FF"
              />
              <path
                d="M143.146 96.7956C143.146 92.1884 139.412 88.4536 134.804 88.4536V146.848H143.146V96.7956Z"
                fill="#0051FF"
              />
              <path
                d="M118.12 88.4536H109.778V146.848H118.12V88.4536Z"
                fill="#0051FF"
              />
              <path
                d="M109.778 80.1121L109.778 88.4541L93.0943 88.4541C93.0943 83.8469 96.8292 80.1121 101.436 80.1121L109.778 80.1121Z"
                fill="#0051FF"
              />
              <path
                d="M118.12 80.1121L118.12 88.4541L134.804 88.4541C134.804 83.8469 131.069 80.1121 126.462 80.1121L118.12 80.1121Z"
                fill="#0051FF"
              />
              <path
                d="M149.557 96.7956C149.557 92.1885 153.291 88.4536 157.899 88.4536V105.138H149.557V96.7956Z"
                fill="#0051FF"
              />
              <path
                d="M149.557 130.163C149.557 134.77 153.291 138.505 157.899 138.505V113.479H149.557V130.163Z"
                fill="#0051FF"
              />
              <path
                d="M191.264 80.1121C195.872 80.1121 199.606 83.8469 199.606 88.4541L157.896 88.4541C157.896 83.8469 161.631 80.1121 166.238 80.1121L191.264 80.1121Z"
                fill="#0051FF"
              />
              <path
                d="M191.264 146.849C195.872 146.849 199.606 143.114 199.606 138.507L157.896 138.507C157.896 143.114 161.631 146.849 166.238 146.849L191.264 146.849Z"
                fill="#0051FF"
              />
              <path
                d="M199.606 105.136L199.606 113.478L157.896 113.478L157.896 105.136L199.606 105.136Z"
                fill="#0051FF"
              />
              <path
                d="M207.95 96.7957L199.608 96.7957L199.608 88.4537C204.215 88.4537 207.95 92.1885 207.95 96.7957Z"
                fill="#0051FF"
              />
              <path
                d="M207.95 121.822L199.608 121.822L199.608 138.506C204.215 138.506 207.95 134.771 207.95 130.164L207.95 121.822Z"
                fill="#0051FF"
              />
              <path
                d="M58.3926 80.0078L58.3926 88.3498L33.3666 88.3498C33.3666 83.7427 37.1014 80.0078 41.7086 80.0078L58.3926 80.0078Z"
                fill="#0051FF"
              />
              <rect
                x="33.3662"
                y="146.745"
                width="8.342"
                height="58.394"
                transform="rotate(-180 33.3662 146.745)"
                fill="#0051FF"
              />
              <path
                d="M16.6844 80.0063C21.2915 80.0063 25.0264 83.7412 25.0264 88.3483L0.000358217 88.3483L0.000358582 80.0063L16.6844 80.0063Z"
                fill="#0051FF"
              />
            </svg>
          </div>
          <div className="nameListBox">
           
            <div className="sec A">
              <CreditBox
                title="졸업전시준비위원회"
                nameList={
                  <>
                    <NameList
                      teamName="위원장"
                      listArr={allCreditNames.위원장}
                    />
                    <NameList teamName="총무" listArr={allCreditNames.총무} />
                    <NameList
                      teamName="브랜딩팀"
                      listArr={allCreditNames.홍보팀}
                    />
                  </>
                }
              />
              <CreditBox
                title=""
                nameList={
                  <>
                    <NameList
                      teamName="전시팀"
                      listArr={allCreditNames.전시팀}
                    />
                    <NameList
                      teamName="하드웨어팀"
                      listArr={allCreditNames.하드웨어팀}
                    />
                    <NameList
                      teamName="오프닝팀"
                      listArr={allCreditNames.오프닝팀}
                    />
                    <NameList
                      teamName="영상팀"
                      listArr={allCreditNames.영상팀}
                    />
                  </>
                }
              />
            </div>
            <div className="sec B">
              <CreditBox
                title="디지털미디어디자인과"
                nameList={
                  <>
                    <NameList
                      teamName="PIVOT TIME"
                      listArr={allCreditNames.PIVOTTIME}
                    />
                    <NameList teamName="빛결" listArr={allCreditNames.빛결} />
                    <NameList
                      teamName="Memo:RE"
                      listArr={allCreditNames.MemoRE}
                    />
                    <NameList teamName="한올" listArr={allCreditNames.한올} />
                  </>
                }
              />
            </div>
            <div className="sec C">
              <CreditBox
                title=""
                nameList={
                  <>
                    <NameList teamName="O.K" listArr={allCreditNames.OK} />
                    <NameList
                      teamName="Pinimo"
                      listArr={allCreditNames.Pinimo}
                    />
                    <NameList
                      teamName="피하몽"
                      listArr={allCreditNames.피하몽}
                    />
                    <NameList teamName="COPS" listArr={allCreditNames.COPS} />
                  </>
                }
              />
            </div>
            <div className="sec D">
              <CreditBox
                title=""
                nameList={
                  <>
                    <NameList teamName="Qpid" listArr={allCreditNames.Qpid} />
                    <NameList
                      teamName="아트랑"
                      listArr={allCreditNames.아트랑}
                    />
                    <NameList
                      teamName="Boutine"
                      listArr={allCreditNames.Boutine}
                    />
                    <NameList teamName="J와P" listArr={allCreditNames.J와P} />
                  </>
                }
              />
            </div>
            <div className="sec E">
              <CreditBox
                title=""
                nameList={
                  <>
                    <NameList
                      teamName="Project.H"
                      listArr={allCreditNames.ProjectH}
                    />
                    <NameList teamName="Gyeob" listArr={allCreditNames.Gyeob} />
                    <NameList teamName="돈쭐" listArr={allCreditNames.돈쭐} />
                    <NameList
                      teamName="Evidence: Clicker"
                      listArr={allCreditNames.EvidenceClicker}
                    />
                  </>
                }
              />
            </div>
            <div className="sec F">
              <CreditBox
                title=""
                nameList={
                  <>
                    <NameList
                      teamName="NOL:EUM"
                      listArr={allCreditNames.NOLEUM}
                    />
                    <NameList
                      teamName="BEYOND THE ABYSS"
                      listArr={allCreditNames.BEYONDTHEABYSS}
                    />
                    <NameList
                      teamName="Melt 0°C"
                      listArr={allCreditNames.Melt0C}
                    />
                    <NameList teamName="Login" listArr={allCreditNames.Login} />
                  </>
                }
              />
            </div>
            <div className="sec G">
              <CreditBox
                title=""
                nameList={
                  <>
                    <NameList
                      teamName="지도교수"
                      listArr={allCreditNames.지도교수}
                      gridName="Professor"
                    />
                  </>
                }
              />
            </div>
            <div className="sec H">
              <CreditBox
                title=""
                nameList={
                  <>
                    <NameList
                      teamName="교수진"
                      listArr={allCreditNames.교수진}
                      gridName="Professor"
                    />
                  </>
                }
              />
            </div>
            <div className="sec I">
              <svg
                width="92"
                height="17"
                viewBox="0 0 92 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.0995 0V2.88851H15.8233V0H0V16.361H8.82892V7.55289H82.1399V16.361H91.1543V0H23.0995Z"
                  fill="white"
                />
              </svg>
              <p>©2025. Delight Insight PIVOTTIME All Right Reserved.</p>
            </div>
          </div>
        </div>
      }
    />
  );
}
