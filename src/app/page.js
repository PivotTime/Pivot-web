import Link from "next/link";
import '../../styles/globals.scss';
import GoPivot from "../../pages/goPivot";

export default function Home() {
  return (
    <div>
      <Link href="/students">Students</Link>
      <Link href="/projects">Projects</Link>
      <GoPivot/>
    </div>
  );
}
