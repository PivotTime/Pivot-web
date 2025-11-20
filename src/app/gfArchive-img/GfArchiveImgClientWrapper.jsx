// src/app/gfArchive-img/GfArchiveImgClientWrapper.jsx
"use client";

import dynamic from "next/dynamic";

// 🔹 WindowIntroWrapper는 여기서 쓰지 않는다
const GfArchiveImgClient = dynamic(() => import("./GfArchiveImgClient"), {
  ssr: false, // 서버에서는 절대 실행 안 함
  loading: () => <div />, // 정적인 fallback (무한루프 방지)
});

export default function GfArchiveImgClientWrapper() {
  return <GfArchiveImgClient />;
}
