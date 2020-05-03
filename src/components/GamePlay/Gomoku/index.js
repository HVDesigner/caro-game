import React from "react";
import { Row, Col } from "react-bootstrap";
import "./../GamePlay.css";

// Game Core
import GamePlay from "./../../../Core/game";

// Components
import Square from "./../../Square/";
import Alphabet from "./Alphabet/";
import Numeric from "./Numeric/";

// Contexts
import { FirebaseContext } from "./../../../Firebase/";
import AppContext from "./../../../context/";

function GamePlayComponent({ gameData, roomInfo, ownType }) {
  const firebase = React.useContext(FirebaseContext);
  const { state } = React.useContext(AppContext);

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

    if (gameData.history) {
      const keys = Object.keys(gameData.history);

      for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        const historyData = gameData.history[element];

        updatePositionWithValue(
          historyData.row,
          historyData.col,
          historyData.value
        );

        const newStatusOfGame = GamePlay(
          caroTable,
          "gomoku",
          roomInfo.rule
        ).checkAround(historyData.row, historyData.col);

        if (newStatusOfGame.isPlay === false) {
          roomRef.child(`game/status`).update({ type: "winner" });

          const keysUser = Object.keys(gameData.player);

          for (let index = 0; index < keysUser.length; index++) {
            const element = keysUser[index];
            const dataUser = gameData.player[element];

            if (dataUser.value === newStatusOfGame.winner) {
              roomRef.child(`game/player/${element}`).update({ winner: true });
            } else {
              roomRef.child(`game/player/${element}`).update({ winner: false });
            }
          }
        }

        setStatusGame(newStatusOfGame);
      }
    }
  }, [
    caroTable,
    firebase,
    gameData.history,
    gameData.player,
    roomInfo.rule,
    state.room.id,
    state.room.type,
  ]);

  const changeTurn = () => {
    const roomRef = firebase
      .database()
      .ref(`/rooms/${state.room.type}/${state.room.id.toString()}`);

    const keys = Object.keys(gameData.player);

    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];

      if (element !== gameData.turn.uid) {
        roomRef.child("game/turn").update({ uid: element });
      }
    }
  };

  const onClickSquare = (rowkey, colkey) => {
    if (statusGame.isPlay && (ownType === "master" || ownType === "player")) {
      if (
        (caroTable[rowkey][colkey] === 0 || caroTable[rowkey][colkey] === 3) &&
        gameData.turn.uid === state.userInfo.id
      ) {
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
          choicePosition.clickCount === 1
        ) {
          setCaroTable(updatePosition(rowkey, colkey));

          const gameNewStatus_ = GamePlay(caroTable, "gomoku").checkAround(
            rowkey,
            colkey
          );

          setStatusGame(gameNewStatus_);

          setChoicePosition({ rowkey: "", colkey: "", clickCount: 0 });

          if (gameNewStatus_.isPlay) {
            changeTurn();
          }

          firebase
            .database()
            .ref(`/rooms/${state.room.type}/${state.room.id}/game/history`)
            .push()
            .set({
              row: rowkey,
              col: colkey,
              value: gameData.player[gameData.turn.uid].value,
              createAt: Date.now(),
            });
        }
      }
    }
  };

  const updatePosition = (rowkey, colkey) => {
    let _caroTableLocal = caroTable;

    let _changeCol = _caroTableLocal[rowkey];

    _changeCol.splice(colkey, 1, gameData.player[gameData.turn.uid].value);

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
                  <Alphabet rowkey={rowkey} />
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
            <Numeric />
          </div>
        </div>
      </Col>
    </Row>
  );
}
export default GamePlayComponent;
