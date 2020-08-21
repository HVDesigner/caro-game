import React from "react";
import { Badge } from "react-bootstrap";
import { useFirebaseApp } from "reactfire";
import useSound from "use-sound";

// Context
import AppContext from "./../../../context/";

// Sound
import FiveSecondLastSound from "./../../../assets/sound/second-sound.mp3";
import OneSecondLastSound from "./../../../assets/sound/one-second-last.mp3";

function Counter({ time, roomData, userType }) {
  const firebaseApp = useFirebaseApp();
  const { state } = React.useContext(AppContext);

  const [counter, setCounter] = React.useState(time);
  const [playFive, { stop: stopFive }] = useSound(FiveSecondLastSound);
  const [playOne, { stop: stopOne }] = useSound(OneSecondLastSound);

  React.useEffect(() => {
    const updateAction = () => {
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
    };

    const timer = setInterval(
      function (updatedAt, timeConst) {
        const calTime = (
          ((Date.now() - updatedAt.toMillis()) % 60000) /
          1000
        ).toFixed(0);

        if (calTime >= timeConst) {
          setCounter(0);
          updateAction();
          clearInterval(timer);
        } else if (updatedAt) {
          // console.log(time, calTime);
          setCounter(time - calTime);
        }
      },
      1001,
      roomData.game.turn.updatedAt,
      time
    );

    return () => {
      clearInterval(timer);
    };
  }, [
    counter,
    firebaseApp,
    state.user.room_id.value,
    roomData.game.turn.updatedAt,
    userType,
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
      stopOne();
    };
  }, [
    counter,
    stopOne,
    stopFive,
    playOne,
    playFive,
    state.user.setting.music.effect,
  ]);

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
