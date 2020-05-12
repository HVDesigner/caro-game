/**
 *
 * Chức năng trời khỏi bàn chơi.
 *
 * @param {({roomId, userId})} data
 * @param {firebase} firebase
 */
export const leaveRoom = async (data, firebase) => {
  const { roomId, userId } = data;

  const docRooms = firebase.firestore().collection("rooms").doc(roomId);
  const docUser = firebase.firestore().collection("users").doc(userId);

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

        if (
          doc.data().participants.master &&
          doc.data().participants.master.id === userId
        ) {
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
          } else if (
            doc.data().participants.watcher &&
            doc.data().participants.watcher.length > 0
          ) {
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
        } else if (
          doc.data().participants.player &&
          doc.data().participants.player.id === userId
        ) {
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

/**
 * --------------------------------------------------------------------------------------
 * Chức năng cập nhật thông tin khi thắng cuộc.
 *
 * @param {({ownType, roomId})} data
 * @param {function} firebase
 */
export const winAction = async (data, firebase) => {
  const { ownType, roomId } = data;

  const updateRoom = {};

  updateRoom[`participants.${ownType}.status`] = "winner";
  updateRoom[
    `participants.${ownType === "master" ? "player" : "master"}.status`
  ] = "loser";
  updateRoom[`game.status.ready`] = 0;
  updateRoom[`game.player`] = {};

  firebase.firestore().collection("rooms").doc(roomId).update(updateRoom);
};

/**
 * ----------------------------------------------------------------------------------------
 * Chức năng chuyển ELO qua kiểu chữ.
 *
 * @param {number} elo
 */
export const filterElo = (elo) => {
  if (0 <= elo && elo < 1150) {
    return "Nhập Môn";
  } else if (1150 <= elo && elo < 1300) {
    return "Tập Sự";
  } else if (1300 <= elo && elo < 1450) {
    return "Tân Thủ";
  } else if (1450 <= elo && elo < 1600) {
    return "Kỳ Thủ";
  } else if (1600 <= elo && elo < 1750) {
    return "Cao Thủ";
  } else if (1750 <= elo && elo < 1900) {
    return "Siêu Cao Thủ";
  } else if (1900 <= elo && elo < 2050) {
    return "Kiện Tướng";
  } else if (2050 <= elo && elo < 2200) {
    return "Đại Kiện Tướng";
  } else if (2200 <= elo && elo < 2350) {
    return "Kỳ Tiên";
  } else if (2350 <= elo && elo < 2500) {
    return "Kỳ Thánh";
  } else {
    return "Nhất Đại Tôn Sư";
  }
};
