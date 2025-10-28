"use client";
import { getProjectLink } from "../lib/util/projectLink";
import Image from "next/image";
import "../styles/pjDetail.scss";

export function ProjectDetail({ project, closeModal }) {
  if (!project) {
    return null;
  }

  return (
    <div className="ProjectDetailModal">
      <div className="ImagePlaceHolder pjDetail">
        <Image
          alt={`${project.name} Poster image`}
          src={`/images/project/${project.id}.png`}
          fill
          size="auto"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="rightSec">
        <div className="rightSecA">
          <div className="infoPlaceHolder">
            <svg
              width="29"
              height="29"
              viewBox="0 0 29 29"
              fill="none"
              onClick={closeModal}
              style={{ cursor: "pointer" }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0.353516 0.353516L28.3535 28.3535" stroke="white" />
              <path d="M28.3535 0.353516L0.353513 28.3535" stroke="white" />
            </svg>

            <div className="infoList">
              {(project.field ?? []).map((field, i) => (
                <div key={i} className="infoBox">
                  {field}
                </div>
              ))}
              <div className="infoBox last">{`TEAM.${project.teamName}`}</div>
            </div>

            <div className="titleBox">
              <p className="title">{project.name}</p>
              <p className="oneLine">{project.oneLineComment}</p>
            </div>

            <p className="explain">{project.explain}</p>

            <a
              className="GoWebsite"
              href={getProjectLink(project.id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              WEBSITE
              <svg
                width="7"
                height="12"
                viewBox="0 0 7 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.353547 11.582L5.96777 5.96777L0.353548 0.353547"
                  stroke="white"
                />
              </svg>
            </a>

            <div className="overviewWrap">
              <div className="overviewBox">
                <div>
                  <p>분야</p>
                  <span>{project.field}</span>
                </div>
                <div>
                  <p>대상</p>
                  <span>{project.target}</span>
                </div>
                <div>
                  <p>매체</p>
                  <span>{project.Media}</span>
                </div>
              </div>
            </div>

            <div className="ScrollPlzBox">
              <p>SCROLL DOWN</p>
              <svg
                width="16"
                height="9"
                viewBox="0 0 16 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.46072 0.458226L7.93744 7.98138L15.4141 0.458276"
                  stroke="white"
                  strokeWidth="1.3"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="rightSecB">
          <div className="teamPlaceHolder">
            <div className="ImagePlaceHolder team">
              <Image
                alt={`${project.teamName} team Photo`}
                src={`/images/team/${project.id}/${project.id}.png`}
                fill
                size="auto"
                style={{ objectFit: "contain" }}
              />
            </div>

            <div className="bottomLine"></div>

            <div className="members">
              {(project.members ?? []).map((m, i) => (
                <div className="memberCard" key={i}>
                  <p className="name">{m.name}</p>
                  <p className="role">{m.role}</p>
                </div>
              ))}
            </div>
            <div className="teamHistory">
              
              <div className="HistoryCard ImagePlaceHolder">
                <Image
                    alt={`${project.teamName} 추억 사진 1`}
                    src={`/images/team/${project.id}/history/1.png`}
                    size="auto"
                    fill
                    style={{objectFit:"cover"}}
                />
              </div>
                            <div className="HistoryCard ImagePlaceHolder">
                <Image
                    alt={`${project.teamName} 추억 사진 2`}
                    src={`/images/team/${project.id}/history/2.png`}
                    size="auto"
                    fill
                    style={{objectFit:"cover"}}
                />
              </div>
                            <div className="HistoryCard ImagePlaceHolder">
                <Image
                    alt={`${project.teamName} 추억 사진 3`}
                    src={`/images/team/${project.id}/history/3.png`}
                    size="auto"
                    fill
                    style={{objectFit:"cover"}}
                />
              </div>
              

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
