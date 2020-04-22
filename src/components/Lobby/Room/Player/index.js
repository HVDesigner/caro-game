import React from "react";
import UserSVG from "./../../../../assets/Dashboard/user.svg";
import AppContext from "./../../../../context/";

function PlayerInRoom({ playerUser }) {
  const { firebase } = React.useContext(AppContext);

  const [name, setName] = React.useState("");
  const [elo, setElo] = React.useState(0);
  const [imageUrl, setImageUrl] = React.useState("");

  React.useEffect(() => {
    if (playerUser) {
      firebase()
        .database.ref("users/" + playerUser)
        .once("value", function (snapshot) {
          console.log(snapshot.val());
        });
    }
  });

  return (
    <div className="d-flex justify-content-end align-items-center">
      <div className="d-flex flex-column text-white text-right">
        <span>{name}</span>
        <span>Elo: {elo}</span>
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
