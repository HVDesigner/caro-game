import "./index.css";
import React from "react";
import firebase from "firebase/app";
import { useFirebaseApp } from "reactfire";
import Sound from "react-sound";

import WinSound from "./../../../assets/sound/win-sound.mp3";
import LostSound from "./../../../assets/sound/lost-sound.mp3";

// Context
import AppContext from "./../../../context/";

function WinnerModal({ roomData, ownType }) {
  const { state } = React.useContext(AppContext);
  const firebaseApp = useFirebaseApp();

  const [win, setWin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [loadingNextBtn, setLoadingNextBtn] = React.useState(false);
  const [soundStatus, setSoundStatus] = React.useState(Sound.status.PLAYING);

  const onNextAction = () => {
    setLoadingNextBtn(true);
    let roomUpdate = {};
    roomUpdate[
      `game.player.${state.user.uid}`
    ] = firebase.firestore.FieldValue.delete();
    if (win) {
      roomUpdate[`game.turn.uid`] = state.user.uid;
    }
    roomUpdate[`participants.${ownType}.status`] = "waiting";

    firebaseApp
      .firestore()
      .collection("rooms")
      .doc(state.user.room_id.value)
      .update(roomUpdate);
  };

  React.useEffect(() => {
    if (
      roomData.participants[ownType] &&
      roomData.participants[ownType].status === "winner"
    ) {
      setWin(true);
    } else {
      setWin(false);
    }
    setLoading(false);
  }, [roomData.participants, ownType, state.user.uid]);

  return (
    <div className="winner-modal d-flex justify-content-center align-items-center">
      <div className="winner-modal-content p-3 brown-border shadow rounded">
        {loading ? (
          <h5 className="text-warning text-stroke-carotv text-center mb-0 brown-color">
            Loading...
          </h5>
        ) : (
          <React.Fragment>
            {win && roomData.participants[ownType].status === "winner" ? (
              <React.Fragment>
                {state.user.setting.sound ? (
                  <Sound
                    url={WinSound}
                    playStatus={soundStatus}
                    loop={false}
                    onFinishedPlaying={() => {
                      setSoundStatus(Sound.status.STOPPED);
                    }}
                  />
                ) : (
                  ""
                )}
                <h5 className="text-warning text-stroke-carotv text-center mb-3">
                  Chúc mừng
                </h5>
                <h1 className="text-warning text-stroke-carotv mb-0">
                  BẠN THẮNG
                </h1>
                {roomData.type === "room" ? (
                  <h5 className="text-warning text-stroke-carotv text-center">
                    + {roomData.bet} xu
                  </h5>
                ) : (
                  ""
                )}
              </React.Fragment>
            ) : (
              ""
            )}

            {!win && roomData.participants[ownType].status === "loser" ? (
              <React.Fragment>
                {state.user.setting.sound ? (
                  <Sound
                    url={LostSound}
                    playStatus={soundStatus}
                    loop={false}
                    onFinishedPlaying={() => {
                      setSoundStatus(Sound.status.STOPPED);
                    }}
                  />
                ) : (
                  ""
                )}
                <h5 className="text-muted text-stroke-carotv text-center mb-3">
                  Rất tiếc
                </h5>
                <h1 className="text-secondary text-stroke-carotv mb-0">
                  BẠN THUA
                </h1>
                {roomData.type === "room" ? (
                  <h5 className="text-secondary text-stroke-carotv text-center">
                    - {roomData.bet} xu
                  </h5>
                ) : (
                  ""
                )}
              </React.Fragment>
            ) : (
              ""
            )}

            <div className="brown-border shadow rounded next-btn wood-btn">
              {loadingNextBtn ? (
                <h5 className="text-center mt-2 mb-2 text-white">Loading...</h5>
              ) : (
                <h5
                  className="text-center mt-2 mb-2 text-white"
                  onClick={() => {
                    onNextAction();
                  }}
                >
                  Tiếp tục
                </h5>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default WinnerModal;
