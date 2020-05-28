import React from "react";

// Components
import MasterComponent from "./../MasterComponent/";
import PlayerComponent from "./../PlayerComponent/";

// SVG
import LockSVG from "./../../../../assets/Rooms/lock.svg";
import MoreSVG from "./../../../../assets/Rooms/more.svg";
import UserSVG from "./../../../../assets/Dashboard/user.svg";

function BodyComponent({
  roomData,
  setShowFooterPassword,
  showFooterPassword,
  showFooterNormal,
  setShowFooterNormal,
}) {
  return (
    <div className="d-flex room-item-body p-2">
      {roomData.participants.master ? (
        <MasterComponent roomData={roomData} />
      ) : (
        <div className="d-flex align-items-center">
          <img
            src={UserSVG}
            alt="user-playing"
            className="player-inroom-img mr-2"
          />
          <div className="d-flex flex-column text-white">
            <span>Trống</span>
          </div>
        </div>
      )}
      {roomData.password.status ? (
        <div className="lock-room">
          <img
            src={LockSVG}
            alt="lock"
            className="wood-btn"
            onClick={() => {
              setShowFooterPassword(!showFooterPassword);
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
              setShowFooterNormal(!showFooterNormal);
              // if (
              //   parseInt(roomData.bet) <= parseInt(state.user.coin) &&
              //   roomData.type === "room"
              // ) {
              //   onJoinRoomSubmit();
              // } else if (roomData.type === "quick-play") {
              //   onJoinRoomSubmit();
              // } else {
              //   dispatch({
              //     type: TOGGLE_DIALOG,
              //     payload: {
              //       status: true,
              //       message: "Bạn không đủ xu!",
              //     },
              //   });
              // }
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
