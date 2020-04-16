import React from "react";
import "./GamePlay.css";
import Gomoku from './Gomoku/';
import Original from './Original/';

function GamePlayComponent({ type = "Original", time = 10 }) {
  if (type === "Original") return (
    <Original time={time} />
  );
  return <Gomoku time={time} />
}
export default GamePlayComponent;
