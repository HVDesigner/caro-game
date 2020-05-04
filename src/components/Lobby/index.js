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
  // const firebase = React.useContext(FirebaseContext);
  const { state } = React.useContext(AppContext);

  return (
    <Container fluid className="rooms-lobby">
      <Menu />

      {state.user["game-type-select"].value === "gomoku" ? (
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
    firebase
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
  }, [firebase]);

  React.useEffect(() => {
    const unsubscribe = firebase
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
          <Col className="room-item-col" key={value.rid} md="4">
            <Room roomData={value} />
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
    firebase
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
  }, [firebase]);

  React.useEffect(() => {
    const unsubscribe = firebase
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
          <Col className="room-item-col" key={value.rid} md="2">
            <Room roomData={value} />
          </Col>
        );
      })}
    </Row>
  );
}
