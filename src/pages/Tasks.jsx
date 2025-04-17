import React from "react";
import "./Tasks.scss"

const Tasks = () => {
  const tasks = [
    {
      id: 1,
      title: "HTML sahifa yaratish",
      description: "HTML elementlari yordamida shaxsiy portfolio sahifasi tuzing.",
      deadline: "2025-04-20",
      completed: false,
    },
    {
      id: 2,
      title: "CSS dizayn berish",
      description: "Portfolio sahifasiga CSS orqali chiroyli dizayn yarating.",
      deadline: "2025-04-25",
      completed: true,
    },
    {
      id: 3,
      title: "JavaScript mini loyihasi",
      description: "Oddiy hisoblagich (counter) loyihasini yarating va interaktiv qiling.",
      deadline: "2025-04-28",
      completed: false,
    },
  ];

  return (
    <div className="task-page">
      <h1 className="page-title">📝 Mening Topshiriqlarim</h1>
      <div className="task-list">
        {tasks.map((task) => (
          <div className={`task-card ${task.completed ? "completed" : ""}`} key={task.id}>
            <div className="task-header">
              <h3>{task.title}</h3>
              <span className={`status ${task.completed ? "done" : "pending"}`}>
                {task.completed ? "Bajarildi ✅" : "Bajarilmagan ❌"}
              </span>
            </div>
            <p className="desc">{task.description}</p>
            <p className="deadline">⏰ Muddat: {task.deadline}</p>
            <button className="btn">{task.completed ? "Ko'rib chiqish" : "Bajarishni boshlash"}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
