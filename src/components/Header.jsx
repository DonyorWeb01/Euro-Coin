import { Link } from "react-router-dom";
import "./Header.scss";

const Header = ({ userRole }) => {

  const login = localStorage.getItem("login")

  
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
        <img className="logoImg" src="./public/logo.png" alt="" />
        <p className="logoName">EURO COIN</p>
        </Link>
      </div>
      <nav className="nav-links">
        {/* Talaba uchun navigatsiya */}
        {userRole === "student" && (
          <>
            <Link to="/">Bosh sahifa</Link>
            <Link to="/tasks">Topshiriqlar</Link>
            <Link to="/profile">Profil</Link>
          </>
        )}

        {/* O‘qituvchi uchun navigatsiya */}
        {userRole === "teacher" && (
          <>
            <Link to="/">Bosh sahifa</Link>
            <Link to="/students">Talabalar Ro‘yxati</Link>
            <Link to="/createTest">Yangi test yaratish</Link>
            <Link to="/profile">Profil</Link>
          </>
        )}

        {/* Admin uchun navigatsiya */}
        {userRole === "admin" && (
          <>
            <Link to="/">Bosh sahifa</Link>
            <Link to="/users">Foydalanuvchilar Ro‘yxati</Link>
          </>
        )}
      </nav>
      <div className="user-info">
        <span className="coins">💰 120</span>
        <span className="user">👤 {login}</span>
      </div>
    </header>
  );
};

export default Header;
