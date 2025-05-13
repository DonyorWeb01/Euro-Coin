import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🛑 useNavigate import
import "./LoginModal.scss";
import { toast } from "react-toastify";

const LoginModal = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 🛑 navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      setError("Iltimos, barcha maydonlarni to‘ldiring va rolni tanlang");
      return;
    }

    try {
      const response = await fetch("https://apieurocoin.uz/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error("Login yoki parol noto‘g‘ri");
      }

      const data = await response.json();
      console.log("Token:", data);

      localStorage.setItem("token", data.access);
      localStorage.setItem("role", role);
      localStorage.setItem("login", email);

      setError("");
      onLogin(); // parent komponentga login bo‘ldi deb xabar beradi

      // 🛑 Agar login muvaffaqiyatli bo'lsa, Home sahifasiga yo‘naltirish
      navigate("/"); // Home sahifasiga yo‘naltirish
      toast.success("Tizimga muvaffaqiyatli kirdingiz!")

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login">
      <img className="login-img" src="/icon.png" alt="" />
      <div className="login-modal">
        <form onSubmit={handleSubmit}>
          <h2>EURO COIN</h2>
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
            <option value="">Rolni tanlang</option>
            <option value="student">O‘quvchi</option>
            <option value="teacher">O‘qituvchi</option>
            {/* <option value="admin">Admin</option> */}
          </select>

          {error && <p className="error">{error}</p>}
          <button type="submit">Kirish</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
