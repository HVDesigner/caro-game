import React from "react";
import "./../GamePlay.css";
import { Row, Col } from "react-bootstrap";
import { useFirebaseApp } from "reactfire";
import firebase from "firebase/app";

// Functions
import { winAction } from "./../../../functions/";

// Game Core
import GamePlay from "./../../../Core/game";

// Components
import Square from "./../../Square/";
import Alphabet from "./Alphabet/";
import Numeric from "./Numeric/";
import ReadyComponent from "./../ReadyComponent/";

// Contexts
import AppContext from "./../../../context/";

function GamePlayComponent({ roomData, ownType }) {
  const firebaseApp = useFirebaseApp();
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

  /**
   * ------------------------------------------------------------------------------------
   *
   * Trạng thái bàn chơi.
   */
  const [statusGame, setStatusGame] = React.useState({
    isPlay: false,
    winner: "",
  });

  /**
   * ---------------------------------------------------------------------------------------
   *
   * Ô đã chọn.
   */
  const [choicePosition, setChoicePosition] = React.useState({
    rowkey: "",
    colkey: "",
    clickCount: 0,
  });

  /**
   * --------------------------------------------------------------------------------------
   *
   * Reset bàn chơi.
   */
  const resetTable = () => {
    setCaroTable([
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
  };

  /**
   * ---------------------------------------------------------------------------------------
   *
   * Cập nhật người chơi thắng cuộc.
   */
  const onUpdateWinner = () => {
    winAction(
      {
        ownType,
        roomId: state.user.room_id.value,
      },
      firebaseApp
    );
  };

  /**
   * -------------------------------------------------------------------------
   */
  React.useEffect(() => {
    if (
      roomData.participants[ownType] &&
      roomData.participants[ownType].status === "playing"
    ) {
      /**
       * Nếu trạng thái của người chơi là 'playing'.
       */

      /**
       * ------------------------------------------------------------------------
       *
       * Chuyển sang trạng thái chơi game, chưa có người thắng.
       */
      setStatusGame({
        isPlay: true,
        winner: "",
      });
    }

    /**
     * ---------------------------------------------------------------------------
     *
     * Cập nhật những ô đã đánh trên bàn cờ, qua  dữ liệu đã lưu.
     *
     * @param {number} rowkey
     * @param {number} colkey
     * @param {(1 | 2)} value
     */
    const updatePositionWithValue = (rowkey, colkey, value) => {
      const _caroTableLocal = caroTable;
      const _changeCol = _caroTableLocal[rowkey];

      _changeCol.splice(colkey, 1, value);
      _caroTableLocal.splice(rowkey, 1, _changeCol);
      return _caroTableLocal;
    };

    /**
     * ----------------------------------------------------------------------------
     */
    if (roomData.game.history.length > 0) {
      /**
       * Nếu có dữ liệu lịch sử bàn chơi.
       */

      /**
       * ---------------------------------------------------------------------------
       * Cập nhật bàn chơi với dữ liệu đã có.
       */
      for (let index = 0; index < roomData.game.history.length; index++) {
        const element = roomData.game.history[index];

        setCaroTable(
          updatePositionWithValue(element.row, element.col, element.value)
        );

        /**
         * ------------------------------------------------------------------------
         * Kiểm tra người thắng đã có chưa.
         */
        const newStatusOfGame = GamePlay(
          caroTable,
          "gomoku",
          roomData.rule
        ).checkAround(element.row, element.col);

        /**
         * ------------------------------------------------------------------------
         */
        if (!newStatusOfGame.isPlay) {
          /**
           * Nếu đã có người thắng.
           *
           * Cập nhật trạng thái người chơi.
           */
          setStatusGame(newStatusOfGame);
        }
      }
    } else {
      if (
        JSON.stringify(caroTable) !==
        JSON.stringify([
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
        ])
      ) {
        /**
         * Nếu bàn chơi trống.
         *
         * Reset bàn.
         */
        resetTable();
      }
    }
  }, [
    firebaseApp,
    state.user.room_id.value,
    roomData.game.player,
    roomData.rule,
    roomData.game.history,
    roomData.participants,
    ownType,
    caroTable,
  ]);

  const changeTurn = () => {
    const RoomsCollection = firebaseApp.firestore().collection("rooms");

    /**
     * ---------------------------------------------------------------------------------
     *
     */
    if (roomData.participants.player.id === roomData.game.turn.uid) {
      /**
       * Nếu lượt đánh đang thuộc về Player.
       *
       * Cập nhật lượt đánh cho Master.
       */
      RoomsCollection.doc(state.user.room_id.value).update({
        "game.turn.uid": roomData.participants.master.id,
      });
    } else if (roomData.participants.master.id === roomData.game.turn.uid) {
      /**
       * Nếu lượt đánh đang thuộc về Master.
       *
       * Cập nhật lượt đánh cho Player.
       */
      RoomsCollection.doc(state.user.room_id.value).update({
        "game.turn.uid": roomData.participants.player.id,
      });
    }
  };

  /**
   * -----------------------------------------------------------------------------------
   * Chức năng cập nhật trạng thái ô khi onClick
   *
   * @param {number} rowkey
   * @param {number} colkey
   */
  const onClickSquare = (rowkey, colkey) => {
    if (statusGame.isPlay && (ownType === "master" || ownType === "player")) {
      /**
       * Nếu như đang ở trạng thái được phép chơi (isPlay : true), User là Master hoặc Player.
       */

      /**
       * ----------------------------------------------------------------------------------------------
       */
      if (
        (caroTable[rowkey][colkey] === 0 || caroTable[rowkey][colkey] === 3) &&
        roomData.game.turn.uid === state.user.uid
      ) {
        /**
         * Nếu như ô đang chọn có trạng thái bằng 0 (rỗng) hoặc bằng 3 (đã chọn).
         */

        /**
         * --------------------------------------------------------------------------------------------
         */
        switch (choicePosition.clickCount) {
          case 1:
            /**
             * Số lần click bằng 1.
             */
            if (
              choicePosition.rowkey !== rowkey ||
              choicePosition.colkey !== colkey
            ) {
              /**
               * Nếu đã chọn ô khác và khác ô đã click lần đầu.
               */

              /**
               * -------------------------------------------------------------------------------
               *
               * Chuyển trạng thái 0 (rỗng) cho ô đã chọn lần đầu.
               */
              setCaroTable(
                choicePositionHide(choicePosition.rowkey, choicePosition.colkey)
              );

              /**
               * -------------------------------------------------------------------------------
               *
               * Cập nhật trạng thái 3 (đã chọn) cho ô mới vừa được chọn.
               */
              setCaroTable(choicePositionShow(rowkey, colkey));

              /**
               * -------------------------------------------------------------------------------
               * Cập nhật vị trí cho ỗ đã chọn và số lần click.
               */
              setChoicePosition({ rowkey, colkey, clickCount: 1 });
            } else {
              /**
               * Nếu như ô được chọn trùng với ô đã chọn lần đầu.
               */

              /**
               * ------------------------------------------------------------------------------
               *
               * Cập nhật trạng thái 1 (X) hoặc 2 (O) cho ô đã chọn.
               */
              setCaroTable(updatePosition(rowkey, colkey));

              /**
               * ------------------------------------------------------------------------------
               *
               * Kiểm tra đã có người thắng chưa.
               */
              const gameNewStatus_ = GamePlay(
                caroTable,
                "gomoku",
                roomData.rule
              ).checkAround(rowkey, colkey);

              if (!gameNewStatus_.isPlay) {
                // Nếu như đã xuất hiện người thắng.
                setStatusGame(gameNewStatus_);
              }

              /**
               * ------------------------------------------------------------------------------
               *
               * Reset vị trí đã chọn và số lần click trên 1 ô.
               */
              setChoicePosition({ rowkey: "", colkey: "", clickCount: 0 });

              /**
               * -------------------------------------------------------------------------------
               *
               * Lưu lịch sử mới lên database.
               */
              firebaseApp
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

              /**
               * -------------------------------------------------------------------------------
               */
              if (gameNewStatus_.isPlay) {
                /**
                 * Nếu như chưa có người thắng xuất hiện.
                 *
                 * Đổi lượt.
                 */
                changeTurn();
              } else {
                /**
                 * Nếu như đã có người thắng xuất hiện.
                 */
                if (
                  roomData.game.player[state.user.uid].value ===
                  gameNewStatus_.winner
                ) {
                  /**
                   * Như bạn là người thắng.
                   *
                   * Cập nhật người thắng.
                   */
                  onUpdateWinner();
                }
              }
            }
            break;

          default:
            if (choicePosition.rowkey === "" && choicePosition.colkey === "") {
              /**
               * Nếu như chưa có ô được chọn, lần đầu.
               *
               * Cập nhật ô đã chọn.
               */
              setChoicePosition({ rowkey, colkey, clickCount: 1 });

              /**
               * Cập nhật ô đã chọn lên bàn.
               */
              setCaroTable(choicePositionShow(rowkey, colkey));
            }
            break;
        }
      }
    }
  };

  /**
   * -------------------------------------------------------------------------------------
   * Chức năng cập nhật vị trí đã đánh trên bàn chơi.
   *
   * @param {number} rowkey
   * @param {number} colkey
   */
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
