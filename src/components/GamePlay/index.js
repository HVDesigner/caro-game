import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./GamePlay.css";
import { useFirebaseApp } from "reactfire";
import firebase from "firebase/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Sound from "react-sound";

// Sounds
import BackgroundSound from "./../../assets/sound/background-music.mp3";

// SVG
import UserSVG from "./../../assets/Dashboard/user.svg";
import MoreSVG from "./../../assets/Rooms/more.svg";

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

  const [showChat, setShowChat] = React.useState(true);
  const [showMobileChatInput, setShowMobileChatInput] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  // menu modal
  const [showMenu, setShowMenu] = React.useState(false);

  const [roomData, setRoomData] = React.useState({});
  const [ownType, setOwnType] = React.useState("");
  const [ownStatus, setOwnStatus] = React.useState("");

  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [messageText, setMessageText] = React.useState("");
  const [showUserList, setShowUserList] = React.useState(false);

  // Refs
  const chatContainer = React.useRef(null);
  const chatInputContainer = React.useRef(null);

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
    if (e) {
      e.preventDefault();
    }

    if (messageText) {
      setShowMobileChatInput(false);

      firebaseApp
        .firestore()
        .collection("rooms")
        .doc(state.user.room_id.value)
        .update({
          conversation: firebase.firestore.FieldValue.arrayUnion({
            text: messageText,
            uid: state.user.uid,
            type: "generic",
            createAt: Date.now(),
          }),
        })
        .then(() => {
          setMessageText("");
        });
    }
  };

  const countUserInRoom = () => {
    let total = 0;

    if (roomData.participants.watcher) {
      total = roomData.participants.watcher.length + total;
    }

    if (roomData.participants.player) {
      total = total + 1;
    }

    if (roomData.participants.master) {
      total = total + 1;
    }

    return total;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      {state.user.setting.music.background ? (
        <Sound
          url={BackgroundSound}
          playStatus={Sound.status.PLAYING}
          loop={true}
        />
      ) : (
        ""
      )}
      {state.user.platform !== "web" && showMobileChatInput ? (
        <div
          className="position-absolute w-100"
          style={{
            zIndex: "999",
            backgroundColor: "#48484891",
            height: "100vh",
          }}
        >
          <div className="p-2 w-100 bg-white rounded d-flex">
            <form className="w-100 d-flex" onSubmit={onSendMessage}>
              <div
                className="pr-2"
                onClick={() => {
                  setShowMobileChatInput(false);
                }}
              >
                Hủy
              </div>
              <input
                type="text"
                className="w-100 input-carotv text-left"
                ref={(input) => input && input.focus()}
                onChange={(e) => setMessageText(e.target.value)}
                value={messageText}
              />
              <div
                className="pl-2"
                onClick={() => {
                  onSendMessage();
                }}
              >
                Gửi
              </div>
            </form>
          </div>
          <div
            className="h-100 w-100"
            onClick={() => {
              setShowMobileChatInput(false);
            }}
          ></div>
        </div>
      ) : (
        ""
      )}
      <MenuModal
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        roomData={roomData}
        ownType={ownType}
      />
      {(ownStatus === "winner" ||
        ownStatus === "loser" ||
        ownStatus === "tie") &&
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
        style={{
          height: "100%",
          minHeight: "100vh",
          overflow: "hidden",
        }}
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
                  <span className="text-warning mr-1 text-stroke-carotv">
                    id:
                  </span>
                  {state.user.room_id.value}
                </small>

                <small className="text-warning text-stroke-carotv">
                  {`${
                    roomData.type === "room" ? roomData.bet + " xu" : "Elo"
                  } - ${roomData.time}s - ${
                    roomData.rule === "6-win" ? "6 thắng" : "Chỉ 5 quân"
                  }`}
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

        <div
          className="flex-fill d-flex flex-column h-100 w-100"
          style={{ maxHeight: "100%" }}
          ref={chatContainer}
        >
          {showChat ? (
            <div
              style={
                chatContainer.current && chatInputContainer.current
                  ? chatContainer.current.clientHeight -
                      chatInputContainer.current.clientHeight <
                    48
                    ? {
                        height: "48px",
                      }
                    : {
                        height:
                          chatContainer.current.clientHeight -
                          chatInputContainer.current.clientHeight,
                      }
                  : {
                      height: "48px",
                    }
              }
            >
              <Chat
                roomData={roomData}
                setShowMenu={setShowMenu}
                ownType={ownType}
                setShowUserList={setShowUserList}
              />
            </div>
          ) : (
            ""
          )}
          <Row>
            <Col>
              <div
                className="pr-1 pt-1 pb-1 rounded d-flex"
                ref={chatInputContainer}
              >
                <div
                  className="brown-border bg-gold-wood rounded pl-2 pr-2 mr-2"
                  onClick={() => {
                    setShowChat(!showChat);
                  }}
                >
                  <strong>{showChat ? "-" : "+"}</strong>
                </div>
                <form onSubmit={onSendMessage} className="d-flex">
                  <input
                    className="input-carotv-2 text-white text-left"
                    placeholder="Nhập tin nhắn..."
                    type="text"
                    onChange={(e) => setMessageText(e.target.value)}
                    value={messageText}
                    onFocus={() => {
                      setShowMobileChatInput(true);
                    }}
                  />
                  <div
                    className="brown-border bg-gold-wood rounded pl-2 pr-2 ml-2"
                    onClick={() => {
                      onSendMessage();
                    }}
                  >
                    Gửi
                  </div>
                </form>
                {showChat ? (
                  ""
                ) : (
                  <div className="d-flex align-items-center ml-2">
                    <img
                      src={MoreSVG}
                      alt="more"
                      style={{ maxWidth: "1.5em", maxHeight: "1.5em" }}
                      className="shadow wood-btn mr-2"
                      onClick={() => {
                        setShowMenu(true);
                      }}
                    />
                    <div
                      className="d-flex align-items-center"
                      onClick={() => {
                        setShowUserList(true);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        className="text-warning mr-1"
                      />
                      <span className="text-stroke-carotv text-white">
                        {countUserInRoom()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </React.Fragment>
  );
}
export default GamePlayComponent;
