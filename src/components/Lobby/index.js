import React from "react";
import "./index.css";
import { Container, Row, Col, Nav } from "react-bootstrap";

import Room from "./Room/";

import CoinSVG from "./../../assets/Dashboard/Coin.svg";
import LeftSVG from "./../../assets/chevron-left.svg";

import AppContext from "./../../context/";

import { FirebaseContext } from "./../../Firebase/";

function Lobby() {
  const {
    changeRoute,
    // state,
  } = React.useContext(AppContext);

  const firebase = React.useContext(FirebaseContext);

  // true: Gomoku
  // false: Block Two Head
  const [gameType, setGameType] = React.useState(true);
  const [loading, setLoading] = React.useState(true);

  const [gomokuListRooms, setGomokuListRoom] = React.useState([]);
  const [blockHeadListRoom, setBlockHeadListRoom] = React.useState([]);

  const roomsRef = firebase.database().ref("rooms");

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

    return () => roomsRef.off("value");
  }, [roomsRef, gameType]);

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
                2.00<span className="text-warning">K</span>
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
              Gomoku<span className="text-warning ml-1">(0)</span>
            </h5>
          </Nav.Item>
          <Nav.Item
            className={`text-white ${!gameType ? "bg-success" : ""}`}
            onClick={() => {
              changGameType(false);
            }}
          >
            <h5 className="p-1 m-0">
              Chặn 2 đầu<span className="text-warning ml-1">(0)</span>
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
            <Room roomId={value.id} data={value} />
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
            <Room roomId={value.id} data={value} />
          </Col>
        );
      })}
    </Row>
  );
}
