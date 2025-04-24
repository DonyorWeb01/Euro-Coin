import React from "react";
import "./WelcomeSection.scss";

const WelcomeSection = ({ user }) => {
  // Default avatar rasm manzili (pravatar.cc-dan tasvir olish)
  const defaultAvatar = "https://i.pravatar.cc/150?img=3"; // Tasvirni dinamik olish

  return (
    <section className="welcome">
      <div className="welcome-header">
        {/* Agar rasm mavjud bo'lsa, uni chiqarish */}
        <div className="user-image">
          <img 
            src={user?.image || defaultAvatar} 
            alt="User Avatar" 
          />
        </div>
        <div className="user-info">
          <h2>Assalomu alaykum, {user?.name}!</h2>
          <p className="bio">"Har kuni kichik g‘alaba – katta yutuqlarga yetaklaydi!"</p>
          {user?.bio && <p className="bio">{user?.bio}</p>} {/* Foydalanuvchining biosi */}
          {user?.birth_date && (
            <p className="birthdate">Tug‘ilgan sana: {new Date(user?.birth_date).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
