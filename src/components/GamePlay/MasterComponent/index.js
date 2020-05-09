import React from "react";
import { Badge } from "react-bootstrap";

// SVGs
import UserSVG from "./../../../assets/Dashboard/user.svg";

// Contexts
import AppContext from "./../../../context/";

// Components
import CounterConponent from "./../Counter/";

function MasterComponent({ roomData, firebase, ownType }) {
  const { state } = React.useContext(AppContext);
  const [thisUser, setThisUser] = React.useState({
    imageUrl: "",
    name: "",
    elo: 0,
    coin: 0,
  });

  React.useEffect(() => {
    if (roomData.participants.master.id === state.user.uid) {
      setThisUser({
        imageUrl: state.user.image_url,
        name: state.user.name.value,
        elo: state.user.elo[roomData.game_play],
        coin: state.user.coin,
      });
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(roomData.participants.master.id)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setThisUser({
              imageUrl: doc.data().image_url,
              name: doc.data().name.value,
              elo: doc.data().elo[roomData.game_play],
              coin: doc.data().coin,
            });
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        });

      var unsubscribe = firebase
        .firestore()
        .collection("users")
        .doc(roomData.participants.master.id)
        .onSnapshot(function (snapshot) {
          if (snapshot.exists) {
            setThisUser({
              imageUrl: snapshot.data().image_url,
              name: snapshot.data().name.value,
              elo: snapshot.data().elo[roomData.game_play],
              coin: snapshot.data().coin,
            });
          } else {
            console.log("No such document!");
          }
        });

      return () => unsubscribe();
    }
  }, [
    firebase,
    roomData.participants.master.id,
    roomData.game_play,
    state.user.coin,
    state.user.elo,
    state.user.image_url,
    state.user.name.value,
    state.user.uid,
  ]);

  return (
    <div className="d-flex flex-column pl-2">
      <div
        style={{ width: "100%" }}
        className="d-flex justify-content-center align-items-center"
      >
        <img
          src={thisUser.imageUrl ? thisUser.imageUrl : UserSVG}
          alt="user"
          className={thisUser.imageUrl ? `rounded-circle brown-border shadow` : ""}
          style={{ width: "40px", height: "40px" }}
        ></img>
        <div className="ml-2">
          <p className="text-white">{thisUser.name ? thisUser.name : "..."}</p>
          {roomData.type === "room" ? (
            <small className="text-white">
              <span className="text-warning mr-1">Xu:</span>
              {thisUser.coin ? thisUser.coin : "..."}
            </small>
          ) : (
            <small className="text-white">
              <span className="text-warning mr-1">ELO:</span>
              {thisUser.elo ? thisUser.elo : "..."}
            </small>
          )}
        </div>
      </div>

      {roomData.participants.master.status === "playing" &&
      roomData.game.turn.uid === roomData.participants.master.id ? (
        <div className="d-flex">
          {roomData.game.turn.uid === state.user.uid ? (
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
          <CounterConponent
            time={roomData.time}
            roomData={roomData}
            userType={"master"}
            ownType={ownType}
          />
        </div>
      ) : (
        <div
          style={{ width: "100%" }}
          className="d-flex justify-content-center align-items-center p-1"
        >
          {roomData.type === "room" ? (
            <Badge pill variant="success" className="shadow">
              <p
                className="text-white roboto-font"
                style={{ fontSize: "12px" }}
              >
                Chủ phòng
              </p>
            </Badge>
          ) : (
            ""
          )}
          <Badge pill variant="success" className="shadow ml-1">
            <p className="text-white roboto-font" style={{ fontSize: "12px" }}>
              {roomData.participants.master.win
                ? roomData.participants.master.win
                : 0}
            </p>
          </Badge>
        </div>
      )}
    </div>
  );
}

export default MasterComponent;
