import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.scss";
import { FaHome, FaPlus, FaUser, FaUsers } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { CiCirclePlus } from "react-icons/ci";

const Header = ({ userRole }) => {
  const [userName, setUserName] = useState("");
  const [userCoins, setUserCoins] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let url = "";
        if (userRole === "student") {
          url = "https://coinsite.pythonanywhere.com/students/get-me/";
        } else if (userRole === "teacher") {
          url = "https://coinsite.pythonanywhere.com/mentors/get-me/";
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

  return (
    <aside className="sidebar">
      <div className="top">
      <div className="logo">
        <Link to="/">
          <img className="logoImg" src="./public/icon.png" alt="logo" />
          <p className="logoName">EURO COIN</p>
        </Link>
      </div>

      <nav className="nav-links">
        {userRole === "student" && (
          <>
            <Link to="/"><FaHome /> Bosh sahifa</Link>
            <Link to="/tasks"><PiStudentBold /> Topshiriqlar</Link>
            <Link to="/profile"><FaUser /> Profil</Link>
          </>
        )}

        {userRole === "teacher" && (
          <>
            <Link to="/"><FaHome /> Bosh sahifa</Link>
            <Link to="/students"><PiStudentBold /> Talabalar</Link>
            <Link to="/createTest"><FaPlus /> Test yaratish</Link>
            <Link to="/profile"><FaUser /> Profil</Link>
          </>
        )}

        {userRole === "admin" && (
          <>
            <Link to="/"><FaHome /> Bosh sahifa</Link>
            <Link to="/users"><FaUsers /> Foydalanuvchilar</Link>
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
  );
};

export default Header;
