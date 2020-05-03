import React from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import "./GamePlay.css";

// SVGs
import UserSVG from "./../../assets/Dashboard/user.svg";

// Components
import Loading from "./../Loading/";
import Gomoku from "./Gomoku/";
import Original from "./Original/";
import Chat from "./Chat/";
import ReadyComponent from "./ReadyComponent/";
import WinnerModal from "./WinnerModal/";
import MasterUser from "./MasterComponent/";
import PlayerUser from "./PlayerComponent/";

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

  const [roomInfo, setRoomInfo] = React.useState({});

  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const [ownType, setOwnType] = React.useState("");

  React.useEffect(() => {
    function getUserType(participants) {
      if (participants.master.id === state.userInfo.id) {
        return "master";
      } else if (
        participants.player &&
        participants.player.id === state.userInfo.id
      ) {
        return "player";
      } else {
        return "watcher";
      }
    }

    function doSnapShot(snapshot) {
      if (snapshot.val()) {
        setRoomInfo(snapshot.val());
        setOwnType(getUserType(snapshot.val().participants));
      }
      setLoading(false);
    }

    if (state.room.type && state.room.id) {
      firebase
        .database()
        .ref(`/rooms/${state.room.type}/${state.room.id.toString()}`)
        .on("value", doSnapShot);
    }

    return () =>
      firebase
        .database()
        .ref(`/rooms/${state.room.type}/${state.room.id.toString()}`)
        .off("value", doSnapShot);
  }, [firebase, state.room.type, state.room.id, state.userInfo.id]);

  if (loading) {
    return <Loading />;
  }

  const game = roomInfo.game;

  return (
    <React.Fragment>
      {showMenu ? (
        <div className="menu-more d-flex justify-content-center">
          <div className="menu-more-content rounded d-flex flex-column justify-content-center align-self-center p-2 brown-border">
            <h4 className="text-center">MENU</h4>
            <span className="brown-border rounded wood-btn p-1 mb-2">
              <h5 className="text-center text-white mb-0">Đầu hàng</h5>
            </span>
            <span
              className="brown-border rounded wood-btn p-1"
              onClick={() => {
                setShowMenu(false);
              }}
            >
              <h5 className="text-center text-warning mb-0">Đóng</h5>
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
      {game.status.type === "winner" &&
      (roomInfo.participants.master.id === state.userInfo.id ||
        roomInfo.participants.player.id === state.userInfo.id) ? (
        <WinnerModal gameData={game} />
      ) : (
        ""
      )}
      <Container
        fluid
        className="game-play position-relative d-flex flex-column"
        style={{ maxHeight: "100vh", minHeight: "100vh", width: "100vw" }}
        onMouseMove={(e) => {
          if (state.userInfo.platform === "web") {
            setMousePosition({ x: e.clientX, y: e.clientY });
          }
        }}
      >
        {state.userInfo.platform === "web" &&
        state["square-position"].status ? (
          <Badge
            variant="success"
            className="position-label position-absolute"
            style={{
              left: `${mousePosition.x + 10}px`,
              top: `${mousePosition.y + 15}px`,
            }}
          >
            {`${state["square-position"].row} - ${state["square-position"].col}`}
          </Badge>
        ) : (
          ""
        )}

        <Row>
          <Col className="p-0">
            <div style={{ width: "100vw" }} className="d-flex flex-fill">
              {roomInfo.participants ? (
                <MasterUser
                  data={roomInfo.participants.master}
                  firebase={firebase}
                  time={roomInfo.time}
                  gameData={game}
                />
              ) : (
                ""
              )}

              <div
                style={{ width: "100%" }}
                className="d-flex flex-fill flex-column align-items-center"
              >
                <p className="text-white mb-0">
                  {state.room.type === "gomoku" ? "GOMOKU" : "CHẶN 2 ĐẦU"}
                </p>

                <small className="text-white">
                  <span className="text-warning mr-1">id:</span>
                  {state.room.id}
                </small>

                <small className="text-white">
                  <span className="text-warning mr-1">Cược:</span>
                  {roomInfo.bet}
                </small>
              </div>

              {roomInfo.participants && roomInfo.participants.player ? (
                <PlayerUser
                  data={roomInfo.participants.player}
                  firebase={firebase}
                  time={roomInfo.time}
                  gameData={game}
                />
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

        {game.status.type === "playing" || game.status.type === "winner" ? (
          <div
            onMouseOut={() => {
              if (state.userInfo.platform === "web") {
                getPositonSquare(false, 0, 0);
              }
            }}
          >
            {state.room.type === "block-head" ? (
              <Original time={roomInfo.time} gameData={game} />
            ) : (
              <Gomoku gameData={game} roomInfo={roomInfo} ownType={ownType} />
            )}
          </div>
        ) : (
          <ReadyComponent
            master={roomInfo.participants.master}
            player={roomInfo.participants.player}
            watcher={roomInfo.participants.watcher}
            gameData={game}
            ownType={ownType}
          />
        )}

        <div className="flex-fill position-relative">
          <Chat gameData={game} setShowMenu={setShowMenu} />
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
