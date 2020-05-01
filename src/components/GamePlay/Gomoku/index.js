import React from "react";
import { Row, Col } from "react-bootstrap";
import "./../GamePlay.css";

// Game Core
import GamePlay from "./../../../Core/game";

// Components
import Square from "./../../Square/";

// Contexts
import { FirebaseContext } from "./../../../Firebase/";
import AppContext from "./../../../context/";

function GamePlayComponent({
  time,
  counter,
  setCounter,
  turn,
  master,
  player,
  round,
}) {
  const firebase = React.useContext(FirebaseContext);
  const { state } = React.useContext(AppContext);

  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "W",
  ];
  const numeric = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]];

  const [caroTable, setCaroTable] = React.useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const [turnInRound, setTurnInRound] = React.useState({ uid: "", value: "" });

  const [statusGame, setStatusGame] = React.useState({
    isPlay: true,
    winner: "",
  });

  const [choicePosition, setChoicePosition] = React.useState({
    rowkey: "",
    colkey: "",
    clickCount: 0,
  });

  React.useEffect(() => {
    const roomRef = firebase
      .database()
      .ref(`/rooms/${state.room.type}/${state.room.id.toString()}`);

    function onSnapShot(snapshot) {
      if (snapshot.val()) {
        setTurnInRound({ uid: turn.uid, value: snapshot.val().value });
      }
    }

    roomRef.child(`game/player/${turn.uid}`).once("value").then(onSnapShot);
  }, [firebase, state.room.type, state.room.id, turn.uid]);

  React.useEffect(() => {
    const updatePositionWithValue = (rowkey, colkey, value) => {
      let _caroTableLocal = caroTable;

      let _changeCol = _caroTableLocal[rowkey];

      _changeCol.splice(colkey, 1, value);

      _caroTableLocal.splice(rowkey, 1, _changeCol);

      return _caroTableLocal;
    };

    const roomRef = firebase
      .database()
      .ref(`/rooms/${state.room.type}/${state.room.id.toString()}`);

    function onSnapShot(snapshot) {
      if (snapshot.exists()) {
        const keys = Object.keys(snapshot.val());

        for (let index = 0; index < keys.length; index++) {
          const element = keys[index];

          updatePositionWithValue(
            snapshot.val()[element].row,
            snapshot.val()[element].col,
            snapshot.val()[element].value
          );

          const gameNewStatus_ = GamePlay(caroTable, "gomoku").checkAround(
            snapshot.val()[element].row,
            snapshot.val()[element].col
          );

          if (gameNewStatus_.isPlay === false) {
            setCounter(0);
          }

          setStatusGame(gameNewStatus_);
        }
      }
    }

    roomRef.child(`game/history/${round}`).once("value").then(onSnapShot);
  }, [
    firebase,
    state.room.type,
    state.room.id,
    round,
    caroTable,
    setCounter,
    turn.uid,
    state.userInfo.id,
  ]);

  const changeTurn = () => {
    const roomRef = firebase
      .database()
      .ref(`/rooms/${state.room.type}/${state.room.id.toString()}`);

    roomRef
      .child(`game/player`)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          const keys = Object.keys(snapshot.val());

          for (let index = 0; index < keys.length; index++) {
            const element = keys[index];

            if (element !== turn.uid) {
              roomRef.child("game/round/turn").update({ uid: element });
            }
          }
        }
      });
  };

  const onClickSquare = (rowkey, colkey) => {
    if (
      statusGame.isPlay &&
      (master.id === state.userInfo.id || player.id === state.userInfo.id)
    ) {
      if (caroTable[rowkey][colkey] === 0 || caroTable[rowkey][colkey] === 3) {
        if (
          choicePosition.rowkey === "" &&
          choicePosition.colkey === "" &&
          choicePosition.clickCount === 0
        ) {
          setChoicePosition({ rowkey, colkey, clickCount: 1 });
          setCaroTable(choicePositionShow(rowkey, colkey));
        }

        if (
          (choicePosition.rowkey !== rowkey ||
            choicePosition.colkey !== colkey) &&
          choicePosition.clickCount === 1
        ) {
          setCaroTable(
            choicePositionHide(choicePosition.rowkey, choicePosition.colkey)
          );
          setCaroTable(choicePositionShow(rowkey, colkey));

          setChoicePosition({ rowkey, colkey, clickCount: 1 });
        }

        if (
          choicePosition.rowkey === rowkey &&
          choicePosition.colkey === colkey &&
          choicePosition.clickCount === 1 &&
          turn.uid === state.userInfo.id
        ) {
          firebase
            .database()
            .ref(
              `/rooms/${state.room.type}/${state.room.id}/game/history/${round}`
            )
            .push()
            .set({
              row: rowkey,
              col: colkey,
              value: turnInRound.value,
              createAt: Date.now(),
            });

          changeTurn();

          setCaroTable(updatePosition(rowkey, colkey));

          setCounter(time);

          const gameNewStatus_ = GamePlay(caroTable, "gomoku").checkAround(
            rowkey,
            colkey
          );
          if (gameNewStatus_.isPlay === false) {
            setCounter(0);
          }

          setStatusGame(gameNewStatus_);

          setChoicePosition({ rowkey: "", colkey: "", clickCount: 0 });
        }
      }
    }
  };

  const updatePosition = (rowkey, colkey) => {
    let _caroTableLocal = caroTable;

    let _changeCol = _caroTableLocal[rowkey];

    _changeCol.splice(colkey, 1, turnInRound.value);

    _caroTableLocal.splice(rowkey, 1, _changeCol);

    return _caroTableLocal;
  };

  const choicePositionShow = (rowkey, colkey) => {
    let _caroTableLocal = caroTable;

    let _changeCol = _caroTableLocal[rowkey];

    _changeCol.splice(colkey, 1, 3);

    _caroTableLocal.splice(rowkey, 1, _changeCol);

    return _caroTableLocal;
  };

  const choicePositionHide = (rowkey, colkey) => {
    let _caroTableLocal = caroTable;

    let _changeCol = _caroTableLocal[rowkey];

    _changeCol.splice(colkey, 1, 0);

    _caroTableLocal.splice(rowkey, 1, _changeCol);

    return _caroTableLocal;
  };

  return (
    <Row>
      <Col className="p-0" xs="10">
        <div className="game-play-body">
          <div style={{ width: "100vw" }}>
            {caroTable.map((row, rowkey) => {
              return (
                <span key={rowkey} className="row_">
                  <span
                    style={{
                      minWidth: "1em",
                      textAlign: "center",
                      fontSize: "12px",
                    }}
                    className="text-white d-flex flex-fill justify-content-center align-items-center"
                  >
                    {alphabet[rowkey]}
                  </span>
                  {row.map((colValue, colkey) => (
                    <Square
                      key={colkey}
                      rowkey={rowkey}
                      colkey={colkey}
                      onClickSquare={onClickSquare}
                      value={colValue}
                    />
                  ))}
                </span>
              );
            })}
            {numeric.map((row, rowkey) => {
              return (
                <span key={rowkey} className="row_">
                  <span
                    style={{
                      minWidth: "1em",
                      textAlign: "center",
                      fontSize: "12px",
                    }}
                    className="text-white d-flex flex-fill justify-content-center align-items-center"
                  ></span>
                  {row.map((colValue, colkey) => (
                    <span
                      key={colkey}
                      className="number-bottom text-white text-center"
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      {colValue}
                    </span>
                  ))}
                </span>
              );
            })}
          </div>
        </div>
      </Col>
    </Row>
  );
}
export default GamePlayComponent;
