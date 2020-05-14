import React from "react";
import "./index.css";
import { Container, Row, Col } from "react-bootstrap";
import { useFirebaseApp } from "reactfire";

// components
import Room from "./Room/";
import Menu from "./Menu/";
import Footer from "./Footer/";
import FindRoomModal from "./FindRoom/";

// contexts
import AppContext from "./../../context/";

function Lobby() {
  const { state } = React.useContext(AppContext);

  console.log("render");
  return (
    <React.Fragment>
      {state.modal["find-room"] ? <FindRoomModal /> : ""}
      <Container fluid className="rooms-lobby position-relative">
        <Menu />

        {state.user["game-type-select"].value === "gomoku" ? (
          <GomokuRoomsComponent />
        ) : state.user["game-type-select"].value === "block-head" ? (
          <BlockHeadRoomsComponent />
        ) : (
          ""
        )}

        <Footer />
      </Container>
    </React.Fragment>
  );
}
export default Lobby;

function GomokuRoomsComponent() {
  const firebaseApp = useFirebaseApp();
  const [loading, setLoading] = React.useState(true);
  const [listRoom, setListRoom] = React.useState([]);

  React.useEffect(() => {
    firebaseApp
      .firestore()
      .collection("rooms")
      .where("game-play", "==", "gomoku")
      .get()
      .then(function (querySnapshot) {
        const arr = [];

        querySnapshot.forEach(function (doc) {
          arr.push({ rid: doc.id, ...doc.data() });
        });

        setListRoom(arr);
        setLoading(false);
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });

    const unsubscribe = firebaseApp
      .firestore()
      .collection("rooms")
      .where("game-play", "==", "gomoku")
      .onSnapshot(function (querySnapshot) {
        const arr = [];

        querySnapshot.forEach(function (doc) {
          arr.push({ rid: doc.id, ...doc.data() });
        });

        setListRoom(arr);
      });

    return () => unsubscribe();
  }, [firebaseApp]);

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
          <Col className="room-item-col" key={value.rid} md="4">
            <Room roomData={value} />
          </Col>
        );
      })}
    </Row>
  );
}

function BlockHeadRoomsComponent() {
  const firebaseApp = useFirebaseApp();
  const [loading, setLoading] = React.useState(true);
  const [listRoom, setListRoom] = React.useState([]);

  React.useEffect(() => {
    firebaseApp
      .firestore()
      .collection("rooms")
      .where("game-play", "==", "block-head")
      .get()
      .then(function (querySnapshot) {
        const arr = [];

        querySnapshot.forEach(function (doc) {
          arr.push({ rid: doc.id, ...doc.data() });
        });

        setListRoom(arr);
        setLoading(false);
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });

    const unsubscribe = firebaseApp
      .firestore()
      .collection("rooms")
      .where("game-play", "==", "block-head")
      .onSnapshot(function (querySnapshot) {
        const arr = [];

        querySnapshot.forEach(function (doc) {
          arr.push({ rid: doc.id, ...doc.data() });
        });

        setListRoom(arr);
      });

    return () => unsubscribe();
  }, [firebaseApp]);

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
          <Col className="room-item-col" key={value.rid} md="2">
            <Room roomData={value} />
          </Col>
        );
      })}
    </Row>
  );
}
