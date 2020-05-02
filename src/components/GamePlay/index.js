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

  const [gameInfo, setGameInfo] = React.useState({
    time: 0,
    bet: 0,
    gameStatus: "",
    turn: { uid: "" },
    player: {},
    round: 1,
    participants: {},
  });

  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    function doSnapShot(snapshot) {
      if (snapshot.val()) {
        console.log(snapshot.val());

        setGameInfo({
          time: snapshot.val().time,
          bet: snapshot.val().bet,
          gameStatus: snapshot.val().game.status.type,
          turn: snapshot.val().game.round.turn,
          player: snapshot.val().game.player,
          round: snapshot.val().game.round.value,
          participants: snapshot.val().participants,
        });
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
  }, [firebase, state.room.type, state.room.id]);

  if (loading) {
    return <Loading />;
  }

  console.log(gameInfo);

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
      {gameInfo.gameStatus === "winner" &&
      (gameInfo.participants.master.id === state.userInfo.id ||
        gameInfo.participants.player.id === state.userInfo.id) ? (
        <WinnerModal gamePlayer={gameInfo.player} />
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
              {gameInfo.participants ? (
                <MasterUser
                  data={
                    gameInfo.participants.master
                      ? gameInfo.participants.master
                      : ""
                  }
                  firebase={firebase}
                  time={gameInfo.time}
                  gameStatus={gameInfo.gameStatus}
                  turn={gameInfo.turn}
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
                  {gameInfo.bet}
                </small>
              </div>

              {gameInfo.participants && gameInfo.participants.player ? (
                <PlayerUser
                  data={gameInfo.participants.player}
                  firebase={firebase}
                  time={gameInfo.time}
                  gameStatus={gameInfo.gameStatus}
                  turn={gameInfo.turn}
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

        {gameInfo.gameStatus === "playing" ||
        gameInfo.gameStatus === "winner" ? (
          <div
            onMouseOut={() => {
              if (state.userInfo.platform === "web") {
                getPositonSquare(false, 0, 0);
              }
            }}
          >
            {state.room.type === "block-head" ? (
              <Original time={gameInfo.time} turn={gameInfo.turn} />
            ) : (
              <Gomoku
                gamePlayer={gameInfo.player}
                time={gameInfo.time}
                turn={gameInfo.turn}
                master={gameInfo.participants.master}
                player={gameInfo.participants.player}
                round={gameInfo.round}
              />
            )}
          </div>
        ) : (
          <ReadyComponent
            master={gameInfo.participants.master}
            player={gameInfo.participants.player}
            watcher={gameInfo.participants.watcher}
          />
        )}

        <div className="flex-fill position-relative">
          <Chat gameStatus={gameInfo.gameStatus} setShowMenu={setShowMenu} />
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

// Counter
function CounterConponent({ time }) {
  const [counter, setCounter] = React.useState(time);

  React.useEffect(() => {
    let timer = setInterval(() => {}, 1000);

    if (counter > 0) {
      timer = setInterval(() => setCounter(counter - 1), 1000);
    }

    if (counter === 0) {
      setCounter(0);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div
      style={{ width: "100%" }}
      className="d-flex justify-content-center align-items-center p-1"
    >
      <Badge pill variant="success">
        <p className="text-white roboto-font" style={{ fontSize: "13px" }}>
          {counter}s
        </p>
      </Badge>
    </div>
  );
}

// Master User Left
function MasterUser({ data, firebase, time, gameStatus, turn }) {
  const { state } = React.useContext(AppContext);
  const [imageUrl, setImageUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const [elo, setElo] = React.useState("");

  React.useEffect(() => {
    function setUserData(image_url, name, elo) {
      setImageUrl(image_url);
      setName(name);
      setElo(elo);
    }

    firebase
      .database()
      .ref(`users/${data.id}`)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setUserData(
            snapshot.val().image_url,
            snapshot.val().name.value,
            snapshot.val().elo
          );
        } else {
          setUserData("", "", "");
        }
      });
  }, [firebase, data.id]);

  return (
    <div className="d-flex flex-column pl-2">
      <div
        style={{ width: "100%" }}
        className="d-flex justify-content-center align-items-center"
      >
        <img
          src={imageUrl ? imageUrl : UserSVG}
          alt="user"
          className={imageUrl ? `rounded-circle` : ""}
          style={{ width: "40px", height: "40px" }}
        ></img>
        <div className="ml-2">
          <p className="text-white">{name ? name : "..."}</p>
          <small className="text-white">
            <span className="text-warning mr-1">ELO:</span>
            {elo ? elo : "..."}
          </small>
        </div>
      </div>
      {gameStatus === "playing" && turn && turn.uid === data.id ? (
        <div className="d-flex">
          {turn.uid === state.userInfo.id ? (
            <div
              style={{ width: "100%" }}
              className="d-flex justify-content-center align-items-center p-1"
            >
              <Badge pill variant="success">
                <p
                  className="text-white roboto-font"
                  style={{ fontSize: "13px" }}
                >
                  Lượt bạn
                </p>
              </Badge>
            </div>
          ) : (
            ""
          )}
          <CounterConponent time={time} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

// Player User Right
function PlayerUser({ data, firebase, time, gameStatus, turn }) {
  const { state } = React.useContext(AppContext);
  const [imageUrl, setImageUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const [elo, setElo] = React.useState("");

  React.useEffect(() => {
    function setUserData(image_url, name, elo) {
      setImageUrl(image_url);
      setName(name);
      setElo(elo);
    }

    firebase
      .database()
      .ref(`users/${data.id}`)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setUserData(
            snapshot.val().image_url,
            snapshot.val().name.value,
            snapshot.val().elo
          );
        } else {
          setUserData("", "", "");
        }
      });
  }, [firebase, data.id]);

  return (
    <div className="d-flex flex-column pr-2">
      <div style={{ width: "100%" }} className="d-flex justify-content-center ">
        <div className="mr-2">
          {name ? (
            <p className="text-white text-right">{name}</p>
          ) : (
            <p className="text-white text-right">Trống</p>
          )}
          {elo ? (
            <small className="text-white">
              <span className="text-warning mr-1">ELO:</span>
              {elo}
            </small>
          ) : (
            ""
          )}
        </div>
        <img
          src={imageUrl ? imageUrl : UserSVG}
          alt="user"
          className={imageUrl ? `rounded-circle align-items-center` : "mt-1"}
          style={{ width: "40px", height: "40px" }}
        ></img>
      </div>
      {gameStatus === "playing" && turn.uid === data.id ? (
        <div className="d-flex">
          <CounterConponent time={time} />
          {turn.uid === state.userInfo.id ? (
            <div
              style={{ width: "100%" }}
              className="d-flex justify-content-center align-items-center p-1"
            >
              <Badge pill variant="success">
                <p
                  className="text-white roboto-font"
                  style={{ fontSize: "13px" }}
                >
                  Lượt bạn
                </p>
              </Badge>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
