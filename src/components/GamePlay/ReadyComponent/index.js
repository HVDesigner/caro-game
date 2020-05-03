import React from "react";
import "./index.css";

// Components
import WatcherList from "./WatcherList/";

// Context
import AppContext from "./../../../context/";
import { FirebaseContext } from "./../../../Firebase/";

function ReadyComponent({ master, player, watcher, gameData, ownType }) {
  const { state } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);

  const [showExitBtn, setShowExitBtn] = React.useState(true);

  const [loadingReady, setLoadingReady] = React.useState(false);

  React.useEffect(() => {
    if (gameData.player && gameData.player[state.userInfo.id]) {
      setLoadingReady(false);
    }
  }, [state.userInfo.id, gameData.player]);

  const onLeaveRoom = () => {
    setShowExitBtn(false);
    const leaveRoom = firebase.functions().httpsCallable("leaveRoom");

    leaveRoom({
      roomId: state.room.id,
      type: state.room.type,
      userId: state.userInfo.id,
      userType: ownType,
    })
      .then()
      .catch((error) => {
        console.log(error);
        setShowExitBtn(true);
      });
  };

  const onReadyPlay = () => {
    const readyAction = firebase.functions().httpsCallable("readyAction");

    readyAction({
      roomType: state.room.type,
      roomId: state.room.id,
      uid: state.userInfo.id,
    })
      .then()
      .catch((error) => {
        console.log(error);
      });
  };

  const onCancelPlay = () => {
    const cancelAction = firebase.functions().httpsCallable("cancelAction");

    cancelAction({
      roomType: state.room.type,
      roomId: state.room.id,
    })
      .then(() => {
        setLoadingReady(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="d-flex flex-column justify-content-center mt-3 mb-3">
        {master && player && (ownType === "master" || ownType === "player") ? (
          <React.Fragment>
            {loadingReady ? (
              <div className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn">
                <h3 className="mb-0 text-center brown-color">LOADING...</h3>
              </div>
            ) : gameData.player && gameData.player[state.userInfo.id] ? (
              <div
                className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
                onClick={() => {
                  setLoadingReady(true);
                  onCancelPlay();
                }}
              >
                <h3 className="mb-0 text-center brown-color">HỦY SẴN SÀNG</h3>
              </div>
            ) : (
              <div
                className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
                onClick={() => {
                  setLoadingReady(true);
                  onReadyPlay();
                }}
              >
                <h3 className="mb-0 text-center brown-color">SẴN SÀNG</h3>
              </div>
            )}
          </React.Fragment>
        ) : (
          ""
        )}
        {gameData.player && gameData.player[state.userInfo.id] ? (
          ""
        ) : (
          <div className="d-flex">
            {ownType === "master" ? (
              <div className="brown-border others-btn wood-btn flex-fill rounded-pill shadow mr-1">
                <h3 className="mb-0 text-center brown-color p-2">Mời chơi</h3>
              </div>
            ) : (
              ""
            )}

            <div className="brown-border others-btn wood-btn flex-fill rounded-pill shadow">
              <h3
                className="mb-0 text-center brown-color p-2"
                onClick={() => {
                  if (showExitBtn) {
                    onLeaveRoom();
                  }
                }}
              >
                {showExitBtn ? "Thoát" : "Đang thoát..."}
              </h3>
            </div>
          </div>
        )}
      </div>
      <WatcherList watcher={watcher ? watcher : ""} />
    </div>
  );
}

export default ReadyComponent;
