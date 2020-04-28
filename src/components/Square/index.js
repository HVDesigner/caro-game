import React from "react";
import "./square.css";

// SVGs
import Circle from "./../../assets/circle-regular.svg";
import Times from "./../../assets/times-solid.svg";

import AppContext from "./../../context/";

function Square({ rowkey, colkey, onClickSquare, value }) {
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "W",
  ];
  const { getPositonSquare, state } = React.useContext(AppContext);
  return (
    <span
      className={`${value === 0 ? "square-empty" : "square"} ${
        value === 3 ? "bg-square-first-time" : "bg-box-game"
      }`}
      onClick={() => {
        onClickSquare(rowkey, colkey);
      }}
      onMouseOver={() => {
        if (state.userInfo.platform === "web") {
          getPositonSquare(true, alphabet[rowkey], colkey + 1);
        }
      }}
    >
      {value === 1 ? <img src={Times} alt="time" className="" /> : ""}
      {value === 2 ? <img src={Circle} alt="circle" className="" /> : ""}
    </span>
  );
}
export default Square;
