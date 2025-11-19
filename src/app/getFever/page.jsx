

import { Suspense } from "react";
import GetFeverClientWrapper from "./GetFeverClientWrapper";

export default function GetFeverPage() {
  return (
    <Suspense fallback={<WindowIntroWrapper children={<></>}/>}>
      <GetFeverClientWrapper />
    </Suspense>
  );
}