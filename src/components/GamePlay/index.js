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

// Contexts
import AppContext from "./../../context/";
import { FirebaseContext } from "./../../Firebase/";

// Table
function GamePlayComponent() {
  const { state, getPositonSquare } = React.useContext(AppContext);
  const [firebase] = React.useState(React.useContext(FirebaseContext));
  const [loading, setLoading] = React.useState(true);

  // menu modal
  const [showMenu, setShowMenu] = React.useState(false);

  const [time, setTime] = React.useState(10);
  const [counter, setCounter] = React.useState(time);
  const [participants, setParticipants] = React.useState([]);
  const [bet, setBet] = React.useState(0);

  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    firebase
      .database()
      .ref(`/rooms/${state.room.type}/${state.room.id.toString()}`)
      .on("value", (snapshot) => {
        if (state.room.type && state.room.id) {
          if (snapshot.val()) {
            console.log(snapshot.val());
            setTime(snapshot.val().time);
            setCounter(snapshot.val().time);
            setParticipants(snapshot.val().participants);
            setBet(snapshot.val().bet);
          }
        }
        setLoading(false);
      });

    return () =>
      firebase
        .database()
        .ref(`/rooms/${state.room.type}/${state.room.id.toString()}`);
  }, [firebase, state.room.type, state.room.id]);

  const getMaster = (partObj) => {
    const finalArr = [];

    for (let index = 0; index < Object.keys(partObj).length; index++) {
      const element = Object.keys(partObj)[index];

      finalArr.push({ id: element, ...partObj[element] });
    }

    return finalArr.filter(
      (master) => master.type === "master" && master.status
    )[0];
  };

  const getPlayer = (partObj) => {
    const finalArr = [];

    for (let index = 0; index < Object.keys(partObj).length; index++) {
      const element = Object.keys(partObj)[index];

      finalArr.push({ id: element, ...partObj[element] });
    }

    return finalArr.filter(
      (player) => player.type === "player" && player.status
    )[0];
  };

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
        onMouseMoveCapture={(e) => {
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
                  data={getMaster(participants)}
                  firebase={firebase}
                  counter={counter}
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
                  <span className="text-warning mr-1">Cược:</span>
                  {bet}
                </small>
                <img
                  src={MoreSVG}
                  alt="more"
                  style={{ width: "1.5em" }}
                  className="shadow wood-btn"
                  onClick={() => {
                    setShowMenu(true);
                  }}
                />
              </div>
              {participants ? (
                <PlayerUser
                  data={getPlayer(participants)}
                  firebase={firebase}
                  counter={counter}
                />
              ) : (
                ""
              )}
            </div>
          </Col>
        </Row>

        <div
          onMouseOut={() => {
            if (state.userInfo.platform === "web") {
              getPositonSquare(false, 0, 0);
            }
          }}
        >
          {state.room.type === "block-head" ? (
            <Original time={time} counter={counter} setCounter={setCounter} />
          ) : (
            <Gomoku time={time} counter={counter} setCounter={setCounter} />
          )}
        </div>

        <div
          className="flex-fill overflow-auto h-100 bg-white pl-2 pr-2 rounded brown-border"
          style={{ minHeight: "48px" }}
        >
          <div style={{ height: "100%" }}>
            <div className="d-flex flex-column">
              <p>
                <strong className="mr-2 ">Hoang:</strong>123a33
              </p>
              <p>
                <strong className="mr-2 ">Linh:</strong>123a33
              </p>
              <p>
                <strong className="mr-2 ">Linh:</strong>123a33
              </p>
            </div>
          </div>
        </div>
        <div className="p-1 rounded">
          <input
            className="input-carotv-2 text-white text-left w-100"
            placeholder="Nhập tin nhắn..."
            type="text"
          />
        </div>
      </Container>
    </React.Fragment>
  );
}
export default GamePlayComponent;

// Counter
function CounterConponent({ counter }) {
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
function MasterUser({ data, firebase, counter }) {
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
  }, [
    state.userInfo.id,
    state.userInfo.image_url,
    state.userInfo.name,
    state.userInfo.elo,
    data.id,
    firebase,
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
      <CounterConponent counter={counter} />
    </div>
  );
}

// Player User Right
function PlayerUser({ data, firebase, counter }) {
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
      <div
        style={{ width: "100%" }}
        className="d-flex flex-fill justify-content-center align-items-center"
      >
        <div className="mr-2">
          <p className="text-white">{name ? name : "..."}</p>
          <small className="text-white">
            <span className="text-warning mr-1">ELO:</span>
            {elo ? elo : "..."}
          </small>
        </div>
        <img
          src={imageUrl ? imageUrl : UserSVG}
          alt="user"
          className={imageUrl ? `rounded-circle` : ""}
          style={{ width: "40px", height: "40px" }}
        ></img>
      </div>
      <CounterConponent counter={counter} />
    </div>
  );
}
