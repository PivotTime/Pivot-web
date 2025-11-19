"use client";

import dynamic from "next/dynamic";
import WindowIntroWrapper from "../../../components/loading.jsx";

const GfArchiveTxtClient = dynamic(() => import("./GfArchiveTxtClient.jsx"), {
  ssr: false, // 🔥 핵심: 서버에서 절대 실행 안 함
  loading: () =>     <WindowIntroWrapper
      children={<></>}
      />,
});

export default function GfArchiveTxtClientWrapper() {
  return <GfArchiveTxtClient />;
}