import GfArchiveImgClientWrapper from "./GfArchiveImgClientWrapper";
import WindowIntroWrapper from "../../../components/loading";

export default function GfArchiveImgPage() {
  return (
    <WindowIntroWrapper
    children={<GfArchiveImgClientWrapper />}
      
      />
    
  );
}