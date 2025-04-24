import React, { useEffect, useState } from "react";
import "./TeacherHome.scss";

const TeacherHome = () => {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch("https://coinsite.pythonanywhere.com/mentors/get-me/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

      <div className="courses-section">
        <h2>Mavjud kurslar</h2>
        <ul className="course-list">
          {teacher?.course_names?.length > 0 ? (
            teacher.course_names.map((course, index) => (
              <li key={index} className="course-item">{course}</li>
            ))
          ) : (
            <p>Hech qanday kurs mavjud emas</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TeacherHome;