'use client';
import { useEffect, useState } from 'react';
import students from '../../../lib/data/students.json';
import { StudentCard } from '../../../components/studentCard';
import '../../../styles/students.scss';
import { StudentDetail } from '../../../components/stDetail';


function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;}

function insertRandomBlanks(arr, ratio = 4, minGap = 2) {
  
  const result = [];

  let sinceLastBlank = minGap;
  let prevWasBlank = false;
  let blankIdx = 0;

  for (let i = 0; i < arr.length; i++) {
    // 항상 실제 아이템은 넣는다
    result.push(arr[i]);
    sinceLastBlank++;
    prevWasBlank = false;

    // 남은 실제 아이템 개수(현재 것 넣고 난 뒤)
    const remainingReal = arr.length - (i + 1);

    // 마지막 3개 보호
    const nearEnd = remainingReal < 3; // === i >= arr.length - 3

    // 이번 위치 뒤에 placeholder를 넣을지 결정
    const wantBlank = Math.random() < 1 / ratio;

    const canInsertBlank =
      !nearEnd &&                  // 끝 3개는 비우지 않음
      sinceLastBlank >= minGap &&  // 최소 간격 충족
      !prevWasBlank &&             // 연속 빈칸 방지
      wantBlank;                   // 확률 조건

    if (canInsertBlank) {
      result.push({ isEmpty: true, Id: `empty-inline-${blankIdx++}` });
      sinceLastBlank = 0;
      prevWasBlank = true;
    }
  }

  return result;
}

// 마지막 줄 빈 슬롯 채우는 헬퍼
// function fillEmptySlots(arr, perRow = 5) {
//   const remainder = arr.length % perRow;
//   if (remainder === 0) return arr;

//   const need = perRow - remainder;

//   // 각 빈 칸마다 독립 객체
//   const blanks = Array.from({ length: need }, (_, i) => ({
//     isEmpty: true,
//     Id: `empty-fill-${i}`,
//   }));

//   return [...arr, ...blanks];
// }

const allStudents = students.students;

export default function Students() {
  const [sortList, setSortList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectStudent, setSelectStudent] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');


  // 초기 로드: 중간에 빈칸 넣고 + 랜덤 섞고 + 5칸 정렬 맞추기
  useEffect(() => {
    const withRandomBlanks = insertRandomBlanks(allStudents);
    setSortList((withRandomBlanks));

  }, []);

  // role 필터
  const listHandler = (role) => {
    if (role === 'All') {
      const withRandomBlanks = insertRandomBlanks(allStudents);
      setSortList(fillEmptySlots(withRandomBlanks, 5));
      setSelectedButton('All');
    } else {
      const filtered = allStudents.filter((s) => s.Role === role);
      const withRandomBlanks = insertRandomBlanks(filtered);
      setSortList(fillEmptySlots(withRandomBlanks, 5));
      setSelectedButton(role);
    }
  };

  // 검색
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = allStudents.filter((a) =>
      a.Name.toLowerCase().includes(value)
    );

    const withRandomBlanks = insertRandomBlanks(filtered);
    setSortList(fillEmptySlots(withRandomBlanks, 5));
  };

  return (
    <>
      {detailModal && selectStudent && (
        <StudentDetail
          student={selectStudent}
          onClick={() => setDetailModal(false)}
        />
      )}

      <div className='Students'>
        <div className='sortingSection'>
          <div className='sortingBar'>
            <button
              onClick={() => listHandler('All')}
              className={selectedButton === 'All' ? 'active' : ''}
            >
              All
            </button>

            <button
              onClick={() => listHandler('Planner')}
              className={selectedButton === 'Planner' ? 'active' : ''}
            >
              PLANNER
            </button>
            <button
              onClick={() => listHandler('Designer')}
              className={selectedButton === 'Designer' ? 'active' : ''}
            >
              DESIGNER
            </button>
            <button
              onClick={() => listHandler('Developer')}
              className={selectedButton === 'Developer' ? 'active' : ''}
            >
              PROGRAMMER
            </button>
          </div>
          <div className='searchBox'>
            <input
              name='searchInput'
              className='searchInput'
              type='text'
              value={searchText}
              onChange={handleSearch}
              placeholder='찾으시는 학생 이름을 입력 해 주세요'
            />

            <svg
              width='22'
              height='23'
              viewBox='0 0 22 23'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='9' cy='9' r='8.25' stroke='white' strokeWidth='1.5' />
              <path
                d='M14.2695 14.9482L21.0016 21.6803'
                stroke='white'
                strokeWidth='1.5'
              />
            </svg>
          </div>
        </div>

        <div className='studentsList'>
          {sortList.length === 0 ? (
            <div className='notFind'>조건에 맞는 학생이 없습니다</div>
          ) : (
            Array.isArray(sortList) &&
            sortList.map((s, i) =>
              s.isEmpty ? (
                
                <StudentCard
                  key={s.Id ?? `empty-${i}`}
                  student={s}
                  isEmpty={true}
                  index={i}
                  // 빈칸은 클릭 불가능하게 그냥 noop
                  onClick={() => {}}
                  style={{ '--animation-delay': `${i * 0.05}s` }}
                />
               
                
              ) : (
                <StudentCard
                  key={s.Id ?? i}
                  index={i}
                  student={s}
                  isEmpty={false}
                  onClick={() => {
                    setSelectStudent(s);
                    setDetailModal(true);
                  }}
                  style={{ '--animation-delay': `${i * 0.05}s` }}
                />
              )
            )
          )}
        </div>

      </div>
    </>
  );
}