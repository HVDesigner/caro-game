import React from "react";
import { Badge } from "react-bootstrap";
// Contexts
import AppContext from "./../../../context/";
// import { FirebaseContext } from "./../../../Firebase/";
import UserSVG from "./../../../assets/Dashboard/user.svg";

import CounterConponent from "./../Counter/";

function MasterComponent({ data, firebase, time, gameData }) {
  const { state } = React.useContext(AppContext);
  const [imageUrl, setImageUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const [elo, setElo] = React.useState("");

  React.useEffect(() => {
    function setUserData(image_url, name, elo) {
      setImageUrl(image_url);
      setName(name);
      setElo(elo);
    }

    firebase
      .database()
      .ref(`users/${data.id}`)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setUserData(
            snapshot.val().image_url,
            snapshot.val().name.value,
            snapshot.val().elo
          );
        } else {
          setUserData("", "", "");
        }
      });
  }, [firebase, data.id]);

  return (
    <div className="d-flex flex-column pl-2">
      <div
        style={{ width: "100%" }}
        className="d-flex justify-content-center align-items-center"
      >
        <img
          src={imageUrl ? imageUrl : UserSVG}
          alt="user"
          className={imageUrl ? `rounded-circle` : ""}
          style={{ width: "40px", height: "40px" }}
        ></img>
        <div className="ml-2">
          <p className="text-white">{name ? name : "..."}</p>
          <small className="text-white">
            <span className="text-warning mr-1">ELO:</span>
            {elo ? elo : "..."}
          </small>
        </div>
      </div>
      {gameData.status.type === "playing" && gameData.turn.uid === data.id ? (
        <div className="d-flex">
          {gameData.turn.uid === state.userInfo.id ? (
            <div
              style={{ width: "100%" }}
              className="d-flex justify-content-center align-items-center p-1"
            >
              <Badge pill variant="success">
                <p
                  className="text-white roboto-font"
                  style={{ fontSize: "13px" }}
                >
                  Lượt bạn
                </p>
              </Badge>
            </div>
          ) : (
            ""
          )}
          <CounterConponent time={time} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default MasterComponent;
