import React from "react";
import "./WelcomeSection.scss";

const WelcomeSection = () => {

  const login  = localStorage.getItem("login")

  return (
    <section className="welcome">
      <h2>Assalomu alaykum, {login}!</h2>
      <p>"Har kuni kichik g‘alaba – katta yutuqlarga yetaklaydi!"</p>
      <button>Bugungi topshiriqlarni bajarish</button>
    </section>
  );
};

export default WelcomeSection;