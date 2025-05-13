import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.scss";
import { FaHome, FaPlus, FaUser, FaUsers } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";

const Header = ({ userRole }) => {
  const [userName, setUserName] = useState("");
  const [userCoins, setUserCoins] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");
  const location = useLocation(); // 🛑 Router location

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let url = "";
        if (userRole === "student") {
          url = "https://apieurocoin.uz/students/get-me/";
        } else if (userRole === "teacher") {
          url = "https://apieurocoin.uz/mentors/get-me/";
        } else {
          return;
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (userRole === "student") {
          setUserName(data.name || "Ism topilmadi");
          setUserCoins(data.points || 0);
        } else if (userRole === "teacher") {
          setUserName(data.name || "Ism topilmadi");
        }
      } catch (err) {
        console.error("Foydalanuvchi ma'lumotlarini olishda xatolik:", err);
      }
    };

    fetchUserData();
  }, [userRole, token]);

  // 🛑 Sahifa yuklanganda: Ekranni tekshirish
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false); // Telefon: sidebar yopiq
    } else {
      setIsSidebarOpen(true); // Katta ekran: sidebar ochiq
    }
  }, []);

  // 🛑 Har safar route o'zgarganda: Telefon bo'lsa sidebar yopilsin
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* Hamburger Button */}
      <div className="hamburger" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="top">
          <div className="logo">
            <Link to="/">
              <img className="logoImg" src="/icon.png" alt="logo" />
              <p className="logoName">EURO COIN</p>
            </Link>
          </div>

          <nav className="nav-links">
            {userRole === "student" && (
              <>
                <Link to="/" onClick={() => setIsSidebarOpen(false)}>
                  <FaHome /> Bosh sahifa
                </Link>
                <Link to="/tasks" onClick={() => setIsSidebarOpen(false)}>
                  <PiStudentBold /> Topshiriqlar
                </Link>
                <Link to="/profile" onClick={() => setIsSidebarOpen(false)}>
                  <FaUser /> Profil
                </Link>
              </>
            )}

            {userRole === "teacher" && (
              <>
                <Link to="/" onClick={() => setIsSidebarOpen(false)}>
                  <FaHome /> Bosh sahifa
                </Link>
                <Link to="/students" onClick={() => setIsSidebarOpen(false)}>
                  <PiStudentBold /> Talabalar
                </Link>
                <Link to="/createTest" onClick={() => setIsSidebarOpen(false)}>
                  <FaPlus /> Test yaratish
                </Link>
                <Link to="/profile" onClick={() => setIsSidebarOpen(false)}>
                  <FaUser /> Profil
                </Link>
              </>
            )}

            {userRole === "admin" && (
              <>
                <Link to="/" onClick={() => setIsSidebarOpen(false)}>
                  <FaHome /> Bosh sahifa
                </Link>
                <Link to="/users" onClick={() => setIsSidebarOpen(false)}>
                  <FaUsers /> Foydalanuvchilar
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="user-info">
          {(userRole === "student" || userRole === "teacher") && (
            <span className="user"> {userName}</span>
          )}
          {userRole === "student" && (
            <span className="coins"> {userCoins}🪙</span>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Header;
