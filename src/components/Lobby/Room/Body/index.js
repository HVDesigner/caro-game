import React from "react";
import LockSVG from "./../../../../assets/Rooms/lock.svg";
import MoreSVG from "./../../../../assets/Rooms/more.svg";
import MasterComponent from "./../MasterComponent/";
import PlayerComponent from "./../PlayerComponent/";

function BodyComponent({
  password,
  masterUser,
  playerUser,
  showFooter,
  setShowFooter,
}) {
  const onJoinRoomSubmit = () => {};

  return (
    <div className="d-flex room-item-body p-2">
      <MasterComponent masterUser={masterUser} />
      {password && password.status ? (
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
      <PlayerComponent playerUser={playerUser} />
    </div>
  );
}

export default BodyComponent;
