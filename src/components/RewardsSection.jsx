import React, { useEffect, useRef, useState } from "react";
import "./RewardsSection.scss";
import { FaGift } from "react-icons/fa";

const RewardsSection = ({ onLoad }) => {
  const [rewards, setRewards] = useState([]);
  const token = localStorage.getItem("token");
  const scrollRef = useRef(null);

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    fetch("https://coinsite.pythonanywhere.com/achievement/", {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((data) => {
        setRewards(data);
        onLoad(); // Malumot kelganda Homega xabar beradi
      })
      .catch((error) => {
        console.error("Xatolik:", error);
        onLoad(); // Xato bo'lsa ham loader to'xtaydi
      });
  }, [token, onLoad]);

  return (
    <div className="rewards">
      <h3 className="rewards-title">
        <FaGift /> Sovrinlar
      </h3>

      <div className="scroll-wrapper">
        <div className="reward-list" ref={scrollRef}>
          {rewards.length > 0 ? (
            rewards.map((reward, index) => (
              <div className="reward-card" key={index}>
                <img className="reward-img" src={reward.image} alt={reward.name} />
                <div className="reward-info">
                  <h4 className="reward-name">{reward.name}</h4>
                  <p className="reward-price">🪙 {reward.point_price} Coin</p>
                  <p className="reward-amount">Qolgan: {reward.amount} ta</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-rewards">Sovrinlar mavjud emas</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardsSection;
