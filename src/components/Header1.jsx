import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // useLocation qo‘shildi
import "./Header1.scss";
import { FaUser } from "react-icons/fa";
import {
  IoIosArrowForward,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import { RiLogoutBoxLine } from "react-icons/ri";
import { toast } from "react-toastify";

const Header1 = ({ userRole }) => {
  const location = useLocation(); // current URL uchun
  const [userData, setUserData] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    if (userRole === "student") {
      fetch(
        "https://apieurocoin.uz/students/get-me/",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => setUserData(result))
        .catch((error) => console.log("Xatolik:", error));
    } else if (userRole === "teacher") {
      fetch(
        "https://apieurocoin.uz/mentors/get-me/",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => setUserData(result))
        .catch((error) => console.log("Xatolik:", error));
    }
  }, [token, userRole]);

  const toggleProfileMenu = () => {
    setIsProfileOpen((prev) => !prev);
    setIsInfoOpen(false);
  };

  const toggleInfoMenu = () => {
    setIsInfoOpen((prev) => !prev);
    setIsProfileOpen(false);
  };

  const closeAllMenus = () => {
    setIsProfileOpen(false);
    setIsInfoOpen(false);
  };

  const [headerOpen, setHeaderOpen] = useState(true)

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
    setHeaderOpen(false)
    toast.success("Hisobingizdan muvaffaqiyatli chiqdingiz!")
  };

  // AGAR URL '/login' bo'lsa headerni ko'rsatmaymiz
  if (location.pathname === "/login") {
    return null;
  }

  return (
    <div>
         {
    headerOpen ? ( <div>
      <header
        className={`header ${isProfileOpen || isInfoOpen ? "open-menu" : ""}`}
      >
        <div className="header-right">
          {userData && userRole === "student" && (
            <b className="user-coins">🪙{userData.points}</b>
          )}
          <div className="profilBtns">
            <button className="profilModalBtn" onClick={toggleProfileMenu}>
              <FaUser />
            </button>
            <button className="infoBtn" onClick={toggleInfoMenu}>
              <IoMdInformationCircleOutline />
            </button>
          </div>
        </div>

        {/* Profil Modal */}
        <div
          className={`profilModal ${isProfileOpen ? "open-menu" : ""}`}
          id="profilMenu"
        >
          <div className="modalMenu">
            <div className="userInfo">
              <img src="/icon.png" alt="" className="profilImg" />
              <h2>{userData?.name}</h2>
            </div>
            <hr />
            <Link onClick={closeAllMenus} to="/profile">
              <span className="linkImg">
                <FaUser />
              </span>
              <p>Profil</p>
              <span className="arrow">
                <IoIosArrowForward />
              </span>
            </Link>
            <Link onClick={handleLogout}>
              <span className="linkImg">
                <RiLogoutBoxLine />
              </span>
              <p>Chiqish</p>
              <span className="arrow">
                <IoIosArrowForward />
              </span>
            </Link>
          </div>
        </div>

        {/* Info Modal */}
        <div
          className={`infoModal ${isInfoOpen ? "open-menu" : ""}`}
          id="infoMenu"
        >
          <div className="modalMenu">
            <div className="userInfo">
              <img src="/icon.png" alt="Profile" className="profilImg" />
              <h2>🪙 Coin Yig‘ish va Foydalanish Tartibi</h2>
            </div>
            <hr />
            <div className="modal-body">
              {/* STUDENT QISMI */}
              <h2>🎓 O‘quvchilar Uchun:</h2>

              <h3>1. Darslardan Coin Topish:</h3>
              <p>
                - Har bir darsga <strong>vaqtida</strong> kelgan o‘quvchiga{" "}
                <strong>10 coin</strong> beriladi.
                <br />- Dars davomida <strong>faol qatnashgan</strong>{" "}
                o‘quvchiga o‘qituvchi tomonidan <strong>20 dan 30 coin</strong>
                gacha beriladi.
              </p>

              <h3>2. Testlar Orqali Coin Yig‘ish:</h3>
              <p>
                - Har oyda <strong>2 ta test</strong> o‘tkaziladi.
                <br />- Har bir testda <strong>20 ta savol</strong> bo‘ladi.
                <br />- Har bir to‘g‘ri javob uchun <strong>5 coin</strong>{" "}
                beriladi.
                <br />- Testlar faqat <strong>1 marta</strong> topshiriladi,
                shuning uchun diqqat bilan ishlash kerak.
              </p>

              <h3>3. Auksion va Sovrinlar:</h3>
              <p>
                - To‘plangan coinlar yordamida har oy{" "}
                <strong>auksionlar</strong>da qatnashish mumkin.
                <br />- Auksionda <strong>turli sovg‘alar</strong> va{" "}
                <strong>bonuslar</strong> o‘ynaladi.
                <br />- Har bir o‘quvchi coinlarini auksionga qo‘yib, o‘ziga
                yoqqan sovg‘ani olish uchun raqobat qiladi.
              </p>

              <h3>4. Muhim Eslatmalar:</h3>
              <p>
                - Darslarda <strong>vaqtida</strong> qatnashish va faol bo‘lish
                ko‘proq coin to‘plash imkonini beradi.
                <br />- Testlarda puxta tayyorgarlik ko‘rib,{" "}
                <strong>bir martalik imkoniyat</strong>dan to‘g‘ri foydalanish
                zarur.
                <br />- Auksionlar har oyning <strong>oxirida</strong>{" "}
                o‘tkaziladi.
                <br />- Qoidabuzarlik aniqlansa, coinlar <strong>
                  bekor
                </strong>{" "}
                qilinadi.
              </p>

              <h3>
                🔥 O‘z mahoratingizni ko‘rsating va ko‘proq coin to‘plab, ajoyib
                sovg‘alarni qo‘lga kiriting!
              </h3>

              <hr />

              {/* TEACHER QISMI */}
              <h2>👨‍🏫 O‘qituvchilar Uchun:</h2>

              <h3>1. Test Yaratish Qo‘llanmasi:</h3>
              <p>
                - Har oyda har bir o‘qituvchi <strong>2 ta test</strong>{" "}
                yaratishi kerak.
                <br />- Har bir testda <strong>20 ta savol</strong> bo‘lishi
                shart.
                <br />- Har bir savolda <strong>1 ta to‘g‘ri javob</strong>{" "}
                belgilanishi kerak.
                <br />- Testlar adolatli va bilimni sinovchi bo‘lishi kerak.
              </p>

              <h3>2. Coin Berish Tartibi:</h3>
              <p>
                - Darsda ishtirok etgan o‘quvchilarga quyidagicha coin
                taqsimlanadi:
                <br />- <strong>10 coin</strong> - vaqtida kelgan va darsni
                boshlagan o‘quvchilarga.
                <br />- <strong>20 dan 30 coin</strong> - darsda faol qatnashgan
                o‘quvchilarga (sifatli ishtirok uchun).
              </p>

              <h3>3. Faoliyatni Kuzatish:</h3>
              <p>
                - Har bir darsdan keyin faol o‘quvchilarning coinlari tizimga
                kiritiladi.
                <br />- Test natijalari tizimda avtomatik tarzda hisoblanadi va
                coinlar qo‘shiladi.
              </p>

              <h3>4. Muhim Eslatmalar:</h3>
              <p>
                - O‘quvchilarga coin berishda adolatli va shaffof yondashish
                talab qilinadi.
                <br />
                - Testlar va darslardagi natijalar aniq va tizimli bo‘lishi
                kerak.
                <br />- Oylik auksionlarga tayyorgarlik ko‘rish va o‘quvchilarga
                motivatsiya berish muhim.
              </p>

              <h3>
                ✅ Hamkorlikda o‘quvchilarning rag‘batini oshirib, bilim va
                faollikni rivojlantiraylik!
              </h3>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        onClick={closeAllMenus}
        className={`overlay ${
          isProfileOpen || isInfoOpen ? "open-overlay" : ""
        }`}
      ></div>
    </div>) : ""
   }
    </div>
   
  );
};

export default Header1;
