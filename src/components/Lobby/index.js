import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  SuspenseWithPerf,
  useFirestore,
  useFirestoreCollection,
} from "reactfire";

// CSS
import "./index.css";

// Components
import Room from "./Room/";
import Menu from "./Menu/";
import Footer from "./Footer/";
import FindRoomModal from "./FindRoom/";

// Contexts
import AppContext from "./../../context/";

function Lobby() {
  const { state } = React.useContext(AppContext);

  return (
    <React.Fragment>
      {state.modal["find-room"] ? <FindRoomModal /> : ""}
      <Container fluid className="rooms-lobby position-relative">
        <Menu />

        {state.user["game-type-select"].value === "gomoku" ? (
          <SuspenseWithPerf
            fallback={
              <Row>
                <Col>
                  <p className="text-white text-center mt-3">Loading...</p>
                </Col>
              </Row>
            }
            traceId={"load-gomoku-rooms"}
          >
            <GomokuRoomsComponent />
          </SuspenseWithPerf>
        ) : state.user["game-type-select"].value === "block-head" ? (
          <SuspenseWithPerf
            fallback={
              <Row>
                <Col>
                  <p className="text-white text-center mt-3">Loading...</p>
                </Col>
              </Row>
            }
            traceId={"load-block-head-rooms"}
          >
            <BlockHeadRoomsComponent />
          </SuspenseWithPerf>
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
  const [listRoom, setListRoom] = React.useState([]);

  const roomsCollectionFirestore = useFirestore()
    .collection("rooms")
    .where("game-play", "==", "gomoku");

  const roomsCollectionData = useFirestoreCollection(roomsCollectionFirestore);

  React.useEffect(() => {
    const arr = [];

    roomsCollectionData.forEach(function (doc) {
      arr.push({ rid: doc.id, ...doc.data() });
    });

    setListRoom(arr);
  }, [roomsCollectionData]);

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
  const [listRoom, setListRoom] = React.useState([]);

  const roomsCollectionFirestore = useFirestore()
    .collection("rooms")
    .where("game-play", "==", "block-head");

  const roomsCollectionData = useFirestoreCollection(roomsCollectionFirestore);

  React.useEffect(() => {
    const arr = [];

    roomsCollectionData.forEach(function (doc) {
      arr.push({ rid: doc.id, ...doc.data() });
    });

    setListRoom(arr);
  }, [roomsCollectionData]);

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
