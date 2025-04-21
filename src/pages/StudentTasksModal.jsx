import React from "react";
import "./StudentTasksModal.scss";

const StudentTaskModal = ({ onClose }) => {
  // Savollar ro'yxati:
  const questions = [
    {
      id: 1,
      question: "HTMLda pargraf uchun qaysi teg ishlatiladi?",
      options: ["<div>", "<p>", "<span>"],
    },
    {
      id: 2,
      question: "Rasm chiqarish uchun qaysi teg ishlatiladi?",
      options: ["<img>", "<src>", "<image>"],
    },
    {
      id: 3,
      question: "CSS faylini HTMLga qanday ulaysiz?",
      options: [
        "<link rel='stylesheet' href='style.css'>",
        "<script src='style.css'>",
        "<style src='style.css'>"
      ]
    },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>✅ Test Topshiriqlari</h2>

        {questions.map((q) => (
          <div className="question" key={q.id}>
            <p>{q.id}. {q.question}</p>
            {q.options.map((option, index) => (
              <label key={index}>
                <input type="radio" name={`q${q.id}`} />
                {option}
              </label>
            ))}
          </div>
        ))}

        <button className="submit-btn" onClick={onClose}>
          Yuborish
        </button>
      </div>
    </div>
  );
};

export default StudentTaskModal;
