import React from "react";
import "./index.css";
import useSound from "use-sound";
import firebase from "firebase/app";
import { useFirebaseApp } from "reactfire";

// Action Type
import { TOGGLE_DIALOG } from "./../../../context/ActionTypes";

// Sounds
import ReadySound from "./../../../assets/sound/ready-sound.mp3";

// Functions
import {
  readyAction,
  changeToPlay,
  changeToWatch,
} from "./../../../functions/";

// Context
import AppContext from "./../../../context/";

function ReadyComponent({ roomData, ownType, setStatusGame }) {
  const { state, dispatch } = React.useContext(AppContext);
  const firebaseApp = useFirebaseApp();

  const [loadingReady, setLoadingReady] = React.useState(false);
  const [play, { stop }] = useSound(ReadySound);

  React.useEffect(() => {
    if (roomData.game.player && roomData.game.player[state.user.uid]) {
      setLoadingReady(false);
    }

    return () => {
      stop();
    };
  }, [roomData.game.player, state.user.uid, stop]);

  const onReadyPlay = () => {
    if (
      parseInt(state.user.coin) < parseInt(roomData.bet) &&
      roomData.type === "room"
    ) {
      setLoadingReady(false);

      dispatch({
        type: TOGGLE_DIALOG,
        payload: {
          status: true,
          message: "Bạn không đủ tiền cược!",
        },
      });
    } else {
      if (state.user.setting.music.effect) {
        play();
      }
      readyAction(
        {
          roomId: state.user.room_id.value,
          uid: state.user.uid,
        },
        firebaseApp
      )
        .then((result) => {
          setLoadingReady(false);
          if (result.ready === 2) {
            setStatusGame({
              isPlay: true,
              winner: "",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
              <h3 className="mb-0 text-center">LOADING...</h3>
            ) : (
              <React.Fragment>
                {roomData.participants.player &&
                roomData.participants.master &&
                !roomData.game.player[state.user.uid] ? (
                  <React.Fragment>
                    <div
                      className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
                      onClick={() => {
                        setLoadingReady(true);
                        onReadyPlay();
                      }}
                    >
                      <h3 className="mb-0 text-center brown-color">SẴN SÀNG</h3>
                    </div>
                    {roomData.type === "room" ? (
                      <div
                        className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
                        onClick={() => {
                          changeToWatch(
                            {
                              roomId: state.user.room_id.value,
                              uid: state.user.uid,
                            },
                            firebaseApp
                          );
                        }}
                      >
                        <h3 className="mb-0 text-center brown-color">
                          ĐỨNG XEM
                        </h3>
                      </div>
                    ) : (
                      ""
                    )}
                  </React.Fragment>
                ) : (
                  ""
                )}
                {roomData.game.player[state.user.uid] ? (
                  <div
                    className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
                    onClick={() => {
                      setLoadingReady(true);
                      onCancelPlay();
                    }}
                  >
                    <h3 className="mb-0 text-center brown-color">
                      HỦY SẴN SÀNG
                    </h3>
                  </div>
                ) : (
                  ""
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        );

      case "player":
        return (
          <React.Fragment>
            {loadingReady ? (
              <h3 className="mb-0 text-center brown-color">LOADING...</h3>
            ) : (
              <React.Fragment>
                {roomData.game.player[state.user.uid] ? (
                  <div
                    className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
                    onClick={() => {
                      setLoadingReady(true);
                      onCancelPlay();
                    }}
                  >
                    <h3 className="mb-0 text-center brown-color">
                      HỦY SẴN SÀNG
                    </h3>
                  </div>
                ) : (
                  <React.Fragment>
                    {roomData.participants.player &&
                    roomData.participants.master ? (
                      <div
                        className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
                        onClick={() => {
                          setLoadingReady(true);
                          onReadyPlay();
                        }}
                      >
                        <h3 className="mb-0 text-center brown-color">
                          SẴN SÀNG
                        </h3>
                      </div>
                    ) : (
                      ""
                    )}
                    {roomData.type === "room" ? (
                      <div
                        className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
                        onClick={() => {
                          changeToWatch(
                            {
                              roomId: state.user.room_id.value,
                              uid: state.user.uid,
                            },
                            firebaseApp
                          );
                        }}
                      >
                        <h3 className="mb-0 text-center brown-color">
                          ĐỨNG XEM
                        </h3>
                      </div>
                    ) : (
                      ""
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        );

      case "watcher":
        return (
          <React.Fragment>
            {roomData.participants.player || roomData.type !== "room" ? (
              ""
            ) : (
              <div
                className="ready-btn p-2 mb-1 rounded-pill brown-border shadow wood-btn"
                onClick={() => {
                  changeToPlay(
                    { roomId: state.user.room_id.value, uid: state.user.uid },
                    firebaseApp
                  );
                }}
              >
                <h3 className="mb-0 text-center brown-color">NGỒI CHƠI</h3>
              </div>
            )}
          </React.Fragment>
        );

      default:
        return;
    }
  };

  return (
    <div className="position-absolute w-100 h-100 p-2" style={{ zIndex: "1" }}>
      <div className="d-flex flex-column justify-content-center mb-3">
        {showReadyBtnFunc()}
      </div>
    </div>
  );
}

export default ReadyComponent;
