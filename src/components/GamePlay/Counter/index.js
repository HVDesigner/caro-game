import React from "react";
import { Badge } from "react-bootstrap";
import { useFirebaseApp } from "reactfire";
import useSound from "use-sound";

// Context
import AppContext from "./../../../context/";

// Sound
import FiveSecondLastSound from "./../../../assets/sound/second-sound.mp3";
import OneSecondLastSound from "./../../../assets/sound/one-second-last.mp3";

function Counter({ time, roomData, userType, ownType }) {
  const firebaseApp = useFirebaseApp();
  const { state } = React.useContext(AppContext);

  const [counter, setCounter] = React.useState(time);
  const [playFive, { stop: stopFive }] = useSound(FiveSecondLastSound);
  const [playOne] = useSound(OneSecondLastSound);

  React.useEffect(() => {
    let timer = setInterval(() => {}, 1000);

    function updateAction() {
      const updateRoom = {};
      updateRoom[`participants.${userType}.status`] = "loser";
      updateRoom[
        `participants.${userType === "master" ? "player" : "master"}.status`
      ] = "winner";
      updateRoom[`game.status.ready`] = 0;
      updateRoom[`game.player`] = {};
      firebaseApp
        .firestore()
        .collection("rooms")
        .doc(state.user.room_id.value)
        .update(updateRoom);
    }

    timer = setInterval(() => {
      let t = Date.now() - roomData.game.turn.updatedAt;

      const calHour = Math.floor(
        (t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const calMinute = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      const calSecond = Math.floor((t % (1000 * 60)) / 1000);

      setCounter(time - calSecond);

      if (calHour > 0) {
        setCounter(0);
        clearInterval(timer);
        updateAction();
      } else if (calMinute) {
        setCounter(0);
        clearInterval(timer);
        updateAction();
      } else if (counter === 0) {
        setCounter(0);
        clearInterval(timer);
        updateAction();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [
    counter,
    firebaseApp,
    userType,
    roomData.bet,
    roomData.participants,
    roomData.type,
    state.user.coin,
    state.user.room_id.value,
    state.user.uid,
    ownType,
    roomData.game.turn.updatedAt,
    time,
  ]);

  React.useEffect(() => {
    if (state.user.setting.music.effect && counter <= 5 && counter >= 0) {
      playFive();
    }
    if (state.user.setting.music.effect && counter === 1) {
      playOne();
    }
    return () => {
      stopFive();
    };
  }, [counter, stopFive, playOne, playFive, state.user.setting.music.effect]);

  return (
    <div
      style={{ width: "100%" }}
      className="d-flex justify-content-center align-items-center p-1"
    >
      <Badge pill variant="success">
        <p className="text-white roboto-font" style={{ fontSize: "13px" }}>
          {counter}s
        </p>
      </Badge>
    </div>
  );
}

export default Counter;
