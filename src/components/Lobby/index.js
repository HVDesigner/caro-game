import React from "react";
import "./index.css";
import { Container, Row, Col, Nav } from "react-bootstrap";

import Room from "./Room/";

import CoinSVG from "./../../assets/Dashboard/Coin.svg";
import LeftSVG from "./../../assets/chevron-left.svg";
import AddCoinSVG from "./../../assets/Dashboard/add_coin.svg";

import AppContext from "./../../context/";

function Lobby({ firebase }) {
  const StateGlobal = React.useContext(AppContext);
  const { state, changeRoute } = StateGlobal;

  // true: Gomoku
  // false: Block Two Head
  const [gameType, setGameType] = React.useState(true);

  const [listRooms, setListRooms] = React.useState([]);
  const [roomsDetail, setRoomsDetail] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (gameType) {
      firebase()
        .database.ref("rooms/gomoku")
        .on("value", (snapshot) => {
          setListRooms(Object.keys(snapshot.val()));
          setRoomsDetail(snapshot.val());
          setLoading(false);
        });

      return () => firebase().database.ref("rooms/gomoku").off();
    } else {
      firebase()
        .database.ref("rooms/block-head")
        .on("value", (snapshot) => {
          setListRooms(Object.keys(snapshot.val()));
          setRoomsDetail(snapshot.val());
          setLoading(false);
        });

      return () => firebase().database.ref("rooms/block-head").off();
    }
  }, [gameType, firebase]);

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
            <Nav.Item className="text-white coin_lobby d-flex align-items-center pl-2 pr-2">
              <img src={CoinSVG} alt="logo"></img>
              <h5 className="ml-3 mr-3 mb-0 d-flex align-items-center">
                2.00<span className="text-warning">K</span>
              </h5>
              <img src={AddCoinSVG} alt="logo" className="m-0 wood-btn"></img>
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

      <Row>
        {loading ? (
          <Col>
            <p className="text-white text-center mt-3">Loading...</p>
          </Col>
        ) : (
          listRooms.map((value, key) => {
            return (
              <Col className="room-item-col" key={key}>
                <Room roomId={value} roomsDetail={roomsDetail} />
              </Col>
            );
          })
        )}
      </Row>
    </Container>
  );
}
export default Lobby;
