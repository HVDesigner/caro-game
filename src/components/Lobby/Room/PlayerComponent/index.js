import React from "react";
import UserSVG from "./../../../../assets/Dashboard/user.svg";
import AppContext from "./../../../../context/";
import { FirebaseContext } from "./../../../../Firebase/";

function PlayerInRoom({ playerUser }) {
  const { state } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);

  const [name, setName] = React.useState("");
  const [elo, setElo] = React.useState(0);
  const [imageUrl, setImageUrl] = React.useState("");

  React.useEffect(() => {
    if (playerUser) {
      if (playerUser.id === state.userInfo.id) {
        setName(state.userInfo.name);
        setElo("1000");
        setImageUrl(state.userInfo.image_url);
      } else {
        firebase
          .database()
          .ref("users/" + playerUser.id)
          .once("value", function (snapshot) {
            if (snapshot.val()) {
              setName(snapshot.val().name.value);
              setElo(snapshot.val().elo);
              setImageUrl(snapshot.val().image_url);
            }
          });
      }
    }
  }, [
    playerUser,
    state.userInfo.id,
    state.userInfo.name,
    state.userInfo.image_url,
    firebase,
  ]);

  return (
    <div className="d-flex justify-content-end align-items-center">
      <div className="d-flex flex-column text-white text-right">
        <span>{name ? name : "..."}</span>
        <span>Elo: {elo ? elo : "..."}</span>
      </div>
      <img
        src={imageUrl ? imageUrl : UserSVG}
        alt="user-playing"
        className={`player-inroom-img ml-2 ${
          imageUrl ? "rounded-circle circle-avartar" : ""
        }`}
      />
    </div>
  );
}

export default PlayerInRoom;
