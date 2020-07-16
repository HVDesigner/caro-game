import React from "react";
import "./square.css";

import AppContext from "./../../context/";

function Square({ rowkey, colkey, onClickSquare, value, roomData }) {
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

  const getClass = (value) => {
    let classString = "";

    if (value === 0) {
      classString = "square-empty";
    } else {
      classString = "square";
    }

    const noSoft = roomData.game["no-soft"];

    if (noSoft.status && noSoft.col - 1 === colkey && noSoft.row === rowkey) {
      return classString;
    }

    if (value === 3) {
      classString = classString + " bg-square-first-time";
    } else if (
      roomData.game["current-step"].col === colkey &&
      roomData.game["current-step"].row === rowkey
    ) {
      classString = classString + " bg-current-step";
    } else {
      classString = classString + " bg-box-game";
    }

    return classString;
  };

  return (
    <span
      // className={`${value === 0 ? "square-empty" : "square"} ${
      //   value === 3
      //     ? "bg-square-first-time"
      //     : roomData.game["current-step"].col === colkey &&
      //       roomData.game["current-step"].row === rowkey
      //     ? "bg-current-step"
      //     : "bg-box-game"
      // }`}
      className={getClass(value)}
      onClick={() => {
        if (
          roomData.game["no-soft"].status &&
          roomData.game["no-soft"].col - 1 === colkey &&
          roomData.game["no-soft"].row === rowkey
        ) {
        } else {
          onClickSquare(rowkey, colkey);
        }
      }}
      onMouseOver={() => {
        if (state.user.platform === "web") {
          getPositonSquare(true, alphabet[rowkey], colkey + 1);
        }
      }}
    >
      {value === 1 ? <div className="w-100 h-100 time-box"></div> : ""}
      {value === 2 ? <div className="w-100 h-100 circle-box"></div> : ""}
    </span>
  );
}
export default Square;
