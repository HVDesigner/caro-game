export const leaveRoom = async (data, firebase) => {
  const { roomId, userId, userType } = data;

  let docRooms = firebase.firestore().collection("rooms").doc(roomId);
  let docUser = firebase.firestore().collection("users").doc(userId);

  try {
    // Out room
    await docUser.update({
      "location.path": "lobby",
      "room_id.type": "none",
      "room_id.value": 0,
    });

    const room = await docRooms.get();

    if (userType === "master") {
      // If master leave room

      if (room.data().participants.player) {
        // if have player

        const playerID = room.data().participants.player.id;

        // update master
        // remove player in participants list
        // update turn
        // remove player ready
        // remove history
        // update game status
        await docRooms.update({
          "participants.master.id": playerID,
          "participants.master.status": "waiting",
          "participants.master.win": 0,
          "participants.player": firebase.firestore.FieldValue.delete(),
          "game.turn.uid": playerID,
          "game.player": {},
          "game.history": [],
          "game.status.ready": 0,
        });
      } else if (room.data().participants.watcher) {
        // if only have watcher

        const watcherId = room.data().participants.watcher[0];

        // update master
        // remove watcher in participants list
        // update turn
        // remove player ready
        // remove history
        // update game status
        await docRooms.update({
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
        await docRooms.delete();
      }
    } else if (userType === "player") {
      // if player leave room

      // update master
      // remove player in participants list
      // update turn
      // remove player ready
      // remove history
      // update game status
      await docRooms.update({
        "participants.master.status": "waiting",
        "participants.master.win": 0,
        "game.turn.uid": room.data().participants.master.id,
        "game.player": {},
        "game.history": [],
        "game.status.ready": 0,
      });

      await docRooms.update({
        "participants.player": firebase.firestore.FieldValue.delete(),
      });
    } else if (userType === "watcher") {
      // if watcher leave room

      // remove watcher in participants list
      await docRooms.update({
        "participants.watcher": firebase.firestore.FieldValue.arrayRemove(
          userId
        ),
      });
    }

    return { code: 1, text: "Leave succeeded." };
  } catch (error) {
    console.log("Leave failed: " + error.message);
    return { code: -1, text: "Leave failed: " + error.message };
  }
};

export const winAction = async (data, firebase) => {
  const { ownType, roomData, roomId, userCoin, userId } = data;

  let updateRoom = {};

  updateRoom[`participants.${ownType}.status`] = "winner";

  updateRoom[`participants.${ownType}.win`] =
    roomData.participants[ownType].win + 1;

  updateRoom[
    `participants.${ownType === "master" ? "player" : "master"}.status`
  ] = "loser";

  firebase.firestore().collection("rooms").doc(roomId).update(updateRoom);

  if (roomData.type === "room") {
    let userUpdate = {};
    userUpdate[`coin`] = userCoin - roomData.bet;

    firebase.firestore().collection("users").doc(userId).update(userUpdate);
  }
};
