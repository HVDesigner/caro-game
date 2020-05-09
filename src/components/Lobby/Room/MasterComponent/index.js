import React from "react";
import UserSVG from "./../../../../assets/Dashboard/user.svg";
import AppContext from "./../../../../context/";
import { FirebaseContext } from "./../../../../Firebase/";

function MasterInRoom({ roomData }) {
  const { state } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);

  const [name, setName] = React.useState("");
  const [elo, setElo] = React.useState(0);
  const [imageUrl, setImageUrl] = React.useState("");

  React.useEffect(() => {
    if (roomData.participants.master.id === state.user.uid) {
      setName(state.user.name.value);
      setElo(state.user.elo[roomData["game-play"]]);
      setImageUrl(state.user.image_url);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(roomData.participants.master.id)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            setName(doc.data().name.value);
            setElo(doc.data().elo[roomData["game-play"]]);
            setImageUrl(doc.data().image_url);
          } else {
            console.log("No such document!");
          }
        });
    }
  }, [
    firebase,
    roomData.participants.master.id,
    roomData,
    state.user.uid,
    state.user.name.value,
    state.user.elo,
    state.user.image_url,
  ]);

  return (
    <div className="d-flex align-items-center">
      <img
        src={imageUrl ? imageUrl : UserSVG}
        alt="user-playing"
        className={`player-inroom-img mr-2 ${
          imageUrl ? "rounded-circle circle-avartar" : ""
        }`}
      />
      <div className="d-flex flex-column text-white">
        <span>{name}</span>
        <span>Elo: {elo}</span>
      </div>
    </div>
  );
}

export default MasterInRoom;
