import React, { useEffect, useState } from "react";
import WelcomeSection from "../components/WelcomeSection";
import AttendanceStats from "../components/AttendanceStats";
import RewardsSection from "../components/RewardsSection";
import "./Home.scss";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token")
  // localStorage.setItem("student_id", userData.id)
  
  

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${token}`
    );

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
      .catch((error) => console.error("Xatolik:", error));
  }, []);

  

  return (
    <>
      <WelcomeSection user={userData} />
      <div className="content">
        <AttendanceStats user={userData}/>
        <RewardsSection />
      </div>
    </>
  );
};

export default Home;
