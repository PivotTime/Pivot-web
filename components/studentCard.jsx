import Image from "next/image";
import "../styles/students.scss";
import { CircleSvg, LineSvg, RectSvg } from './keyObject';
import { useEffect, useState } from "react";

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getRandomX() {
  return Math.floor(Math.random() * 121) - 60;
}

function getRandomY() {
  return Math.floor(Math.random() * 81) - 40;
}

function PivotSvg(name, left, top) {
  switch (name) {
    case 'RectSvg':
      return <RectSvg left={left} top={top} />;
    case 'CircleSvg':
      return <CircleSvg left={left} top={top} />;
    case 'LineSvg':
      return <LineSvg left={left} top={top} />;
  }
}

const svgArr = ['RectSvg', 'CircleSvg', 'LineSvg'];

const randomSvg25 = function randomSvg25(svgArr) {
  const repeated = Array.from(
    { length: 200 },
    () => svgArr[Math.floor(Math.random() * svgArr.length)]
  );
  return shuffle(repeated);
};

export function StudentCard({ student, onClick, isEmpty, index, ...props }) {
  const { Id, Name, Role, Project } = student;
   const [randomSvgList, setRandomSvgList] = useState([]);

   useEffect(()=>{
        setRandomSvgList(randomSvg25(svgArr));
   },[])

  return (
    <>
      {isEmpty ? (
        <div className="StudentCard empty" onClick={onClick} {...props}>
          <div className="ImgPlaceHolder Profile "></div>
          <div className="textBox">
            
          </div>
           <div className='DecorationPivot'>
            {PivotSvg(randomSvgList[index], getRandomX(), getRandomY())}
           </div>
        </div>
      ) : (
        <div className="StudentCard" onClick={onClick} {...props}>

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
