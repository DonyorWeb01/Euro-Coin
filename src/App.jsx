import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import LoginModal from "./components/LoginModal";

// 🔹 O‘qituvchi sahifalari
import TeacherHome from "./pages/TeacherHome";
import StudentsList from "./pages/StudentsList";
import TeacherCreateTest from "./pages/TeacherCreatetest";


// 🔹 Admin sahifalari
import AdminPanel from "./pages/AdminPanel";
import UsersList from "./pages/UsersList";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserRole(localStorage.getItem("role"));
  };

  return (
    <>
      {!isLoggedIn && <LoginModal onLogin={handleLogin} />}

      <div className={isLoggedIn ? "app" : "blur"}>
        <Header userRole={userRole} />
        <main className="main">
          <Routes>
            {/* 👨‍🎓 Talaba sahifalari */}
            {userRole === "student" && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/profile" element={<Profile />} />
              </>
            )}

            {/* 👨‍🏫 O‘qituvchi sahifalari */}
            {userRole === "teacher" && (
              <>
                <Route path="/" element={<TeacherHome />} />
                <Route path="/students" element={<StudentsList />} />
                <Route path="/createTest" element={<TeacherCreateTest />} />
                <Route path="/profile" element={<Profile />} />
              </>
            )}

            {/* 👨‍💼 Admin sahifalari */}
            {userRole === "admin" && (
              <>
                <Route path="/" element={<AdminPanel />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/profile" element={<Profile />} />
              </>
            )}
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
