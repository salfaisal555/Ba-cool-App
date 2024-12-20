import React, { useEffect, useState } from "react";
import "./LoadingScreen.css";

const LoadingScreen = () => {
  const [fade, setFade] = useState("fade-in");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade("fade-out");
    }, 2000); // Durasi animasi fade-in sebelum fade-out

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-screen ${fade}`}>
      <h1 className="loading-text">Ba-Cool</h1>
    </div>
  );
};

export default LoadingScreen;
