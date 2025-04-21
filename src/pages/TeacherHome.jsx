import React, { useEffect, useState } from "react";
import "./TeacherHome.scss";

const TeacherHome = () => {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState(null);

  const login = localStorage.getItem("login");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch("https://coinsite.pythonanywhere.com/mentors/get-me/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Ma'lumotlarni olishda xatolik yuz berdi");
        }

        const data = await response.json();
        console.log("Teacher data:", data);
        setTeacher(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchTeacherData();
  }, [token]);

  return (
    <div className="teacher-home">
      <h1 className="welcome-text">
        Assalomu alaykum, {teacher?.name}!
      </h1>

      {error && <p className="error">{error}</p>}

      <div className="cards">
        <div className="card">
          <h2>{teacher?.course}</h2>
          <p>Bugungi darslar</p>
        </div>
        <div className="card">
          <h2>{teacher?.user}</h2>
          <p>Faol o‘quvchilar</p>
        </div>
        <div className="card">
          <h2>7</h2>
          <p>Yuborilgan topshiriqlar</p>
        </div>
      </div>

      <div className="students-section">
        <h2>So‘nggi faol o‘quvchilar</h2>
        <ul className="student-list">
          <li>🔹 Abdulla Karimov</li>
          <li>🔹 Malika Sobirova</li>
          <li>🔹 Akbar Aliyev</li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherHome;
