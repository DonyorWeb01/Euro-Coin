import React, { useEffect, useState } from "react";
import "./Profile.scss";

const Profile = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fileInput, setFileInput] = useState(null);
  const [refresh, setRefresh] = useState(false); // ✅ Ma’lumotni yangilash uchun trigger

  console.log(user);

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
    // else if (role === "admin") url = "https://coinsite.pythonanywhere.com/admins/get-me/";

    if (url) {
      fetch(url, requestOptions)
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error("Xatolik:", err));
    }
  }, [role, refresh]); // ✅ refresh trigger qo‘shildi

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFileInput(e.target);
  };

  const handleSave = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("birth_date", user.birth_date);
    if (fileInput && fileInput.files[0]) {
      formData.append("image", fileInput.files[0]);
    }
    formData.append("bio", user.bio);
    formData.append("id", user.id);

    let url = "";
    if (role === "student") url = `https://coinsite.pythonanywhere.com/students/${user.id}/`;
    else if (role === "teacher") url = `https://coinsite.pythonanywhere.com/mentors/${user.id}/`;
    // else if (role === "admin") url = `https://coinsite.pythonanywhere.com/admins/update/${user.id}/`;

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((res) => res.text())
      .then((result) => {
        console.log(result);
        alert("✅ Profil yangilandi!");
        setShowModal(false);
        setRefresh(!refresh); // ✅ Ma’lumotlarni yangilash uchun triggerni almashtirish
      })
      .catch((err) => console.error("Xatolik:", err));
  };

  if (!user) return <div className="profile-page">Yuklanmoqda...</div>;

  return (
    <div className="profile-page">
      <h1 className="page-title">👤 Mening Profilim</h1>
      <div className="profile-card">
        <img className="avatar" src={user.image || "https://i.pravatar.cc/100"} alt="User Avatar" />
        <h2 className="name">{user.name}</h2>
        <p className="role">
          {role === "student" && "🎓 Talaba"}
          {role === "teacher" && "👨‍🏫 O‘qituvchi"}
          {role === "admin" && "🛠 Admin"}
        </p>
        <p><strong>Tug‘ilgan sana:</strong> {user.birth_date || "Kiritilmagan"}</p>
        <p><strong>Bio:</strong> {user.bio || "Bio mavjud emas"}</p>

        <button className="edit-btn" onClick={() => setShowModal(true)}>✏️ Profilni tahrirlash</button>
      </div>

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
              <input type="date" name="birth_date" value={user.birth_date || ""} onChange={handleChange} />
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
  );
};

export default Profile;
