"use client";
import { getProjectLink } from "../lib/util/projectLink.js";
import Image from "next/image";
import "../styles/pjDetail.scss";

import { useState } from "react"; // Import useState
import { useRouter } from "next/navigation"; // Import useRouter


export function ProjectDetail({ project, closeModal }) {
  if (!project) {
    return null;
  }

  const [isHovered, setIsHovered] = useState(false); // New state for hover
  const router = useRouter(); // Initialize useRouter

  const handleMemberClick = (memberId) => {
    router.push(`/students/${memberId}`); // Navigate to the student detail page
  };

  const allMember = project.members;

   const nameSorting = (arr, role) => {
    return arr
      .filter((a) => a.role === role) // role로 필터
      .sort((a, b) => a.name.localeCompare(b.name)); // name 기준 정렬
  };
  const planners = nameSorting(allMember, "PLANNER");
  const designers = nameSorting(allMember, "DESIGNER");
  const developers = nameSorting(allMember, "PROGRAMMER");

 

  return (
    <div className="ProjectDetailModal">
      <div className="ImagePlaceHolder pjDetail">
        <Image
          alt={`${project.name} Poster image`}
          src={`/images/project/${project.id}.webp`}
          fill
          sizes={1000}
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

            <div className="firstSec">
              <div className="left">
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
              </div>

              <div className="overviewWrap">
                <div className="overviewBox">
                  <div>
                    <p>매체</p>
                    <span>{project.Media}</span>
                  </div>
                  <div>
                    <p>주제</p>
                    <span>{project.topic}</span>
                  </div>
                  <div>
                    <p>대상</p>
                    <span>{project.target}</span>
                  </div>
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
            <div
              className="ImagePlaceHolder team"
              onMouseEnter={() => setIsHovered(true)} // Set hover state to true
              onMouseLeave={() => setIsHovered(false)} // Set hover state to false
            >
              <Image
                className="teamPhotoA"
                alt={`${project.teamName} team Photo`}
                src={`/images/team/${project.id}1.webp`}
                fill
                size={500}
                style={{ objectFit: "cover" }}
              />
              <Image
                className={`teamPhotoB ${isHovered ? "hovered" : ""}`} // Conditionally add 'hovered' class
                alt={`${project.teamName} team Photo`}
                src={`/images/team/${project.id}2.webp`}
                width={1920}
                height={1080}
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="bottomLine"></div>

            <div className="members">
              {(planners ?? []).map((m, i) => (
                <div
                  className="memberCard planner"
                  key={i}
                  onClick={() => m.id && handleMemberClick(m.id)}
                >
                  <p className="name">{m.name}</p>
                  <p className="role">{m.role}</p>
                </div>
              ))}
              {(designers ?? []).map((m, i) => (
                <div
                  className="memberCard"
                  key={i}
                  onClick={() => m.id && handleMemberClick(m.id)}
                >
                  <p className="name">{m.name}</p>
                  <p className="role">{m.role}</p>
                </div>
              ))}
              {(developers ?? []).map((m, i) => (
                <div
                  className="memberCard developer"
                  key={i}
                  onClick={() => m.id && handleMemberClick(m.id)}
                >
                  <p className="name">{m.name}</p>
                  <p className="role">{m.role}</p>
                </div>
              ))}
            </div>
            <div className="teamNameBox">TEAM. {project.teamName}</div>
            <div className="teamHistory">
              <div className="HistoryCard ImagePlaceHolder">
                <Image
                  alt={`${project.teamName} 추억d 사진 1`}
                  src={`/images/team/history/${project.id}.webp`}
                  size="auto"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="HistoryCard ImagePlaceHolder">
                <Image
                  alt={`${project.teamName} 추억 사진 2`}
                  src={`/images/team/history/${project.id}(1).webp`}
                  size="auto"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="HistoryCard ImagePlaceHolder">
                <Image
                  alt={`${project.teamName} 추억 사진 3`}
                  src={`/images/team/history/${project.id}(2).webp`}
                  size="auto"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
