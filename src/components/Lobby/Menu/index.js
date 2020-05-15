import React from "react";
import numeral from "numeral";
import { Row, Nav } from "react-bootstrap";
import { useFirebaseApp } from "reactfire";

// SVGs
import CoinSVG from "./../../../assets/Dashboard/Coin.svg";

// Contexts
import AppContext from "./../../../context/";

function MenuComponent() {
  const firebaseApp = useFirebaseApp();
  const { state } = React.useContext(AppContext);

  const [countFreeGomoku, setCountFreeGomoku] = React.useState(0);
  const [countPlayingGomoku, setCountPlayingGomoku] = React.useState(0);

  const [countFreeBlockHead, setCountFreeBlockHead] = React.useState(0);
  const [countPlayingBlockHead, setCountPlayingBlockHead] = React.useState(0);

  React.useEffect(() => {
    const userCollection = firebaseApp.firestore().collection("users");

    const unsubscribeFreeGomoku = userCollection
      .where("location.path", "==", "lobby")
      .where("game-type-select.value", "==", "gomoku")
      .onSnapshot((doc) => {
        setCountFreeGomoku(doc.size);
      });

    const unsubscribePlayingGomoku = userCollection
      .where("location.path", "==", "room")
      .where("room_id.type", "==", "gomoku")
      .onSnapshot((doc) => {
        setCountPlayingGomoku(doc.size);
      });

    const unsubscribeFreeBlockHead = userCollection
      .where("location.path", "==", "lobby")
      .where("game-type-select.value", "==", "block-head")
      .onSnapshot((doc) => {
        setCountFreeBlockHead(doc.size);
      });

    const unsubscribePlayingBlockHead = userCollection
      .where("location.path", "==", "room")
      .where("room_id.type", "==", "block-head")
      .onSnapshot((doc) => {
        setCountPlayingBlockHead(doc.size);
      });

    return () => {
      unsubscribeFreeGomoku();
      unsubscribePlayingGomoku();
      unsubscribeFreeBlockHead();
      unsubscribePlayingBlockHead();
    };
  }, [state.user.uid, firebaseApp]);

  const changGameType = (type) => {
    firebaseApp.firestore().collection("users").doc(state.user.uid).update({
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
              {`${numeral(state.user.coin).format("0a")} xu`}
            </h5>
          </Nav.Item>
          <Nav.Item className="text-white elo-lobby d-flex align-items-center p-2">
            <h5 className="ml-2 mr-2 mb-0 d-flex align-items-center text-stroke-carotv">
              <span className="text-warning mr-1">Elo:</span>
              {state.user.elo[state.user["game-type-select"].value]}
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
              ({countPlayingGomoku + countFreeGomoku})
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
              ({countPlayingBlockHead + countFreeBlockHead})
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
              {state.user["game-type-select"].value === "gomoku"
                ? countPlayingGomoku
                : countPlayingBlockHead}
              )
            </span>
          </h5>
        </Nav.Item>
        <Nav.Item className="text-warning">
          <h5 className="p-1 m-0 text-stroke-carotv">
            Chưa chơi
            <span className="text-warning ml-1">
              (
              {state.user["game-type-select"].value === "gomoku"
                ? countFreeGomoku
                : countFreeBlockHead}
              )
            </span>
          </h5>
        </Nav.Item>
      </Nav>
    </Row>
  );
}

export default MenuComponent;
