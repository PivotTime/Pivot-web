import Image from "next/image";
import "../styles/students.scss";

export function StudentCard({ student, onClick, isEmpty }) {
  const { Id, Name, Role, Project } = student;

  return (
    <>
      {isEmpty ? (
        <div className="StudentCard empty" onClick={onClick}>
          <div className="ImgPlaceHolder Profile "></div>
          <div className="textBox">
            <p className="name">Name</p>
            <p>
              {"PPPPPPP"}
              <span> | </span>
              {"pppppp"}
            </p>
          </div>
        </div>
      ) : (
        <div className="StudentCard" onClick={onClick}>

          <div className="ImgPlaceHolder Profile">
            <Image
              alt={`${Name} 프로필 사진`}
              //   src={`/images/profile/${Id}.png`}
              src={`/images/profile/kimyoungeun.png`}
              fill
              sizes="auto"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="textBox">
            <p className="name">{Name}</p>
            <p>
              {Project}
              <span> | </span>
              {Role}
            </p>
          </div>
        </div>
      )}
    
    </>
  );
}
