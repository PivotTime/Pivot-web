import { Suspense } from "react";
import GetFeverClient from "./GetFeverClient";
import WindowIntroWrapper from "../../../components/loading";

export default function GetFeverPage() {
  return (

    <WindowIntroWrapper
        children={<GetFeverClient />}
        />
  );
}