import React from "react";
import LockSVG from "./../../../../assets/Rooms/lock.svg";
import MoreSVG from "./../../../../assets/Rooms/more.svg";
import MasterComponent from "./../MasterComponent/";
import PlayerComponent from "./../PlayerComponent/";

import UserSVG from "./../../../../assets/Dashboard/user.svg";

import { FirebaseContext } from "./../../../../Firebase/";
import AppContext from "./../../../../context/";

function BodyComponent({ roomData, setShowFooter, showFooter }) {
  const firebase = React.useContext(FirebaseContext);
  const { state } = React.useContext(AppContext);

  const onJoinRoomSubmit = () => {
    if (roomData.type === "room") {
      const roomWithIdRef = firebase
        .firestore()
        .collection("rooms")
        .doc(roomData.rid);

      return firebase.firestore().runTransaction((transaction) => {
        return transaction
          .get(roomWithIdRef)
          .then((tranDoc) => {
            if (!tranDoc.exists) {
              console.log("Document does not exist!");
            }

            const roomUpdates = {};
            if (tranDoc.data().participants.player) {
              roomUpdates[
                "participants.watcher"
              ] = firebase.firestore.FieldValue.arrayUnion(state.user.uid);
            } else {
              roomUpdates["participants.player.id"] = state.user.uid;
              roomUpdates["participants.player.status"] = "waiting";
              roomUpdates["participants.player.win"] = 0;
            }

            return transaction.update(roomWithIdRef, roomUpdates);
          })
          .then(async () => {
            return await firebase
              .firestore()
              .collection("users")
              .doc(state.user.uid)
              .update({
                "room_id.type": roomData["game-play"],
                "room_id.value": roomData.rid,
                "location.path": "room",
              });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    } else {
      const roomByIdDoc = firebase
        .firestore()
        .collection("rooms")
        .doc(roomData.rid);
      const userDoc = firebase
        .firestore()
        .collection("users")
        .doc(state.user.uid);

      const batch = firebase.firestore().batch();
      batch.update(userDoc, {
        room_id: {
          type: roomData["game-play"],
          value: roomData.rid,
        },
        "location.path": "room",
      });
      batch.update(roomByIdDoc, {
        "participants.watcher": firebase.firestore.FieldValue.arrayUnion(
          state.user.uid
        ),
      });

      batch.commit();
    }
  };
  return (
    <div className="d-flex room-item-body p-2">
      {roomData.participants.master ? (
        <MasterComponent roomData={roomData} />
      ) : (
        <div className="d-flex align-items-center">
          <img
            src={UserSVG}
            alt="user-playing"
            className="player-inroom-img mr-2"
          />
          <div className="d-flex flex-column text-white">
            <span>Trống</span>
          </div>
        </div>
      )}
      {roomData.password.status ? (
        <div className="lock-room">
          <img
            src={LockSVG}
            alt="lock"
            className="wood-btn"
            onClick={() => {
              setShowFooter(!showFooter);
            }}
          />
        </div>
      ) : (
        <div className="unlock-room">
          <img
            src={MoreSVG}
            alt="moreSVG"
            className="wood-btn"
            onClick={() => {
              onJoinRoomSubmit();
            }}
          />
        </div>
      )}
      {roomData.participants.player ? (
        <PlayerComponent roomData={roomData} />
      ) : (
        <div className="d-flex justify-content-end align-items-center">
          <div className="d-flex flex-column text-white text-right">
            <span>Trống</span>
          </div>
          <img
            src={UserSVG}
            alt="user-playing"
            className="player-inroom-img ml-2"
          />
        </div>
      )}
    </div>
  );
}

export default BodyComponent;
