import React from "react";
import { Badge } from "react-bootstrap";
import { useFirebaseApp } from "reactfire";

import CounterConponent from "./../Counter/";
import AppContext from "./../../../context/";
import UserSVG from "./../../../assets/Dashboard/user.svg";

function PlayerComponent({ roomData, ownType }) {
  const firebaseApp = useFirebaseApp();
  const { state, toggleInfoModal } = React.useContext(AppContext);

  const [thisUser, setThisUser] = React.useState({
    imageUrl: "",
    name: "",
    elo: 0,
    coin: 0,
  });

  React.useEffect(() => {
    if (roomData.participants.player.id === state.user.uid) {
      setThisUser({
        imageUrl: state.user.image_url,
        name: state.user.name.value,
        elo: state.user.elo[roomData["game-play"]],
        coin: state.user.coin,
      });
    } else {
      firebaseApp
        .firestore()
        .collection("users")
        .doc(roomData.participants.player.id)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setThisUser({
              imageUrl: doc.data().image_url,
              name: doc.data().name.value,
              elo: doc.data().elo[roomData["game-play"]],
              coin: doc.data().coin,
            });
          } else {
            setThisUser({
              imageUrl: "",
              name: "",
              elo: 0,
              coin: 0,
            });
            console.log("No such document!");
          }
        });

      var unsubscribe = firebaseApp
        .firestore()
        .collection("users")
        .doc(roomData.participants.player.id)
        .onSnapshot(function (snapshot) {
          if (snapshot.exists) {
            setThisUser({
              imageUrl: snapshot.data().image_url,
              name: snapshot.data().name.value,
              elo: snapshot.data().elo[roomData["game-play"]],
              coin: snapshot.data().coin,
            });
          } else {
            setThisUser({
              imageUrl: "",
              name: "",
              elo: 0,
              coin: 0,
            });
            console.log("No such document!");
          }
        });

      return () => unsubscribe();
    }
  }, [
    firebaseApp,
    roomData.participants.player.id,
    roomData,
    state.user.coin,
    state.user.elo,
    state.user.image_url,
    state.user.name.value,
    state.user.uid,
  ]);

  return (
    <div className="d-flex flex-column pr-2">
      <div style={{ width: "100%" }} className="d-flex justify-content-center ">
        <div className="mr-2">
          <p className="text-white text-right">{thisUser.name}</p>
          {roomData.type === "room" ? (
            <small className="text-white">
              <span className="text-warning mr-1">Xu:</span>
              {thisUser.coin}
            </small>
          ) : (
            <small className="text-white">
              <span className="text-warning mr-1">ELO:</span>
              {thisUser.elo}
            </small>
          )}
        </div>
        <img
          src={thisUser.imageUrl !== "image" ? thisUser.imageUrl : UserSVG}
          alt="user"
          className={
            thisUser.imageUrl !== "image"
              ? `rounded-circle align-items-center brown-border shadow mt-1`
              : "mt-1"
          }
          style={{ width: "40px", height: "40px" }}
          onClick={() => {
            toggleInfoModal(true, roomData.participants.player.id);
          }}
        ></img>
      </div>

      {roomData.participants.player.status === "playing" &&
      roomData.game.turn.uid === roomData.participants.player.id ? (
        <div className="d-flex">
          <CounterConponent
            time={roomData.time}
            roomData={roomData}
            userType={"player"}
            ownType={ownType}
          />
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
        </div>
      ) : (
        <div
          style={{ width: "100%" }}
          className="d-flex justify-content-center align-items-center p-1"
        >
          {/* <Badge
            pill
            variant={
              roomData.participants.player.id === state.user.uid
                ? "success"
                : "secondary"
            }
          >
            <p className="text-white roboto-font" style={{ fontSize: "12px" }}>
              {roomData.participants.player.win
                ? roomData.participants.player.win
                : 0}
            </p>
          </Badge> */}
        </div>
      )}
    </div>
  );
}

export default PlayerComponent;
