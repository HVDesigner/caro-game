import React from "react";
import "./index.css";

// Components
import WatcherList from "./WatcherList/";

// Context
import AppContext from "./../../../context/";
import { FirebaseContext } from "./../../../Firebase/";

function ReadyComponent({ roomData, ownType, setStatusGame }) {
  const { state } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);

  const [showLoadingExitBtn, setShowLoadingExitBtn] = React.useState(true);
  const [showExBtn, setShowExBtn] = React.useState(true);

  const [loadingReady, setLoadingReady] = React.useState(false);

  React.useEffect(() => {
    if (roomData.game.player && roomData.game.player[state.user.uid]) {
      setLoadingReady(false);
    }
  }, [roomData.game.player, state.user.uid]);

  const onLeaveRoom = () => {
    setShowLoadingExitBtn(false);
    const leaveRoom = firebase.functions().httpsCallable("leaveRoom");

    console.log({
      roomId: state.user.room_id.value,
      userId: state.user.uid,
      userType: ownType,
    });

    leaveRoom({
      roomId: state.user.room_id.value,
      userId: state.user.uid,
      userType: ownType,
    })
      .then()
      .catch((error) => {
        console.log(error);
        setShowLoadingExitBtn(true);
      });
  };

  const onReadyPlay = () => {
    const readyAction = firebase.functions().httpsCallable("readyAction");

    readyAction({
      roomId: state.user.room_id.value,
      uid: state.user.uid,
    })
      .then((result) => {
        console.log(result);
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

    firebase
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
                  setShowExBtn(true);
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
                  setShowExBtn(false);
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
                  <div className="brown-border others-btn wood-btn flex-fill rounded-pill shadow mr-1">
                    <h3 className="mb-0 text-center brown-color p-2">
                      Mời chơi
                    </h3>
                  </div>
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
                  setShowExBtn(true);
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
                  setShowExBtn(false);
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
            {roomData.participants.player ? (
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
