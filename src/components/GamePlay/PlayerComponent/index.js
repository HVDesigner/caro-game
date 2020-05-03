import React from "react";
import { Badge } from "react-bootstrap";
import AppContext from "./../../../context/";

import CounterConponent from "./../Counter/";
import UserSVG from "./../../../assets/Dashboard/user.svg";

function PlayerComponent({ data, firebase, time, gameData, roomInfo }) {
  const { state } = React.useContext(AppContext);
  const [imageUrl, setImageUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const [elo, setElo] = React.useState(0);
  const [coin, setCoin] = React.useState(0);

  React.useEffect(() => {
    function setUserData(image_url, name, elo, coin) {
      setImageUrl(image_url);
      setName(name);
      setElo(elo);
      setCoin(coin);
    }

    function onSnapShot(snapshot) {
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

    if (data.id === state.userInfo.id) {
      setUserData(
        state.userInfo.image_url,
        state.userInfo.name,
        state.userInfo.elo,
        state.userInfo.coin
      );
    } else {
      firebase.database().ref(`users/${data.id}`).on("value", onSnapShot);
    }

    return () => {
      if (data.id !== state.userInfo.id)
        return firebase
          .database()
          .ref(`users/${data.id}`)
          .off("value", onSnapShot);
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
    <div className="d-flex flex-column pr-2">
      <div style={{ width: "100%" }} className="d-flex justify-content-center ">
        {roomInfo.type === "room" ? (
          <div className="mr-2">
            {name ? (
              <p className="text-white text-right">{name}</p>
            ) : (
              <p className="text-white text-right">Trống</p>
            )}
            {coin ? (
              <small className="text-white">
                <span className="text-warning mr-1">Xu:</span>
                {coin}
              </small>
            ) : (
              ""
            )}
          </div>
        ) : (
          <div className="mr-2">
            {name ? (
              <p className="text-white text-right">{name}</p>
            ) : (
              <p className="text-white text-right">Trống</p>
            )}
            {elo ? (
              <small className="text-white">
                <span className="text-warning mr-1">ELO:</span>
                {elo}
              </small>
            ) : (
              ""
            )}
          </div>
        )}
        <img
          src={imageUrl ? imageUrl : UserSVG}
          alt="user"
          className={imageUrl ? `rounded-circle align-items-center` : "mt-1"}
          style={{ width: "40px", height: "40px" }}
        ></img>
      </div>
      {gameData.status.type === "playing" && gameData.turn.uid === data.id ? (
        <div className="d-flex">
          <CounterConponent time={time} />
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
        </div>
      ) : (
        <div
          style={{ width: "100%" }}
          className="d-flex justify-content-center align-items-center p-1"
        >
          <Badge pill variant="success">
            <p className="text-white roboto-font" style={{ fontSize: "12px" }}>
              {roomInfo.participants.player.win
                ? roomInfo.participants.player.win
                : 0}
            </p>
          </Badge>
        </div>
      )}
    </div>
  );
}

export default PlayerComponent;
