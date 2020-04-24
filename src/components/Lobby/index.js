import React from "react";
import "./index.css";
import { Container, Row, Col, Nav } from "react-bootstrap";
import numeral from "numeral";

import Room from "./Room/";

import CoinSVG from "./../../assets/Dashboard/Coin.svg";
import LeftSVG from "./../../assets/chevron-left.svg";

import AppContext from "./../../context/";

import { FirebaseContext } from "./../../Firebase/";

function Lobby() {
  const { changeRoute } = React.useContext(AppContext);

  const firebase = React.useContext(FirebaseContext);

  // true: Gomoku
  // false: Block Two Head
  const [gameType, setGameType] = React.useState(true);
  const [loading, setLoading] = React.useState(true);

  const [gomokuListRooms, setGomokuListRoom] = React.useState([]);
  const [blockHeadListRoom, setBlockHeadListRoom] = React.useState([]);

  const [blockHeadQuantity, setBlockHeadQuantity] = React.useState(0);
  const [gomokuQuantity, setGomokuQuantity] = React.useState(0);

  const roomsRef = firebase.database().ref("rooms");

  const roomsQuantityRef = firebase.database().ref("rooms-quantity");

  React.useEffect(() => {
    function converToArr(value) {
      const keysArr = Object.keys(value);
      const finalArr = [];

      for (let index = 0; index < keysArr.length; index++) {
        const element = keysArr[index];

        finalArr.push({ id: element, ...value[element] });
      }

      return finalArr;
    }

    roomsQuantityRef.on("value", function (snapshot) {
      if (snapshot.val()) {
        setGomokuQuantity(snapshot.val().gomoku.value);
        setBlockHeadQuantity(snapshot.val()["block-head"].value);
      }
    });

    roomsRef.on("value", (snapshot) => {
      if (snapshot.val()) {
        if (gameType) {
          setGomokuListRoom(converToArr(snapshot.val().gomoku));
        } else {
          setBlockHeadListRoom(converToArr(snapshot.val()["block-head"]));
        }
        setLoading(false);
      }
    });

    return () => {
      return [roomsRef.off("value"), roomsQuantityRef.off("value")];
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameType]);

  const changGameType = (status) => {
    if (gameType !== status) {
      setGameType(status);
      setLoading(true);
    }
  };

  return (
    <Container className="rooms-lobby">
      <Row className="sticky-top room-menu shadow-sm">
        <div className="menu-top">
          <Nav>
            <Nav.Item className="d-flex">
              <Nav.Link
                onClick={() => {
                  changeRoute("dashboard");
                }}
                className="wood-btn-back"
              >
                <img
                  src={LeftSVG}
                  alt="back-btn"
                  style={{ height: "1.5em" }}
                ></img>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="text-white coin_lobby d-flex align-items-center pl-2">
              <img src={CoinSVG} alt="logo"></img>
              <h5 className="ml-3 mr-3 mb-0 d-flex align-items-center">
                {numeral(21928).format("0.0 a")}
              </h5>
            </Nav.Item>
          </Nav>
        </div>
        <Nav fill className="game-type">
          <Nav.Item
            className={`text-white game-gomoku ${gameType ? "bg-success" : ""}`}
            onClick={() => {
              changGameType(true);
            }}
          >
            <h5 className="p-1 m-0">
              Gomoku
              <span className="text-warning ml-1">({gomokuQuantity})</span>
            </h5>
          </Nav.Item>
          <Nav.Item
            className={`text-white ${!gameType ? "bg-success" : ""}`}
            onClick={() => {
              changGameType(false);
            }}
          >
            <h5 className="p-1 m-0">
              Chặn 2 đầu
              <span className="text-warning ml-1">({blockHeadQuantity})</span>
            </h5>
          </Nav.Item>
        </Nav>
      </Row>

      {loading ? (
        <Row>
          <Col>
            <p className="text-white text-center mt-3">Loading...</p>
          </Col>
        </Row>
      ) : gameType ? (
        <GomokuRoomsComponent data={gomokuListRooms} />
      ) : (
        <BlockHeadRoomsComponent data={blockHeadListRoom} />
      )}

      <Row className="">
        <Nav className="fixed-bottom footer-lobby justify-content-center">
          <Nav.Item
            className="text-white p-2 text-center wood-btn-back"
            style={{ width: "100%" }}
            onClick={() => {
              changeRoute("create-room");
            }}
          >
            <h5 className="m-0">TẠO PHÒNG</h5>
          </Nav.Item>
        </Nav>
      </Row>
    </Container>
  );
}
export default Lobby;

function GomokuRoomsComponent({ data }) {
  return (
    <Row>
      {data.map((value) => {
        return (
          <Col className="room-item-col" key={value.id}>
            <Room roomId={value.id} data={value} type={"gomoku"} />
          </Col>
        );
      })}
    </Row>
  );
}

function BlockHeadRoomsComponent({ data }) {
  return (
    <Row>
      {data.map((value) => {
        return (
          <Col className="room-item-col" key={value.id}>
            <Room roomId={value.id} data={value} type={"block-head"} />
          </Col>
        );
      })}
    </Row>
  );
}
