import React from "react";
import { Container, Row, Col } from "react-bootstrap";
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

function GamePlayComponent() {
  const { state } = React.useContext(AppContext);
  const [firebase] = React.useState(React.useContext(FirebaseContext));

  const [time, setTime] = React.useState(10);
  const [counter, setCounter] = React.useState(time);
  const [participants, setParticipants] = React.useState([]);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    firebase
      .database()
      .ref(`/rooms/${state.room.type}/${state.room.id.toString()}`)
      .once("value")
      .then((snapshot) => {
        setTime(snapshot.val().time);
        setCounter(snapshot.val().time);
        setParticipants(snapshot.val().participants);

        console.log(snapshot.val());
      })
      .then(() => {
        setLoading(false);
      });
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
      className="game-play"
      style={{ maxHeight: "100vh", minHeight: "100vh", width: "100vw" }}
    >
      <Row>
        <Col className="p-0">
          <div style={{ width: "100vw" }} className="d-flex flex-fill">
            <MasterUser data={getMaster(participants)} firebase={firebase} />
            <CounterConponent counter={counter} />
            <PlayerUser data={getPlayer(participants)} firebase={firebase} />
          </div>
        </Col>
      </Row>
      {state.room.type === "block-head" ? (
        <Original time={time} counter={counter} setCounter={setCounter} />
      ) : (
        <Gomoku time={time} counter={counter} setCounter={setCounter} />
      )}
      <Row>
        <Col></Col>
      </Row>
    </Container>
  );
}
export default GamePlayComponent;

function CounterConponent({ counter }) {
  return (
    <div
      style={{ width: "100%" }}
      className="d-flex flex-fill justify-content-center align-items-center"
    >
      <p className="text-white" style={{ fontSize: "20px" }}>
        {counter}s
      </p>
    </div>
  );
}

function MasterUser({ data, firebase }) {
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
          console.log(snapshot.val());
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
    <div
      style={{ width: "100%" }}
      className="d-flex flex-fill flex-column justify-content-center align-items-center p-2"
    >
      <img
        src={imageUrl ? imageUrl : UserSVG}
        alt="user"
        className={imageUrl ? `rounded-circle` : ""}
        style={{ width: "40px", height: "40px" }}
      ></img>
      <p className="text-white">{name ? name : "..."}</p>
      <p>{elo ? elo : "..."}</p>
    </div>
  );
}

function PlayerUser({ data, firebase }) {
  const { state } = React.useContext(AppContext);
  const [imageUrl, setImageUrl] = React.useState("");
  const [name, setName] = React.useState("");

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
            console.log(snapshot.val());
            setImageUrl(snapshot.val().image_url);
            setName(snapshot.val().name.value);
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
    <div
      style={{ width: "100%" }}
      className="d-flex flex-fill flex-column justify-content-center align-items-center p-2"
    >
      <img
        src={imageUrl ? imageUrl : UserSVG}
        alt="user"
        className={imageUrl ? `rounded-circle` : ""}
        style={{ width: "40px", height: "40px" }}
      ></img>
      <p className="text-white">{name ? name : "..."}</p>
    </div>
  );
}
