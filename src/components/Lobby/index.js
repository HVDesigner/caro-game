import React from "react";
import "./index.css";
import { Container, Row, Col, Nav } from "react-bootstrap";
import numeral from "numeral";

import Room from "./Room/";

import CoinSVG from "./../../assets/Dashboard/Coin.svg";

import AppContext from "./../../context/";

import { FirebaseContext } from "./../../Firebase/";

function Lobby() {
  const { changeRoute, state } = React.useContext(AppContext);
  const [firebase] = React.useState(React.useContext(FirebaseContext));
  const [loading, setLoading] = React.useState(true);

  const [gameType, setGameType] = React.useState("gomoku");

  const [gomokuListRooms, setGomokuListRoom] = React.useState([]);
  const [blockHeadListRoom, setBlockHeadListRoom] = React.useState([]);

  const [userInGomoku, setUserInGomoku] = React.useState(0);
  const [userInBlockHead, setUserInBlockHead] = React.useState(0);

  const roomsRef = firebase.database().ref("rooms");
  const userRef = firebase.database().ref("users");

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

    // Count user in game type
    userRef.on("value", (snapshot) => {
      const keys = Object.keys(snapshot.val());

      let gomokuTotal = 0;
      let blockHeadTotal = 0;

      for (let index = 0; index < keys.length; index++) {
        const element = keys[index];

        if (snapshot.val()[element]["game-type-select"].value === "gomoku") {
          gomokuTotal = gomokuTotal + 1;
        } else if (
          snapshot.val()[element]["game-type-select"].value === "block-head"
        ) {
          blockHeadTotal = blockHeadTotal + 1;
        }
      }

      setUserInGomoku(gomokuTotal);
      setUserInBlockHead(blockHeadTotal);
    });

    // Get game type
    userRef
      .child(`${state.userInfo.id}/game-type-select`)
      .on("value", (snapshot) => {
        setGameType(snapshot.val().value);
      });

    // Get list tables
    roomsRef.on("value", (snapshot) => {
      if (snapshot.val()) {
        if (gameType === "gomoku") {
          if (snapshot.val().gomoku) {
            setGomokuListRoom(converToArr(snapshot.val().gomoku));
          }
        } else if (gameType === "block-head") {
          if (snapshot.val()["block-head"]) {
            setBlockHeadListRoom(converToArr(snapshot.val()["block-head"]));
          }
        }
      }
      setLoading(false);
    });

    return () => {
      roomsRef.off("value");
      userRef.child(`${state.userInfo.id}/game-type-select`).off("value");
      userRef.off("value");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameType, roomsRef, userRef, state.userInfo.id]);

  const changGameType = (status) => {
    userRef
      .child(`${state.userInfo.id}/game-type-select`)
      .update({ value: status });
  };

  const exitLooby = () => {
    userRef
      .child(`${state.userInfo.id}/game-type-select`)
      .update({ value: "none" })
      .then(() => {
        changeRoute("dashboard");
      });
  };

  return (
    <Container fluid className="rooms-lobby">
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
            className={`text-white game-gomoku ${
              gameType === "gomoku" ? "bg-success" : ""
            }`}
            onClick={() => {
              changGameType("gomoku");
            }}
          >
            <h5 className="p-1 m-0 text-stroke-carotv">
              Gomoku
              <span className="text-warning ml-1">({userInGomoku})</span>
            </h5>
          </Nav.Item>
          <Nav.Item
            className={`text-white ${
              gameType === "block-head" ? "bg-success" : ""
            }`}
            onClick={() => {
              changGameType("block-head");
            }}
          >
            <h5 className="p-1 m-0 text-stroke-carotv">
              Chặn 2 đầu
              <span className="text-warning ml-1">({userInBlockHead})</span>
            </h5>
          </Nav.Item>
        </Nav>

        <Nav fill className="user-status">
          <Nav.Item className="text-white" onClick={() => {}}>
            <p className="p-1 m-0 text-stroke-carotv">
              Đang chơi
              <span className="text-warning ml-1">(0)</span>
            </p>
          </Nav.Item>
          <Nav.Item className="text-white" onClick={() => {}}>
            <p className="p-1 m-0 text-stroke-carotv">
              Chưa chơi
              <span className="text-warning ml-1">(0)</span>
            </p>
          </Nav.Item>
        </Nav>
      </Row>

      {loading ? (
        <Row>
          <Col>
            <p className="text-white text-center mt-3">Loading...</p>
          </Col>
        </Row>
      ) : gameType === "gomoku" ? (
        <GomokuRoomsComponent data={gomokuListRooms} />
      ) : gameType === "block-head" ? (
        <BlockHeadRoomsComponent data={blockHeadListRoom} />
      ) : (
        <Row></Row>
      )}

      <Row className="">
        <Nav className="fixed-bottom footer-lobby" fill>
          <Nav.Item
            className="text-white p-2 text-center wood-btn-back"
            onClick={() => {}}
          >
            <h5 className="m-0 text-stroke-carotv">MỜI CHƠI</h5>
          </Nav.Item>
          <Nav.Item
            className="text-white p-2 text-center wood-btn-back"
            style={{
              borderLeft: "2px solid #4e311d",
              borderRight: "2px solid #4e311d",
            }}
            onClick={() => {
              changeRoute("create-room");
            }}
          >
            <h5 className="m-0 text-stroke-carotv">TẠO BÀN</h5>
          </Nav.Item>
          <Nav.Item
            className="text-white p-2 text-center wood-btn-back"
            onClick={() => {
              exitLooby();
            }}
          >
            <h5 className="m-0 text-stroke-carotv">THOÁT</h5>
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
          <Col className="room-item-col" key={value.id} md="4">
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
          <Col className="room-item-col" key={value.id} md="2">
            <Room roomId={value.id} data={value} type={"block-head"} />
          </Col>
        );
      })}
    </Row>
  );
}
