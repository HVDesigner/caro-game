import React from "react";
import "./index.css";
import AppContext from "./../../../context/";
import { TOGGLE_FIND_ROOM_MODAL } from "./../../../context/ActionTypes";
import { loginRoom } from "./../../../functions/";
import { useFirebaseApp } from "reactfire";
import firebase from "firebase/app";

function FindRoom() {
  const { dispatch, state } = React.useContext(AppContext);
  const firebaseApp = useFirebaseApp();

  const [roomId, setRoomId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const closeModal = () => {
    dispatch({
      type: TOGGLE_FIND_ROOM_MODAL,
      payload: false,
    });
  };

  const onSubmitForm = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (roomId) {
      firebaseApp
        .firestore()
        .collection("rooms")
        .doc(roomId.toString())
        .get()
        .then(function (doc) {
          if (doc.exists) {
            if (!doc.data().password.status) {
              if (doc.data().type === "room") {
                const roomWithIdRef = firebaseApp
                  .firestore()
                  .collection("rooms")
                  .doc(roomId.toString());

                return firebaseApp.firestore().runTransaction((transaction) => {
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
                        ] = firebase.firestore.FieldValue.arrayUnion(
                          state.user.uid
                        );
                      } else {
                        roomUpdates["participants.player.id"] = state.user.uid;
                        roomUpdates["participants.player.status"] = "waiting";
                        roomUpdates["participants.player.win"] = 0;
                      }

                      return transaction.update(roomWithIdRef, roomUpdates);
                    })
                    .then(async () => {
                      return await firebaseApp
                        .firestore()
                        .collection("users")
                        .doc(state.user.uid)
                        .update({
                          "room_id.type": doc.data()["game-play"],
                          "room_id.value": roomId.toString(),
                          "location.path": "room",
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
              } else {
                const roomByIdDoc = firebaseApp
                  .firestore()
                  .collection("rooms")
                  .doc(roomId.toString());
                const userDoc = firebaseApp
                  .firestore()
                  .collection("users")
                  .doc(state.user.uid);

                const batch = firebaseApp.firestore().batch();
                batch.update(userDoc, {
                  room_id: {
                    type: doc.data()["game-play"],
                    value: roomId.toString(),
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
            } else if (doc.data().password.status && password !== "") {
              loginRoom(
                {
                  uid: state.user.uid,
                  ...doc.data(),
                  rid: roomId.toString(),
                  rawText: password,
                },
                firebaseApp
              )
                .then(() => {
                  closeModal();
                })
                .catch((error) => {
                  if (error.value === false) {
                    setError(error.text);
                  } else {
                    setError("Không thể vào bàn!");
                  }
                });
            } else {
              setError("Bàn có mật khẩu!");
            }
          } else {
            setError("Bàn không tồn tại");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    } else {
      setError("Chưa nhập số bàn!");
    }
  };

  return (
    <div
      className="position-absolute find-room-modal d-flex justify-content-center align-items-center"
      style={{ zIndex: "9999" }}
    >
      <div className="find-room-modal-content p-3 brown-border rounded shadow">
        <form onSubmit={onSubmitForm} className="d-flex flex-column">
          <input
            placeholder="Nhập ID phòng"
            className="input-carotv-2 mb-2"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            maxLength="6"
          />
          <input
            placeholder="Nhập mật khẩu (nếu có)"
            className="input-carotv-2 mb-2"
            value={password}
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </form>
        <div className="find-room-btn brown-border rounded mb-2">
          <p
            className="mb-0 text-center wood-btn-back p-1"
            onClick={() => {
              onSubmitForm();
            }}
          >
            Vào phòng
          </p>
        </div>
        <div className="find-room-btn brown-border rounded mb-2">
          <p
            className="mb-0 text-center wood-btn-back p-1"
            onClick={() => {
              closeModal();
            }}
          >
            Thoát
          </p>
        </div>
        {error ? (
          <p className="mb-0 text-center text-warning p-1">{error}</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default FindRoom;
