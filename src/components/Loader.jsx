import React from "react";

const Loader = () => {
  return (
    <div style={{
      minHeight: "83vh",
      borderRadius:"20px",
      display: "flex",
      flexDirection: "column",
      gap:"10px",
      justifyContent: "center",
      alignItems: "center",
      background: "rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)", // Safari uchun
    }}>
      <div style={{
        width: "60px",
        height: "60px",
        border: "6px solid #ccc",
        borderTop: "6px solid #4A90E2",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <h3>Ma'lumotlar yuklanmoqda...</h3>
    </div>
  );
};

export default Loader;
