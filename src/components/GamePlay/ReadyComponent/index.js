import React from "react";
import "./index.css";

// Components
import WatcherList from "./WatcherList/";

// Context
import AppContext from "./../../../context/";
import { FirebaseContext } from "./../../../Firebase/";

function ReadyComponent({ master, player, watcher }) {
  console.log({ master, player });
  const { state } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);

  const [showExitBtn, setShowExitBtn] = React.useState(true);

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
        setShowExitBtn(true);
      })
      .catch((error) => {
        console.log(error);
        setShowExitBtn(true);
      });
  };

  return (
    <div>
      <div className="d-flex flex-column justify-content-center mt-3 mb-3">
        {master && player ? (
          <div className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn">
            <h3 className="mb-0 text-center brown-color">SẴN SÀNG</h3>
          </div>
        ) : (
          ""
        )}
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
      </div>
      <WatcherList watcher={watcher ? watcher : ""} />
    </div>
  );
}

export default ReadyComponent;
