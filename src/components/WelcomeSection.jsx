

// WelcomeSection.jsx
import React from "react";
import "./WelcomeSection.scss";

const WelcomeSection = ({ user }) => {
  const defaultAvatar = "https://i.pravatar.cc/150?img=3";

  return (
    <section className="welcome">
      <div className="welcome-header">
        <div className="user-image">
          <img src={user?.image || defaultAvatar} alt="User Avatar" />
        </div>
        <div className="user-info">
          <h2>Assalomu alaykum, {user?.name}!</h2>
          <p className="bio">"Har kuni kichik g‘alaba – katta yutuqlarga yetaklaydi!"</p>
          {user?.bio && <p className="bio">{user?.bio}</p>}
          {user?.birth_date && (
            <p className="birthdate">Tug‘ilgan sana: {new Date(user?.birth_date).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
