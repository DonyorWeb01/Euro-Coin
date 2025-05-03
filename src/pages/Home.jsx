import React, { useEffect, useState, useRef } from "react";
import "./Home.scss";
import { FaGift } from "react-icons/fa";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [rewardsLoaded, setRewardsLoaded] = useState(true);
  const [rewards, setRewards] = useState([]);
  const token = localStorage.getItem("token");
  
  const scrollRef = useRef(null);

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://coinsite.pythonanywhere.com/students/get-me/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUserData(result);
        localStorage.setItem("student_id", result.id)

      })
      .catch((error) => {
        console.error("Xatolik:", error);
      });

    // Fetch rewards data
    fetch("https://coinsite.pythonanywhere.com/achievement/", {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((data) => {
        setRewards(data);
        setRewardsLoaded(true);
      })
      .catch((error) => {
        console.error("Xatolik:", error);
        setRewardsLoaded(true);
      });
  }, [token]);

  const isLoading = !userData || !rewardsLoaded;
  return (
    <div className="page-home">
      {isLoading ? (
        <div className="loader-container">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <>
          <section className="welcome">
            <div className="welcome-header">
              <div className="user-image">
                <img
                  src={userData?.image || "/profile.jpg"}
                  alt="User Avatar"
                />
              </div>
              <div className="user-info">
                <h2 className="userName">Assalomu alaykum, {userData?.name}!</h2>
                <p className="bio">"Har kuni kichik g‘alaba – katta yutuqlarga yetaklaydi!"</p>
                {userData?.bio && <p className="bio">{userData?.bio}</p>}
                {userData?.birth_date && (
                  <p className="birthdate">
                    Tug‘ilgan sana: {new Date(userData?.birth_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="content">
            <div className="home-section">
              <div className="attendance">
                <h3>Coinlar statistikasi</h3>
                {userData?.point_history.length === 0 ? (
                  <p>Hali statistik ma'lumotlar mavjud emas</p>
                ) : (
                  <ul className="history-list">
                    {userData?.point_history
                      .slice()
                      .reverse()
                      .map((item, index) => (
                        <li className="history-item" key={index}>
                          <div className="icon">
                            <h1>🪙</h1>
                          </div>
                          <div className="info">
                            <p className="type">{item.point_type}</p>
                            <p className="desc">{item.description}</p>
                          </div>
                          <div className="amount">+{item.amount} Coin</div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>

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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
