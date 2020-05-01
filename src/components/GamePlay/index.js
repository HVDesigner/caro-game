import React from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import "./GamePlay.css";

// SVGs
import UserSVG from "./../../assets/Dashboard/user.svg";
import MoreSVG from "./../../assets/Rooms/more.svg";

// Components
import Loading from "./../Loading/";
import Gomoku from "./Gomoku/";
import Original from "./Original/";
import Chat from "./Chat/";
import ReadyComponent from "./ReadyComponent/";

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

  const [time, setTime] = React.useState(10);
  const [counter, setCounter] = React.useState(time);
  const [participants, setParticipants] = React.useState([]);
  const [bet, setBet] = React.useState(0);
  const [gameStatus, setGameStatus] = React.useState("waiting");
  const [turn, setTurn] = React.useState({ uid: "" });

  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    function setUserInfoState(snapshot) {
      if (snapshot.val()) {
        setTime(snapshot.val().time);
        setCounter(snapshot.val().time);
        setBet(snapshot.val().bet);
        setGameStatus(snapshot.val().game.status.type);
        setTurn(snapshot.val().game.round.turn);

        setParticipants(snapshot.val().participants);
      }
      setLoading(false);
    }

    if (state.room.type && state.room.id) {
      firebase
        .database()
        .ref(`/rooms/${state.room.type}/${state.room.id.toString()}`)
        .on("value", setUserInfoState);
    }

    return () => {
      if (state.room.type && state.room.id) {
        return firebase
          .database()
          .ref(`/rooms/${state.room.type}/${state.room.id.toString()}`)
          .off("value", setUserInfoState);
      }
    };
  }, [firebase, state.room.type, state.room.id]);

  if (loading) {
    return <Loading />;
  }

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
              {participants ? (
                <MasterUser
                  data={participants.master}
                  firebase={firebase}
                  time={time}
                  gameStatus={gameStatus}
                  turn={turn}
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
                  {bet}
                </small>

                {gameStatus === "playing" ? (
                  <img
                    src={MoreSVG}
                    alt="more"
                    style={{ width: "1.5em" }}
                    className="shadow wood-btn"
                    onClick={() => {
                      setShowMenu(true);
                    }}
                  />
                ) : (
                  ""
                )}
              </div>

              {participants ? (
                <PlayerUser
                  data={participants.player}
                  firebase={firebase}
                  time={time}
                  gameStatus={gameStatus}
                  turn={turn}
                />
              ) : (
                ""
              )}
            </div>
          </Col>
        </Row>

        {gameStatus === "playing" ? (
          <div
            onMouseOut={() => {
              if (state.userInfo.platform === "web") {
                getPositonSquare(false, 0, 0);
              }
            }}
          >
            {state.room.type === "block-head" ? (
              <Original
                time={time}
                counter={counter}
                setCounter={setCounter}
                turn={turn}
              />
            ) : (
              <Gomoku
                time={time}
                counter={counter}
                setCounter={setCounter}
                turn={turn}
              />
            )}
          </div>
        ) : (
          <ReadyComponent
            master={participants.master}
            player={participants.player}
            watcher={participants.watcher}
          />
        )}

        <Chat />
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
  }, [time, counter]);

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

    if (data) {
      if (state.userInfo.id === data.id) {
        setUserData(
          state.userInfo.image_url,
          state.userInfo.name,
          state.userInfo.elo
        );
      } else {
        firebase
          .database()
          .ref(`users/${data.id}`)
          .once("value")
          .then((snapshot) => {
            setUserData(
              snapshot.val().image_url,
              snapshot.val().name.value,
              snapshot.val().elo
            );
          });
      }
    } else {
      setUserData("", "", "");
    }
  }, [
    state.userInfo.id,
    state.userInfo.image_url,
    state.userInfo.name,
    state.userInfo.elo,
    data.id,
    firebase,
    data,
  ]);

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
        <CounterConponent time={time} />
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

    if (data) {
      if (state.userInfo.id === data.id) {
        setUserData(
          state.userInfo.image_url,
          state.userInfo.name,
          state.userInfo.elo
        );
      } else {
        firebase
          .database()
          .ref(`users/${data.id}`)
          .once("value")
          .then((snapshot) => {
            setUserData(
              snapshot.val().image_url,
              snapshot.val().name.value,
              snapshot.val().elo
            );
          });
      }
    } else {
      setUserData("", "", "");
    }
  }, [
    state.userInfo.id,
    state.userInfo.image_url,
    state.userInfo.name,
    state.userInfo.elo,
    firebase,
    data,
  ]);

  return (
    <div className="d-flex flex-column pr-2">
      <div style={{ width: "100%" }} className="d-flex justify-content-center ">
        <div className="mr-2">
          {name ? (
            <p className="text-white">{name}</p>
          ) : (
            <p className="text-white">Trống</p>
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
      {gameStatus === "playing" && turn && turn.uid === data.id ? (
        <CounterConponent time={time} />
      ) : (
        ""
      )}
    </div>
  );
}
