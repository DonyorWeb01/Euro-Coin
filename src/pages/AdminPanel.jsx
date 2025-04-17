// src/pages/AdminPanel.jsx
import React from "react";
import "./AdminPanel.scss";

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <h1 className="title">Admin Panel</h1>
      <div className="stats">
        <div className="stat-item">
          <h3>Foydalanuvchilar soni</h3>
          <p>150</p>
        </div>
        <div className="stat-item">
          <h3>Topshiriqlar soni</h3>
          <p>45</p>
        </div>
        <div className="stat-item">
          <h3>Sovrinlar soni</h3>
          <p>30</p>
        </div>
      </div>
      <div className="controls">
        <button className="btn">Foydalanuvchilarni qo‘shish</button>
        <button className="btn">Yangi Topshiriq Yaratish</button>
      </div>
    </div>
  );
};

export default AdminPanel;
