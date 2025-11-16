'use client';
import { useEffect, useState } from 'react';
import students from '../../../lib/data/students.json';
import { StudentCard } from '../../../components/studentCard';
import '../../../styles/students.scss';
import { StudentDetail } from '../../../components/stDetail';
import { Footer } from '../../../components/footer';

// Fisher–Yates
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 랜덤 빈칸 삽입 (마운트 이후에만 호출)
function insertRandomBlanks(arr, ratio = 4, minGap = 2) {
  const result = [];
  let sinceLastBlank = minGap;
  let prevWasBlank = false;
  let blankIdx = 0;

  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i]);
    sinceLastBlank++;
    prevWasBlank = false;

    const remainingReal = arr.length - (i + 1);
    const nearEnd = remainingReal < 3;         // 끝 3개 보호
    const wantBlank = Math.random() < 1 / ratio;

    const canInsertBlank =
      !nearEnd &&
      sinceLastBlank >= minGap &&
      !prevWasBlank &&
      wantBlank;

    if (canInsertBlank) {
      result.push({ isEmpty: true, Id: `empty-inline-${blankIdx++}` });
      sinceLastBlank = 0;
      prevWasBlank = true;
    }
  }
  return result;
}

// 마지막 줄 칸수 맞추기 (비랜덤, SSR/CSR 영향 없음)
function fillEmptySlots(arr, perRow = 5) {
  const remainder = arr.length % perRow;
  if (remainder === 0) return arr;
  const need = perRow - remainder;
  const blanks = Array.from({ length: need }, (_, i) => ({
    isEmpty: true,
    Id: `empty-fill-${i}`,
  }));
  return [...arr, ...blanks];
}

const allStudents = students.students;

export default function Students() {
  const [mounted, setMounted] = useState(false);        // ✅ 수화 안정 플래그
  const [sortList, setSortList] = useState([]);         // 표시용 리스트
  const [searchText, setSearchText] = useState('');
  const [selectStudent, setSelectStudent] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedButton, setSelectedButton] = useState('All');

  // 마운트 후에만 랜덤/가공 실행 → SSR과 CSR 초기 DOM 동일 보장
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const base = shuffle(allStudents);
    const withRandomBlanks = insertRandomBlanks(base);
    setSortList(fillEmptySlots(withRandomBlanks, 5));
  }, [mounted]);

  // role 필터
  const listHandler = (role) => {
    if (!mounted) return;
    setSelectedButton(role);
    const base =
      role === 'All'
        ? allStudents
        : allStudents.filter((s) => s.role === role);
    const shuffled = shuffle(base);
    const withRandomBlanks = insertRandomBlanks(shuffled);
    setSortList(fillEmptySlots(withRandomBlanks, 5));
    setSearchText(''); // 필터 클릭 시 검색어 초기화 (선택)
  };

  // 검색
  const handleSearch = (e) => {
    if (!mounted) return;
    //입력값 대소문자 다 대문자 처리
    const value = e.target.value.toLowerCase();
    //검색값 state에 추가
    setSearchText(value);

    //배열에서 필터링 때리기 값 넣은 거랑 학생객체 이름 비교해서
    const filtered = allStudents.filter((a) =>
      (a.name ?? '').toLowerCase().includes(value)
    );

    //랜덤섞기
    const withRandomBlanks = insertRandomBlanks(filtered);

    //현재 보여주는 학생 useState에 집어넣기(여백 넣어서)

    setSortList(fillEmptySlots(withRandomBlanks, 5));
    //소팅 버튼 한거 다 초기화
    setSelectedButton('All'); 
  };

  return (
    <>
      {mounted && detailModal && selectStudent && (
        <StudentDetail
          student={selectStudent}
          onClick={() => setDetailModal(false)}
        />
      )}

      <div className="Students">
        <div className="sortingSection">
          <div className="sortingBar">
            <div
              onClick={() => listHandler('All')}
              className={selectedButton === 'All' ? 'active' : ''}
            >
              All
            </div>
            <div
              onClick={() => listHandler('Planner')}
              className={selectedButton === 'Planner' ? 'active' : ''}
            >
              PLANNER
            </div>
            <div
              onClick={() => listHandler('Designer')}
              className={selectedButton === 'Designer' ? 'active' : ''}
            >
              DESIGNER
            </div>
            <div
              onClick={() => listHandler('Developer')}
              className={selectedButton === 'Developer' ? 'active' : ''}
            >
              PROGRAMMER
            </div>
          </div>

          <div className="searchBox">
            <input
              name="searchInput"
              className="searchInput"
              type="text"
              value={searchText}
              onChange={handleSearch}
              placeholder="찾으시는 학생 이름을 입력 해 주세요"
            />
            <svg
              width="22"
              height="23"
              viewBox="0 0 22 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="9" r="8.25" stroke="white" strokeWidth="1.5" />
              <path
                d="M14.2695 14.9482L21.0016 21.6803"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        <div className="studentsList">
          {/* ✅ 수화 전에는 리스트를 렌더하지 않음 (서버/클라 동일 DOM 보장) */}
          {!mounted ? null : sortList.length === 0 ? (
            <div className="notFind">조건에 맞는 학생이 없습니다</div>
          ) : (
            sortList.map((s, i) =>
              s.isEmpty ? (
                <StudentCard
                  key={s.Id ?? `empty-${i}`}
                  student={s}
                  isEmpty={true}
                  index={i}
                  onClick={() => {}}
                  style={{ ['--animation-delay']: `${i * 0.05}s` }}
                />
              ) : (
                <StudentCard
                  key={s.Id ?? s.id ?? i}
                  index={i}
                  student={s}
                  isEmpty={false}
                  onClick={() => {
                    setSelectStudent(s);
                    setDetailModal(true);
                  }}
                  style={{ ['--animation-delay']: `${i * 0.05}s` }}
                />
              )
            )
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
}
