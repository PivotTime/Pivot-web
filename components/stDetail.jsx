import Image from "next/image";
import '../styles/stDetail.scss';
import { DeveloperPivot, DesignerPivot, PlannerPivot } from "./keyObject";
import { getProjectIdByName } from "../lib/util/getProjectId";

export function StudentDetail({ student, onClick }) {



  const roleText = (r) => {
    switch(r){
      case "Designer" :
        return "디자이너";
         case "Planner" :
        return "기획자";
         case "Developer" :
        return "개발자";
    }
  }

  
  const rolePivot = (r) => {
    switch(r){
      case "Designer" :
        return (

          <DesignerPivot/>
        );
         case "Planner" :
        return (< PlannerPivot/>);
         case "Developer" :
        return (<DeveloperPivot/>);
    }
  }

  const linkType = (link) => {
    switch (link) {
      case link && link.includes("behance"):
        return "Behance";

      default:
        return "Website";
    }
  };
  console.log(student.name)

  return (
    <div className="StudentDetail">
      <div className="profileImagePlaceholder">
        <Image
          alt={`${student.name} profile photo`}
            src={`/images/profile/${student.Id}.webp`}
          // src={`/images/profile/kimyoungeun.png`}
          unoptimized                   // ← 원본 그대로 전달(재인코딩/리사이즈 X)

        fill
        sizes="1000"
        style={{ maxWidth: "40vw", }} // 업스케일 방지
        priority
          placeholder="blur"
        blurDataURL = {`/images/profile/${student.Id}.png`}
        />
      </div>
      <div className="rightSec">
        <svg
        className="exitBtn"
          width="29"
          height="29"
          viewBox="0 0 29 29"
          fill="none"
          onClick={onClick}
          style={{ cursor: "pointer" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0.353516 0.353516L28.3535 28.3535" stroke="white" />
          <path d="M28.3535 0.353516L0.353513 28.3535" stroke="white" />
        </svg>
        <div className="firstLine">
        <p className="studentName">
          {student.name} <span>{student.enname}</span>
          
        </p>
        <div className="commentBox">
        {student.comment} {roleText(student.role)} {student.name}입니다.

              <div className="lengthLine left"> <div className="line"></div></div>
      <div className="lengthLine right"> <div className="line"></div></div>
      <div className="TransverseLine top"> <div className="line"></div></div>
      <div className="TransverseLine bottom"><div className="line"></div></div>
        </div>
        </div>

        <div className="overviewList">
          <div className="overviewBox">
            <p className="contentsName">Portfolio</p>
            <div className="portfolio">

              <a href={student.portfolioSrc} target="_blank" rel="noopener noreferrer">
              <p>{linkType(student.portfolioSrc) }</p>
              <span className="goWebPage">
                <svg
                  viewBox="0 0 7 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.528465 10.5014L5.54413 5.51666L0.528499 0.531987"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              </a>
            </div>
          </div>
          <div className="overviewBox">
            <p className="contentsName">Contact</p>
            <p className="email"> {student.eMail}</p>
          </div>
          <div className="overviewBox">
            <p className="contentsName">Project</p>
            <div className="ImagePlaceHolder projectPoster">
              <Image
                alt={`${student.project} Poster image`}
                src={`/images/project/wide/${getProjectIdByName(student.project)}.webp`}
               fill
               sizes={1000}
                style={{ objectFit: "cover" }}
              />
              <div className="gradientCover">
                <p className="projectName">{student.project}</p>

              </div>
              
            </div>
          </div>
          <div className="roleSvg">
                     {rolePivot(student.role)}

          </div>

        </div>
      </div>
    </div>
  );
}
