import React from "react";
import "./index.css";
import { useFirebaseApp } from "reactfire";
import firebase from "firebase/app";

// Functions
import { leaveRoom } from "./../../../functions/";

// Components
import WatcherList from "./WatcherList/";

// Context
import AppContext from "./../../../context/";

function ReadyComponent({ roomData, ownType, setStatusGame }) {
  const { state } = React.useContext(AppContext);
  const firebaseApp = useFirebaseApp();

  const [showLoadingExitBtn, setShowLoadingExitBtn] = React.useState(true);

  const [loadingReady, setLoadingReady] = React.useState(false);

  React.useEffect(() => {
    if (roomData.game.player && roomData.game.player[state.user.uid]) {
      setLoadingReady(false);
    }
  }, [roomData.game.player, state.user.uid]);

  const onLeaveRoom = () => {
    setShowLoadingExitBtn(false);

    if (roomData.type === "room") {
      leaveRoom(
        {
          roomId: state.user.room_id.value,
          userId: state.user.uid,
          userType: ownType,
        },
        firebaseApp
      )
        .then()
        .catch((error) => {
          console.log(error);
          setShowLoadingExitBtn(true);
        });
    } else if (roomData.type === "quick-play") {
      let roomRef = firebaseApp
        .firestore()
        .collection("rooms")
        .doc(state.user.room_id.value);
      let userCollection = firebaseApp.firestore().collection("users");

      firebaseApp.firestore().runTransaction(function (transaction) {
        return transaction.get(roomRef).then(function (sfDoc) {
          if (!sfDoc.exists) {
            console.log("Document does not exist!");
          }

          switch (ownType) {
            case "master":
              if (sfDoc.data().participants.player) {
                transaction.update(
                  userCollection.doc(sfDoc.data().participants.master.id),
                  {
                    "location.path": "playnow",
                    room_id: { type: "none", value: 0 },
                  }
                );
                transaction.update(roomRef, {
                  "participants.master": firebase.firestore.FieldValue.delete(),
                  "game.turn.uid": sfDoc.data().participants.player.id,
                });
              } else {
                if (sfDoc.data().participants.watcher) {
                  for (const iterator of sfDoc.data().participants.watcher) {
                    transaction.update(userCollection.doc(iterator), {
                      "location.path": "lobby",
                      room_id: { type: "none", value: 0 },
                    });
                  }
                }

                transaction.update(
                  userCollection.doc(sfDoc.data().participants.master.id),
                  {
                    "location.path": "playnow",
                    room_id: { type: "none", value: 0 },
                  }
                );

                transaction.delete(roomRef);
              }
              break;
            case "player":
              if (sfDoc.data().participants.master) {
                transaction.update(
                  userCollection.doc(sfDoc.data().participants.player.id),
                  {
                    "location.path": "playnow",
                    room_id: { type: "none", value: 0 },
                  }
                );
                transaction.update(roomRef, {
                  "participants.player": firebase.firestore.FieldValue.delete(),
                  "game.turn.uid": sfDoc.data().participants.master.id,
                });
              } else {
                if (sfDoc.data().participants.watcher) {
                  for (const iterator of sfDoc.data().participants.watcher) {
                    transaction.update(userCollection.doc(iterator), {
                      "location.path": "lobby",
                      room_id: { type: "none", value: 0 },
                    });
                  }
                }

                transaction.update(
                  userCollection.doc(sfDoc.data().participants.player.id),
                  {
                    "location.path": "playnow",
                    room_id: { type: "none", value: 0 },
                  }
                );

                transaction.delete(roomRef);
              }
              break;

            default:
              transaction.update(userCollection.doc(state.user.uid), {
                "location.path": "lobby",
                room_id: { type: "none", value: 0 },
              });
              transaction.update(roomRef, {
                "participants.watcher": firebase.firestore.FieldValue.arrayRemove(
                  state.user.uid
                ),
              });
              break;
          }
        });
      });
    }
  };

  // const readyAction = useFunctions();

  const onReadyPlay = () => {
    const readyAction = firebase
      .app()
      .functions("asia-east2")
      .httpsCallable("readyAction");

    readyAction({
      roomId: state.user.room_id.value,
      uid: state.user.uid,
    })
      .then((result) => {
        if (result.data.ready === 2) {
          setStatusGame({
            isPlay: true,
            winner: "",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onCancelPlay = () => {
    let roomUpdate = {};
    roomUpdate[`game.status.ready`] = roomData.game.status.ready - 1;
    roomUpdate[
      `game.player.${state.user.uid}`
    ] = firebase.firestore.FieldValue.delete();

    firebaseApp
      .firestore()
      .collection("rooms")
      .doc(state.user.room_id.value)
      .update(roomUpdate)
      .then(() => {
        setLoadingReady(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showReadyBtnFunc = () => {
    switch (ownType) {
      case "master":
        return (
          <React.Fragment>
            {loadingReady ? (
              <div className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn">
                <h3 className="mb-0 text-center brown-color">LOADING...</h3>
              </div>
            ) : roomData.game.player[state.user.uid] ? (
              <div
                className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
                onClick={() => {
                  setLoadingReady(true);
                  onCancelPlay();
                }}
              >
                <h3 className="mb-0 text-center brown-color">HỦY SẴN SÀNG</h3>
              </div>
            ) : roomData.participants.player && roomData.participants.master ? (
              <div
                className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
                onClick={() => {
                  setLoadingReady(true);
                  onReadyPlay();
                }}
              >
                <h3 className="mb-0 text-center brown-color">SẴN SÀNG</h3>
              </div>
            ) : (
              ""
            )}
            <div className="d-flex">
              {loadingReady ? (
                ""
              ) : (
                <React.Fragment>
                  {roomData.type === "room" ? (
                    <div className="brown-border others-btn wood-btn flex-fill rounded-pill shadow mr-1">
                      <h3 className="mb-0 text-center brown-color p-2">
                        Mời chơi
                      </h3>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="brown-border others-btn wood-btn flex-fill rounded-pill shadow">
                    <h3
                      className="mb-0 text-center brown-color p-2"
                      onClick={() => {
                        if (showLoadingExitBtn) {
                          onLeaveRoom();
                        }
                      }}
                    >
                      {showLoadingExitBtn ? "Thoát" : "Đang thoát..."}
                    </h3>
                  </div>
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        );

      case "player":
        return (
          <React.Fragment>
            {loadingReady ? (
              <div className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn">
                <h3 className="mb-0 text-center brown-color">LOADING...</h3>
              </div>
            ) : roomData.game.player[state.user.uid] ? (
              <div
                className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
                onClick={() => {
                  setLoadingReady(true);
                  onCancelPlay();
                }}
              >
                <h3 className="mb-0 text-center brown-color">HỦY SẴN SÀNG</h3>
              </div>
            ) : roomData.participants.player && roomData.participants.master ? (
              <div
                className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
                onClick={() => {
                  setLoadingReady(true);
                  onReadyPlay();
                }}
              >
                <h3 className="mb-0 text-center brown-color">SẴN SÀNG</h3>
              </div>
            ) : (
              ""
            )}
            <div className="d-flex">
              {loadingReady ? (
                ""
              ) : (
                <React.Fragment>
                  <div className="brown-border others-btn wood-btn flex-fill rounded-pill shadow">
                    <h3
                      className="mb-0 text-center brown-color p-2"
                      onClick={() => {
                        if (showLoadingExitBtn) {
                          onLeaveRoom();
                        }
                      }}
                    >
                      {showLoadingExitBtn ? "Thoát" : "Đang thoát..."}
                    </h3>
                  </div>
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        );

      default:
        return (
          <React.Fragment>
            {roomData.participants.player || roomData.type !== "room" ? (
              ""
            ) : (
              <div className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn">
                <h3 className="mb-0 text-center brown-color">NGỒI CHƠI</h3>
              </div>
            )}
            <div className="d-flex">
              <div className="brown-border others-btn wood-btn flex-fill rounded-pill shadow">
                <h3
                  className="mb-0 text-center brown-color p-2"
                  onClick={() => {
                    if (showLoadingExitBtn) {
                      onLeaveRoom();
                    }
                  }}
                >
                  {showLoadingExitBtn ? "Thoát" : "Đang thoát..."}
                </h3>
              </div>
            </div>
          </React.Fragment>
        );
    }
  };

  return (
    <div className="position-absolute w-100 h-100 p-2" style={{ zIndex: "1" }}>
      <div className="d-flex flex-column justify-content-center mt-3 mb-3">
        {showReadyBtnFunc()}
      </div>
      <WatcherList roomData={roomData} />
    </div>
  );
}

export default ReadyComponent;
