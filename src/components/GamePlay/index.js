import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./GamePlay.css";

// Components
import Loading from "./../Loading/";
import Gomoku from "./Gomoku/";
import Original from "./Original/";

// SVGs
import UserSVG from './../../assets/Dashboard/user.svg';

// Contexts
import AppContext from "./../../context/";
import { FirebaseContext } from "./../../Firebase/";

function GamePlayComponent({ type = "original" }) {
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

      finalArr.push({ id: element, ...partObj[element] })
    }

    return finalArr.filter(master => master.type === 'master')[0];
  }

  if (loading) {
    return <Loading />;
  }

  console.log(participants)

  return (
    <Container
      fluid
      className="game-play"
      style={{ minHeight: "100vh", width: "100vw" }}
    >
      <Row>
        <Col className="p-0">
          <div style={{ width: "100vw" }} className="d-flex flex-fill">
            <MasterUser data={getMaster(participants)} firebase={firebase} />
            <CounterConponent counter={counter} />
            <div
              style={{ width: "100%" }}
              className="d-flex flex-fill justify-content-center align-items-center p-2"
            >
              <span
                className="rounded-circle bg-primary"
                style={{ width: "40px", height: "40px" }}
              ></span>
            </div>
          </div>
        </Col>
      </Row>
      {type === "original" ? (
        <Original time={time} counter={counter} setCounter={setCounter} />
      ) : (
          <Gomoku time={time} counter={counter} setCounter={setCounter} />
        )}
    </Container>
  );
}
export default GamePlayComponent;

function CounterConponent({ counter }) {
  return (<div
    style={{ width: "100%" }}
    className="d-flex flex-fill justify-content-center align-items-center"
  >
    <p>{counter}</p>
  </div>)
}

function MasterUser({ data, firebase }) {
  const { state } = React.useContext(AppContext);
  const [imageUrl, setImageUrl] = React.useState('');

  console.log(data);
  React.useEffect(() => {
    if (state.userInfo.id === data.id) {
      setImageUrl(state.userInfo.image_url);
    } else {
      firebase.database().ref(`users/${data.id}`).once('value')
        .then(snapshot => {
          setImageUrl(snapshot.val().image_url)
        });
    }

    return () => { }
  }, [state.userInfo.id, state.userInfo.image_url, data.id, firebase]);

  return (<div
    style={{ width: "100%" }}
    className="d-flex flex-fill justify-content-center align-items-center p-2"
  >
    <img
      src={imageUrl ? imageUrl : UserSVG}
      alt="user"
      className={imageUrl ? `rounded-circle` : ''}
      style={{ width: "40px", height: "40px" }}
    ></img>
  </div>)
}
