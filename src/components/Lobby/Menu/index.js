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
  const [firebase] = React.useState(React.useContext(FirebaseContext));

  const changGameType = (status) => {
    firebase
      .database()
      .ref("users")
      .child(`${state.userInfo.id}/game-type-select`)
      .update({ value: status });
  };

  return (
    <Row className="sticky-top room-menu shadow-sm">
      <div className="menu-top">
        <Nav>
          <Nav.Item className="text-white coin_lobby d-flex align-items-center p-2">
            <img src={CoinSVG} alt="logo"></img>
            <h5 className="ml-3 mr-2 mb-0 d-flex align-items-center text-stroke-carotv">
              {numeral(21928).format("0.0 a")}
            </h5>
          </Nav.Item>
          <Nav.Item className="text-white elo-lobby d-flex align-items-center p-2">
            <h5 className="ml-2 mr-2 mb-0 d-flex align-items-center text-stroke-carotv">
              <span className="text-warning mr-1">Elo:</span>
              1000
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
            gameType === "gomoku" ? "bg-success" : ""
          }`}
          onClick={() => {
            changGameType("gomoku");
          }}
        >
          <h5 className="p-1 m-0 text-stroke-carotv">
            Gomoku
            <span className="text-warning ml-1">
              ({state.rooms.gomoku.total})
            </span>
          </h5>
        </Nav.Item>
        <Nav.Item
          className={`text-white wood-btn-back ${
            gameType === "block-head" ? "bg-success" : ""
          }`}
          onClick={() => {
            changGameType("block-head");
          }}
        >
          <h5 className="p-1 m-0 text-stroke-carotv">
            Chặn 2 đầu
            <span className="text-warning ml-1">
              ({state.rooms["block-head"].total})
            </span>
          </h5>
        </Nav.Item>
      </Nav>

      <Nav fill className="user-status">
        <Nav.Item className="text-warning" onClick={() => {}}>
          <h5 className="p-1 m-0 text-stroke-carotv">
            Đang chơi
            <span className="text-warning ml-1">
              (
              {gameType === "gomoku"
                ? state.rooms.gomoku.playing
                : state.rooms["block-head"].playing}
              )
            </span>
          </h5>
        </Nav.Item>
        <Nav.Item className="text-warning" onClick={() => {}}>
          <h5 className="p-1 m-0 text-stroke-carotv">
            Chưa chơi
            <span className="text-warning ml-1">
              (
              {gameType === "gomoku"
                ? state.rooms.gomoku.free
                : state.rooms["block-head"].free}
              )
            </span>
          </h5>
        </Nav.Item>
      </Nav>
    </Row>
  );
}

export default MenuComponent;
