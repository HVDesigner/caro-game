import React from "react";
import { Badge } from "react-bootstrap";
import { useFirebaseApp } from "reactfire";
// import Sound from "react-sound";

// Context
import AppContext from "./../../../context/";

// Sound
// import SecondSound from "./../../../assets/sound/second-sound.mp3";

function Counter({ time, roomData, userType, ownType }) {
  const firebaseApp = useFirebaseApp();
  const { state } = React.useContext(AppContext);

  const [counter, setCounter] = React.useState(time);
  // const [soundTime, setSoundTime] = React.useState(Sound.status.PLAYING);

  React.useEffect(() => {
    let timer = setInterval(() => {}, 1000);

    if (counter > 0) {
      timer = setInterval(() => {
        setCounter(counter - 1);
      }, 1000);
    }

    if (counter === 0) {
      setCounter(0);
      clearInterval(timer);
      // setSoundTime(Sound.status.STOPPED);

      // const updateRoom = {};

      // updateRoom[`participants.${userType}.status`] = "loser";
      // updateRoom[
      //   `participants.${userType === "master" ? "player" : "master"}.status`
      // ] = "winner";
      // updateRoom[`game.status.ready`] = 0;
      // updateRoom[`game.player`] = {};

      // firebaseApp
      //   .firestore()
      //   .collection("rooms")
      //   .doc(state.user.room_id.value)
      //   .update(updateRoom);
    }

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
  ]);

  return (
    <div
      style={{ width: "100%" }}
      className="d-flex justify-content-center align-items-center p-1"
    >
      {/* <Sound
        url={SecondSound}
        playStatus={soundTime}
        loop={true}
        onFinishedPlaying={() => {
          // setSoundTime(Sound.status.STOPPED);
        }}
      /> */}
      <Badge pill variant="success">
        <p className="text-white roboto-font" style={{ fontSize: "13px" }}>
          {counter}s
        </p>
      </Badge>
    </div>
  );
}

export default Counter;
