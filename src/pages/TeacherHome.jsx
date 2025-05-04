import React, { useEffect, useState } from "react";
import "./TeacherHome.scss";
import { toast } from "react-toastify";

const TeacherHome = () => {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [description, setDescription] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [reason, setReason] = useState("");

  const token = localStorage.getItem("token");
  localStorage.setItem("teacher_id", teacher?.id)
  console.log(groups);
    
  

  // useEffect(() => {
  //   const fetchTeacherData = async () => {
  //     try {
  //       const response = await fetch("https://coinsite.pythonanywhere.com/mentors/get-me/", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       if (!response.ok) throw new Error("Ma'lumotlarni olishda xatolik");

  //       const data = await response.json();
  //       setTeacher(data);
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //   };

  //   const fetchGroups = async () => {
  //     try {
  //       const res = await fetch("https://coinsite.pythonanywhere.com/groups/", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
    
  //       const data = await res.json();
        
  //       // Teacher ID borligini tekshir
  //       if (teacher?.id) {
  //         // Faqat teacher mentor bo'lgan guruhlarni filter qilish
  //         const filteredGroups = data?.filter(group => group.mentors.includes(teacher?.id));
  //         setGroups(filteredGroups);
  //       } else {
  //         setGroups([]); // Agar teacher yo'q bo'lsa, bo'sh array
  //       }
    
  //     } catch (err) {
  //       console.error("Guruhlarni olishda xatolik:", err);
  //     }
  //   };
    
   


  //   const fetchAllStudents = async () => {
  //     try {
  //       const res = await fetch("https://coinsite.pythonanywhere.com/students/", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       const data = await res.json();
  //       setAllStudents(data);
  //     } catch (err) {
  //       console.error("O‘quvchilarni olishda xatolik:", err);
  //     }
  //   };

  //   fetchTeacherData();
  //   fetchGroups();
  //   fetchAllStudents();
  // }, [token]);


  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch("https://coinsite.pythonanywhere.com/mentors/get-me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Ma'lumotlarni olishda xatolik");
        const data = await response.json();
        setTeacher(data);
        localStorage.setItem("teacher_id", data.id);
      } catch (err) {
        setError(err.message);
      }
    };
  
    const fetchAllStudents = async () => {
      try {
        const res = await fetch("https://coinsite.pythonanywhere.com/students/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAllStudents(data);
      } catch (err) {
        console.error("O‘quvchilarni olishda xatolik:", err);
      }
    };
  
    fetchTeacherData();
    fetchAllStudents();
  }, [token]);
  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("https://coinsite.pythonanywhere.com/groups/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
  
        if (teacher?.id) {
          const filteredGroups = data.filter(group => group.mentors.includes(teacher.id));
          setGroups(filteredGroups);
        } else {
          setGroups([]);
        }
      } catch (err) {
        console.error("Guruhlarni olishda xatolik:", err);
      }
    };
  
    if (teacher) {
      fetchGroups();
    }
  }, [teacher, token]);
  


  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);
    setSelectedStudent("");
    const filtered = allStudents.filter((student) => student.group === parseInt(groupId));
    setFilteredStudents(filtered);
  };

  const handleReasonSelect = (selectedReason) => {
    setReason(selectedReason);
    setCoinAmount("");
  };

  const handleCoinAmountChange = (e) => {
    setCoinAmount(e.target.value);
  };

  const handleSendCoin = async (e) => {
    e.preventDefault();

    if (!teacher?.id || !selectedStudent || !coinAmount || !description || !reason) {
      alert("Barcha maydonlarni to‘ldiring!");
      return;
    }

    const amount = parseInt(coinAmount);

    if (reason === "davomat" && amount !== 10) {
      alert("Davomat uchun faqat 10 coin kiritilishi kerak!");
      return;
    }

    if (reason === "dars" && (amount < 20 || amount > 30)) {
      alert("Dars uchun coin 20 va 30 orasida bo‘lishi kerak!");
      return;
    }

    const requestBody = {
      amount,
      description,
      point_type: "mentor",
      student: parseInt(selectedStudent),
      mentor: teacher.id,
    };

    try {
      const response = await fetch("https://coinsite.pythonanywhere.com/give-points/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Xatolik yuz berdi!");
      }

      toast.success("Coin muvaffaqiyatli yuborildi!")
      setCoinAmount("");
      setDescription("");
      setSelectedStudent("");
      setReason("");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Coin yuborishda xatolik:", error);
      setError("Coin yuborilmadi. Xatolik yuz berdi.");
      toast.error("Coin berishda xatolik. Qayta urining!")
    }
  };

  return (
    <div className="teacher-home">
      {error && <p className="error">{error}</p>}

      <div className="profile-card">
        <img
          src={teacher?.image || "/profile.jpg"}
          alt="Profil rasmi"
          className="profile-img"
        />
        <div className="profile-info">
          <h1>{teacher?.name || "Ism topilmadi"}</h1>
          <p>Tug‘ilgan sana: {teacher?.birth_date || "Ma'lumot mavjud emas"}</p>
        </div>
      </div>

      <div className="coin-give-section">
        <h2>Coin berish</h2>
        <form onSubmit={handleSendCoin} className="coin-form">
          <select
            value={selectedGroup}
            onChange={(e) => handleGroupSelect(e.target.value)}
            required
          >
            <option value="">Guruhni tanlang</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>

          {filteredStudents.length > 0 && (
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
            >
              <option value="">O‘quvchini tanlang</option>
              {filteredStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={reason}
            onChange={(e) => handleReasonSelect(e.target.value)}
            required
          >
            <option value="">Sababni tanlang</option>
            <option value="davomat">Davomat uchun</option>
            <option value="dars">Dars uchun</option>
          </select>

          {reason && (
            <input
              type="number"
              placeholder={
                reason === "davomat"
                  ? "Faqat 10 coin kiriting"
                  : "20 va 30 oralig‘ida coin kiriting"
              }
              value={coinAmount}
              onChange={handleCoinAmountChange}
              required
            />
          )}

          <textarea
            placeholder="Sababni yozing (masalan: yaxshi qatnashgani uchun)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          ></textarea>

          <button type="submit">Coin berish</button>
        </form>

        {successMsg && <p className="success-msg">{successMsg}</p>}
      </div>

      <div className="courses-section">
        <h2>Mavjud kurslar</h2>
        <ul className="course-list">
          {teacher?.course_names?.length > 0 ? (
            teacher.course_names.map((course, index) => (
              <li key={index} className="course-item">
                {course}
              </li>
            ))
          ) : (
            <li>Hozircha hech qanday kurs mavjud emas</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TeacherHome;
