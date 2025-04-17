import React from "react";
import "./RewardsSection.scss";

const rewards = [
  { name: "Brendli ruchka", cost: 50 },
  { name: "Kitob", cost: 300 },
  { name: "Coffee Gift", cost: 100 },
  { name: "Airpods", cost: 1000 },
];

const RewardsSection = () => {
  return (
    <div className="rewards">
      <h3>Sovrinlar</h3>
      <div className="reward-list">
        {rewards.map((reward, index) => (
          <div className="reward-card" key={index}>
            <h4>{reward.name}</h4>
            <p>{reward.cost} Coin</p>
            <button>Yutib olish</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsSection;