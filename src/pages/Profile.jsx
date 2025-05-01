import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { FaEdit, FaUser } from "react-icons/fa";
import Loader from "../components/Loader"; // Loader komponentasini import qilamiz
import { TbLogout2 } from "react-icons/tb";

const Profile = () => {
  const role = localStorage.getItem("role"); // LocalStorage dan role ni olamiz
  const token = localStorage.getItem("token"); // LocalStorage dan token ni olamiz
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fileInput, setFileInput] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // Logout funksiyasi
  const handleLogout = () => {
    localStorage.clear(); // Barcha localStorage ma'lumotlarini o'chirib tashlaymiz
    window.location.href = "/login"; // Login sahifasiga yuboramiz
  };

  // Profil ma'lumotlarini olish uchun API chaqiruv
  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    let url = "";
    if (role === "student") url = "https://coinsite.pythonanywhere.com/students/get-me/";
    else if (role === "teacher") url = "https://coinsite.pythonanywhere.com/mentors/get-me/";

    if (url) {
      fetch(url, requestOptions)
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error("Xatolik:", err));
    }
  }, [role, refresh]);

  // Form input o'zgarishini ushlash
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Fayl yuklash inputini ushlash
  const handleFileChange = (e) => {
    setFileInput(e.target);
  };

  // Saqlash tugmasi bosilganda profilni yangilash
  const handleSave = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const formData = new FormData();
    formData.append("name", user.name);

    if (role === "student") formData.append("birth_date", user.birth_date);
    else if (role === "teacher") formData.append("birthday", user.birthday);

    if (fileInput && fileInput.files[0]) {
      formData.append("image", fileInput.files[0]);
    }

    formData.append("bio", user.bio);
    formData.append("id", user.id);

    let url = "";
    if (role === "student") url = `https://coinsite.pythonanywhere.com/students/${user.id}/`;
    else if (role === "teacher") url = `https://coinsite.pythonanywhere.com/mentors/${user.id}/`;

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((res) => res.text())
      .then(() => {
        alert("✅ Profil yangilandi!");
        setShowModal(false);
        setRefresh(!refresh); // Ma'lumotni qayta yuklash
      })
      .catch((err) => console.error("Xatolik:", err));
  };

  // User yuklanmagan bo'lsa Loader ko'rsatamiz
  if (!user) return <div className="profile-page1"><Loader /></div>;

  // Tug‘ilgan sanani role ga qarab aniqlaymiz
  const birthDate = role === "student" ? user.birth_date : user.birthday;

  return (
    <div className="profil1">
      <div className="profile-page">
      <h1 className="page-title"><FaUser /> Mening Profilim</h1>

      <div className="profile-card">
        <img className="avatar" src={user.image || "https://i.pravatar.cc/100"} alt="User Avatar" />
        <h2 className="name">{user.name}</h2>

        <div className="info-box">
          <p><strong>Rol:</strong> 
            {role === "student" && "  Talaba"}
            {role === "teacher" && "  O‘qituvchi"}
            {role === "admin" && "  Admin"}
          </p>
          <div className="highlight-box">
            <p><strong>Tug‘ilgan sana:</strong> {birthDate || "Kiritilmagan"}</p>
            <p><strong>Bio:</strong> {user.bio || "Bio mavjud emas"}</p>
          </div>
        </div>

        <div className="profi-btns">
        <button className="edit-btn" onClick={() => setShowModal(true)}>
          <FaEdit />  Profilni tahrirlash
        </button>
        <button className="logout-btn" onClick={handleLogout}>
        <TbLogout2 /> Chiqish
        </button>
        </div>
      </div>

      {/* Modal oynasi */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🛠 Profilni tahrirlash</h2>
            <label>
              Ism:
              <input type="text" name="name" value={user.name} onChange={handleChange} />
            </label>
            <label>
              Tug‘ilgan sana:
              <input
                type="date"
                name={role === "student" ? "birth_date" : "birthday"}
                value={birthDate || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              Rasm yuklash:
              <input type="file" name="image" onChange={handleFileChange} />
            </label>
            <label>
              Bio:
              <textarea name="bio" rows="3" value={user.bio || ""} onChange={handleChange} />
            </label>

            <div className="modal-buttons">
              <button onClick={handleSave}>💾 Saqlash</button>
              <button onClick={() => setShowModal(false)}>❌ Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Profile;
