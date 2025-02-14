import React from "react";
import { Badge } from "react-bootstrap";
import { useFirebaseApp } from "reactfire";

// SVGs
import UserSVG from "./../../../assets/Dashboard/user.svg";

// Contexts
import AppContext from "./../../../context/";

// Components
import CounterConponent from "./../Counter/";

function MasterComponent({ roomData, ownType }) {
  const firebaseApp = useFirebaseApp();
  const { state, toggleInfoModal } = React.useContext(AppContext);
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
        elo: state.user.elo[roomData["game-play"]],
        coin: state.user.coin,
      });
    } else {
      firebaseApp
        .firestore()
        .collection("users")
        .doc(roomData.participants.master.id)
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
            console.log("No such document!");
          }
        });

      const unsubscribe = firebaseApp
        .firestore()
        .collection("users")
        .doc(roomData.participants.master.id)
        .onSnapshot(function (snapshot) {
          if (snapshot.exists) {
            setThisUser({
              imageUrl: snapshot.data().image_url,
              name: snapshot.data().name.value,
              elo: snapshot.data().elo[roomData["game-play"]],
              coin: snapshot.data().coin,
            });
          } else {
            console.log("No such document!");
          }
        });

      return () => unsubscribe();
    }
  }, [
    firebaseApp,
    roomData.participants.master.id,
    roomData,
    state.user.coin,
    state.user.elo,
    state.user.image_url,
    state.user.name.value,
    state.user.uid,
  ]);

  return (
    <div className="d-flex flex-column pl-2">
      <div style={{ width: "100%" }} className="d-flex align-items-center">
        <img
          src={thisUser.imageUrl !== "image" ? thisUser.imageUrl : UserSVG}
          alt="user"
          className={
            thisUser.imageUrl !== "image"
              ? `rounded-circle brown-border shadow`
              : ""
          }
          style={{ width: "40px", height: "40px" }}
          onClick={() => {
            toggleInfoModal(true, roomData.participants.master.id);
          }}
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
            <Badge
              pill
              variant={
                roomData.participants.master.id === state.user.uid
                  ? "success"
                  : "secondary"
              }
              className="shadow"
            >
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
          {/* <Badge
            pill
            variant={
              roomData.participants.master.id === state.user.uid
                ? "success"
                : "secondary"
            }
            className="shadow ml-1"
          >
            <p className="text-white roboto-font" style={{ fontSize: "12px" }}>
              {roomData.participants.master.win
                ? roomData.participants.master.win
                : 0}
            </p>
          </Badge> */}
        </div>
      )}
    </div>
  );
}

export default MasterComponent;
