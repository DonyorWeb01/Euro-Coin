import React, { useEffect, useState } from "react";
import "./StudentsList.scss";

const StudentsList = () => {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [myGroupIds, setMyGroupIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentResults, setStudentResults] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const mentorRes = await fetch("https://apieurocoin.uz/mentors/get-me/", { headers });
        const mentorData = await mentorRes.json();
        const groupIds = mentorData.my_group_id?.map((g) => g) || [];
        setMyGroupIds(groupIds);

        const [groupsRes, studentsRes] = await Promise.all([
          fetch("https://apieurocoin.uz/groups/", { headers }),
          fetch("https://apieurocoin.uz/students/", { headers }),
        ]);

        setGroups(await groupsRes.json());
        setStudents(await studentsRes.json());
      } catch (error) {
        console.error("Ma'lumotlarni olishda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getStudentsByGroup = (groupId) =>
    students.filter((student) => student.group === groupId);

  const handleViewStudent = async (studentId) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const res = await fetch("https://apieurocoin.uz/students/test/result/", { headers });
      const data = await res.json();
      const studentData = data.filter((item) => item.student === studentId);

      setStudentResults(studentData);
      const student = students.find((s) => s.id === studentId);
      setSelectedStudent(student);
      setShowModal(true);
    } catch (error) {
      console.error("Student natijalarini olishda xatolik:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setStudentResults([]);
  };

  if (loading) return <p>Yuklanmoqda...</p>;

  return (
    <div className="students-list">
      <h1>O‘quvchilar ro‘yxati</h1>

      {groups
        .filter((group) => myGroupIds.includes(group.id))
        .map((group) => (
          <div key={group.id} className="group-section">
            <h2>{group.name}</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ismi</th>
                  <th>Coinlar</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {getStudentsByGroup(group.id).map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.points} 🪙</td>
                    <td>
                      <button className="view-btn" onClick={() => handleViewStudent(student.id)}>
                        Ko‘rish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {showModal && selectedStudent && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedStudent.name} - Test Natijalari</h2>
            {studentResults.length > 0 ? (
              <ul className="results-list">
                {studentResults.map((result, index) => (
                  <li key={index}>
                    <strong>Test Nomi:</strong> {result.test_title} <br />
                    <strong>To‘plangan ball:</strong> {result.score}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Hozircha test natijalari mavjud emas.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
