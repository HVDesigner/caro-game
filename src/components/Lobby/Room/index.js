import React from "react";
import "./index.css";

import UserSVG from "./../../../assets/Dashboard/user.svg";
import LockSVG from "./../../../assets/Rooms/lock.svg";
import MoreSVG from "./../../../assets/Rooms/more.svg";
import LeftSVG from "./../../../assets/chevron-left.svg";

function Room({ roomId, roomsDetail }) {
  const [showFooter, setShowFooter] = React.useState(false);

  return (
    <div className="room-item d-flex flex-column shadow mt-2">
      <div className="d-flex room-item-head pl-2 text-white bg-success">
        <span>id: {roomId}</span>
      </div>
      <div className="d-flex room-item-body p-2">
        <div className="d-flex align-items-center">
          <img
            src={UserSVG}
            alt="user-playing"
            className="player-inroom-img mr-2"
          />
          <div className="d-flex flex-column text-white">
            <span>Viet</span>
            <span>Elo: 1K</span>
          </div>
        </div>
        {roomsDetail && roomsDetail[roomId].password.status ? (
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
        <div className="d-flex justify-content-end align-items-center">
          <div className="d-flex flex-column text-white text-right">
            <span>Viet</span>
            <span>Elo: 1K</span>
          </div>
          <img
            src={UserSVG}
            alt="user-playing"
            className="player-inroom-img ml-2"
          />
        </div>
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
