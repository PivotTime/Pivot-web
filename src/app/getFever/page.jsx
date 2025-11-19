

import { Suspense } from "react";
import GetFeverClientWrapper from "./GetFeverClientWrapper";
import WindowIntroWrapper from "../../../components/loading";

export default function GetFeverPage() {
  return (
    <Suspense fallback={<WindowIntroWrapper children={<></>}/>}>
      <GetFeverClientWrapper />
    </Suspense>
  );
}