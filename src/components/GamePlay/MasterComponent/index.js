import React from "react";
import { Badge } from "react-bootstrap";

// SVGs
import UserSVG from "./../../../assets/Dashboard/user.svg";

// Contexts
import AppContext from "./../../../context/";

import CounterConponent from "./../Counter/";

function MasterComponent({ data, firebase, time, gameData, roomInfo }) {
  const { state } = React.useContext(AppContext);
  const [imageUrl, setImageUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const [elo, setElo] = React.useState("");
  const [coin, setCoin] = React.useState("");

  React.useEffect(() => {
    function setUserData(image_url, name, elo, coin) {
      setImageUrl(image_url);
      setName(name);
      setElo(elo);
      setCoin(coin);
    }

    function doSnapShot(snapshot) {
      if (snapshot.val()) {
        setUserData(
          snapshot.val().image_url,
          snapshot.val().name.value,
          snapshot.val().elo,
          snapshot.val().coin
        );
      } else {
        setUserData("", "", "");
      }
    }

    if (data.id !== state.userInfo.id) {
      firebase.database().ref(`users/${data.id}`).on("value", doSnapShot);
    } else {
      setUserData(
        state.userInfo.image_url,
        state.userInfo.name,
        state.userInfo.elo,
        state.userInfo.coin
      );
    }

    return () => {
      if (data.id !== state.userInfo.id)
        return firebase
          .database()
          .ref(`users/${data.id}`)
          .off("value", doSnapShot);
    };
  }, [
    firebase,
    data.id,
    state.userInfo.id,
    state.userInfo.image_url,
    state.userInfo.name,
    state.userInfo.elo,
    state.userInfo.coin,
  ]);

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
          {roomInfo.type === "room" ? (
            <small className="text-white">
              <span className="text-warning mr-1">Xu:</span>
              {coin ? coin : "..."}
            </small>
          ) : (
            <small className="text-white">
              <span className="text-warning mr-1">ELO:</span>
              {elo ? elo : "..."}
            </small>
          )}
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
        <div
          style={{ width: "100%" }}
          className="d-flex justify-content-center align-items-center p-1"
        >
          <Badge pill variant="success" className="shadow">
            <p className="text-white roboto-font" style={{ fontSize: "12px" }}>
              Chủ phòng
            </p>
          </Badge>
          <Badge pill variant="success" className="shadow ml-1">
            <p className="text-white roboto-font" style={{ fontSize: "12px" }}>
              {roomInfo.participants.master.win
                ? roomInfo.participants.master.win
                : 0}
            </p>
          </Badge>
        </div>
      )}
    </div>
  );
}

export default MasterComponent;
