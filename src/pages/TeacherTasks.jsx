import React from "react";
import "./TeacherTasks.scss";

const tasks = [
  {
    title: "HTML asoslari",
    description: "O‘quvchilarga taglar va tuzilma haqida vazifa bering.",
    dueDate: "2025-04-20",
  },
  {
    title: "CSS Box Model",
    description: "Box modelni chizmalar bilan tushuntirib berish topshirig‘i.",
    dueDate: "2025-04-21",
  },
  {
    title: "JavaScript function",
    description: "Oddiy function yozib, natijasini konsolda chiqarish.",
    dueDate: "2025-04-23",
  },
];

const TeacherTasks = () => {
  return (
    <div className="teacher-tasks">
      <h1>Yuborilgan Topshiriqlar</h1>

      <div className="task-list">
        {tasks.map((task, index) => (
          <div className="task-card" key={index}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <span>Muddati: {task.dueDate}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherTasks;
