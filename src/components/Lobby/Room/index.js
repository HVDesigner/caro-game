import React from "react";
import "./index.css";
import firebase from "firebase/app";
import { useFirebaseApp } from "reactfire";

// Contexts
import AppContext from "./../../../context/";

// Action Type
import { TOGGLE_DIALOG } from "./../../../context/ActionTypes";

// Components
import Header from "./Header/";
import Footer from "./Footer/";
import Body from "./Body/";
import PasswordInput from "./PasswordInput/";

function Room({ roomData }) {
  const [showFooterPassword, setShowFooterPassword] = React.useState(false);
  const [showFooterNormal, setShowFooterNormal] = React.useState(false);

  return (
    <div className="room-item d-flex flex-column shadow mt-2">
      <Header roomData={roomData} />

      <Body
        roomData={roomData}
        setShowFooterPassword={setShowFooterPassword}
        showFooterPassword={showFooterPassword}
        showFooterNormal={showFooterNormal}
        setShowFooterNormal={setShowFooterNormal}
      />

      <Footer roomData={roomData} />

      {showFooterPassword ? <PasswordInput roomData={roomData} /> : ""}
      {showFooterNormal ? <FooterNormal roomData={roomData} /> : ""}
    </div>
  );
}

export default Room;

function FooterNormal({ roomData }) {
  const firebaseApp = useFirebaseApp();
  const { state, dispatch } = React.useContext(AppContext);

  const onJoinRoomSubmit = (userType) => {
    const roomWithIdRef = firebaseApp
      .firestore()
      .collection("rooms")
      .doc(roomData.rid);

    switch (roomData.type) {
      case "room":
        if (
          roomData.pan &&
          roomData.pan.findIndex((value) => value === state.user.uid) >= 0
        ) {
          return dispatch({
            type: TOGGLE_DIALOG,
            payload: {
              status: true,
              message: "Bạn đã bị cấm vào phòng này!",
            },
          });
        }

        if (parseInt(roomData.bet) > parseInt(state.user.coin)) {
          return dispatch({
            type: TOGGLE_DIALOG,
            payload: {
              status: true,
              message: "Bạn không đủ xu!",
            },
          });
        }

        return firebaseApp.firestore().runTransaction((transaction) => {
          return transaction
            .get(roomWithIdRef)
            .then((tranDoc) => {
              if (!tranDoc.exists) {
                console.log("Document does not exist!");
              }

              const roomUpdates = {};

              if (userType === "watcher") {
                roomUpdates[
                  "participants.watcher"
                ] = firebase.firestore.FieldValue.arrayUnion(state.user.uid);
              }

              if (userType === "player") {
                roomUpdates["participants.player.id"] = state.user.uid;
                roomUpdates["participants.player.status"] = "waiting";
                roomUpdates["participants.player.win"] = 0;
              }

              transaction.update(roomWithIdRef, roomUpdates);
              transaction.update(
                firebaseApp.firestore().collection("users").doc(state.user.uid),
                {
                  "room_id.type": roomData["game-play"],
                  "room_id.value": roomData.rid,
                  "location.path": "room",
                }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        });
      case "quick-play":
        const userDoc = firebaseApp
          .firestore()
          .collection("users")
          .doc(state.user.uid);

        const batch = firebaseApp.firestore().batch();

        if (userType === "watcher") {
          batch.update(userDoc, {
            room_id: {
              type: roomData["game-play"],
              value: roomData.rid,
            },
            "location.path": "room",
          });
          batch.update(roomWithIdRef, {
            "participants.watcher": firebase.firestore.FieldValue.arrayUnion(
              state.user.uid
            ),
          });
        }

        batch.commit();
        break;

      default:
        break;
    }
  };

  return (
    <div className={`room-item-footer pt-2 pl-2 pr-2 d-flex flex-column`}>
      <div className="d-flex w-100 mb-2">
        {roomData.type === "quick-play" || roomData.participants.player ? (
          ""
        ) : (
          <div
            className="flex-fill p-1 bg-gold-wood rounded brown-border mr-1 wood-btn"
            onClick={() => {
              onJoinRoomSubmit("player");
            }}
          >
            <p className="m-0 text-center brown-color">VÀO CHƠI</p>
          </div>
        )}

        <div
          className="flex-fill p-1 bg-gold-wood rounded brown-border ml-2 wood-btn"
          onClick={() => {
            onJoinRoomSubmit("watcher");
          }}
        >
          <p className="m-0 text-center brown-color">VÀO XEM</p>
        </div>
      </div>
    </div>
  );
}
