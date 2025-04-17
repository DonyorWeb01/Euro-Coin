// src/pages/Profile.jsx
import React from "react";
import "./Profile.scss";

const Profile = () => {
  const user = {
    name: "Donyorbek",
    role: "Talaba",
    avatar: "https://i.pravatar.cc/100?img=12",
    coins: 240,
    tasksCompleted: 7,
    level: "Beginner",
  };

  return (
    <div className="profile-page">
      <h1 className="page-title">👤 Mening Profilim</h1>
      <div className="profile-card">
        <img className="avatar" src={user.avatar} alt="User Avatar" />
        <h2 className="name">{user.name}</h2>
        <p className="role">🎓 {user.role}</p>

        <div className="stats">
          <div className="stat">
            <h3>{user.coins}</h3>
            <p>Coinlar</p>
          </div>
          <div className="stat">
            <h3>{user.tasksCompleted}</h3>
            <p>Bajarilgan topshiriqlar</p>
          </div>
          <div className="stat">
            <h3>{user.level}</h3>
            <p>Daraja</p>
          </div>
        </div>

        <button className="edit-btn">✏️ Profilni tahrirlash</button>
      </div>
    </div>
  );
};

export default Profile;
