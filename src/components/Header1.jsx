import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header1.scss"; // SCSS faylini import qilish

const Header1 = ({ userRole }) => {
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    // Foydalanuvchi roli bo'yicha API'dan ma'lumot olish
    if (userRole === "student") {
      fetch("https://coinsite.pythonanywhere.com/students/get-me/", requestOptions)
        .then((response) => response.json())
        .then((result) => setUserData(result))
        .catch((error) => console.log("Xatolik:", error));
    } else if (userRole === "teacher") {
      fetch("https://coinsite.pythonanywhere.com/mentors/get-me/", requestOptions)
        .then((response) => response.json())
        .then((result) => setUserData(result))
        .catch((error) => console.log("Xatolik:", error));
    }
  }, [token, userRole]);

  return (
    <header className="header">
      <div className="header-right">
        {userData && (
          <>
            <span className="user-name">{userData.name}</span>
            {userRole === "student" && (
              <span className="user-coins">
               {userData.points}🪙
              </span>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header1;
