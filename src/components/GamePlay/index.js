import React from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import "./GamePlay.css";

// Components
import Loading from "./../Loading/";
import Gomoku from "./Gomoku/";
import Original from "./Original/";

// SVGs
import UserSVG from "./../../assets/Dashboard/user.svg";

// Contexts
import AppContext from "./../../context/";
import { FirebaseContext } from "./../../Firebase/";

// Table
function GamePlayComponent() {
  const { state, getPositonSquare } = React.useContext(AppContext);
  const [firebase] = React.useState(React.useContext(FirebaseContext));

  const [time, setTime] = React.useState(10);
  const [counter, setCounter] = React.useState(time);
  const [participants, setParticipants] = React.useState([]);
  const [bet, setBet] = React.useState(0);

  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (state.room.type !== "none" && state.room.id !== 0) {
      firebase
        .database()
        .ref(`/rooms/${state.room.type}/${state.room.id.toString()}`)
        .once("value")
        .then((snapshot) => {
          if (snapshot.val()) {
            console.log(snapshot.val());
            setTime(snapshot.val().time);
            setCounter(snapshot.val().time);
            setParticipants(snapshot.val().participants);
            setBet(snapshot.val().bet);
          }
        })
        .then(() => {
          setLoading(false);
        });
    }
  }, [firebase, state.room.type, state.room.id]);

  const getMaster = (partObj) => {
    const finalArr = [];

    for (let index = 0; index < Object.keys(partObj).length; index++) {
      const element = Object.keys(partObj)[index];

      finalArr.push({ id: element, ...partObj[element] });
    }

    return finalArr.filter((master) => master.type === "master")[0];
  };

  const getPlayer = (partObj) => {
    const finalArr = [];

    for (let index = 0; index < Object.keys(partObj).length; index++) {
      const element = Object.keys(partObj)[index];

      finalArr.push({ id: element, ...partObj[element] });
    }

    return finalArr.filter((master) => master.type === "player")[0];
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container
      fluid
      className="game-play position-relative"
      style={{ maxHeight: "100vh", minHeight: "100vh", width: "100vw" }}
      onMouseMoveCapture={(e) => {
        if (state.userInfo.platform === "web") {
          setMousePosition({ x: e.clientX, y: e.clientY });
        }
      }}
    >
      {state.userInfo.platform === "web" && state["square-position"].status ? (
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
            <MasterUser
              data={getMaster(participants)}
              firebase={firebase}
              counter={counter}
            />
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
            </div>
            <PlayerUser
              data={getPlayer(participants)}
              firebase={firebase}
              counter={counter}
            />
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

      <Row>
        <Col></Col>
      </Row>
    </Container>
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

  // console.log(data);
  React.useEffect(() => {
    if (state.userInfo.id === data.id) {
      setImageUrl(state.userInfo.image_url);
      setName(state.userInfo.name);
    } else {
      firebase
        .database()
        .ref(`users/${data.id}`)
        .once("value")
        .then((snapshot) => {
          setImageUrl(snapshot.val().image_url);
          setName(snapshot.val().name.value);
          setElo(snapshot.val().elo);
        });
    }

    return () => {};
  }, [
    state.userInfo.id,
    state.userInfo.image_url,
    state.userInfo.name,
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
    if (data) {
      if (state.userInfo.id === data.id) {
        setImageUrl(state.userInfo.image_url);
        setName(state.userInfo.name);
      } else {
        firebase
          .database()
          .ref(`users/${data.id}`)
          .once("value")
          .then((snapshot) => {
            setImageUrl(snapshot.val().image_url);
            setName(snapshot.val().name.value);
            setElo(snapshot.val().elo);
          });
      }
    }

    return () => {};
  }, [
    state.userInfo.id,
    state.userInfo.image_url,
    state.userInfo.name,
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
