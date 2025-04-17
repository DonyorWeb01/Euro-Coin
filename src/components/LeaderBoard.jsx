import React from "react";
import "./Leaderboard.scss";

const leaders = [
  { name: "Zuhra", coins: 320 },
  { name: "Ali", coins: 290 },
  { name: "Kamol", coins: 270 },
];

const Leaderboard = () => {
  return (
    <div className="leaderboard">
      <h3>Top 3 o‘quvchi</h3>
      <ul>
        {leaders.map((user, i) => (
          <li key={i}>{i + 1}. {user.name} - {user.coins} Coin</li>
        ))}
      </ul>
      <p>Sizning o‘rningiz: 5</p>
    </div>
  );
};

export default Leaderboard;