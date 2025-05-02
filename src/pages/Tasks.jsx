import React, { useEffect, useState } from "react";
import "./Tasks.scss";
import { IoClose } from "react-icons/io5";

const Tasks = () => {
  const [tests, setTests] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
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
  const [completedTests, setCompletedTests] = useState([]); // ✅ Yangi: Ishlangan testlar uchun

  const token = localStorage.getItem("token");
  const studentId = localStorage.getItem("student_id");

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    // Testni olish
    fetch("https://coinsite.pythonanywhere.com/test/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const testObj = {};
        data.forEach((test) => {
          testObj[test.id] = test;
        });
        setTests(testObj);
      })
      .catch((error) => console.log("Testlarni yuklashda xatolik:", error));

    // Savollarni olish
    fetch("https://coinsite.pythonanywhere.com/quesion/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
      })
      .catch((error) => console.log("Savollarni yuklashda xatolik:", error));

    // Javoblarni olish
    fetch("https://coinsite.pythonanywhere.com/answer/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setAnswers(data);
      })
      .catch((error) => console.log("Variantlarni yuklashda xatolik:", error));

    // ✅ Yangi: Ishlangan testlarni olish
    fetch(
      "https://coinsite.pythonanywhere.com/api/test-submission-log/",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        const completedIds = data.map((item) => item.test_id);
        setCompletedTests(completedIds);
      })
      .catch((error) =>
        console.log("Ishlangan testlarni olishda xatolik:", error)
      );
  }, []);

  // Test vaqti
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

  const handleStartTest = () => {
    setShowStartConfirm(false);
    setShowModal(true);
    setActiveTestId(selectedTestId);

    const selectedTest = tests[selectedTestId];
    if (selectedTest) {
      startCountdown(selectedTest.duration_minutes);
    }

    const filteredQuestions = questions.filter(
      (q) => q.test === selectedTestId
    );
    const questionsWithAnswers = filteredQuestions.map((q) => {
      const relatedAnswers = answers.filter((ans) => ans.question === q.id);
      return { ...q, answers: relatedAnswers };
    });

    setSelectedQuestions(questionsWithAnswers);
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

    let score = 0;
    selectedQuestions.forEach((q) => {
      const correctAnswer = (q.answers || []).find((ans) => ans.is_correct);
      const selectedAnswerId = selectedAnswers[q.id];

      if (
        selectedAnswerId &&
        correctAnswer &&
        selectedAnswerId === correctAnswer.id
      ) {
        score += 1;
      }
    });

    // Serverga natijani yuborish
    submitTestResult(score);

    // Natija ko'rsatish uchun state yangilash
    setResultData({
      score,
      total: selectedQuestions.length,
    });

    setDetailedResult({
      student_name: "Test Student",
      test_title: tests[activeTestId]?.title || "Noma'lum test",
      score: `${score}/${selectedQuestions.length}`, // Backtick ichiga olish kerak edi!
      taken_at: new Date().toISOString(),
    });

    setShowResultModal(true);
  };

  // Ishlagan testni apiga yuborish
  const submitTestResult = (correctAnswersCount) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const body = JSON.stringify({
      student_id: Number(studentId),
      test_id: activeTestId,
      correct_answers: correctAnswersCount,
    });

    console.log(body);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: body,
      redirect: "follow",
    };

    fetch(
      "https://coinsite.pythonanywhere.com/api/tests/submit/",
      requestOptions
    )
      .then(async (response) => {
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server xatosi: ${errorText}`);
        }

        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          console.log("✅ Natija yuborildi:", result);
        } else {
          const text = await response.text();
          console.log("✅ Javob JSON emas, text:", text);
        }
      })
      .catch((error) => console.error("❌ Xatolik yuborishda:", error));
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Vaqtni olish
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  // ishlagan testga natija chiqarish
  const handleViewResult = (testId) => {
    const test = tests[testId];
    setDetailedResult({
      student_name: "Test Student",
      test_title: test?.title,
      score: completedTests.includes(testId)
        ? "✅ Ishlangan"
        : "Testni yakunlamagan", // O'zgartirish kiritildi
      taken_at: new Date().toISOString(),
    });
    setShowResultModal(true);
  };

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
            {completedTests.includes(Number(id)) ? (
              <button
                className="btn view-result-btn"
                onClick={() => handleViewResult(Number(id))}
              >
                Natijani ko'rish
              </button>
            ) : (
              <button
                className="btn"
                onClick={() => handleStartClick(Number(id))}
              >
                Boshlash
              </button>
            )}
          </div>
        ))}
      </div>

      {showStartConfirm && (
        <div className="modal-overlay1">
          <div className="modal-content1">
            <h2>⚠️ Diqqat!</h2>
            <p>
              Ushbu testni faqat bir marta ishlash imkoniyatingiz bor.
              Boshlashga ishonchingiz komilmi?
            </p>
            <div className="btns1" style={{ marginTop: "1rem" }}>
              <button className="btn submit-btn" onClick={handleStartTest}>
                Ha, boshlayman
              </button>
              <button
                className="closeBtn"
                onClick={() => setShowStartConfirm(false)}
              >
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
            <p>
              ⏳ Qolgan vaqt: <strong>{formatTime(timeLeft)}</strong>
            </p>
            <div className="questions-list">
              <ul>
                {selectedQuestions.map((q) => (
                  <li key={q.id}>
                    <p>{q.text}</p>
                    <ul>
                      {(q.answers || []).map((ans) => (
                        <li key={ans.id}>
                          <label
                            onClick={() => handleAnswerSelect(q.id, ans.id)}
                          >
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
                Yuborish
              </button>
              <button
                className="closeBtn1"
                onClick={() => {
                  setShowModal(false);
                  if (timer) clearInterval(timer);
                }}
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {showResultModal && detailedResult && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>✅ Natijangiz</h2>
            <hr />
            <p>
              <strong>Ismingiz:</strong> {detailedResult.student_name}
            </p>
            <p>
              <strong>Test nomi:</strong> {detailedResult.test_title}
            </p>
            <p>
              <strong>Holat:</strong> {detailedResult.score}
            </p>
            <p>
              <strong>Vaqt:</strong>{" "}
              {new Date(detailedResult.taken_at).toLocaleString()}
            </p>
            <button
              className="XBtn"
              onClick={() => setShowResultModal(false)}
            >
              <IoClose />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
