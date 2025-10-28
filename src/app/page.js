import Link from "next/link";
import '../../styles/globals.scss';
import GoPivot from "../../pages/goPivot";
import MakeObjectPage from "../../pages/makeObject";

export default function Home() {
  return (
    <div>
      <Link href="/students">Students</Link>
      <Link href="/projects">Projects</Link>
      <MakeObjectPage/>
    </div>
  );
}
