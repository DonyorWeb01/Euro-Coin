// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import "./AdminPanel.scss";

const AdminPanel = () => {
  const [studentCount, setStudentCount] = useState(null);
  const [teacherCount, setTeacherCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // form holatlari
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token")

  const fetchCounts = async () => {
    try {
      const headers = new Headers();
      headers.append("Authorization", token);

      const [studentsRes, teachersRes] = await Promise.all([
        fetch("https://apieurocoin.uz/students/", { method: "GET", headers }),
        fetch("https://apieurocoin.uz/mentors/", { method: "GET", headers }),
      ]);

      if (!studentsRes.ok || !teachersRes.ok) {
        throw new Error("Ma'lumotlarni yuklashda xatolik yuz berdi.");
      }

      const studentsData = await studentsRes.json();
      const teachersData = await teachersRes.json();

      setStudentCount(studentsData.length);
      setTeacherCount(teachersData.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const headers = new Headers();
    headers.append("Authorization", token);
    headers.append("Content-Type", "application/json");

    const body = JSON.stringify({
      full_name: fullName,
      phone: phone,
      email: email,
    });

    const endpoint =
      role === "student"
        ? "https://apieurocoin.uz/students/"
        : "https://apieurocoin.uz/mentors/";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        throw new Error("Foydalanuvchi qo'shilmadi");
      }

      setSuccessMessage("✅ Foydalanuvchi muvaffaqiyatli qo'shildi!");
      setFullName("");
      setPhone("");
      setEmail("");
      setRole("student");
      fetchCounts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <h1 className="title">Admin Panel</h1>
      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="stats">
            <div className="stat-item">
              <h3>Talabalar soni</h3>
              <p>{studentCount}</p>
            </div>
            <div className="stat-item">
              <h3>O'qituvchilar soni</h3>
              <p>{teacherCount}</p>
            </div>
          </div>

          <div className="form-card">
            <h2>🆕 Yangi foydalanuvchi qo'shish</h2>
            <form className="user-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="To'liq ism"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Telefon raqam"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Talaba</option>
                <option value="teacher">O'qituvchi</option>
              </select>
              <button type="submit">Qo‘shish</button>
              {successMessage && <p className="success">{successMessage}</p>}
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
