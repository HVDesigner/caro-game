import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./GamePlay.css";

// Components
import Loading from "./../Loading/";
import Gomoku from "./Gomoku/";
import Original from "./Original/";

// SVGs
import UserIMG from "./../../assets/profile_pic.jpg";

// Contexts
import AppContext from "./../../context/";
import { FirebaseContext } from "./../../Firebase/";

function GamePlayComponent({ type = "original" }) {
  const { state } = React.useContext(AppContext);
  const [firebase] = React.useState(React.useContext(FirebaseContext));

  const [time, setTime] = React.useState(10);
  const [counter, setCounter] = React.useState(time);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    firebase
      .database()
      .ref(`/rooms/${state.room.type}/${state.room.id.toString()}`)
      .once("value")
      .then((snapshot) => {
        setTime(snapshot.val().time);
        setCounter(snapshot.val().time);
        console.log(snapshot.val());
      })
      .then(() => {
        setLoading(false);
      });
  }, [firebase, state.room.type, state.room.id, time]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Container
      fluid
      className="game-play"
      style={{ minHeight: "100vh", width: "100vw" }}
    >
      <Row>
        <Col className="p-0">
          <div style={{ width: "100vw" }} className="d-flex flex-fill">
            <div
              style={{ width: "100%" }}
              className="d-flex flex-fill justify-content-center align-items-center p-2"
            >
              <img
                src={UserIMG}
                alt="user"
                className="rounded-circle"
                style={{ width: "40px", height: "40px" }}
              ></img>
            </div>
            <div
              style={{ width: "100%" }}
              className="d-flex flex-fill justify-content-center align-items-center"
            >
              <p>{counter}</p>
            </div>
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
