import { Suspense } from "react";
import GfArchiveTxtClientWrapper from "./GfArchiveTxtClientWrapper";
import WindowIntroWrapper from "../../../components/loading";

export default function Page() {
  return (
        <WindowIntroWrapper
        children={<GfArchiveTxtClientWrapper />}
        />
      
  );
}