"use client";

import dynamic from "next/dynamic";

const GetFeverClient = dynamic(() => import("./GetFeverClient"), {
  ssr: false,
  loading: () => <div style={{ color: "#fff" }}>Loading...</div>,
});

export default function GetFeverClientWrapper() {
  return <GetFeverClient />;
}
