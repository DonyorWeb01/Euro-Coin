import React from "react";
import "./TeacherHome.scss";

const TeacherHome = () => {

  const login = localStorage.getItem("login")

  return (
    <div className="teacher-home">
      <h1 className="welcome-text">Assalomu alaykum, {login}!</h1>

      <div className="cards">
        <div className="card">
          <h2>3</h2>
          <p>Bugungi darslar</p>
        </div>
        <div className="card">
          <h2>12</h2>
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
