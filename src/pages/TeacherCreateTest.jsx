import React, { useState, useEffect } from "react";
import "./TeacherCreateTest.scss";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrFormNextLink } from "react-icons/gr";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { FaQuestion, FaRegEdit } from "react-icons/fa";

const TeacherCreateTest = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [testDuration, setTestDuration] = useState("");
  const [mentorId, setMentorId] = useState(null);
  const [testId, setTestId] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [step, setStep] = useState(1);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const res = await fetch("https://coinsite.pythonanywhere.com/mentors/get-me/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setTasks(data.my_test || []);
        setMentorId(data.id);
      } catch (error) {
        console.error("Mentor ma'lumotlarini olishda xatolik:", error);
      }
    };
    fetchMentor();
  }, [token]);

  const handleCreateTest = async () => {
    try {
      const res = await fetch("https://coinsite.pythonanywhere.com/test/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: testTitle,
          description: testDescription,
          duration_minutes: parseInt(testDuration),
          created_by: mentorId
        })
      });
      const data = await res.json();
      setTestId(data.id);
      setStep(2);
      alert("✅ Test yaratildi. Endi savol kiriting.");
    } catch (error) {
      alert("Test yaratishda xatolik yuz berdi.");
    }
  };

  const handleCreateQuestion = async () => {
    try {
      const res = await fetch("https://coinsite.pythonanywhere.com/quesion/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text: questionText,
          test: testId
        })
      });
      const data = await res.json();
      setQuestionId(data.id); // ❗️ Savol ID ni saqlaymiz
      alert("✅ Savol qo‘shildi. Endi variantlarni yozing.");
      setStep(3);
    } catch (error) {
      alert("Savol yaratishda xatolik yuz berdi.");
    }
  };

  const handleCreateOptions = async () => {
    try {
      const labels = ["A", "B", "C", "D"];

      for (let i = 0; i < options.length; i++) {
        const res = await fetch("https://coinsite.pythonanywhere.com/answer/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            question: questionId,
            label: labels[i],
            text: options[i],
            is_correct: options[i] === correctAnswer
          })
        });
        await res.json();
      }

      alert("✅ Variantlar muvaffaqiyatli qo‘shildi.");
      // Reset values
      setStep(2);
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setQuestionId(null);
    } catch (error) {
      alert("Variantlarni yaratishda xatolik yuz berdi.");
    }
  };

  return (
    <div className="teacher-panel">
      <div className="tabs">
        <button onClick={() => setActiveTab("tasks")} className={activeTab === "tasks" ? "active" : ""}>
        <BsFillQuestionSquareFill /> Mavjud testlar
        </button>
        <button onClick={() => setActiveTab("tests")} className={activeTab === "tests" ? "active" : ""}>
          🧪 Yangi test yaratish
        </button>
      </div>

      {activeTab === "tasks" && (
        <div className="task-list">
          {tasks.length === 0 ? <p>Topshiriqlar mavjud emas</p> : tasks.map((task, i) => (
            <div className="task-card" key={i}>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "tests" && (
        <div className="test-section">
          {step === 1 && (
            <>
              <h3>📝 Test nomi, tavsifi va davomiyligini kiriting</h3>
              <input type="text" placeholder="Test nomi" value={testTitle} onChange={(e) => setTestTitle(e.target.value)} />
              <textarea placeholder="Tavsif" value={testDescription} onChange={(e) => setTestDescription(e.target.value)} />
              <input type="number" placeholder="Davomiyligi (daqiqa)" value={testDuration} onChange={(e) => setTestDuration(e.target.value)} />
              <button className="submit-btn" onClick={handleCreateTest}><FaRegEdit /> Yaratish</button>
            </>
          )}

{step === 2 && (
  <>
    <h3><FaQuestion /> Savolni kiriting</h3>
    <input
      type="text"
      placeholder="Savol matni"
      value={questionText}
      onChange={(e) => setQuestionText(e.target.value)}
    />
    <div className="buttons">
      <button onClick={() => setStep(1)}><IoMdArrowRoundBack /> Ortga</button>
      <button onClick={handleCreateQuestion}><GrFormNextLink /> Keyingisi</button>
    </div>
  </>
)}

{step === 3 && (
  <>
    <h3>📌 Variantlarni kiriting</h3>
    {options.map((opt, i) => (
      <input
        key={i}
        type="text"
        placeholder={`Variant ${i + 1}`}
        value={opt}
        onChange={(e) => {
          const newOpts = [...options];
          newOpts[i] = e.target.value;
          setOptions(newOpts);
        }}
      />
    ))}
    <input
      type="text"
      placeholder="To‘g‘ri javobni kiriting"
      value={correctAnswer}
      onChange={(e) => setCorrectAnswer(e.target.value)}
    />
    <div className="buttons">
      <button onClick={() => setStep(2)}>⬅️ Ortga</button>
      <button onClick={handleCreateOptions}>✅ Saqlash va yangi savol</button>
    </div>
  </>
)}

        </div>
      )}
    </div>
  );
};

export default TeacherCreateTest;
