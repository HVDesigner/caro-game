import React from "react";
import { useFirebaseApp } from "reactfire";

// Components
import CheckButton from "./../../CheckButton/";

// Contexts
import AppContext from "./../../../context/";

// Functions
import { leaveRoom, winAction, GetTie } from "./../../../functions/";
import { parseInt } from "lodash";

function MenuModal({ showMenu, setShowMenu, roomData, ownType }) {
  const firebaseApp = useFirebaseApp();
  const { state } = React.useContext(AppContext);

  // true Bật
  // false Tắt
  const [musicBackground, setMusicBackground] = React.useState(true);
  const [soundEffect, setSoundEffect] = React.useState(true);

  React.useEffect(() => {
    setMusicBackground(state.user.setting.music.background);
    setSoundEffect(state.user.setting.music.effect);
  }, [state.user.setting.music.effect, state.user.setting.music.background]);

  const onToggleSound = () => {
    firebaseApp.firestore().collection("users").doc(state.user.uid).update({
      "setting.music.background": musicBackground,
      "setting.music.effect": soundEffect,
    });
  };

  const IamLoser = () => {
    winAction(
      {
        ownType: ownType === "master" ? "player" : "master",
        roomId: state.user.room_id.value,
      },
      firebaseApp
    );
    setShowMenu(false);
  };

  const WeTie = () => {
    GetTie(
      {
        roomId: state.user.room_id.value,
        uid: state.user.uid,
      },
      firebaseApp
    );
    setShowMenu(false);
  };

  return (
    <React.Fragment>
      {showMenu ? (
        <div className="menu-more d-flex justify-content-center">
          <div
            className="menu-more-content bg-brown-wood rounded d-flex flex-column justify-content-center align-self-center p-2 brown-border"
            style={{ maxWidth: "80vw" }}
          >
            <h4 className="text-center text-white text-stroke-carotv">MENU</h4>
            <div className="d-flex flex-column mb-2 brown-border rounded p-2">
              <p className="text-white text-center mb-2 text-stroke-carotv">
                Cài đặt âm thanh
              </p>
              <div className="d-flex" style={{ width: "100%" }}>
                <p className="flex-fill text-white mb-2 mr-2 text-stroke-carotv">
                  Nhạc nền
                </p>
                <div className="flex-fill mr-3">
                  <CheckButton
                    text={"Tắt"}
                    value={!musicBackground}
                    func={() => {
                      setMusicBackground(false);
                    }}
                  />
                </div>

                <div className="flex-fill">
                  <CheckButton
                    text={"Bật"}
                    value={musicBackground}
                    func={() => {
                      setMusicBackground(true);
                    }}
                  />
                </div>
              </div>
              <div className="d-flex" style={{ width: "100%" }}>
                <p className="flex-fill text-white mb-2 mr-2 text-stroke-carotv">
                  Hiệu ứng
                </p>
                <div className="flex-fill mr-3">
                  <CheckButton
                    text={"Tắt"}
                    value={!soundEffect}
                    func={() => {
                      setSoundEffect(false);
                    }}
                  />
                </div>

                <div className="flex-fill">
                  <CheckButton
                    text={"Bật"}
                    value={soundEffect}
                    func={() => {
                      setSoundEffect(true);
                    }}
                  />
                </div>
              </div>
              {state.user.setting.music.background !== musicBackground ||
              state.user.setting.music.effect !== soundEffect ? (
                <div
                  className="brown-border bg-gold-wood rounded wood-btn p-1"
                  onClick={() => {
                    onToggleSound();
                  }}
                >
                  <h5 className="text-center brown-color mb-0">Áp dụng</h5>
                </div>
              ) : (
                ""
              )}
            </div>

            {(ownType === "master" || ownType === "player") &&
            roomData.participants[ownType].status === "playing" ? (
              <div className="d-flex flex-column mb-2 brown-border rounded p-2">
                <span
                  className="brown-border bg-gold-wood rounded wood-btn p-1 mb-2"
                  onClick={() => {
                    IamLoser();
                  }}
                >
                  <h5 className="text-center brown-color mb-0 text-danger">
                    <strong>Xin thua</strong>
                  </h5>
                </span>
                <span
                  className="brown-border bg-gold-wood rounded wood-btn p-1"
                  onClick={() => {
                    WeTie();
                  }}
                >
                  <h5 className="text-center brown-color mb-0">Cầu Hòa</h5>
                </span>
              </div>
            ) : (
              ""
            )}

            {ownType === "master" &&
            roomData.participants[ownType].status === "waiting" ? (
              <div className="d-flex flex-column mb-2 brown-border rounded p-2">
                <p className="text-white text-center mb-2 text-stroke-carotv">
                  Chống SOFT
                </p>
                <NoSOFT roomData={roomData} />
              </div>
            ) : (
              ""
            )}

            {ownType === "watcher" ? (
              <span
                className="brown-border bg-gold-wood rounded wood-btn p-1 mb-2"
                onClick={() => {
                  leaveRoom(
                    {
                      roomId: state.user.room_id.value,
                      userId: state.user.uid,
                      userType: ownType,
                    },
                    firebaseApp
                  )
                    .then()
                    .catch((error) => {
                      console.log(error);
                    });
                }}
              >
                <h5 className="text-center brown-color mb-0">Thoát</h5>
              </span>
            ) : (
              ""
            )}
            <span className="brown-border bg-gold-wood rounded wood-btn p-1 mb-2">
              <h5 className="text-center brown-color mb-0">Chia sẻ</h5>
            </span>
            <span
              className="brown-border bg-gold-wood rounded wood-btn p-1"
              onClick={() => {
                setShowMenu(false);
              }}
            >
              <h5 className="text-center brown-color mb-0">Đóng</h5>
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}

export default MenuModal;

function NoSOFT({ roomData }) {
  const firebaseApp = useFirebaseApp();
  const { state } = React.useContext(AppContext);

  const [row, setRow] = React.useState("");
  const [col, setCol] = React.useState("");
  const [err, setErr] = React.useState("");

  const onSubmit = () => {
    setErr("");

    let alphabet;
    let checkRow;

    if (roomData["game-play"] === "gomoku") {
      alphabet = [
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

      checkRow = alphabet.findIndex(
        (value) => value.toLowerCase() === row.toLowerCase()
      );

      if (parseInt(col) > 13 || parseInt(col) <= 0) {
        setErr("Hàng không tồn tại!");
        return;
      }
    } else {
      alphabet = [
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
      ];

      checkRow = alphabet.findIndex(
        (value) => value.toLowerCase() === row.toLowerCase()
      );

      if (parseInt(col) > 15 || parseInt(col) <= 0) {
        setErr("Hàng không tồn tại!");
        return;
      }
    }

    if (checkRow < 0) {
      console.log(roomData);
      console.log({
        status: true,
        gamePlay: roomData["game-play"],
        rowString: row.toUpperCase(),
        row: checkRow,
        col: parseInt(col),
      });
      setErr("Ký tự hàng không tồn tại!");
      return;
    }

    firebaseApp
      .firestore()
      .collection("rooms")
      .doc(state.user.room_id.value)
      .update({
        "game.no-soft": {
          status: true,
          gamePlay: roomData.type,
          rowString: row.toUpperCase(),
          row: checkRow,
          col: parseInt(col),
        },
      });
  };

  if (roomData.game["no-soft"].status) {
    return (
      <React.Fragment>
        <p className="text-white text-center mb-2">
          Đã loại bỏ ô{" "}
          {`${roomData.game["no-soft"].rowString}${roomData.game["no-soft"].col}`}
        </p>
        <span
          className="brown-border bg-gold-wood rounded wood-btn p-1"
          onClick={() => {
            firebaseApp
              .firestore()
              .collection("rooms")
              .doc(state.user.room_id.value)
              .update({
                "game.no-soft": {
                  status: false,
                  gamePlay: "",
                  rowString: "",
                  row: 0,
                  col: 0,
                },
              });
          }}
        >
          <h5 className="text-center brown-color mb-0">Tắt</h5>
        </span>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <p className="text-white text-center mb-2">
        Nhập tọa độ ô để loại bỏ ô đó khỏi cuộc chơi. (VD: A2 hoặc P10)
      </p>
      <input
        placeholder="Nhập hàng (ký tự)"
        className="input-carotv-2 mb-2"
        onChange={(e) => {
          setRow(e.target.value);
        }}
        value={row}
        maxLength="1"
      />
      <input
        placeholder="Nhập cột (số)"
        className="input-carotv-2 mb-2"
        onChange={(e) => {
          setCol(e.target.value);
        }}
        value={col}
        maxLength="2"
      />
      {err ? <p className="text-white text-center mb-2">{err}</p> : ""}
      <span
        className="brown-border bg-gold-wood rounded wood-btn p-1"
        onClick={() => {
          onSubmit();
        }}
      >
        <h5 className="text-center brown-color mb-0">Áp dụng</h5>
      </span>
    </React.Fragment>
  );
}
