import bcrypt from "bcryptjs";
import firebaseApp from "firebase/app";

const participantsDataConstant = (id) => {
  return {
    id,
    status: "waiting",
    win: 0,
  };
};

// const roomDataConstant = (bet, password) => {
//   let createRoom = {
//     bet,
//     password: {
//       status: password ? true : false,
//       text: password ? bcrypt.hashSync(password, 10) : "",
//     },
//     game: {
//       "current-step": {},
//       player: {},
//       history: [],
//       status: { ready: 0 },
//       turn: { uid: state.user.uid },
//       "tie-request": [],
//       "no-soft": {
//         status: false,
//         gamePlay: "",
//         rowString: "",
//         row: 0,
//         col: 0,
//       },
//     },
//     rule: rule ? "6-win" : "6-no-win",
//     time: getTime().type,
//     title: name ? name : `Phòng của ${state.user.name.value}`,
//     type: "room",
//     conversation: [],
//     pan: [],
//     participants: {
//       master: {
//         id: state.user.uid,
//         status: "waiting",
//         win: 0,
//       },
//     },
//     "game-play": gamePlay ? "gomoku" : "block-head",
//     createdAt: firebaseApp.firestore.FieldValue.serverTimestamp(),
//     updatedAt: firebaseApp.firestore.FieldValue.serverTimestamp(),
//   };
// };

/**
 *
 * Chức năng rời khỏi bàn chơi.
 *
 * @param { {roomId, userId} } data
 * @param {*} firebase
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

            // update master, player and game
            transaction.update(docRooms, {
              "participants.master.id": playerID,
              "participants.master.status": "waiting",
              "participants.master.win": 0,
              "participants.player": firebaseApp.firestore.FieldValue.delete(),
              "game.turn.uid": playerID,
              "game.player": {},
              "game.history": [],
              "game.current-step": {},
              "game.status.ready": 0,
              "game.tie-request": [],
            });
          } else if (
            doc.data().participants.watcher &&
            doc.data().participants.watcher.length > 0
          ) {
            // if only have watcher

            const watcherId = doc.data().participants.watcher[0];

            // update master, player and game
            transaction.update(docRooms, {
              "participants.master.id": watcherId,
              "participants.master.status": "waiting",
              "participants.master.win": 0,
              "participants.watcher": firebaseApp.firestore.FieldValue.arrayRemove(
                watcherId
              ),
              "game.turn.uid": watcherId,
              "game.player": {},
              "game.history": [],
              "game.current-step": {},
              "game.status.ready": 0,
              "game.tie-request": [],
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

          // update master, player and game
          transaction.update(docRooms, {
            "participants.master.status": "waiting",
            "participants.master.win": 0,
            "participants.player": firebaseApp.firestore.FieldValue.delete(),
            "game.turn.uid": doc.data().participants.master.id,
            "game.player": {},
            "game.history": [],
            "game.current-step": {},
            "game.status.ready": 0,
            "game.tie-request": [],
          });
        } else {
          // if watcher leave room

          // remove watcher in participants list
          transaction.update(docRooms, {
            "participants.watcher": firebaseApp.firestore.FieldValue.arrayRemove(
              userId
            ),
          });
        }
      });
    });

    return { code: 1, text: "Leave succeeded." };
  } catch (error) {
    return { code: -1, text: "Leave failed: " + error.message };
  }
};

/**
 * --------------------------------------------------------------------------------------
 * Chức năng cập nhật thông tin khi thắng cuộc.
 *
 * @param { {ownType, roomId} } data
 * @param {function} firebase
 */
