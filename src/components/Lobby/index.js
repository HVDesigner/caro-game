import React from "react";
import "./index.css";
import { Container, Row, Col } from "react-bootstrap";

// components
import Room from "./Room/";
import Menu from "./Menu/";
import Footer from "./Footer/";

// contexts
import AppContext from "./../../context/";
import { FirebaseContext } from "./../../Firebase/";

function Lobby() {
  const firebase = React.useContext(FirebaseContext);
  const { state } = React.useContext(AppContext);

  const [gameType, setGameType] = React.useState("");
  const [gameTypeLoading, setGameTypeLoading] = React.useState(true);

  React.useEffect(() => {
    function setGameTypeState(snapshot) {
      if (snapshot.val()) {
        setGameType(snapshot.val().value);
        setGameTypeLoading(false);
      }
    }

    // Get game type
    firebase
      .database()
      .ref(`users/${state.userInfo.id}/game-type-select`)
      .on("value", setGameTypeState);

    return () => {
      return firebase
        .database()
        .ref(`users/${state.userInfo.id}/game-type-select`)
        .off("value", setGameTypeState);
    };
  }, [firebase, state.userInfo.id]);

  return (
    <Container fluid className="rooms-lobby">
      {gameTypeLoading ? "" : <Menu gameType={gameType} />}

      {gameType === "gomoku" ? (
        <GomokuRoomsComponent />
      ) : (
        <BlockHeadRoomsComponent />
      )}

      <Footer />
    </Container>
  );
}
export default Lobby;

function GomokuRoomsComponent() {
  const firebase = React.useContext(FirebaseContext);
  const [loading, setLoading] = React.useState(true);
  const [listRoom, setListRoom] = React.useState([]);

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

    function getListRoomState(snapshot) {
      if (snapshot && snapshot.val()) {
        if (snapshot.val()) {
          setListRoom(converToArr(snapshot.val()));
        }
      }
      setLoading(false);
    }

    firebase.database().ref("rooms/gomoku").on("value", getListRoomState);

    return () =>
      firebase.database().ref("rooms/gomoku").off("value", getListRoomState);
  }, [firebase]);

  if (loading)
    return (
      <Row>
        <Col>
          <p className="text-white text-center mt-3">Loading...</p>
        </Col>
      </Row>
    );

  return (
    <Row>
      {listRoom.map((value) => {
        return (
          <Col className="room-item-col" key={value.id} md="4">
            <Room roomId={value.id} data={value} type={"gomoku"} />
          </Col>
        );
      })}
    </Row>
  );
}

function BlockHeadRoomsComponent() {
  const firebase = React.useContext(FirebaseContext);
  const [loading, setLoading] = React.useState(true);
  const [listRoom, setListRoom] = React.useState([]);

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

    function getListRoomState(snapshot) {
      if (snapshot && snapshot.val()) {
        if (snapshot.val()) {
          setListRoom(converToArr(snapshot.val()));
        }
      }
      setLoading(false);
    }

    firebase.database().ref("rooms/block-head").on("value", getListRoomState);

    return () =>
      firebase
        .database()
        .ref("rooms/block-head")
        .off("value", getListRoomState);
  }, [firebase]);

  if (loading)
    return (
      <Row>
        <Col>
          <p className="text-white text-center mt-3">Loading...</p>
        </Col>
      </Row>
    );

  return (
    <Row>
      {listRoom.map((value) => {
        return (
          <Col className="room-item-col" key={value.id} md="2">
            <Room roomId={value.id} data={value} type={"block-head"} />
          </Col>
        );
      })}
    </Row>
  );
}
