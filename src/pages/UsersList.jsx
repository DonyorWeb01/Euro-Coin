// src/pages/UsersList.jsx
import React from "react";
import "./UsersList.scss";

const UsersList = () => {
  return (
    <div className="users-list">
      <h1 className="title">Foydalanuvchilar Ro‘yxati</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Ism</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Harakatlar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Donyor</td>
            <td>donyor@example.com</td>
            <td>Talaba</td>
            <td><button className="btn">Tahrirlash</button></td>
          </tr>
          <tr>
            <td>2</td>
            <td>Kamola</td>
            <td>kamola@example.com</td>
            <td>O‘qituvchi</td>
            <td><button className="btn">Tahrirlash</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
