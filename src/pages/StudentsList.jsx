import React from "react";
import "./StudentsList.scss";

const students = [
  { name: "Abdulla Karimov", level: "Boshlang‘ich", coins: 120 },
  { name: "Malika Sobirova", level: "O‘rta", coins: 95 },
  { name: "Akbar Aliyev", level: "Yuqori", coins: 180 },
];

const StudentsList = () => {
  return (
    <div className="students-list">
      <h1>O‘quvchilar ro‘yxati</h1>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Ismi</th>
            <th>Daraja</th>
            <th>Coinlar</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.level}</td>
              <td>{student.coins} 🪙</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsList;
