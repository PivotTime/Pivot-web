import Image from "next/image";
import '../styles/stDetail.scss';

export function StudentDetail({ student, onClick }) {
  const linkType = (link) => {
    switch (link) {
      case link && link.includes("behance"):
        return "Behance";

      default:
        return "Website";
    }
  };

  return (
    <div className="StudentDetail">
      <div className="profileImagePlaceholder">
        <Image
          alt={`${student.name} profile photo`}
          //   src={`/images/profile/${Id}.png`}
          src={`/images/profile/kimyoungeun.png`}
          fill
          sizes="auto"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="rightSec">
        <svg
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
        <div className="infoList">
          <div className="infoBox project">{student.project}</div>
          <div className="infoBox role">{student.role}</div>
        </div>
        <p>
          {student.name} <span>{student.enName}</span>
        </p>

        <div className="overviewList">
          <div className="overviewBox">
            <p className="contentsName">Portfolio</p>
            <div className="portfolio">
              {linkType(student.PortfolioSrc)}
              <span>
                <svg
                  width="7"
                  height="12"
                  viewBox="0 0 7 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.528465 10.5014L5.54413 5.51666L0.528499 0.531987"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
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
                src={`/images/project/${student.project}.png`}
                fill
                size="auto"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          {/* 여기 팀별 오브젝트 들어갈 것*/}
        </div>
      </div>
    </div>
  );
}
