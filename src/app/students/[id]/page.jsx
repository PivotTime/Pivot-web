'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import studentsData from '../../../../lib/data/students.json';
import { StudentDetail } from '../../../../components/stDetail';
import { useRouter } from "next/navigation";
import '../../../../styles/stDetail.scss'; // Assuming you have a specific style for stDetail page

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id;
  const [student, setStudent] = useState(null);

    const router = useRouter();

  function goToProjects() {
    router.push("/students");
  }


  useEffect(() => {
    if (studentId) {
      const foundStudent = studentsData.students.find(s => s.Id === studentId);
      setStudent(foundStudent);
    }
  }, [studentId]);

  if (!student) {
    return <div>Loading student details...</div>; // Or a 404 page
  }

  return (
    <div className="student-detail-page">
      <StudentDetail student={student} onClick={goToProjects} />
    </div>
  );
}
