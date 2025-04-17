import { Link } from "react-router-dom";
import "./Header.scss";

const Header = ({ userRole }) => {

  const login = localStorage.getItem("login")

  
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">EURO COIN</Link>
      </div>
      <nav className="nav-links">
        {/* Talaba uchun navigatsiya */}
        {userRole === "student" && (
          <>
            <Link to="/">Bosh sahifa</Link>
            <Link to="/tasks">Topshiriqlar</Link>
            <Link to="/rewards">Sovrinlar</Link>
            <Link to="/profile">Profil</Link>
          </>
        )}

        {/* O‘qituvchi uchun navigatsiya */}
        {userRole === "teacher" && (
          <>
            <Link to="/">Bosh sahifa</Link>
            <Link to="/tasks">Topshiriqlar</Link>
            <Link to="/students">Talabalar Ro‘yxati</Link>
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
