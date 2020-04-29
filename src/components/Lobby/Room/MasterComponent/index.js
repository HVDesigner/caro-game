import React from "react";
import UserSVG from "./../../../../assets/Dashboard/user.svg";
import AppContext from "./../../../../context/";
import { FirebaseContext } from "./../../../../Firebase/";

function MasterInRoom({ masterUser }) {
  const { state } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);

  const [name, setName] = React.useState("");
  const [elo, setElo] = React.useState(0);
  const [imageUrl, setImageUrl] = React.useState("");

  React.useEffect(() => {
    if (masterUser) {
      if (masterUser === state.userInfo.id) {
        setName(state.userInfo.name);
        setElo("1000");
        setImageUrl(state.userInfo.image_url);
      } else {
        firebase
          .database()
          .ref(`users/${masterUser}`)
          .once("value")
          .then((snapshot) => {
            if (snapshot.val()) {
              setName(snapshot.val().name.value);
              setElo(snapshot.val().elo);
              setImageUrl(snapshot.val().image_url);
            }
          });
      }
    }
  }, [
    masterUser,
    state.userInfo.id,
    state.userInfo.name,
    state.userInfo.image_url,
    firebase,
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
