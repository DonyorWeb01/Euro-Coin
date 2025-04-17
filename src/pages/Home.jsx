import React from "react";
import WelcomeSection from "../components/WelcomeSection";
import AttendanceStats from "../components/AttendanceStats";
import RewardsSection from "../components/RewardsSection";
import Leaderboard from "../components/Leaderboard";
import "./Home.scss"

const Home = () => {
  return (
    <>
      <WelcomeSection />
      <div className="content">
        <AttendanceStats />
        <RewardsSection />
      </div>
      <Leaderboard />
    </>
  );
};

export default Home;
