import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCoins, faEye } from "@fortawesome/free-solid-svg-icons";
import "./index.css";

import MasterComponent from "./Master/";
import PlayerComponent from "./Player/";

import LockSVG from "./../../../assets/Rooms/lock.svg";
import MoreSVG from "./../../../assets/Rooms/more.svg";
import LeftSVG from "./../../../assets/chevron-left.svg";

import { FirebaseContext } from "./../../../Firebase/";
import AppContext from "./../../../context/";

function Room({ roomId, data, type }) {
  const [firebase] = React.useState(React.useContext(FirebaseContext));
  const { changeRoute } = React.useContext(AppContext);

  const [masterUser, setMasterUser] = React.useState("");
  const [playerUser, setPlayerUser] = React.useState("");

  const [loginInProcess, setLoginInProcess] = React.useState(false);
  const [pass, setPass] = React.useState("");
  const [passError, setPassError] = React.useState({ status: false, text: "" });

  React.useEffect(() => {
    if (data.participants) {
      Object.keys(data.participants).forEach((element) => {
        if (data.participants[element].type === "master") {
          setMasterUser(element);
        } else if (data.participants[element].type === "player") {
          setPlayerUser(element);
        }
      });
    }
  }, [data]);

  const onPasswordSubmit = (e) => {
    e.preventDefault();
    if (pass) {
      setLoginInProcess(true);
      setPassError({ status: false, text: "" });
      const loginRoom = firebase.functions().httpsCallable("loginRoom");

      loginRoom({ roomId, pass, type }).then(function (result) {
        console.log(result);
        if (result.data.value) {
          // console.log(result);
          changeRoute("room", parseInt(result.data.id), result.data.type);
        } else {
          setPassError({ status: true, text: result.data.text });
        }
        setLoginInProcess(false);
      });
    } else {
      setPassError({ status: true, text: "Chưa điền mật khẩu." });
    }
  };

  const [showFooter, setShowFooter] = React.useState(false);

  return (
    <div className="room-item d-flex flex-column shadow mt-2">
      <div className="d-flex room-item-head text-white bg-success">
        <span className="text-stroke-carotv">
          <p className="mb-0 ml-2 mr-2">id: {roomId}</p>
        </span>
        <span className="text-stroke-carotv d-flex align-items-center">
          <p className="mb-0 ml-2 mr-2">
            {data.rule === "6-win" ? "6 Quân Thắng" : "Chỉ 5 Quân"}
          </p>
        </span>
        {data.type === "room" ? (
          data.bet ? (
            <span className="text-stroke-carotv d-flex align-items-center">
              <FontAwesomeIcon icon={faCoins} className="text-warning ml-2" />
              <p className="mb-0 ml-2 mr-2">{data.bet}</p>
            </span>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        <span className="text-stroke-carotv d-flex align-items-center">
          <FontAwesomeIcon icon={faClock} className="text-warning ml-2" />
          <p className="mb-0 ml-2 mr-2">{data.time}</p>
        </span>
      </div>
      <div className="d-flex room-item-body p-2">
        <MasterComponent masterUser={masterUser} />
        {data && data.password.status ? (
          <div className="lock-room">
            <img
              src={LockSVG}
              alt="lock"
              className="wood-btn"
              onClick={() => {
                setShowFooter(!showFooter);
              }}
            />
          </div>
        ) : (
          <div className="lock-room">
            <img
              src={MoreSVG}
              alt="moreSVG"
              className="wood-btn"
              onClick={() => {
                console.log({ roomId: parseInt(roomId), type });
                changeRoute("room", parseInt(roomId), type);
              }}
            />
          </div>
        )}
        <PlayerComponent playerUser={playerUser} />
      </div>
      <div className="d-flex room-item-footer pl-2 pr-2 text-white bg-success">
        <span className="text-center mr-auto text-stroke-carotv">
          {data.title}
        </span>
        <span className="text-center text-stroke-carotv">
          <FontAwesomeIcon icon={faEye} className="text-white mr-2" />
          20
        </span>
      </div>

      {showFooter ? (
        <div>
          {loginInProcess ? (
            <p className="text-warning mb-1 text-center">Đang đăng nhập...</p>
          ) : (
            <div
              className={`room-item-footer pt-2 pl-2 pr-2 ${
                passError.status ? "" : "pb-2"
              } d-flex`}
            >
              <span className="text-white mr-2">Mật khẩu:</span>
              <form
                onSubmit={onPasswordSubmit}
                className="form-carotv d-flex flex-fill"
              >
                <input
                  type="password"
                  className="input-carotv text-white flex-fill"
                  placeholder="Nhập mật khẩu..."
                  value={pass}
                  onChange={(e) => {
                    setPass(e.target.value);
                  }}
                />
              </form>
              <img
                src={LeftSVG}
                alt="back-btn"
                className="ml-2"
                style={{ height: "1.5em", transform: "rotate(180deg)" }}
                onClick={onPasswordSubmit}
              ></img>
            </div>
          )}
          {passError.status ? (
            <p className="text-warning mb-1 text-center">{passError.text}</p>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Room;
