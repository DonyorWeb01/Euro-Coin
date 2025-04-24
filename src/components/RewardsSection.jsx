import React, { useEffect, useRef, useState } from "react";
import "./RewardsSection.scss";

const RewardsSection = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const scrollRef = useRef(null);

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    fetch("https://coinsite.pythonanywhere.com/achievement/", {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    })
      .then(response => response.json())
      .then(data => {
        setRewards(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Xatolik:", error);
        setLoading(false);
      });
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="rewards">
      <h3 className="rewards-title">🎁 Sovrinlar</h3>

      {loading ? (
        <p className="loading">⏳ Yuklanmoqda...</p>
      ) : (
        <div className="scroll-wrapper">
          <div className="reward-list" ref={scrollRef}>
            {rewards.map((reward, index) => (
              <div className="reward-card" key={index}>
                <img className="reward-img" src={reward.image} alt={reward.name} />
                <div className="reward-info">
                  <h4 className="reward-name">{reward.name}</h4>
                  <p className="reward-price">🪙 {reward.point_price} Coin</p>
                  <p className="reward-amount">Qolgan: {reward.amount} ta</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsSection;
