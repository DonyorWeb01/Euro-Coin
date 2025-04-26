
// AttendanceStats.jsx
import React from "react";
import "./AttendanceStats.scss";

const AttendanceStats = ({ user }) => {
  const pointHistory = (user?.point_history || []).slice().reverse();

  return (
    <div className="attendance">
      <h3>Coinlar statistikasi</h3>

      {pointHistory.length === 0 ? (
        <p>Hali statistik ma'lumotlar mavjud emas</p>
      ) : (
        <ul className="history-list">
          {pointHistory.map((item, index) => (
            <li className="history-item" key={index}>
              <div className="icon">
                <h1>🪙</h1>
              </div>
              <div className="info">
                <p className="type">{item.point_type}</p>
                <p className="desc">{item.description}</p>
              </div>
              <div className="amount">
                +{item.amount} Coin
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttendanceStats;
