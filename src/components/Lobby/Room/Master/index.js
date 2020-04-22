import React from "react";
import UserSVG from "./../../../../assets/Dashboard/user.svg";

function MasterInRoom() {
  return (
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
  );
}

export default MasterInRoom;
