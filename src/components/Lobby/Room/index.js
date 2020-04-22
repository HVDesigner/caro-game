import React from "react";
import "./index.css";

import MasterComponent from "./Master/";
import PlayerComponent from "./Player/";

import LockSVG from "./../../../assets/Rooms/lock.svg";
import MoreSVG from "./../../../assets/Rooms/more.svg";
import LeftSVG from "./../../../assets/chevron-left.svg";

function Room({ roomId, data }) {
  const [masterUser, setMasterUser] = React.useState("");
  const [playerUser, setPlayerUser] = React.useState("");

  React.useEffect(() => {
    Object.keys(data.participants).forEach((element) => {
      if (data.participants[element].type === "master") {
        setMasterUser(element);
      } else if (data.participants[element].type === "player") {
        setPlayerUser(element);
      }
    });
  });

  const [showFooter, setShowFooter] = React.useState(false);

  return (
    <div className="room-item d-flex flex-column shadow mt-2">
      <div className="d-flex room-item-head pl-2 text-white bg-success">
        <span>id: {roomId}</span>
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
      {showFooter ? (
        <div className="room-item-footer p-2 d-flex">
          <span className="text-white mr-2">Mật khẩu:</span>
          <input
            type="password"
            className="input-carotv text-white flex-fill"
            placeholder="Nhập mật khẩu..."
          />
          <img
            src={LeftSVG}
            alt="back-btn"
            className="ml-2"
            style={{ height: "1.5em", transform: "rotate(180deg)" }}
          ></img>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Room;
