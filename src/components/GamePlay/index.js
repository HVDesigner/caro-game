import React from "react";
import "./GamePlay.css";
import Gomoku from './Gomoku/';
import Original from './Original/';

function GamePlayComponent({ type = "original", time = 10 }) {
  if (type === "original") return (
    <Original time={time} />
  );
  return <Gomoku time={time} />
}
export default GamePlayComponent;
