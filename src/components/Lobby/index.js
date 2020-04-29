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
  const { state } = React.useContext(AppContext);
  const [firebase] = React.useState(React.useContext(FirebaseContext));
  const [loading, setLoading] = React.useState(true);

  const [gameType, setGameType] = React.useState("");

  const [gomokuListRooms, setGomokuListRoom] = React.useState([]);
  const [blockHeadListRoom, setBlockHeadListRoom] = React.useState([]);

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

    // Get game type
    firebase
      .database()
      .ref(`users/${state.userInfo.id}/game-type-select`)
      .on("value", (snapshot) => {
        if (snapshot && snapshot.val()) {
          setGameType(snapshot.val().value);
        }
      });

    // Get list tables
    firebase
      .database()
      .ref("rooms")
      .on("value", (snapshot) => {
        if (snapshot && snapshot.val()) {
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
      firebase.database().ref("rooms").off("value");
      firebase
        .database()
        .ref(`users/${state.userInfo.id}/game-type-select`)
        .off("value");
    };
  }, [firebase, gameType, state.userInfo.id]);

  return (
    <Container fluid className="rooms-lobby">
      <Menu gameType={gameType} />

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

      <Footer />
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
