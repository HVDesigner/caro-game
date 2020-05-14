import React from "react";
import "./PlayNow.css";
import { Spinner } from "react-bootstrap";
import { useFirebaseApp } from "reactfire";
import firebase from "firebase/app";

// Contexts
import AppContext from "./../../context/";

// Components
import CheckButton from "./../CheckButton/";

// SVGs
import Exit from "./../../assets/Exit.svg";
import CancelSVG from "./../../assets/cancel.svg";
import FindSVG from "./../../assets/find_enemy.svg";
import UserSVG from "./../../assets/Dashboard/user.svg";
import DefaultSVG from "./../../assets/default-btn.svg";

function PlayNow() {
  const { changeRoute, state } = React.useContext(AppContext);
  const firebaseApp = useFirebaseApp();

  // true gomoku
  // false block-head
  const [gamePlay, setGamePlay] = React.useState(true);

  // true 6-win
  // false 6-no-win
  const [rule, setRule] = React.useState(true);

  // true matching
  // false no-matching
  const [matchingByElo, setMatchingByElo] = React.useState(true);

  const [tenSecond, setTenSecond] = React.useState({ status: false, type: 10 });

  const [twentySecond, setTwentySecond] = React.useState({
    status: false,
    type: 20,
  });

  const [thirtySecond, setThirtySecond] = React.useState({
    status: true,
    type: 30,
  });

  React.useEffect(() => {
    setMatchingByElo(state.user.setting.matchingByElo);
  }, [state.user.setting.matchingByElo]);

  const timeInTurn = (id, value) => {
    if (id === 1) {
      setTenSecond({ status: value, type: 10 });
      setTwentySecond({ status: false, type: 20 });
      setThirtySecond({ status: false, type: 30 });
    } else if (id === 2) {
      setTenSecond({ status: false, type: 10 });
      setTwentySecond({ status: value, type: 20 });
      setThirtySecond({ status: false, type: 30 });
    } else {
      setTenSecond({ status: false, type: 10 });
      setTwentySecond({ status: false, type: 20 });
      setThirtySecond({ status: value, type: 30 });
    }
  };

  const filterElo = (elo) => {
    if (0 <= elo && elo < 1150) {
      return "nhap-mon";
    } else if (1150 <= elo && elo < 1300) {
      return "tap-su";
    } else if (1300 <= elo && elo < 1450) {
      return "tan-thu";
    } else if (1450 <= elo && elo < 1600) {
      return "ky-thu";
    } else if (1600 <= elo && elo < 1750) {
      return "cao-thu";
    } else if (1750 <= elo && elo < 1900) {
      return "sieu-cao-thu";
    } else if (1900 <= elo && elo < 2050) {
      return "kien-tuong";
    } else if (2050 <= elo && elo < 2200) {
      return "dai-kien-tuong";
    } else if (2200 <= elo && elo < 2350) {
      return "ky-tien";
    } else if (2350 <= elo && elo < 2500) {
      return "ky-thanh";
    } else {
      return "nhat-dai-ton-su";
    }
  };

  const FindPlayer = () => {
    const data = {
      elo_level: filterElo(state.user.elo[gamePlay ? "gomoku" : "block-head"]),
      room_type: gamePlay ? "gomoku" : "block-head",
      rule: rule ? "6-win" : "6-no-win",
      matching_by_elo: matchingByElo,
      time: [tenSecond, twentySecond, thirtySecond].filter((m) => m.status)[0]
        .type,
      createAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: state.user.uid,
    };

    const finalData = {};
    finalData[`${state.user.uid}`] = data;

    const queueDoc = firebaseApp
      .firestore()
      .collection("quick-play-queue")
      .doc("user-list");
    const batch = firebaseApp.firestore().batch();
    batch.update(queueDoc, finalData);
    batch.update(
      firebaseApp.firestore().collection("users").doc(state.user.uid),
      {
        on_queue: true,
      }
    );

    batch.commit();
  };

  const cancelFindPlay = () => {
    const batch = firebaseApp.firestore().batch();

    let updateQueue = {};
    updateQueue[`${state.user.uid}`] = firebase.firestore.FieldValue.delete();

    batch.update(
      firebaseApp.firestore().collection("quick-play-queue").doc("user-list"),
      updateQueue
    );
    batch.update(
      firebaseApp.firestore().collection("users").doc(state.user.uid),
      {
        on_queue: false,
      }
    );

    batch.commit();
  };

  const updateMatchingByElo = (status) => {
    const batch = firebaseApp.firestore().batch();

    batch.update(
      firebaseApp.firestore().collection("users").doc(state.user.uid),
      {
        "setting.matchingByElo": status,
      }
    );

    batch.commit();
  };

  return (
    <div className="playow-body d-flex flex-column">
      <div className="setting-game position-relative">
        {state.user.on_queue ? (
          <div className="cover-all-setup position-absolute h-100"></div>
        ) : (
          ""
        )}
        <h4 className="text-white text-center mt-2">Chọn luật</h4>
        <div className="d-flex">
          <div className="pl-3 flex-fill">
            <CheckButton
              text={"Gomoku"}
              value={gamePlay}
              func={() => {
                setGamePlay(true);
              }}
            />
            <CheckButton
              text={"Chặn 2 đầu"}
              value={!gamePlay}
              func={() => {
                setGamePlay(false);
              }}
            />
          </div>

          <div className="flex-fill">
            <CheckButton
              text={"6 thắng"}
              value={rule}
              func={() => {
                setRule(true);
              }}
            />
            <CheckButton
              text={"6 không thắng"}
              value={!rule}
              func={() => {
                setRule(false);
              }}
            />
          </div>
        </div>

        <h4 className="text-white text-center mt-2">Chọn thời gian</h4>
        <div className="d-flex mt-2">
          <div className="pl-3 d-flex" style={{ width: "100%" }}>
            <div className="flex-fill">
              <CheckButton
                text={"10s"}
                value={tenSecond.status}
                id={1}
                func={timeInTurn}
              />
            </div>

            <div className="flex-fill">
              <CheckButton
                text={"20s"}
                value={twentySecond.status}
                id={2}
                func={timeInTurn}
              />
            </div>

            <div className="flex-fill">
              <CheckButton
                text={"30s"}
                value={thirtySecond.status}
                id={3}
                func={timeInTurn}
              />
            </div>
          </div>
        </div>

        <h4 className="text-white text-center mt-2">Chọn đối thủ</h4>
        <div className="d-flex mt-2">
          <div className="pl-3 d-flex flex-fill">
            <div className="flex-fill">
              <CheckButton
                text={"Đối thủ bất kỳ"}
                value={!matchingByElo}
                func={() => {
                  setMatchingByElo(false);
                  updateMatchingByElo(false);
                }}
              />
            </div>

            <div className="flex-fill">
              <CheckButton
                text={"Đối thủ cùng trình độ"}
                value={matchingByElo}
                func={() => {
                  setMatchingByElo(true);
                  updateMatchingByElo(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="play-now-btn mt-2">
        {state.user.on_queue ? (
          ""
        ) : (
          <img
            src={DefaultSVG}
            alt="exit"
            onClick={() => {
              timeInTurn(3, true);
              setRule(true);
            }}
            className="wood-btn"
          />
        )}
      </div>

      <div className="d-flex align-items-center mt-3 mb-3">
        <div style={{ width: "50%" }} className="player p-2 ml-2 mr-1 shadow">
          <img
            src={state.user.image_url ? state.user.image_url : UserSVG}
            alt="proflie_image"
            style={{ width: "15vw" }}
            className={`${
              state.user.image_url ? "rounded-circle border" : ""
            } m-auto d-block`}
          />
          <p className="text-center text-white mb-0">
            {state.user.name.value ? state.user.name.value : "..."}
          </p>
          <p className="text-center text-white mb-0">
            Elo: {state.user.elo[gamePlay ? "gomoku" : "block-head"]}
          </p>
        </div>

        <div
          style={{ width: "50%", height: "100%" }}
          className="player p-2 ml-1 mr-2 shadow"
        >
          <img
            src={UserSVG}
            alt="user_svg"
            style={{ width: "15vw" }}
            className="m-auto d-block"
          />
          <p className="text-center text-white mb-0">
            {state.user.on_queue ? "Đang tìm đối thủ..." : "..."}
          </p>
          {state.user.on_queue ? (
            <div className="text-center text-white mb-0">
              <Spinner animation="border" role="status" size="sm">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <p className="text-center text-white mb-0">...</p>
          )}
        </div>
      </div>

      <div className="play-now-btn mb-2 d-flex fixed-bottom">
        {state.user.on_queue ? (
          <img
            src={CancelSVG}
            alt="exit"
            onClick={() => {
              cancelFindPlay();
            }}
            className="wood-btn"
          />
        ) : (
          <React.Fragment>
            <img
              src={FindSVG}
              alt="exit"
              onClick={() => {
                FindPlayer();
              }}
              className="wood-btn"
            />
            <img
              src={Exit}
              alt="exit"
              onClick={() => {
                changeRoute("Dashboard");
              }}
              className="wood-btn"
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
export default PlayNow;
