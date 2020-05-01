import React from "react";
import UserSVG from "./../../../../assets/Dashboard/user.svg";
// import AppContext from "./../../../../context/";
import { FirebaseContext } from "./../../../../Firebase/";

function MasterInRoom({ masterUser }) {
  // const { state } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);

  const [name, setName] = React.useState("");
  const [elo, setElo] = React.useState(0);
  const [imageUrl, setImageUrl] = React.useState("");

  React.useEffect(() => {
    firebase
      .database()
      .ref(`users/${masterUser.id}`)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setName(snapshot.val().name.value);
          setElo(snapshot.val().elo);
          setImageUrl(snapshot.val().image_url);
        }
      });
  }, [masterUser, firebase]);

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
