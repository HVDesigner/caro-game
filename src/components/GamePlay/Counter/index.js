import React from "react";
import { Badge } from "react-bootstrap";

import { FirebaseContext } from "./../../../Firebase/index";
import AppContext from "./../../../context/";

function Counter({ time, roomData, userType, ownType }) {
  const [counter, setCounter] = React.useState(time);
  const firebase = React.useContext(FirebaseContext);
  const { state } = React.useContext(AppContext);

  React.useEffect(() => {
    let timer = setInterval(() => {}, 1000);

    if (counter > 0) {
      timer = setInterval(() => setCounter(counter - 1), 1000);
    }

    if (counter === 0) {
      setCounter(0);
      clearInterval(timer);

      if (userType !== ownType) {
        let updateRoom = {};

        updateRoom[`participants.${userType}.status`] = "loser";
        updateRoom[
          `participants.${userType === "master" ? "player" : "master"}.status`
        ] = "winner";
        updateRoom[
          `participants.${userType === "master" ? "player" : "master"}.win`
        ] = firebase.firestore.FieldValue.increment(1);

        firebase
          .firestore()
          .collection("rooms")
          .doc(state.user.room_id.value)
          .update(updateRoom);

        if (roomData.type === "room") {
          const loserRef = firebase
            .firestore()
            .collection("users")
            .doc(roomData.participants[userType].id);

          const winnerRef = firebase
            .firestore()
            .collection("users")
            .doc(
              roomData.participants[userType === "master" ? "player" : "master"]
                .id
            );

          firebase.firestore().runTransaction(function (transaction) {
            return Promise.all([
              transaction.get(loserRef).then(function (sfDoc) {
                if (!sfDoc.exists) {
                  return "Document does not exist!";
                }

                transaction.update(loserRef, {
                  coin: firebase.firestore.FieldValue.increment(
                    -parseInt(roomData.bet)
                  ),
                });
              }),
              transaction.get(winnerRef).then(function (sfDoc) {
                if (!sfDoc.exists) {
                  return "Document does not exist!";
                }

                transaction.update(winnerRef, {
                  coin: firebase.firestore.FieldValue.increment(
                    parseInt(roomData.bet)
                  ),
                });
              }),
            ]);
          });
        }
      }
    }

    return () => clearInterval(timer);
  }, [
    counter,
    firebase,
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
      <Badge pill variant="success">
        <p className="text-white roboto-font" style={{ fontSize: "13px" }}>
          {counter}s
        </p>
      </Badge>
    </div>
  );
}

export default Counter;
