import React from "react";
import { Row, Col } from "react-bootstrap";
import "./../GamePlay.css";

// Game Core
import GamePlay from "./../../../Core/game";

// Components
import Square from "./../../Square/";
import Alphabet from "./Alphabet/";
import Numeric from "./Numeric/";
import ReadyComponent from "./../ReadyComponent/";

// Contexts
import { FirebaseContext } from "./../../../Firebase/";
import AppContext from "./../../../context/";

function GamePlayComponent({ gameData, roomInfo, ownType }) {
  const firebase = React.useContext(FirebaseContext);
  const { state } = React.useContext(AppContext);

  const [initTable] = React.useState([
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

  const onUpdateWinner = React.useCallback(() => {
    const winAction = firebase.functions().httpsCallable("winAction");

    winAction({
      roomType: state.room.type,
      roomId: state.room.id,
      userType: ownType,
      prevWinNumber: roomInfo.participants[ownType].win
        ? roomInfo.participants[ownType].win
        : 0,
      winnerId: state.userInfo.id,
    });
  }, [
    firebase,
    state.room.id,
    state.room.type,
    ownType,
    roomInfo.participants,
    state.userInfo.id,
  ]);

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
          const historyData = snapshot.val()[element];

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

          setStatusGame(newStatusOfGame);

          if (newStatusOfGame.isPlay === false) {
            roomRef.child(`game/status`).update({ type: "winner" });

            const keysUser = Object.keys(gameData.player);

            for (let index = 0; index < keysUser.length; index++) {
              const element = keysUser[index];
              const dataUser = gameData.player[element];

              if (dataUser.value === newStatusOfGame.winner) {
                roomRef
                  .child(`game/player/${element}`)
                  .update({ winner: true });
              } else {
                roomRef
                  .child(`game/player/${element}`)
                  .update({ winner: false });
              }
            }
          }
        }
      }
    }

    roomRef.child(`game/history`).on("value", onSnapShot);
    return () => roomRef.child(`game/history`).off("value", onSnapShot);
  }, [
    caroTable,
    firebase,
    gameData.history,
    gameData.player,
    ownType,
    roomInfo.rule,
    state.room.id,
    state.room.type,
    state.userInfo.id,
    initTable,
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
          } else {
            if (
              gameData.player[state.userInfo.id].value === gameNewStatus_.winner
            ) {
              onUpdateWinner();
            }
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
    <div>
      {gameData.status.type === "waiting" ? (
        <ReadyComponent
          master={roomInfo.participants.master}
          player={roomInfo.participants.player}
          watcher={roomInfo.participants.watcher}
          gameData={gameData}
          ownType={ownType}
          initTable={initTable}
          setCaroTable={setCaroTable}
          setStatusGame={setStatusGame}
        />
      ) : (
        ""
      )}

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
    </div>
  );
}
export default GamePlayComponent;
