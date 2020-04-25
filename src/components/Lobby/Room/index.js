import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCoins, faRuler } from "@fortawesome/free-solid-svg-icons";
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

  const [pass, setPass] = React.useState("");

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
      const createRoom = firebase.functions().httpsCallable("loginRoom");

      createRoom({ roomId, pass, type }).then(function (result) {
        console.log(result);
        if (result.data.value) {
          changeRoute("room", { id: result.data.value });
        }
      });
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
          <FontAwesomeIcon icon={faRuler} className="text-warning ml-2" />
          <p className="mb-0 ml-2 mr-2">
            {data.rule === "6-win" ? "6 Quân Thắng" : "Chỉ 5 Quân"}
          </p>
        </span>
        {data.type === "room" ? (
          <span className="text-stroke-carotv d-flex align-items-center">
            <FontAwesomeIcon icon={faCoins} className="text-warning ml-2" />
            <p className="mb-0 ml-2 mr-2">{data.bet}</p>
          </span>
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
            <img src={MoreSVG} alt="lock" className="wood-btn" />
          </div>
        )}
        <PlayerComponent playerUser={playerUser} />
      </div>
      <div className="d-flex room-item-footer pl-2 pr-2 text-white bg-success">
        <span className="text-center d-block w-100 text-stroke-carotv">
          {data.title}
        </span>
      </div>

      {showFooter ? (
        <div className="room-item-footer p-2 d-flex">
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
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Room;
