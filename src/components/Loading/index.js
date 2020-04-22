import React from "react";
import BackGround from "./../../assets/matching_background.svg";

function LoadingComponent() {
  return (
    <div
      className="text-center"
      style={{
        backgroundImage: `url(${BackGround})`,
        backgroundSize: "80%",
        height: "100vh",
        width: "100vw",
      }}
    >
      <h3 className="pt-5 text-white">Loading...</h3>
    </div>
  );
}

export default LoadingComponent;
