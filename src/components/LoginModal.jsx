import React, { useState } from "react";
import "./LoginModal.scss";

const LoginModal = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      localStorage.setItem("token", "mockToken123");
      localStorage.setItem("role", role);
      localStorage.setItem("login", email)
      onLogin();
    } else {
      alert("Iltimos, barcha maydonlarni to‘ldiring");
    }
  };

  return (
    <div className="login-modal">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Loginni kiriting"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Parol kiriting"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">O‘quvchi</option>
          <option value="teacher">O‘qituvchi</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Kirish</button>
      </form>
    </div>
  );
};

export default LoginModal;
