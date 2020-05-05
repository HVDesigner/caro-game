import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./GamePlay.css";

// SVGs
import UserSVG from "./../../assets/Dashboard/user.svg";

// Components
// import ReadyComponent from "./ReadyComponent/";
import Loading from "./../Loading/";
import Gomoku from "./Gomoku/";
import Original from "./Original/";
import Chat from "./Chat/";
import WinnerModal from "./WinnerModal/";
import MasterUser from "./MasterComponent/";
import PlayerUser from "./PlayerComponent/";
import MenuModal from "./MenuModal/";
import PositionPoint from "./PositionPoint/";

// Contexts
import AppContext from "./../../context/";
import { FirebaseContext } from "./../../Firebase/";

// Table
function GamePlayComponent() {
  const { state, getPositonSquare } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);

  const [loading, setLoading] = React.useState(true);

  // menu modal
  const [showMenu, setShowMenu] = React.useState(false);

  const [roomData, setRoomData] = React.useState({});
  const [ownType, setOwnType] = React.useState("");
  const [ownStatus, setOwnStatus] = React.useState("");

  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    function getUserType(participants) {
      if (participants.master.id === state.user.uid) {
        return "master";
      } else if (
        participants.player &&
        participants.player.id === state.user.uid
      ) {
        return "player";
      } else {
        return "watcher";
      }
    }

    firebase
      .firestore()
      .collection("rooms")
      .doc(state.user.room_id.value)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          setRoomData({ rid: doc.id, ...doc.data() });
          setOwnType(getUserType(doc.data().participants));
          setOwnStatus(
            doc.data().participants[getUserType(doc.data().participants)]
              ? doc.data().participants[getUserType(doc.data().participants)]
                  .status
              : ""
          );
          setLoading(false);
        } else {
          console.log("No such document!");
        }
      });
  }, [firebase, state.user.room_id.value, state.user.uid]);

  React.useEffect(() => {
    function getUserType(participants) {
      if (participants.master.id === state.user.uid) {
        return "master";
      } else if (
        participants.player &&
        participants.player.id === state.user.uid
      ) {
        return "player";
      } else {
        return "watcher";
      }
    }

    const unsubscribe = firebase
      .firestore()
      .collection("rooms")
      .doc(state.user.room_id.value)
      .onSnapshot(function (doc) {
        if (doc.exists) {
          setRoomData({ rid: doc.id, ...doc.data() });
          setOwnType(getUserType(doc.data().participants));
          setOwnStatus(
            doc.data().participants[getUserType(doc.data().participants)]
              ? doc.data().participants[getUserType(doc.data().participants)]
                  .status
              : ""
          );
        }
      });

    return () => unsubscribe();
  }, [firebase, state.user.room_id.value, state.user.uid]);

  if (loading) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <MenuModal showMenu={showMenu} setShowMenu={setShowMenu} />
      {(ownStatus === "winner" || ownStatus === "loser") &&
      (ownType === "master" || ownType === "player") ? (
        <WinnerModal roomData={roomData} ownType={ownType} />
      ) : (
        ""
      )}
      <Container
        fluid
        className="game-play position-relative d-flex flex-column"
        style={{ maxHeight: "100vh", minHeight: "100vh", width: "100vw" }}
        onMouseMove={(e) => {
          if (state.user.platform === "web") {
            setMousePosition({ x: e.clientX, y: e.clientY });
          }
        }}
      >
        <PositionPoint mousePosition={mousePosition} />
        <Row>
          <Col className="p-0">
            <div style={{ width: "100vw" }} className="d-flex flex-fill">
              <MasterUser firebase={firebase} roomData={roomData} />

              <div
                style={{ width: "100%" }}
                className="d-flex flex-fill flex-column align-items-center"
              >
                <p className="text-white mb-0">
                  {state.user.room_id.type === "gomoku"
                    ? "GOMOKU"
                    : "CHẶN 2 ĐẦU"}
                </p>

                <small className="text-white">
                  <span className="text-warning mr-1">id:</span>
                  {state.user.room_id.value}
                </small>

                <small className="text-white">
                  <span className="text-warning mr-1">Cược:</span>
                  {roomData.bet}
                </small>
              </div>

              {roomData.participants && roomData.participants.player ? (
                <PlayerUser roomData={roomData} firebase={firebase} />
              ) : (
                <div className="d-flex flex-column pr-2">
                  <div
                    style={{ width: "100%" }}
                    className="d-flex justify-content-center "
                  >
                    <div className="mr-2">
                      <p className="text-white text-right">Trống</p>
                    </div>
                    <img
                      src={UserSVG}
                      alt="user"
                      className="mt-1"
                      style={{ width: "40px", height: "40px" }}
                    ></img>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <div
          onMouseOut={() => {
            if (state.user.platform === "web") {
              getPositonSquare(false, 0, 0);
            }
          }}
          className="position-relative"
        >
          {state.user.room_id.type === "block-head" ? (
            <Original roomData={roomData} ownType={ownType} />
          ) : (
            <Gomoku roomData={roomData} ownType={ownType} />
          )}
        </div>

        <div className="flex-fill position-relative">
          <Chat roomData={roomData} setShowMenu={setShowMenu} />
        </div>
        <Row>
          <Col>
            <div className="p-1 rounded">
              <input
                className="input-carotv-2 text-white text-left w-100"
                placeholder="Nhập tin nhắn..."
                type="text"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}
export default GamePlayComponent;
