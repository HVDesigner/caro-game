import React from "react";
import { Row, Col } from "react-bootstrap";
import "./../GamePlay.css";
import { winAction } from "./../../../functions/";

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

const initTable = [
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
];

function GamePlayComponent({ roomData, ownType }) {
  const firebase = React.useContext(FirebaseContext);
  const { state } = React.useContext(AppContext);

  const [caroTable, setCaroTable] = React.useState(initTable);

  const [statusGame, setStatusGame] = React.useState({
    isPlay: false,
    winner: "",
  });

  const [choicePosition, setChoicePosition] = React.useState({
    rowkey: "",
    colkey: "",
    clickCount: 0,
  });

  const resetTable = () => {
    setCaroTable(initTable);
  };

  const onUpdateWinner = async () => {
    winAction(
      {
        ownType,
        roomData,
        roomId: state.user.room_id.value,
        userCoin: state.user.coin,
        userId: state.user.uid,
      },
      firebase
    );
  };

  React.useEffect(() => {
    if (
      roomData.participants[ownType] &&
      roomData.participants[ownType].status === "playing"
    ) {
      setStatusGame({
        isPlay: true,
        winner: "",
      });
    }

    const updatePositionWithValue = (rowkey, colkey, value) => {
      let _caroTableLocal = caroTable;
      let _changeCol = _caroTableLocal[rowkey];
      _changeCol.splice(colkey, 1, value);
      _caroTableLocal.splice(rowkey, 1, _changeCol);
      return _caroTableLocal;
    };

    if (roomData.game.history.length > 0) {
      for (let index = 0; index < roomData.game.history.length; index++) {
        const element = roomData.game.history[index];

        setCaroTable(
          updatePositionWithValue(element.row, element.col, element.value)
        );

        const newStatusOfGame = GamePlay(
          caroTable,
          "gomoku",
          roomData.rule
        ).checkAround(element.row, element.col);

        setStatusGame(newStatusOfGame);
      }
    } else {
      if (JSON.stringify(caroTable) !== JSON.stringify(initTable)) {
        resetTable();
      }
    }
  }, [
    firebase,
    state.user.room_id.value,
    roomData.game.player,
    roomData.rule,
    roomData.game.history,
    roomData.participants,
    ownType,
    caroTable,
  ]);

  const changeTurn = () => {
    if (roomData.participants.player.id === roomData.game.turn.uid) {
      firebase
        .firestore()
        .collection("rooms")
        .doc(state.user.room_id.value)
        .update({
          "game.turn.uid": roomData.participants.master.id,
        });
    } else if (roomData.participants.master.id === roomData.game.turn.uid) {
      firebase
        .firestore()
        .collection("rooms")
        .doc(state.user.room_id.value)
        .update({
          "game.turn.uid": roomData.participants.player.id,
        });
    }
  };

  const onClickSquare = (rowkey, colkey) => {
    if (
      statusGame.isPlay &&
      (ownType === "master" || ownType === "player")
      /* && roomData.participants[ownType].status === "playing" */
    ) {
      if (
        (caroTable[rowkey][colkey] === 0 || caroTable[rowkey][colkey] === 3) &&
        roomData.game.turn.uid === state.user.uid
      ) {
        switch (choicePosition.clickCount) {
          case 1:
            if (
              choicePosition.rowkey !== rowkey ||
              choicePosition.colkey !== colkey
            ) {
              // Selected new position
              setCaroTable(
                choicePositionHide(choicePosition.rowkey, choicePosition.colkey)
              );
              setCaroTable(choicePositionShow(rowkey, colkey));
              // Set new select position
              setChoicePosition({ rowkey, colkey, clickCount: 1 });
            } else {
              setCaroTable(updatePosition(rowkey, colkey));

              const gameNewStatus_ = GamePlay(
                caroTable,
                "gomoku",
                roomData.rule
              ).checkAround(rowkey, colkey);

              setStatusGame(gameNewStatus_);

              setChoicePosition({ rowkey: "", colkey: "", clickCount: 0 });

              firebase
                .firestore()
                .collection("rooms")
                .doc(state.user.room_id.value)
                .update({
                  "game.history": firebase.firestore.FieldValue.arrayUnion({
                    row: rowkey,
                    col: colkey,
                    value: roomData.game.player[roomData.game.turn.uid].value,
                  }),
                });

              if (gameNewStatus_.isPlay) {
                changeTurn();
              } else {
                if (
                  roomData.game.player[state.user.uid].value ===
                  gameNewStatus_.winner
                ) {
                  onUpdateWinner();
                }
              }
            }
            break;

          default:
            if (choicePosition.rowkey === "" && choicePosition.colkey === "") {
              setChoicePosition({ rowkey, colkey, clickCount: 1 });
              setCaroTable(choicePositionShow(rowkey, colkey));
            }

            break;
        }
      }
    }
  };

  const updatePosition = (rowkey, colkey) => {
    let _caroTableLocal = caroTable;
    let _changeCol = _caroTableLocal[rowkey];
    _changeCol.splice(
      colkey,
      1,
      roomData.game.player[roomData.game.turn.uid].value
    );
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
      {roomData.participants[ownType] &&
      (roomData.participants[ownType].status === "waiting" ||
        ownType === "watcher") ? (
        <ReadyComponent
          roomData={roomData}
          ownType={ownType}
          setStatusGame={setStatusGame}
        />
      ) : (
        ""
      )}

      <Row>
        <Col className="p-0" xs="10">
          <div className="game-play-body">
            <div style={{ width: "100vw" }}>
              {caroTable.map((rowValue, rowkey) => {
                return (
                  <span key={rowkey} className="row_">
                    <Alphabet rowkey={rowkey} />
                    {rowValue.map((colValue, colkey) => (
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
