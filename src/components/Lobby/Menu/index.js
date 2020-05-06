import React from "react";
import numeral from "numeral";
import { Row, Nav } from "react-bootstrap";

// SVGs
import CoinSVG from "./../../../assets/Dashboard/Coin.svg";

// Contexts
import AppContext from "./../../../context/";
import { FirebaseContext } from "./../../../Firebase/";

function MenuComponent({ gameType }) {
  const { state } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);

  const [count, setCount] = React.useState({
    countTotalUserInGomoku: 0,
    countTotalUserInBlockHead: 0,
    countUserPlayingGomoku: 0,
    countUserPlayingBlockHead: 0,
  });

  React.useEffect(() => {
    setCount({
      countTotalUserInGomoku: 0,
      countTotalUserInBlockHead: 0,
      countUserPlayingGomoku: 0,
      countUserPlayingBlockHead: 0,
    });
  }, [firebase]);

  const changGameType = (type) => {
    firebase.firestore().collection("users").doc(state.user.uid).update({
      "game-type-select.value": type,
    });
  };

  return (
    <Row className="sticky-top room-menu shadow-sm">
      <div className="menu-top">
        <Nav>
          <Nav.Item className="text-white coin_lobby d-flex align-items-center p-2">
            <img src={CoinSVG} alt="logo"></img>
            <h5 className="ml-3 mr-2 mb-0 d-flex align-items-center text-stroke-carotv">
              {numeral(state.user.coin).format("0.0a")}
            </h5>
          </Nav.Item>
          <Nav.Item className="text-white elo-lobby d-flex align-items-center p-2">
            <h5 className="ml-2 mr-2 mb-0 d-flex align-items-center text-stroke-carotv">
              <span className="text-warning mr-1">Elo:</span>
              {state.user.elo}
            </h5>
          </Nav.Item>
          <Nav.Item className="text-white d-flex align-items-center p-2">
            <h5 className="ml-2 mr-2 mb-0 d-flex align-items-center text-stroke-carotv">
              <span className="mr-1">PHÒNG CHƠI</span>
            </h5>
          </Nav.Item>
        </Nav>
      </div>
      <Nav fill className="game-type">
        <Nav.Item
          className={`text-white game-gomoku wood-btn-back ${
            state.user["game-type-select"].value === "gomoku"
              ? "bg-success"
              : ""
          }`}
          onClick={() => {
            changGameType("gomoku");
          }}
        >
          <h5 className="p-1 m-0 text-stroke-carotv">
            Gomoku
            <span className="text-warning ml-1">
              ({count.countTotalUserInGomoku})
            </span>
          </h5>
        </Nav.Item>
        <Nav.Item
          className={`text-white wood-btn-back ${
            state.user["game-type-select"].value === "block-head"
              ? "bg-success"
              : ""
          }`}
          onClick={() => {
            changGameType("block-head");
          }}
        >
          <h5 className="p-1 m-0 text-stroke-carotv">
            Chặn 2 đầu
            <span className="text-warning ml-1">
              ({count.countTotalUserInBlockHead})
            </span>
          </h5>
        </Nav.Item>
      </Nav>

      <Nav fill className="user-status">
        <Nav.Item className="text-warning">
          <h5 className="p-1 m-0 text-stroke-carotv">
            Đang chơi
            <span className="text-warning ml-1">
              (
              {gameType === "gomoku"
                ? count.countUserPlayingGomoku
                : count.countUserPlayingBlockHead}
              )
            </span>
          </h5>
        </Nav.Item>
        <Nav.Item className="text-warning">
          <h5 className="p-1 m-0 text-stroke-carotv">
            Chưa chơi
            <span className="text-warning ml-1">
              (
              {gameType === "gomoku"
                ? count.countTotalUserInGomoku - count.countUserPlayingGomoku
                : count.countTotalUserInBlockHead -
                  count.countUserPlayingBlockHead}
              )
            </span>
          </h5>
        </Nav.Item>
      </Nav>
    </Row>
  );
}

export default MenuComponent;
