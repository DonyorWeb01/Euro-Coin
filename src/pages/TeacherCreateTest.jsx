import React, { useState, useEffect } from "react";
import "./TeacherCreateTest.scss";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { FaQuestion, FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const TeacherCreateTest = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [testDuration, setTestDuration] = useState("");
  const [testId, setTestId] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);

  const token = localStorage.getItem("token");
  const mentorId = localStorage.getItem("teacher_id");

  useEffect(() => {
    const fetchGroupsAndTests = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const groupsResponse = await fetch(
          "https://coinsite.pythonanywhere.com/groups/",
          {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          }
        );
        const groupsData = await groupsResponse.json();
        if (Array.isArray(groupsData)) {
          const filteredGroups = groupsData.filter((group) =>
            group.mentors.includes(parseInt(mentorId))
          );
          setGroups(filteredGroups);
        } else {
          console.error(
            "Guruhlar API noto'g'ri ma'lumot qaytardi:",
            groupsData
          );
        }

        const testsResponse = await fetch(
          "https://coinsite.pythonanywhere.com/test/",
          {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          }
        );
        const testsData = await testsResponse.json();
        if (Array.isArray(testsData)) {
          const formattedTasks = testsData.map((test) => ({
            title: test.title,
            id: test.id,
            description: test.description || "Tavsif mavjud emas.",
          }));
          setTasks(formattedTasks);
        } else {
          console.error("Testlar API noto'g'ri ma'lumot qaytardi:", testsData);
        }
      } catch (error) {
        console.error("Ma'lumotlarni olib kelishda xatolik:", error);
      }
    };

    fetchGroupsAndTests();
  }, [token, mentorId]);

  const resetAllStates = () => {
    setTestTitle("");
    setTestDescription("");
    setTestDuration("");
    setSelectedGroup("");
    setTestId(null);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswerIndex(null);
  };

  const handleCreateTest = () => {
    if (!selectedGroup || !testTitle || !testDuration) {
      toast.warning("❗ Iltimos, barcha ma'lumotlarni to'liq to'ldiring.");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      title: testTitle,
      description: testDescription,
      duration_minutes: parseInt(testDuration),
      created_by: mentorId,
      groups: [parseInt(selectedGroup)],
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://coinsite.pythonanywhere.com/test/create/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("✅ Test yaratildi:", result);
        setTestId(result.id);
        toast.success(
          `✅ Test yaratildi. Endi savol va variantlarni yozing.`
        );
      })
      .catch((error) => {
        console.error("Test yaratishda xatolik:", error);
        toast.error("❌ Test yaratishda xatolik yuz berdi.");
      });
  };

  const handleSaveQuestion = () => {
    if (
      !questionText ||
      options.some((opt) => opt.trim() === "") ||
      correctAnswerIndex === null
    ) {
      toast.warning("❗ Iltimos, barcha savol va variantlarni to'liq to'ldiring.");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const optionsPayload = options.map((opt, i) => ({
      label: String.fromCharCode(65 + i), // A, B, C, D
      text: opt,
      is_correct: i === correctAnswerIndex,
    }));

    const raw = JSON.stringify({
      text: questionText,
      test_id: testId,
      options: optionsPayload,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://coinsite.pythonanywhere.com/quesion/option/create/",
      requestOptions
    )
      .then((response) => {
        if (response.ok) {
          toast.success(
            "✅ Savol va variantlar saqlandi. Keyingi savolni yozishingiz mumkin."
          );
          setQuestionText("");
          setOptions(["", "", "", ""]);
          setCorrectAnswerIndex(null);
        } else {
          return response.json().then((data) => {
            console.error("❌ Saqlashda xatolik:", data);
            toast.error("❌ Savol saqlashda xatolik yuz berdi.");
          });
        }
      })
      .catch((error) => {
        console.error("❌ So'rovda xatolik:", error);
        toast.error("❌ Server bilan aloqa xatosi.");
      });
  };

  const handleFinishTest = () => {
    resetAllStates();
    setActiveTab("tasks");
    toast.success("✅ Test va savollar yaratildi. Mavjud testlarga qaytdingiz.");
  };

  // Mavjud testlarni ko'rish!
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setIsModalOpen] = useState(false);

  const handleViewTest = async (taskId) => {
    console.log("taskId kelyapti:", taskId); // tekshirib olamiz

    if (!taskId) {
      console.error("taskId topilmadi!");
      return;
    }

    try {
      setLoading(true);
      setSelectedTest(taskId);
      setIsModalOpen(true);

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        "https://coinsite.pythonanywhere.com/quesion/",
        requestOptions
      );
      const data = await response.json();
      console.log("APIdan kelgan data:", data);

      // FILTER qilish: Faqat shu testga tegishli savollar
      const filteredQuestions = data.filter(
        (question) => String(question.test) === String(taskId)
      );

      console.log("Filtered questions:", filteredQuestions);

      setQuestions(filteredQuestions);
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-panel">
      <div className="tabs">
        <button
          id="btn1"
          onClick={() => setActiveTab("tasks")}
          className={activeTab === "tasks" ? "active" : ""}
        >
          <BsFillQuestionSquareFill /> Mavjud testlar
        </button>
        <button
          id="btn1"
          onClick={() => setActiveTab("tests")}
          className={activeTab === "tests" ? "active" : ""}
        >
          🧪 Yangi test yaratish
        </button>
      </div>

      {activeTab === "tasks" && (
        <div className="task-section">
          {tasks.length === 0 ? (
            <p>Topshiriqlar mavjud emas</p>
          ) : (
            <div className="task-list">
              {tasks.map((task, i) => {
                console.log("task:", task); // HAR BIR TASKNI KO'RAMIZ

                return (
                  <div className="task-card" key={i}>
                    <h2>{task.title}</h2>
                    <p>{task.description}</p>
                    <button
                      className="view-test-btn"
                      onClick={() => handleViewTest(task?.id)}
                    >
                      Testni ko‘rish
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Test savollar qismi */}
          {modalOpen && (
            <div className="custom-modal-overlay">
              <div className="custom-modal">
                <button
                  className="custom-close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  X
                </button>
                <h3 className="custom-modal-title">Test savollari:</h3>
                {loading ? (
                  <p className="custom-loading">Yuklanmoqda...</p>
                ) : questions.length > 0 ? (
                  <ul className="custom-questions-list">
                    {questions.map((q, idx) => (
                      <li key={idx} className="custom-question-item">
                        {q.text}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="custom-no-questions">Savollar topilmadi</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "tests" && (
        <div className="test-section">
          {!testId ? (
            <>
              <h3>📝 Test nomi, tavsifi, davomiyligi va guruhni kiriting</h3>
              <input
                type="text"
                placeholder="Test nomi"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
              />
              <textarea
                placeholder="Tavsif"
                value={testDescription}
                onChange={(e) => setTestDescription(e.target.value)}
              />
              <input
                type="number"
                placeholder="Davomiyligi (daqiqa)"
                value={testDuration}
                onChange={(e) => setTestDuration(e.target.value)}
              />
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">-- Guruh tanlang --</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              <button className="submit-btn" onClick={handleCreateTest}>
                <FaRegEdit /> Yaratish
              </button>
            </>
          ) : (
            <>
              <h3>
                <FaQuestion /> Savol va variantlarni kiriting
              </h3>
              <input
                type="text"
                placeholder="Savol matni"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
              <div className="options-list">
                {options.map((opt, i) => (
                  <div key={i} className="option-item">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={correctAnswerIndex === i}
                      onChange={() => setCorrectAnswerIndex(i)}
                    />
                    <input
                      type="text"
                      placeholder={`Variant ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[i] = e.target.value;
                        setOptions(newOpts);
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="buttons">
                <button onClick={handleSaveQuestion}>✅ Saqlash</button>
                <button
                  onClick={() => {
                    handleSaveQuestion();
                    handleFinishTest();
                  }}
                >
                  🔚 Tugatish
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherCreateTest;







































// import React, { useState, useEffect } from "react";
// import "./TeacherCreateTest.scss";
// import { BsFillQuestionSquareFill } from "react-icons/bs";
// import { FaQuestion, FaRegEdit } from "react-icons/fa";
// import { toast } from "react-toastify";

// const TeacherCreateTest = () => {
//   const [activeTab, setActiveTab] = useState("tasks");
//   const [tasks, setTasks] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState("");
//   const [testTitle, setTestTitle] = useState("");
//   const [testDescription, setTestDescription] = useState("");
//   const [testDuration, setTestDuration] = useState("");
//   const [testId, setTestId] = useState(null);

//   const [questionText, setQuestionText] = useState("");
//   const [questionImage, setQuestionImage] = useState(null); // ✅ Savol rasmi uchun
//   const [options, setOptions] = useState([
//     { text: "", image: null },
//     { text: "", image: null },
//     { text: "", image: null },
//     { text: "", image: null },
//   ]);
//   const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);

//   const token = localStorage.getItem("token");
//   const mentorId = localStorage.getItem("teacher_id");

//   useEffect(() => {
//     const fetchGroupsAndTests = async () => {
//       try {
//         const myHeaders = new Headers();
//         myHeaders.append("Authorization", `Bearer ${token}`);

//         const groupsResponse = await fetch(
//           "https://coinsite.pythonanywhere.com/groups/",
//           {
//             method: "GET",
//             headers: myHeaders,
//             redirect: "follow",
//           }
//         );
//         const groupsData = await groupsResponse.json();
//         if (Array.isArray(groupsData)) {
//           const filteredGroups = groupsData.filter((group) =>
//             group.mentors.includes(parseInt(mentorId))
//           );
//           setGroups(filteredGroups);
//         }

//         const testsResponse = await fetch(
//           "https://coinsite.pythonanywhere.com/test/",
//           {
//             method: "GET",
//             headers: myHeaders,
//             redirect: "follow",
//           }
//         );
//         const testsData = await testsResponse.json();
//         if (Array.isArray(testsData)) {
//           const formattedTasks = testsData.map((test) => ({
//             title: test.title,
//             id: test.id,
//             description: test.description || "Tavsif mavjud emas.",
//           }));
//           setTasks(formattedTasks);
//         }
//       } catch (error) {
//         console.error("Ma'lumotlarni olib kelishda xatolik:", error);
//       }
//     };

//     fetchGroupsAndTests();
//   }, [token, mentorId]);

//   const resetAllStates = () => {
//     setTestTitle("");
//     setTestDescription("");
//     setTestDuration("");
//     setSelectedGroup("");
//     setTestId(null);
//     setQuestionText("");
//     setQuestionImage(null);
//     setOptions([
//       { text: "", image: null },
//       { text: "", image: null },
//       { text: "", image: null },
//       { text: "", image: null },
//     ]);
//     setCorrectAnswerIndex(null);
//   };

//   const handleCreateTest = () => {
//     if (!selectedGroup || !testTitle || !testDuration) {
//       toast.warning("❗ Iltimos, barcha ma'lumotlarni to'liq to'ldiring.");
//       return;
//     }

//     const myHeaders = new Headers();
//     myHeaders.append("Authorization", `Bearer ${token}`);
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       title: testTitle,
//       description: testDescription,
//       duration_minutes: parseInt(testDuration),
//       created_by: mentorId,
//       groups: [parseInt(selectedGroup)],
//     });

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };

//     fetch("https://coinsite.pythonanywhere.com/test/create/", requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         setTestId(result.id);
//         toast.success("✅ Test yaratildi. Endi savol va variantlarni yozing.");
//       })
//       .catch((error) => {
//         console.error("Test yaratishda xatolik:", error);
//         toast.error("❌ Test yaratishda xatolik yuz berdi.");
//       });
//   };

//   const handleSaveQuestion = async () => {
//     // if (
//     //   !questionText ||
//     //   options.some((opt) => opt.text.trim() === "" && !opt.image) ||
//     //   correctAnswerIndex === null
//     // ) {
//     //   toast.warning("❗ Iltimos, barcha savol va variantlarni to'liq to'ldiring.");
//     //   return;
//     // }
//     if (
//       !questionText ||
//       options.some((opt) => (!opt.text?.trim() && !opt.image)) ||
//       correctAnswerIndex === null
//     ) {
//       toast.warning("❗ Iltimos, barcha savol va variantlarni to'liq to'ldiring.");
//       return;
//     }
    

//     const myHeaders = new Headers();
//     myHeaders.append("Authorization", `Bearer ${token}`);

//     const formData = new FormData();
//     formData.append("text", questionText);
//     formData.append("test_id", testId);

//     if (questionImage) {
//       formData.append("image", questionImage);
//     }

//     options.forEach((opt, i) => {
//       formData.append(`options[${i}][label]`, String.fromCharCode(65 + i)); // A, B, C, D
//       formData.append(`options[${i}][text]`, opt.text || "");
//       formData.append(`options[${i}][is_correct]`, i === correctAnswerIndex);
//       if (opt.image) {
//         formData.append(`options[${i}][image]`, opt.image);
//       }
//     });

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders, 
//       body: formData,
//       redirect: "follow",
//     };

//     try {
//       const response = await fetch(
//         "https://coinsite.pythonanywhere.com/quesion/option/create/",
//         requestOptions
//       );
//       if (response.ok) {
//         toast.success("✅ Savol va variantlar saqlandi. Keyingi savolni yozishingiz mumkin.");
//         setQuestionText("");
//         setQuestionImage(null);
//         setOptions([
//           { text: "", image: null },
//           { text: "", image: null },
//           { text: "", image: null },
//           { text: "", image: null },  
//         ]);
//         setCorrectAnswerIndex(null);
//       } else {
//         toast.error("❌ Savol saqlashda xatolik yuz berdi.");
//       }
//     } catch (error) {
//       console.error("❌ Server bilan aloqa xatosi:", error);
//       toast.error("❌ Server bilan aloqa xatosi.");
//     }
//   };

//   const handleFinishTest = () => {
//     resetAllStates();
//     setActiveTab("tasks");
//     toast.success("✅ Test va savollar yaratildi. Mavjud testlarga qaytdingiz.");
//   };

//   const [selectedTest, setSelectedTest] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setIsModalOpen] = useState(false);

//   const handleViewTest = async (taskId) => {
//     if (!taskId) {
//       console.error("taskId topilmadi!");
//       return;
//     }

//     try {
//       setLoading(true);
//       setSelectedTest(taskId);
//       setIsModalOpen(true);

//       const myHeaders = new Headers();
//       myHeaders.append("Authorization", `Bearer ${token}`);

//       const requestOptions = {
//         method: "GET",
//         headers: myHeaders,
//         redirect: "follow",
//       };

//       const response = await fetch(
//         "https://coinsite.pythonanywhere.com/quesion/",
//         requestOptions
//       );
//       const data = await response.json();

//       const filteredQuestions = data.filter(
//         (question) => String(question.test) === String(taskId)
//       );

//       setQuestions(filteredQuestions);
//     } catch (error) {
//       console.error("Xatolik:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="teacher-panel">
//       <div className="tabs">
//         <button
//           id="btn1"
//           onClick={() => setActiveTab("tasks")}
//           className={activeTab === "tasks" ? "active" : ""}
//         >
//           <BsFillQuestionSquareFill /> Mavjud testlar
//         </button>
//         <button
//           id="btn1"
//           onClick={() => setActiveTab("tests")}
//           className={activeTab === "tests" ? "active" : ""}
//         >
//           🧪 Yangi test yaratish
//         </button>
//       </div> 

//       {activeTab === "tasks" && (
//         <div className="task-section">
//           {tasks.length === 0 ? (
//             <p>Topshiriqlar mavjud emas</p>
//           ) : (
//             <div className="task-list">
//               {tasks.map((task, i) => (
//                 <div className="task-card" key={i}>
//                   <h2>{task.title}</h2>
//                   <p>{task.description}</p>
//                   <button
//                     className="view-test-btn"
//                     onClick={() => handleViewTest(task?.id)}
//                   >
//                     Testni ko‘rish
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {modalOpen && (
//             <div className="custom-modal-overlay">
//               <div className="custom-modal">
//                 <button
//                   className="custom-close-btn"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   X
//                 </button>
//                 <h3 className="custom-modal-title">Test savollari:</h3>
//                 {loading ? (
//                   <p>Yuklanmoqda...</p>
//                 ) : questions.length > 0 ? (
//                   <ul>
//                     {questions.map((q, idx) => (
//                       <li key={idx}>{q.text}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>Savollar topilmadi</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === "tests" && (
//         <div className="test-section">
//           {!testId ? (
//             <>
//               <h3>📝 Test nomi, tavsifi, davomiyligi va guruhni kiriting</h3>
//               <input
//                 type="text"
//                 placeholder="Test nomi"
//                 value={testTitle}
//                 onChange={(e) => setTestTitle(e.target.value)}
//               />
//               <textarea
//                 placeholder="Tavsif"
//                 value={testDescription}
//                 onChange={(e) => setTestDescription(e.target.value)}
//               />
//               <input
//                 type="number"
//                 placeholder="Davomiyligi (daqiqa)"
//                 value={testDuration}
//                 onChange={(e) => setTestDuration(e.target.value)}
//               />
//               <select
//                 value={selectedGroup}
//                 onChange={(e) => setSelectedGroup(e.target.value)}
//               >
//                 <option value="">-- Guruh tanlang --</option>
//                 {groups.map((group) => (
//                   <option key={group.id} value={group.id}>
//                     {group.name}
//                   </option>
//                 ))}
//               </select>
//               <button className="submit-btn" onClick={handleCreateTest}>
//                 <FaRegEdit /> Yaratish
//               </button>
//             </>
//           ) : (
//             <>
//               <h3>
//                 <FaQuestion /> Savol va variantlarni kiriting
//               </h3>
//               <input
//                 type="text"
//                 placeholder="Savol matni"
//                 value={questionText}
//                 onChange={(e) => setQuestionText(e.target.value)}
//               />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setQuestionImage(e.target.files[0])}
//               />

//               <div className="options-list">
//                 {options.map((opt, i) => (
//                   <div key={i} className="option-item">
//                     <input
//                       type="radio"
//                       name="correctAnswer"
//                       checked={correctAnswerIndex === i}
//                       onChange={() => setCorrectAnswerIndex(i)}
//                     />
//                     <input
//                       type="text"
//                       placeholder={`Variant ${i + 1}`}
//                       value={opt.text}
//                       onChange={(e) => {
//                         const newOpts = [...options];
//                         newOpts[i].text = e.target.value;
//                         setOptions(newOpts);
//                       }}
//                     />
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         const newOpts = [...options];
//                         newOpts[i].image = e.target.files[0];
//                         setOptions(newOpts);
//                       }}
//                     />
//                   </div>
//                 ))}
//               </div>

//               <div className="buttons">
//                 <button onClick={handleSaveQuestion}>✅ Saqlash</button>
//                 <button
//                   onClick={() => {
//                     handleSaveQuestion();
//                     handleFinishTest();
//                   }}
//                 >
//                   🔚 Tugatish
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TeacherCreateTest;
