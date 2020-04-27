import React from "react";
import "./square.css";

// SVGs
import Circle from "./../../assets/circle-regular.svg";
import Times from "./../../assets/times-solid.svg";

function Square({ rowkey, colkey, onClickSquare, value }) {
  return (
    <span
      className={`${value === 0 ? "square-empty" : "square"} ${
        value === 3 ? "bg-square-first-time" : "bg-box-game"
      }`}
      onClick={() => {
        onClickSquare(rowkey, colkey);
      }}
    >
      {value === 1 ? <img src={Times} alt="time" className="" /> : ""}
      {value === 2 ? <img src={Circle} alt="circle" className="" /> : ""}
    </span>
  );
}
export default Square;
