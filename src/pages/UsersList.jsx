import React, { useEffect, useState } from "react";
import "./UsersList.scss";

const UsersList = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const token = localStorage.getItem("token")

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    // Fetching students
    fetch("https://apieurocoin.uz/students/", requestOptions)
      .then((response) => response.json())
      .then((result) => setStudents(result))
      .catch((error) => console.error("Error fetching students:", error));

    // Fetching teachers
    fetch("https://apieurocoin.uz/mentors/", requestOptions)
      .then((response) => response.json())
      .then((result) => setTeachers(result))
      .catch((error) => console.error("Error fetching teachers:", error));
  }, [token]);

  return (
    <div className="users-list">
      <h1 className="title">Foydalanuvchilar Ro‘yxati</h1>
      <div className="section">
        <h2>Talabalar</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Ism</th>
              <th>Tug'ilgan sana</th>
              <th>Rasm</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.birth_date}</td>
                <td>
                  <img
                    src={student.image}
                    alt={student.name}
                    className="user-img"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h2>O‘qituvchilar</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Ism</th>
              <th>Tug'ilgan sana</th>
              <th>Rasm</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={teacher.id}>
                <td>{index + 1}</td>
                <td>{teacher.name}</td>
                <td>{teacher.birthday}</td>
                <td>
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="user-img"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
