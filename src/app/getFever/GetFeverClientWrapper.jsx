"use client";

import dynamic from "next/dynamic";
import WindowIntroWrapper from "../../../components/loading";

const GetFeverClient = dynamic(() => import("./GetFeverClient"), {
  ssr: false,
  loading: () => <WindowIntroWrapper children={<></>}/>,
});

export default function GetFeverClientWrapper() {
  return <GetFeverClient />;
}
