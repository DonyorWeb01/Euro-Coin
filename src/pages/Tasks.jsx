import React, { useEffect, useState } from "react";
import "./Tasks.scss";

const Tasks = () => {
  const [tests, setTests] = useState({});
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [detailedResult, setDetailedResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timer, setTimer] = useState(null);
  const [activeTestId, setActiveTestId] = useState(null);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    fetch("https://coinsite.pythonanywhere.com/student/test/", {
      method: "GET",
      headers: myHeaders,
    })
      .then((response) => response.json())
      .then((data) => {
        const testObj = {};
        data.forEach((test) => {
          testObj[test.id] = test;
        });
        setTests(testObj);
      })
      .catch((error) => console.error("Error fetching tests:", error));
  }, [token]);

  const startCountdown = (minutes) => {
    const totalSeconds = minutes * 60;
    setTimeLeft(totalSeconds);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          alert("⏰ Vaqt tugadi!");
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(interval);
  };

  const handleStartClick = (testId) => {
    setSelectedTestId(testId);
    setShowStartConfirm(true);
  };

  const handleStartTest = (testId) => {
    setShowStartConfirm(false);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const fetchQuestions = fetch("https://coinsite.pythonanywhere.com/quesion/", {
      method: "GET",
      headers: myHeaders,
    }).then((res) => res.json());

    const fetchAnswers = fetch("https://coinsite.pythonanywhere.com/answer/", {
      method: "GET",
      headers: myHeaders,
    }).then((res) => res.json());

    Promise.all([fetchQuestions, fetchAnswers])
      .then(([questions, allAnswers]) => {
        const filteredQuestions = questions.filter(q => q.test === testId);
        const filteredAnswers = allAnswers.filter(ans => ans.test_id === testId);

        setSelectedQuestions(filteredQuestions);
        setAnswers(filteredAnswers);
        setShowModal(true);
        setActiveTestId(testId);
        startCountdown(tests[testId].duration_minutes);
      })
      .catch((error) => console.error("Ma'lumotlarni olishda xatolik:", error));
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = () => {
    if (timer) clearInterval(timer);
    setShowModal(false);

    const payload = {
      test_id: activeTestId,
      answers: Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
        question_id: parseInt(questionId),
        answer_option_id: answerId,
      })),
    };

    fetch("https://coinsite.pythonanywhere.com/api/tests/submit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        setResultData(data);
        fetchDetailedResult();
        setShowResultModal(true);
      })
      .catch((error) => console.error("Javoblarni yuborishda xatolik:", error));
  };

  const fetchDetailedResult = () => {
    fetch("https://coinsite.pythonanywhere.com/student/test/result/get-me/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDetailedResult(data);
      })
      .catch((err) => console.error("Natija olishda xatolik:", err));
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  return (
    <div className="task-page">
      <h1 className="page-title">📝 Testlar Ro'yxati</h1>
      <div className="task-list">
        {Object.entries(tests).map(([id, test]) => (
          <div className="task-card" key={id}>
            <div className="task-header">
              <h3>{test.title}</h3>
            </div>
            <p className="desc">{test.description}</p>
            <p className="duration">⏳ {test.duration_minutes} daqiqa</p>
            <button className="btn" onClick={() => handleStartClick(Number(id))}>
              Boshlash
            </button>
          </div>
        ))}
      </div>

      {showStartConfirm && (
        <div className="modal-overlay1">
          <div className="modal-content1">
            <h2>⚠️ Diqqat!</h2>
            <p>Ushbu testni faqat bir marta ishlash imkoniyatingiz bor. Boshlashga ishonchingiz komilmi?</p>
            <div className="btns1" style={{ marginTop: "1rem" }}>
              <button className="btn submit-btn" onClick={() => handleStartTest(selectedTestId)}>
                Ha, boshlayman
              </button>
              <button className="btn close-btn" onClick={() => setShowStartConfirm(false)}>
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

{showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>🧠 Test Savollari</h2>
      <p>⏳ Qolgan vaqt: <strong>{formatTime(timeLeft)}</strong></p>
      <div className="questions-list">
  <ul>
    {selectedQuestions.map((q) => (
      <li key={q.id}>
        <p>{q.text}</p>
        <ul>
          {answers
            .filter((ans) => ans.question === q.id)
            .map((ans) => (
              <li key={ans.id}>
                <label onClick={() => handleAnswerSelect(q.id, ans.id)}>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    checked={selectedAnswers[q.id] === ans.id}
                    readOnly
                  />
                  {ans.label}. {ans.text}
                </label>
              </li>
            ))}
        </ul>
      </li>
    ))}
  </ul>
</div>


      <div className="modal-buttons">
        <button className="btn submit-btn" onClick={handleSubmit}>
          ✅ Yuborish
        </button>
        <button
          className="btn close-btn"
          onClick={() => {
            setShowModal(false);
            if (timer) clearInterval(timer);
          }}
        >
          ❌ Yopish
        </button>
      </div>
    </div>
  </div>
)}


      {showResultModal && resultData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>✅ Natijangiz</h2>
            {detailedResult && (
              <>
                <hr />
                <p><strong>Ismingiz:</strong> {detailedResult.student_name}</p>
                <p><strong>Test nomi:</strong> {detailedResult.test_title}</p>
                <p><strong>Ball:</strong> {detailedResult.score}</p>
                <p><strong>Vaqt:</strong> {new Date(detailedResult.taken_at).toLocaleString()}</p>
              </>
            )}
            <button className="btn close-btn" onClick={() => setShowResultModal(false)}>
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
