export const leaveRoom = async (data, firebase) => {
  const { roomId, userId } = data;

  let docRooms = firebase.firestore().collection("rooms").doc(roomId);
  let docUser = firebase.firestore().collection("users").doc(userId);

  try {
    // Out room
    await docUser.update({
      "location.path": "lobby",
      "room_id.type": "none",
      "room_id.value": 0,
    });

    firebase.firestore().runTransaction((transaction) => {
      return transaction.get(docRooms).then((doc) => {
        if (!doc.exists) {
          console.log("Document does not exist!");
        }

        if (doc.data().participants.master.id === userId) {
          // If master leave room

          if (doc.data().participants.player) {
            // if have player

            const playerID = doc.data().participants.player.id;

            // update master
            // remove player in participants list
            // update turn
            // remove player ready
            // remove history
            // update game status
            transaction.update(docRooms, {
              "participants.master.id": playerID,
              "participants.master.status": "waiting",
              "participants.master.win": 0,
              "participants.player": firebase.firestore.FieldValue.delete(),
              "game.turn.uid": playerID,
              "game.player": {},
              "game.history": [],
              "game.status.ready": 0,
            });
          } else if (doc.data().participants.watcher) {
            // if only have watcher

            const watcherId = doc.data().participants.watcher[0];

            // update master
            // remove watcher in participants list
            // update turn
            // remove player ready
            // remove history
            // update game status
            transaction.update(docRooms, {
              "participants.master.id": watcherId,
              "participants.master.status": "waiting",
              "participants.master.win": 0,
              "participants.watcher": firebase.firestore.FieldValue.arrayRemove(
                watcherId
              ),
              "game.turn.uid": watcherId,
              "game.player": {},
              "game.history": [],
              "game.status.ready": 0,
            });
          } else {
            // if only have master in room

            // remove room
            transaction.delete(docRooms);
          }
        } else if (doc.data().participants.player.id === userId) {
          // if player leave room

          // update master
          // remove player in participants list
          // update turn
          // remove player ready
          // remove history
          // update game status
          transaction.update(docRooms, {
            "participants.master.status": "waiting",
            "participants.master.win": 0,
            "game.turn.uid": doc.data().participants.master.id,
            "game.player": {},
            "game.history": [],
            "game.status.ready": 0,
          });

          transaction.update(docRooms, {
            "participants.player": firebase.firestore.FieldValue.delete(),
          });
        } else {
          // if watcher leave room

          // remove watcher in participants list
          transaction.update(docRooms, {
            "participants.watcher": firebase.firestore.FieldValue.arrayRemove(
              userId
            ),
          });
        }
      });
    });

    return { code: 1, text: "Leave succeeded." };
  } catch (error) {
    console.log("Leave failed: " + error.message);
    return { code: -1, text: "Leave failed: " + error.message };
  }
};

export const winAction = async (data, firebase) => {
  const { ownType, roomId } = data;

  let updateRoom = {};

  updateRoom[`participants.${ownType}.status`] = "winner";
  updateRoom[
    `participants.${ownType === "master" ? "player" : "master"}.status`
  ] = "loser";
  updateRoom[`game.status.ready`] = 0;
  updateRoom[`game.player`] = {};

  firebase.firestore().collection("rooms").doc(roomId).update(updateRoom);
};
