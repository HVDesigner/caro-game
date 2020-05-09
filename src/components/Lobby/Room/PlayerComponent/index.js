import React from "react";
import UserSVG from "./../../../../assets/Dashboard/user.svg";
import AppContext from "./../../../../context/";
import { FirebaseContext } from "./../../../../Firebase/";

function PlayerInRoom({ roomData }) {
  const { state } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);

  const [name, setName] = React.useState("");
  const [elo, setElo] = React.useState(0);
  const [imageUrl, setImageUrl] = React.useState("");

  React.useEffect(() => {
    if (roomData.participants.player.id === state.user.uid) {
      setName(state.user.name.value);
      setElo(state.user.elo);
      setImageUrl(state.user.image_url);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(roomData.participants.player.id)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setName(doc.data().name.value);
            setElo(doc.data().elo);
            setImageUrl(doc.data().image_url);
          } else {
            console.log("No such document!");
          }
        });
    }
  }, [
    firebase,
    roomData.participants.player.id,
    state.user.elo,
    state.user.image_url,
    state.user.name.value,
    state.user.uid,
  ]);

  return (
    <div className="d-flex justify-content-end align-items-center">
      <div className="d-flex flex-column text-white text-right">
        {name && elo ? (
          <React.Fragment>
            <span>{name}</span>
            <span>Elo: {elo[roomData["game-play"]]}</span>
          </React.Fragment>
        ) : (
          <span>Trống</span>
        )}
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
