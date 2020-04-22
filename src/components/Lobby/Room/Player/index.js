import React from "react";
import UserSVG from "./../../../../assets/Dashboard/user.svg";
import AppContext from "./../../../../context/";

function PlayerInRoom({ playerUser }) {
  const { firebase } = React.useContext(AppContext);

  React.useEffect(() => {
    console.log(playerUser);
    firebase()
      .database.ref("users/" + playerUser)
      .once("value", function (snapshot) {
        console.log(snapshot.val());
      });
  }, [playerUser, firebase]);

  return (
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
  );
}

export default PlayerInRoom;
