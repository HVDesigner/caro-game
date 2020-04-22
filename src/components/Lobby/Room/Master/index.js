import React from "react";
import UserSVG from "./../../../../assets/Dashboard/user.svg";
import AppContext from "./../../../../context/";

function MasterInRoom({ masterUser }) {
  const { firebase } = React.useContext(AppContext);

  const [name, setName] = React.useState("");
  const [elo, setElo] = React.useState(0);
  const [imageUrl, setImageUrl] = React.useState("");

  React.useEffect(() => {
    if (masterUser) {
      firebase()
        .database.ref(`users/${masterUser}`)
        .once("value")
        .then((snapshot) => {
          if (snapshot.val()) {
            setName(snapshot.val().name.value);
            setElo(snapshot.val().elo);
            setImageUrl(snapshot.val().image_url);
          }
        });
    }
  });

  return (
    <div className="d-flex align-items-center">
      <img
        src={imageUrl ? imageUrl : UserSVG}
        alt="user-playing"
        className="player-inroom-img mr-2"
      />
      <div className="d-flex flex-column text-white">
        <span>{name}</span>
        <span>Elo: {elo}</span>
      </div>
    </div>
  );
}

export default MasterInRoom;
