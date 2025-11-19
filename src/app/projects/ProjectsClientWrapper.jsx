// src/app/projects/ProjectsClientWrapper.jsx
"use client";

import dynamic from "next/dynamic";
import WindowIntroWrapper from "../../../components/loading";

const ProjectsClient = dynamic(() => import("./ProjectsClient"), {
  ssr: false, // 🔥 핵심: 서버에서 window/GSAP 실행 안 됨
  loading: () => (
    <WindowIntroWrapper
    children={<></>}
    />
  ),
});

export default function ProjectsClientWrapper() {
  return <ProjectsClient />;
}