export const winAction = async (data, firebase) => {
  const { ownType, roomId } = data;

  const batch = firebase.firestore().batch();
  const roomRef = firebase.firestore().collection("rooms").doc(roomId);

  const updateRoom = {};
  updateRoom[`participants.${ownType}.status`] = "winner";
  updateRoom[
    `participants.${ownType === "master" ? "player" : "master"}.status`
  ] = "loser";
  updateRoom[`game.status.ready`] = 0;
  updateRoom[`game.player`] = {};
  updateRoom["game.tie-request"] = [];

  batch.update(roomRef, updateRoom);
  batch.commit();
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

/**
 * ----------------------------------------------------------------------------------------
 * Chức năng đăng nhập vào bàn chơi.
 *
 * @param {Object} data
 * @param {function} firebase
 */
export const loginRoom = (data, firebase) => {
  // Kiểm tra mật khẩu
  const checkPass = bcrypt.compareSync(data.rawText, data.password.text);

  // Chức năng đăng nhập
  const doLogin = () => {
    const roomWithIdRef = firebase
      .firestore()
      .collection("rooms")
      .doc(data.rid);

    return firebase.firestore().runTransaction((transaction) => {
      return transaction
        .get(roomWithIdRef)
        .then((tranDoc) => {
          if (!tranDoc.exists) {
            console.log("Phòng không tồn tại");
          }

          const roomUpdates = {};

          roomUpdates["participants.player.id"] = data.uid;
          roomUpdates["participants.player.status"] = "waiting";
          roomUpdates["participants.player.win"] = 0;

          // Cập nhật thông tin room
          return transaction.update(roomWithIdRef, roomUpdates);
        })
        .then(async () => {
          // Chuyển hướng người đăng nhập vào phòng.
          // Cập nhật thông tin loại phòng và id phòng cho user
          return await firebase
            .firestore()
            .collection("users")
            .doc(data.uid)
            .update({
              "room_id.type": data["game-play"],
              "room_id.value": data.rid,
              "location.path": "room",
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  if (!data.password.status) {
    // Nếu phòng không cần password
    return doLogin();
  } else if (checkPass) {
    // Phòng có password và password đúng
    return doLogin();
  } else {
    // Sai mật khẩu
    return new Promise((_, reject) =>
      reject({ value: checkPass, text: "Mật khẩu không chính xác." })
    );
  }
};

export const loginWatch = (data, firebase) => {
  // Kiểm tra mật khẩu
  const checkPass = bcrypt.compareSync(data.rawText, data.password.text);

  // Chức năng đăng nhập
  const doLogin = () => {
    const roomWithIdRef = firebase
      .firestore()
      .collection("rooms")
      .doc(data.rid);

    return firebase.firestore().runTransaction((transaction) => {
      return transaction
        .get(roomWithIdRef)
        .then((tranDoc) => {
          if (!tranDoc.exists) {
            console.log("Phòng không tồn tại");
          }

          const roomUpdates = {};

          roomUpdates[
            "participants.watcher"
          ] = firebaseApp.firestore.FieldValue.arrayUnion(data.uid);

          // Cập nhật thông tin room
          return transaction.update(roomWithIdRef, roomUpdates);
        })
        .then(() => {
          // Chuyển hướng người đăng nhập vào phòng.
          // Cập nhật thông tin loại phòng và id phòng cho user
          return firebase.firestore().collection("users").doc(data.uid).update({
            "room_id.type": data["game-play"],
            "room_id.value": data.rid,
            "location.path": "room",
          });
        })
        .catch(() => {
          return { value: checkPass, text: "Không thể đăng nhập." };
        });
    });
  };

  if (checkPass) {
    // Phòng có password và password đúng
    return doLogin();
  } else {
    // Sai mật khẩu
    return new Promise((_, reject) =>
      reject({ value: checkPass, text: "Mật khẩu không chính xác." })
    );
  }
};

/**
 * Chức năng sẵn sàng.
 *
 * @param { {roomId, uid} } data
 * @param {*} firebase
 */
export const readyAction = (data, firebase) => {
  const { roomId, uid } = data;

  const room = firebase.firestore().collection("rooms").doc(roomId);

  return firebase.firestore().runTransaction((transaction) => {
    return transaction.get(room).then((doc) => {
      if (!doc.exists) {
        return { message: "Phòng không tồn tại!" };
      }

      const player = Object.values(doc.data().game.player);

      if (player.length === 1) {
        // Có một người chơi đã sẵn sàng.
        const firstUpdateGame = {};

        // Cập nhật lên có 2 người chơi đã sẵn sàng.
        // Làm rỗng lịch sử.
        // Thêm người chơi vào game.player với loại cờ X hoặc O.
        // Cập nhật trạng thái có 2 người chơi, để chuyển hướng.
        firstUpdateGame[`game.status.ready`] = 2;
        firstUpdateGame[`game.history`] = [];
        firstUpdateGame[`game.player.${uid}.value`] =
          player[0].value === 1 ? 2 : 1;
        firstUpdateGame[`game.current-step`] = {};
        firstUpdateGame[
          `game.turn.updatedAt`
        ] = firebaseApp.firestore.FieldValue.serverTimestamp();
        firstUpdateGame["game.tie-request"] = [];
        firstUpdateGame[`participants.master.status`] = "playing";
        firstUpdateGame[`participants.player.status`] = "playing";

        // Cập nhật những thông tin trên.
        transaction.update(room, firstUpdateGame);

        return { ready: 2, message: "second ready" };
      } else if (player.length === 0) {
        // Chưa có người chơi sẵn sàng.
        const secondUpdateGame = {};

        // Cập nhật lên có 1 người chơi đã sẵn sàng.
        // Thêm người chơi vào game.player với loại cờ X hoặc O.
        secondUpdateGame[`game.status.ready`] = 1;
        secondUpdateGame[`game.player.${uid}.value`] =
          Math.floor(Math.random() * 2) + 1;

        // Cập nhật những thông tin trên.
        transaction.update(room, secondUpdateGame);

        return { ready: 1, message: "first ready" };
      } else {
        return { ready: 1, message: "nothing ready" };
      }
    });
  });
};

/**
 * Chức năng kick người chơi.
 *
 * @param { {roomId, uid, kickId} } data
 * @param {*} firebase
 */
export const kickUser = (data, firebase) => {
  const { roomId, uid, kickId } = data;

  const room = firebase.firestore().collection("rooms").doc(roomId);
  const user = firebase.firestore().collection("users").doc(kickId);

  return firebase.firestore().runTransaction((transaction) => {
    return transaction.get(room).then((doc) => {
      if (!doc.exists) {
        return Promise.reject({ message: "Phòng không tồn tại!" });
      }

      transaction.update(user, {
        "location.path": "lobby",
        "room_id.value": 0,
        "room_id.type": "none",
      });

      if (
        doc.data().participants.master.id === uid &&
        doc.data().type === "room"
      ) {
        if (doc.data().participants.player.id === kickId) {
          transaction.update(room, {
            "game.status.ready": 0,
            "game.player": {},
            "game.turn": { uid: doc.data().participants.master.id },
            "game.tie-request": [],
            "participants.master": participantsDataConstant(
              doc.data().participants.master.id
            ),
            "participants.player": firebaseApp.firestore.FieldValue.delete(),
            pan: firebaseApp.firestore.FieldValue.arrayUnion(kickId),
          });
        } else {
          transaction.update(room, {
            "participants.watcher": firebaseApp.firestore.FieldValue.arrayRemove(
              kickId
            ),
            pan: firebaseApp.firestore.FieldValue.arrayUnion(kickId),
          });
        }
      }

      if (
        (doc.data().participants.master.id === uid ||
          doc.data().participants.player.id === uid) &&
        doc.data().type === "quick-play"
      ) {
        transaction.update(room, {
          "participants.watcher": firebaseApp.firestore.FieldValue.arrayRemove(
            kickId
          ),
          pan: firebaseApp.firestore.FieldValue.arrayUnion(kickId),
        });
      }
    });
  });
};

/**
 * Chức năng chuyển sang ngồi xem.
 *
 * @param { {roomId, uid} } data
 * @param {*} firebase
 */
export const changeToWatch = (data, firebase) => {
  const { roomId, uid } = data;

  const room = firebase.firestore().collection("rooms").doc(roomId);

  return firebase.firestore().runTransaction((transaction) => {
    return transaction.get(room).then((doc) => {
      if (!doc.exists) {
        return Promise.reject({ message: "Phòng không tồn tại!" });
      }

      if (doc.data().participants.master.id === uid) {
        transaction.update(room, {
          "game.status.ready": 0,
          "game.player": {},
          "game.turn": { uid: doc.data().participants.player.id },
          "game.tie-request": [],
          "participants.master": participantsDataConstant(
            doc.data().participants.player.id
          ),
          "participants.player": firebaseApp.firestore.FieldValue.delete(),
          "participants.watcher": firebaseApp.firestore.FieldValue.arrayUnion(
            uid
          ),
        });
      }

      if (doc.data().participants.player.id === uid) {
        transaction.update(room, {
          "game.status.ready": 0,
          "game.player": {},
          "game.turn": { uid: doc.data().participants.master.id },
          "game.tie-request": [],
          "participants.master": participantsDataConstant(
            doc.data().participants.master.id
          ),
          "participants.player": firebaseApp.firestore.FieldValue.delete(),
          "participants.watcher": firebaseApp.firestore.FieldValue.arrayUnion(
            uid
          ),
        });
      }
    });
  });
};

/**
 * Chức năng chuyển sang ngồi chơi.
 *
 * @param { {roomId, uid} } data
 * @param {*} firebase
 */
export const changeToPlay = (data, firebase) => {
  const { roomId, uid } = data;

  const room = firebase.firestore().collection("rooms").doc(roomId);

  return firebase.firestore().runTransaction((transaction) => {
    return transaction.get(room).then((doc) => {
      if (!doc.exists) {
        return Promise.reject({ message: "Phòng không tồn tại!" });
      }

      if (doc.data().participants.player) {
        return Promise.reject({ message: "Đã có người chơi!" });
      } else {
        transaction.update(room, {
          "participants.player": { id: uid, status: "waiting", win: 0 },
          "participants.watcher": firebaseApp.firestore.FieldValue.arrayRemove(
            uid
          ),
        });
      }
    });
  });
};

/**
 * Chức năng cầu hòa.
 *
 * @param {{roomId, uid}} data
 * @param {*} firebase
 */
export const GetTie = (data, firebase) => {
  const { roomId, uid } = data;

  const room = firebase.firestore().collection("rooms").doc(roomId);

  return firebase.firestore().runTransaction((transaction) => {
    return transaction.get(room).then((doc) => {
      if (!doc.exists) {
        return { message: "Phòng không tồn tại!" };
      }

      const tieRequest = doc.data().game["tie-request"];

      // Nếu tie-request.length == 0 thì thêm uid vào tie-request và thêm vào conversation 1 đoạn tin nhắn "Xin cầu hòa."
      if (tieRequest.length === 0) {
        // Có một người chơi đã sẵn sàng.
        const firstUpdateGame = {};

        firstUpdateGame[
          "game.tie-request"
        ] = firebaseApp.firestore.FieldValue.arrayUnion(uid);
        firstUpdateGame[
          "conversation"
        ] = firebaseApp.firestore.FieldValue.arrayUnion({
          text: "Xin cầu hòa.",
          uid,
          type: "tie-message",
          createAt: Date.now(),
        });

        // Cập nhật những thông tin trên.
        transaction.update(room, firstUpdateGame);

        return { tie: [uid], message: "Xin cầu hòa" };
      }

      // Nếu tie-request.length == 1 thì reset phòng chơi và tăng trận hòa cho user.
      else {
        // Nếu có thì lớn hơn -1, nếu không thì bằng -1.
        const check = tieRequest.findIndex((value) => value === uid);
        if (check >= 0) {
          const firstUpdateGame = {};

          firstUpdateGame[
            "conversation"
          ] = firebaseApp.firestore.FieldValue.arrayUnion({
            text: "Xin cầu hòa.",
            uid,
            type: "tie-message",
            createAt: Date.now(),
          });

          // Cập nhật những thông tin trên.
          transaction.update(room, firstUpdateGame);

          return { tie: [uid], message: "Xin cầu hòa" };
        } else {
          const updateRoom = {};
          updateRoom[`participants.master.status`] = "tie";
          updateRoom[`participants.player.status`] = "tie";
          updateRoom[`game.status.ready`] = 0;
          updateRoom[`game.player`] = {};
          updateRoom["game.tie-request"] = [];

          // Cập nhật những thông tin trên.
          transaction.update(room, updateRoom);

          return { message: "Hòa" };
        }
      }
    });
  });
};

/**
 * Chức năng bấm yêu thích.
 *
 * @param { {ownId, uid} } data
 * @param {*} firebase
 */
export const LikeFunc = (data, firebase) => {
  const { ownId, uid } = data;

  const user = firebase.firestore().collection("users").doc(uid);

  user.update({
    like: firebaseApp.firestore.FieldValue.arrayUnion(ownId),
  });
};

/**
 * Chức năng bỏ yêu thích.
 *
 * @param { {ownId, uid} } data
 * @param {*} firebase
 */
export const UnLikeFunc = (data, firebase) => {
  const { ownId, uid } = data;

  const user = firebase.firestore().collection("users").doc(uid);

  user.update({
    like: firebaseApp.firestore.FieldValue.arrayRemove(ownId),
  });
};
