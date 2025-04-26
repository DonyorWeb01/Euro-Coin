import React, { useEffect, useState } from "react";
import "./StudentsList.scss";

const StudentsList = () => {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [myGroupIds, setMyGroupIds] = useState([]);
  const [loading, setLoading] = useState(true);

  

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Mentor ma'lumotlarini olish (faqat my_groups uchun)
        const mentorRes = await fetch("https://coinsite.pythonanywhere.com/mentors/get-me/", {
          headers,
        });
        const mentorData = await mentorRes.json();
        const groupIds = mentorData.my_group_id?.map((g) => g) || [];
        setMyGroupIds(groupIds);

        // Barcha guruhlar va o'quvchilarni olish
        const [groupsRes, studentsRes] = await Promise.all([
          fetch("https://coinsite.pythonanywhere.com/groups/", { headers }),
          fetch("https://coinsite.pythonanywhere.com/students/", { headers }),
        ]);

        const groupsData = await groupsRes.json();
        const studentsData = await studentsRes.json();

        setGroups(groupsData);
        setStudents(studentsData);
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

  if (loading) return <p>Yuklanmoqda...</p>;

  return (
    <div className="students-list">
      <h1>O‘quvchilar ro‘yxati</h1>

      {groups
        .filter((group) => myGroupIds.includes(group.id)) // Faqat mentor o'ziga tegishli guruhlar
        .map((group) => (
          <div key={group.id} className="group-section">
            <h2>{group.name}</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ismi</th>
                  <th>Coinlar</th>
                </tr>
              </thead>
              <tbody>
                {getStudentsByGroup(group.id).map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.points} 🪙</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
};

export default StudentsList;
