import React from "react";
import "./index.css";

// Components
import WatcherList from "./WatcherList/";

// Context
import AppContext from "./../../../context/";
import { FirebaseContext } from "./../../../Firebase/";

function ReadyComponent({ master, player, watcher }) {
  const { state } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);

  const [showExitBtn, setShowExitBtn] = React.useState(true);

  const [showReadyBtn, setShowReadyBtn] = React.useState(true);
  const [showCancelBtn, setShowCancelBtn] = React.useState(false);
  const [noExitOrInvite, setNoExitOrInvite] = React.useState(false);

  React.useEffect(() => {
    function doSnapShot(snapshot) {
      if (snapshot.exists()) {
        setShowReadyBtn(false);
        setShowCancelBtn(true);
        setNoExitOrInvite(true);
      }
    }

    if (state.room.type && state.room.id) {
      firebase
        .database()
        .ref(
          `/rooms/${state.room.type}/${state.room.id.toString()}/game/player/${
            state.userInfo.id
          }`
        )
        .once("value")
        .then(doSnapShot);
    }

    return () =>
      firebase
        .database()
        .ref(
          `/rooms/${state.room.type}/${state.room.id.toString()}/game/player/${
            state.userInfo.id
          }`
        )
        .off("value", doSnapShot);
  }, [firebase, state.room.id, state.room.type, state.userInfo.id]);

  const onLeaveRoom = () => {
    setShowExitBtn(false);
    const leaveRoom = firebase.functions().httpsCallable("leaveRoom");

    leaveRoom({
      roomId: state.room.id,
      type: state.room.type,
      userId: state.userInfo.id,
      userType:
        master.id === state.userInfo.id
          ? "master"
          : player.id === state.userInfo.id
          ? "player"
          : "watcher",
    })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
        setShowExitBtn(true);
      });
  };

  const onReadyPlay = () => {
    const readyAction = firebase.functions().httpsCallable("readyAction");

    setShowReadyBtn(false);
    setNoExitOrInvite(true);

    readyAction({
      roomType: state.room.type,
      roomId: state.room.id,
      uid: state.userInfo.id,
    }).then((result) => {
      // setShowCancelBtn(true);
      console.log(result);
    });
  };

  const onCancelPlay = () => {
    const cancelAction = firebase.functions().httpsCallable("cancelAction");

    setShowCancelBtn(false);
    setNoExitOrInvite(false);

    cancelAction({
      roomType: state.room.type,
      roomId: state.room.id,
    }).then((result) => {
      setShowReadyBtn(true);
      console.log(result);
    });
  };

  return (
    <div>
      <div className="d-flex flex-column justify-content-center mt-3 mb-3">
        {master &&
        player &&
        showReadyBtn &&
        (master.id === state.userInfo.id || player.id === state.userInfo.id) ? (
          <div
            className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
            onClick={() => {
              onReadyPlay();
            }}
          >
            <h3 className="mb-0 text-center brown-color">SẴN SÀNG</h3>
          </div>
        ) : (
          ""
        )}
        {master && player && showCancelBtn ? (
          <div
            className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
            onClick={() => {
              onCancelPlay();
            }}
          >
            <h3 className="mb-0 text-center brown-color">HỦY SẴN SÀNG</h3>
          </div>
        ) : (
          ""
        )}
        {noExitOrInvite ? (
          ""
        ) : (
          <div className="d-flex">
            {master.id === state.userInfo.id ? (
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
