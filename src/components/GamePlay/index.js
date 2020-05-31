import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./GamePlay.css";
import { useFirebaseApp } from "reactfire";
import firebase from "firebase/app";
import Sound from "react-sound";

// Sounds
import BackgroundSound from "./../../assets/sound/background-music.mp3";

// SVGs
import UserSVG from "./../../assets/Dashboard/user.svg";

// Components
import Loading from "./../Loading/";
import Gomoku from "./Gomoku/";
import Original from "./Original/";
import Chat from "./Chat/";
import WinnerModal from "./WinnerModal/";
import MasterUser from "./MasterComponent/";
import PlayerUser from "./PlayerComponent/";
import MenuModal from "./MenuModal/";
import PositionPoint from "./PositionPoint/";
import UserInRoomModal from "./UserInRoomModal/";

// Contexts
import AppContext from "./../../context/";

// Table
function GamePlayComponent() {
  const { state, getPositonSquare } = React.useContext(AppContext);
  const firebaseApp = useFirebaseApp();

  const [loading, setLoading] = React.useState(true);

  // menu modal
  const [showMenu, setShowMenu] = React.useState(false);

  const [roomData, setRoomData] = React.useState({});
  const [ownType, setOwnType] = React.useState("");
  const [ownStatus, setOwnStatus] = React.useState("");

  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [messageText, setMessageText] = React.useState("");
  const [showUserList, setShowUserList] = React.useState(false);

  React.useEffect(() => {
    function getUserType(participants) {
      if (participants.master && participants.master.id === state.user.uid) {
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

    firebaseApp
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
  }, [firebaseApp, state.user.room_id.value, state.user.uid]);

  React.useEffect(() => {
    function getUserType(participants) {
      if (participants.master && participants.master.id === state.user.uid) {
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

    const unsubscribe = firebaseApp
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
  }, [firebaseApp, state.user.room_id.value, state.user.uid]);

  const onSendMessage = (e) => {
    e.preventDefault();
    if (messageText) {
      firebaseApp
        .firestore()
        .collection("rooms")
        .doc(state.user.room_id.value)
        .update({
          conversation: firebase.firestore.FieldValue.arrayUnion({
            text: messageText,
            uid: state.user.uid,
            name: state.user.name.value,
            createAt: Date.now(),
          }),
        })
        .then(() => {
          setMessageText("");
        });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      {state.user.setting.sound ? (
        <Sound
          url={BackgroundSound}
          playStatus={Sound.status.PLAYING}
          loop={true}
        />
      ) : (
        ""
      )}
      <MenuModal
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        roomData={roomData}
        ownType={ownType}
      />
      {(ownStatus === "winner" || ownStatus === "loser") &&
      (ownType === "master" || ownType === "player") ? (
        <WinnerModal roomData={roomData} ownType={ownType} />
      ) : (
        ""
      )}
      {showUserList ? (
        <UserInRoomModal
          setShowUserList={setShowUserList}
          roomData={roomData}
        />
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
              {roomData.participants && roomData.participants.master ? (
                <MasterUser roomData={roomData} ownType={ownType} />
              ) : (
                <div className="d-flex flex-column pl-2">
                  <div
                    style={{ width: "100%" }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <img
                      src={UserSVG}
                      alt="user"
                      className="mt-1"
                      style={{ width: "40px", height: "40px" }}
                    ></img>
                    <div className="ml-2">
                      <p className="text-white">Trống</p>
                    </div>
                  </div>
                </div>
              )}

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
                  {`${roomData.bet} xu`}
                </small>
              </div>

              {roomData.participants && roomData.participants.player ? (
                <PlayerUser roomData={roomData} ownType={ownType} />
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
          <Chat
            roomData={roomData}
            setShowMenu={setShowMenu}
            ownType={ownType}
            setShowUserList={setShowUserList}
          />
        </div>
        <Row>
          <Col>
            <div className="p-1 rounded">
              <form onSubmit={onSendMessage}>
                <input
                  className="input-carotv-2 text-white text-left w-100"
                  placeholder="Nhập tin nhắn..."
                  type="text"
                  onChange={(e) => setMessageText(e.target.value)}
                  value={messageText}
                />
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}
export default GamePlayComponent;
