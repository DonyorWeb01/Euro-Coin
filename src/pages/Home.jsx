import React, { useEffect, useState } from "react";
import WelcomeSection from "../components/WelcomeSection";
import AttendanceStats from "../components/AttendanceStats";
import RewardsSection from "../components/RewardsSection";
import Loader from "../components/Loader";
import "./Home.scss";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [rewardsLoaded, setRewardsLoaded] = useState(true);
  const token = localStorage.getItem("token");

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
      })
      .catch((error) => {
        console.error("Xatolik:", error);
      });
  }, [token]);

  const isLoading = !userData || !rewardsLoaded;

  return (
    <div className="page-home">
      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <>
          <WelcomeSection user={userData} />
          <div className="content">
            <AttendanceStats user={userData} />
            <RewardsSection onLoad={() => setRewardsLoaded(true)} />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
