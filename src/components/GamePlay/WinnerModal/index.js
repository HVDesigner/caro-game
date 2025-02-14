import "./index.css";
import React from "react";
import firebase from "firebase/app";
import { useFirebaseApp } from "reactfire";
import useSound from "use-sound";

import WinSound from "./../../../assets/sound/win-sound.mp3";
import LostSound from "./../../../assets/sound/lost-sound.mp3";

// Context
import AppContext from "./../../../context/";

function WinnerModal({ roomData, ownType }) {
  const { state } = React.useContext(AppContext);
  const firebaseApp = useFirebaseApp();

  const [loadingNextBtn, setLoadingNextBtn] = React.useState(false);

  const onNextAction = () => {
    setLoadingNextBtn(true);

    const roomRef = firebaseApp
      .firestore()
      .collection("rooms")
      .doc(state.user.room_id.value);

    firebaseApp.firestore().runTransaction(function (transaction) {
      return transaction.get(roomRef).then(function (sfDoc) {
        if (!sfDoc.exists) {
          console.log("Document does not exist!");
        }

        const roomUpdate = {};

        roomUpdate[
          `game.player.${state.user.uid}`
        ] = firebase.firestore.FieldValue.delete();

        if (sfDoc.data().participants[ownType].status === "winner") {
          if (sfDoc.data().game.history.length === 0) {
            roomUpdate[`game.turn.uid`] =
              sfDoc.data().participants["player"] &&
              sfDoc.data().participants["master"].id ===
                sfDoc.data().game.turn.uid
                ? sfDoc.data().participants["player"].id
                : sfDoc.data().participants["master"].id;
          } else if (sfDoc.data().game.history.length === 1) {
            roomUpdate[`game.turn.uid`] = sfDoc.data().game.turn.uid;
          } else {
            roomUpdate[`game.turn.uid`] = sfDoc.data().game.history[1].uid;
          }
        }
        roomUpdate[`participants.${ownType}.status`] = "waiting";

        transaction.update(roomRef, roomUpdate);
      });
    });
  };

  return (
    <div className="winner-modal d-flex justify-content-center align-items-center">
      <div className="winner-modal-content p-3 brown-border shadow rounded">
        <React.Fragment>
          {roomData.participants[ownType] &&
          roomData.participants[ownType].status === "winner" ? (
            <WinnerContent roomData={roomData} />
          ) : (
            ""
          )}

          {roomData.participants[ownType] &&
          roomData.participants[ownType].status === "loser" ? (
            <LoserContent roomData={roomData} />
          ) : (
            ""
          )}

          {roomData.participants[ownType] &&
          roomData.participants[ownType].status === "tie" ? (
            <TieContent roomData={roomData} />
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
      </div>
    </div>
  );
}

export default WinnerModal;

function WinnerContent({ roomData }) {
  const { state } = React.useContext(AppContext);
  const [play, { stop }] = useSound(WinSound);

  React.useEffect(() => {
    if (state.user.setting.music.effect) {
      play();
    } else {
      stop();
    }

    return () => {
      stop();
    };
  }, [play, stop, state.user.setting.music.effect]);

  return (
    <React.Fragment>
      <h5 className="text-warning text-stroke-carotv text-center mb-3">
        Chúc mừng
      </h5>
      <h1 className="text-warning text-stroke-carotv mb-0">BẠN THẮNG</h1>
      {roomData.type === "room" ? (
        <h5 className="text-warning text-stroke-carotv text-center">
          + {roomData.bet} xu
        </h5>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}

function LoserContent({ roomData }) {
  const { state } = React.useContext(AppContext);
  const [play, { stop }] = useSound(LostSound);

  React.useEffect(() => {
    if (state.user.setting.music.effect) {
      play();
    } else {
      stop();
    }

    return () => {
      stop();
    };
  }, [play, stop, state.user.setting.music.effect]);

  return (
    <React.Fragment>
      <h5 className="text-muted text-stroke-carotv text-center mb-3">
        Rất tiếc
      </h5>
      <h1 className="text-secondary text-stroke-carotv mb-0">BẠN THUA</h1>
      {roomData.type === "room" ? (
        <h5 className="text-secondary text-stroke-carotv text-center">
          - {roomData.bet} xu
        </h5>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}

function TieContent({ roomData }) {
  return (
    <React.Fragment>
      <h5 className="text-warning text-stroke-carotv text-center mb-3">
        Chúc mừng
      </h5>
      <h1 className="text-warning text-stroke-carotv mb-2">TRẬN HÒA</h1>
    </React.Fragment>
  );
}
