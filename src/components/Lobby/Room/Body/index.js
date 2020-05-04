import React from "react";
import LockSVG from "./../../../../assets/Rooms/lock.svg";
import MoreSVG from "./../../../../assets/Rooms/more.svg";
import MasterComponent from "./../MasterComponent/";
import PlayerComponent from "./../PlayerComponent/";

import UserSVG from "./../../../../assets/Dashboard/user.svg";

function BodyComponent({ roomData, setShowFooter, showFooter }) {
  const onJoinRoomSubmit = () => {};

  return (
    <div className="d-flex room-item-body p-2">
      <MasterComponent roomData={roomData} />
      {roomData.password.status ? (
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
        <div className="unlock-room">
          <img
            src={MoreSVG}
            alt="moreSVG"
            className="wood-btn"
            onClick={() => {
              onJoinRoomSubmit();
            }}
          />
        </div>
      )}
      {roomData.participants.player ? (
        <PlayerComponent roomData={roomData} />
      ) : (
        <div className="d-flex justify-content-end align-items-center">
          <div className="d-flex flex-column text-white text-right">
            <span>Trống</span>
          </div>
          <img
            src={UserSVG}
            alt="user-playing"
            className="player-inroom-img ml-2"
          />
        </div>
      )}
    </div>
  );
}

export default BodyComponent;
