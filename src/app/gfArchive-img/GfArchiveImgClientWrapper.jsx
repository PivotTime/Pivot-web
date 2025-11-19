// src/app/gfArchive-img/GfArchiveImgClientWrapper.jsx
"use client";

import dynamic from "next/dynamic";
import WindowIntroWrapper from "../../../components/loading";

const GfArchiveImgClient = dynamic(() => import("./GfArchiveImgClient"), {
  ssr: false, // 🔥 핵심: 서버에서는 절대 실행하지 않음
  loading: () => (
    <WindowIntroWrapper
    children={<></>}
    />
  ),
});

export default function GfArchiveImgClientWrapper() {
  return <GfArchiveImgClient />;
}
