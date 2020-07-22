import React from "react";
import "./index.css";
import { parseInt } from "lodash";
import { useFirestoreDocData, useFirestore, useFirebaseApp } from "reactfire";

// SVG
import UserSVG from "./../../assets/Dashboard/user.svg";

// Contexts
import AppContext from "./../../context/";

// Locales
import { LANGUAGE_BY_LOCALE } from "./../../locale-constant";

// Functions
import { LikeFunc, UnLikeFunc, filterElo } from "./../../functions/";

// Component
import Medal from "./../Medal/";

function InfoModal() {
  const firebaseApp = useFirebaseApp();
  const { state, toggleInfoModal } = React.useContext(AppContext);

  // true Gomoku
  // false Block-head
  const [gameType, setGameType] = React.useState(true);

  const userRef = useFirestore()
    .collection("users")
    .doc(state.modal["user-info"].uid.toString());

  const user = useFirestoreDocData(userRef);

  const winPercent = () => {
    const { lost, win, tie } = user.game;

    const winTotal = parseInt(win.gomoku) + parseInt(win["block-head"]);
    const all =
      winTotal +
      parseInt(lost.gomoku) +
      parseInt(lost["block-head"]) +
      parseInt(tie.gomoku) +
      parseInt(tie["block-head"]);

    if (winTotal === 0 && all === 0) {
      return 100;
    }

    return Math.round((winTotal / all) * 100);
  };

  return (
    <div
      className="d-flex position-absolute w-100vw h-100vh justify-content-center align-items-center"
      style={{ zIndex: "9999", backgroundColor: "#48484891" }}
    >
      <div
        className="brown-border shadow bg-brown-wood p-2 rounded d-flex flex-column"
        style={{
          width: "80vw",
          maxWidth: "80vw",
          maxHeight: "80vh",
          height: "80vh",
        }}
      >
        <h3 className="text-stroke-carotv text-warning text-center">
          Thông tin
        </h3>

        <div className="d-flex flex-column justify-content-center align-items-center w-100">
          <div className="d-flex w-100 justify-content-center">
            <div className="mr-3 info-modal-medal d-flex flex-column align-items-center">
              <Medal elo={user.elo.gomoku} />
              <p className="m-0 text-stroke-carotv text-white">
                {filterElo(user.elo.gomoku)}
              </p>
              <p className="m-0 text-stroke-carotv text-white">(Gomoku)</p>
            </div>
            <img
              src={user.image_url !== "image" ? user.image_url : UserSVG}
              alt="user"
              style={{ maxWidth: "60px", maxHeight: "60px" }}
              className={`${
                user.image_url !== "image" ? "rounded-circle brown-border" : ""
              }`}
            />
            <div className="ml-3 info-modal-medal d-flex flex-column align-items-center">
              <Medal elo={user.elo["block-head"]} />
              <p className="m-0 text-stroke-carotv text-white">
                {filterElo(user.elo["block-head"])}
              </p>
              <p className="m-0 text-stroke-carotv text-white">(Chặn 2 đầu)</p>
            </div>
          </div>
          <p className="text-stroke-carotv text-white m-0">{user.name.value}</p>
          <p className="text-stroke-carotv text-white">
            {user.locale ? LANGUAGE_BY_LOCALE[user.locale] : "..."}
          </p>
        </div>

        <table className="table table-bordered m-0 table-info-modal mb-2">
          <tbody>
            <tr>
              <td
                className={`text-stroke-carotv text-center text-warning ${
                  gameType ? "bg-success" : ""
                }`}
                onClick={() => {
                  setGameType(true);
                }}
              >
                Gomoku
              </td>
              <td
                className={`text-stroke-carotv text-center text-warning ${
                  gameType ? "" : "bg-success"
                }`}
                onClick={() => {
                  setGameType(false);
                }}
              >
                Chặn 2 đầu
              </td>
            </tr>
          </tbody>
        </table>

        <div className="overflow-auto h-100 mb-2" style={{ maxHeight: "100%" }}>
          <table className="table table-bordered h-100 m-0 table-info-modal">
            <tbody>
              <tr>
                <td className="text-stroke-carotv text-warning">Elo</td>
                <td className="text-stroke-carotv text-white">
                  {gameType ? user.elo.gomoku : user.elo["block-head"]}
                </td>
              </tr>

              <tr>
                <td className="text-stroke-carotv text-warning">Cấp độ</td>
                <td className="text-stroke-carotv text-white">
                  {filterElo(
                    gameType ? user.elo.gomoku : user.elo["block-head"]
                  )}
                </td>
              </tr>

              <tr>
                <td className="text-stroke-carotv text-warning">Thắng</td>
                <td className="text-stroke-carotv text-white">
                  {gameType
                    ? user.game.win.gomoku
                    : user.game.win["block-head"]}
                </td>
              </tr>

              <tr>
                <td className="text-stroke-carotv text-warning">Thua</td>
                <td className="text-stroke-carotv text-white">
                  {gameType
                    ? user.game.lost.gomoku
                    : user.game.lost["block-head"]}
                </td>
              </tr>

              <tr>
                <td className="text-stroke-carotv text-warning">Hòa</td>
                <td className="text-stroke-carotv text-white">
                  {gameType
                    ? user.game.tie.gomoku
                    : user.game.tie["block-head"]}
                </td>
              </tr>

              <tr>
                <td className="text-stroke-carotv text-warning">Tỉ lệ thắng</td>
                <td className="text-stroke-carotv text-white">
                  {winPercent()}%
                </td>
              </tr>
              <tr>
                <td className="text-stroke-carotv text-warning">Yêu thích</td>
                <td className="text-stroke-carotv text-white">
                  {user.like.length}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="d-flex w-100">
          {user.like.findIndex((value) => value === state.user.uid) < 0 ? (
            <div
              className="flex-fill text-center brown-border shadow rounded bg-gold-wood wood-btn"
              style={{ backgroundSize: "cover" }}
              onClick={() => {
                LikeFunc(
                  {
                    ownId: state.user.uid,
                    uid: state.modal["user-info"].uid.toString(),
                  },
                  firebaseApp
                );
              }}
            >
              Yêu thích
            </div>
          ) : (
            <div
              className="flex-fill text-center brown-border shadow rounded bg-gold-wood wood-btn"
              style={{ backgroundSize: "cover" }}
              onClick={() => {
                UnLikeFunc(
                  {
                    ownId: state.user.uid,
                    uid: state.modal["user-info"].uid.toString(),
                  },
                  firebaseApp
                );
              }}
            >
              Bỏ yêu thích
            </div>
          )}
          <div
            className="flex-fill text-center brown-border shadow rounded ml-1 bg-gold-wood wood-btn"
            style={{ backgroundSize: "cover" }}
            onClick={() => {
              toggleInfoModal(false, "");
            }}
          >
            Đóng
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
