import React from "react";
import "./PlayNow.css";
import AppContext from "./../../context/";
import Exit from "./../../assets/Exit.svg";
import FindSVG from "./../../assets/find_enemy.svg";
import CheckButton from "./../CheckButton/";
import ProfileJPG from "./../../assets/profile_pic.jpg";
import UserSVG from "./../../assets/Dashboard/user.svg";
import DefaultSVG from "./../../assets/default-btn.svg";

function PlayNow() {
  const GlobalState = React.useContext(AppContext);
  const { changeRoute } = GlobalState;

  const [gomoku, setGomoku] = React.useState({ status: true, type: "Gomoku" });
  const [twoHeadBlock, setTwoHeadBlock] = React.useState({
    status: false,
    type: "Block Two Head",
  });

  const [sixWin, setSixWin] = React.useState({ status: true, type: "Six Win" });
  const [sixNotWin, setSixNotWin] = React.useState({
    status: false,
    type: "Six Not Win",
  });

  const [enemyFree, setEnemyFree] = React.useState({
    status: true,
    type: "Free Enemy",
  });
  const [enemySimilar, setEnemySimilar] = React.useState({
    status: false,
    type: "Similar Enemy",
  });

  const [tenSecond, setTenSecond] = React.useState({ status: false, type: 10 });
  const [twentySecond, setTwentySecond] = React.useState({
    status: false,
    type: 20,
  });
  const [thirtySecond, setThirtySecond] = React.useState({
    status: true,
    type: 30,
  });

  const GomokuOrTowHead = (id, value) => {
    if (id === 1) {
      setGomoku({ status: value, type: "Gomoku" });
      setTwoHeadBlock({ status: false, type: "Block Two Head" });
    } else {
      setGomoku({ status: false, type: "Gomoku" });
      setTwoHeadBlock({ status: value, type: "Block Two Head" });
    }
  };

  const sixOrNotFunc = (id, value) => {
    if (id === 1) {
      setSixWin({ status: value, type: "Six Win" });
      setSixNotWin({ status: false, type: "Six Not Win" });
    } else {
      setSixWin({ status: false, type: "Six Win" });
      setSixNotWin({ status: value, type: "Six Not Win" });
    }
  };

  const findEnemy = (id, value) => {
    if (id === 1) {
      setEnemyFree({ status: value, type: "Free Enemy" });
      setEnemySimilar({ status: false, type: "Similar Enemy" });
    } else {
      setEnemyFree({ status: false, type: "Free Enemy" });
      setEnemySimilar({ status: value, type: "Similar Enemy" });
    }
  };

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

  return (
    <div className="playow-body d-flex flex-column">
      <div className="setting-game">
        <h4 className="text-white text-center mt-2">Chọn luật</h4>
        <div className="d-flex">
          <div className="pl-3 flex-fill">
            <CheckButton
              text={"Gomoku"}
              value={gomoku.status}
              func={GomokuOrTowHead}
              id={1}
            />
            <CheckButton
              text={"Chặn 2 đầu"}
              value={twoHeadBlock.status}
              func={GomokuOrTowHead}
              id={2}
            />
          </div>

          <div className="flex-fill">
            <CheckButton
              text={"6 thắng"}
              value={sixWin.status}
              id={1}
              func={sixOrNotFunc}
            />
            <CheckButton
              text={"6 không thắng"}
              value={sixNotWin.status}
              id={2}
              func={sixOrNotFunc}
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
                value={enemyFree.status}
                id={1}
                func={findEnemy}
              />
            </div>

            <div className="flex-fill">
              <CheckButton
                text={"Đối thủ cùng trình độ"}
                value={enemySimilar.status}
                id={2}
                func={findEnemy}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="play-now-btn mt-2">
        <img
          src={DefaultSVG}
          alt="exit"
          onClick={() => {
            timeInTurn(3, true);
            sixOrNotFunc(1, true);
          }}
          className="wood-btn"
        />
      </div>

      <div className="d-flex align-items-center mt-3 mb-3">
        <div style={{ width: "50%" }} className="player p-2 ml-2 mr-1 shadow">
          <img
            src={ProfileJPG}
            alt="proflie_image"
            style={{ width: "15vw" }}
            className="rounded-circle m-auto d-block border"
          />
          <p className="text-center text-white mb-0">Việt</p>
          <p className="text-center text-white mb-0">Elo: 1000</p>
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
          <p className="text-center text-white mb-0">...</p>
          <p className="text-center text-white mb-0">...</p>
        </div>
      </div>

      <div className="play-now-btn mb-2 d-flex fixed-bottom">
        <img
          src={FindSVG}
          alt="exit"
          onClick={() => {
            console.log({
              gomoku,
              twoHeadBlock,
              sixWin,
              sixNotWin,
              enemyFree,
              enemySimilar,
              tenSecond,
              twentySecond,
              thirtySecond,
            });
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
      </div>
    </div>
  );
}
export default PlayNow;
