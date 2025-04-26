import React, { useEffect, useState } from "react";
import "./TeacherHome.scss";

const TeacherHome = () => {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [description, setDescription] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch("https://coinsite.pythonanywhere.com/mentors/get-me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Ma'lumotlarni olishda xatolik");

        const data = await response.json();
        setTeacher(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchGroups = async () => {
      try {
        const res = await fetch("https://coinsite.pythonanywhere.com/groups/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setGroups(data);
      } catch (err) {
        console.error("Guruhlarni olishda xatolik:", err);
      }
    };

    const fetchAllStudents = async () => {
      try {
        const res = await fetch("https://coinsite.pythonanywhere.com/students/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setAllStudents(data);
      } catch (err) {
        console.error("O‘quvchilarni olishda xatolik:", err);
      }
    };

    fetchTeacherData();
    fetchGroups();
    fetchAllStudents();
  }, [token]);

  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);
    setSelectedStudent("");
    const filtered = allStudents.filter((student) => student.group === parseInt(groupId));
    setFilteredStudents(filtered);
  };

  const handleSendCoin = async (e) => {
    e.preventDefault();

    if (!teacher?.id || !selectedStudent || !coinAmount || !description) {
      alert("Barcha maydonlarni to‘ldiring!");
      return;
    }

    const requestBody = {
      amount: parseInt(coinAmount),
      description,
      point_type: "mentor",
      student: parseInt(selectedStudent),
      mentor: teacher.id,
    };

    try {
      const response = await fetch("https://coinsite.pythonanywhere.com/give-points/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Xatolik yuz berdi!");
      }

      setSuccessMsg("Coin muvaffaqiyatli yuborildi!");
      setCoinAmount("");
      setDescription("");
      setSelectedStudent("");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Coin yuborishda xatolik:", error);
      setError("Coin yuborilmadi. Xatolik yuz berdi.");
    }
  };

  return (
    <div className="teacher-home">
      {error && <p className="error">{error}</p>}

      <div className="profile-card">
        <img
          src={teacher?.image || "/default-profile.png"}
          alt="Profil rasmi"
          className="profile-img"
        />
        <div className="profile-info">
          <h1>{teacher?.name || "Ism topilmadi"}</h1>
          <p>Tug‘ilgan sana: {teacher?.birth_date || "Ma'lumot mavjud emas"}</p>
        </div>
      </div>

      <div className="coin-give-section">
        <h2>Coin berish</h2>
        <form onSubmit={handleSendCoin} className="coin-form">
          <select
            value={selectedGroup}
            onChange={(e) => handleGroupSelect(e.target.value)}
            required
          >
            <option value="">Guruhni tanlang</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>

          {filteredStudents.length > 0 && (
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
            >
              <option value="">O‘quvchini tanlang</option>
              {filteredStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          )}

          <input
            type="number"
            placeholder="Coin miqdori"
            value={coinAmount}
            onChange={(e) => setCoinAmount(e.target.value)}
            required
          />

          <textarea
            placeholder="Sabab (masalan: yaxshi qatnashgani uchun)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          ></textarea>

          <button type="submit">Coin berish</button>
        </form>

        {successMsg && <p className="success-msg">{successMsg}</p>}
      </div>

      <div className="courses-section">
        <h2>Mavjud kurslar</h2>
        <ul className="course-list">
          {teacher?.course_names?.length > 0 ? (
            teacher.course_names.map((course, index) => (
              <li key={index} className="course-item">
                {course}
              </li>
            ))
          ) : (
            <li>Hozircha hech qanday kurs mavjud emas</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TeacherHome;
