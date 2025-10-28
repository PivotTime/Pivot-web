'use client';
import { useEffect, useState } from "react";
import students from "../../../lib/data/students.json";
import { StudentCard } from "../../../components/studentCard";
import '../../../styles/students.scss';
import { StudentDetail } from "../../../components/stDetail";

const allStudents = students.students;

export default function Students() {
  const [sortList, setSortList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectStudent, setSelectStudent] = useState(null);
  const [detailModal, setDetailModal] = useState(false);

  useEffect(() => {
    setSortList(allStudents);
  }, []);

  const listHandler = (role) => {
    if (role === "All") {
      setSortList(allStudents);
    } else {
      setSortList(allStudents.filter((s) => s.Role === role));
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setSortList(
      allStudents.filter((a) => a.Name.toLowerCase().includes(value))
    );
  };

  return (
    <> {detailModal && selectStudent && 
      <StudentDetail
      student={selectStudent}
      onClick={()=> setDetailModal(false)}
      />
    }
    <div className="Students">
      <div className="sortingSection">
        <div className="sortingBar">
          <button onClick={() => listHandler("All")}>All</button>
          <button onClick={() => listHandler("Developer")}>developer</button>
          <button onClick={() => listHandler("Planner")}>planner</button>
          <button onClick={() => listHandler("Designer")}>designer</button>
        </div>
        <div>
          <input
            className="searchInput"
            type="text"
            value={searchText}
            onChange={handleSearch}
            placeholder="찾으시는 학생 이름을 입력 해 주세요"
          ></input>
        </div>
      </div>

      <div className="studentsList">
    {sortList.length === 0 ?(     
      <div className="notFind">
      조건에 맞는 학생이 없습니다
      </div>
      )
    
    :
    (
    
    Array.isArray(sortList) &&
          sortList.map((s, i) => (
            <StudentCard key={i} 
              student={s}
              onClick={()=> {
                setSelectStudent(s)
                setDetailModal(true)}}
             />

    )
    ))
    }

      </div>
    </div>
    </>

  );
}
