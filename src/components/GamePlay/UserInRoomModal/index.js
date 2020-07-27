import React from "react";
import UserSVG from "./../../../assets/Dashboard/user.svg";
import {
  useFirestore,
  useFirestoreDocDataOnce,
  useFirebaseApp,
  SuspenseWithPerf,
} from "reactfire";

import LoadingOverlay from "./../../LoadingOverlay/";

// Contexts
import AppContext from "./../../../context/";

// Functions
import { kickUser } from "./../../../functions/";

function UserInRoomModal({ setShowUserList, roomData }) {
  return (
    <div
      className="d-flex justify-content-center position-absolute align-items-center w-100vw h-100"
      style={{
        zIndex: "999",
        backgroundColor: " #48484891",
        minHeight: "100vh",
      }}
    >
      <div
        className="d-flex flex-column p-2 bg-brown-wood brown-border rounded shadow"
        style={{ maxHeight: "80vh", maxWidth: "80vw", width: "100%" }}
      >
        <div
          className="mb-2 brown-border rounded p-2 overflow-auto"
          style={{ maxHeight: "100%" }}
        >
          <MasterUser roomData={roomData} />
          {roomData.participants.player ? (
            <PlayerUser roomData={roomData} />
          ) : (
            ""
          )}
          {roomData.participants.watcher &&
          roomData.participants.watcher.length !== 0
            ? roomData.participants.watcher.map((value) => {
                return (
                  <SuspenseWithPerf
                    fallback={<LoadingOverlay />}
                    traceId={"load-user-watcher"}
                    key={value}
                  >
                    <WatcherUser uid={value} roomData={roomData} />
                  </SuspenseWithPerf>
                );
              })
            : ""}
        </div>
        <div>
          <div
            className="bg-gold-wood brown-border rounded wood-btn p-1"
            onClick={() => {
              setShowUserList(false);
            }}
          >
            <p className="m-0 text-center brown-color">Đóng</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInRoomModal;

function MasterUser({ roomData }) {
  const { toggleInfoModal } = React.useContext(AppContext);

  const userRef = useFirestore()
    .collection("users")
    .doc(roomData.participants.master.id);

  const user = useFirestoreDocDataOnce(userRef);

  return (
    <div className="d-flex align-items-center mb-2">
      <img
        src={user.image_url !== "image" ? user.image_url : UserSVG}
        alt="user"
        style={{ height: "50px", width: "50px" }}
        className={`${
          user.image_url !== "image" ? "rounded-pill brown-border" : ""
        } mr-2`}
        onClick={() => {
          toggleInfoModal(true, roomData.participants.master.id);
        }}
      />
      <div className="w-100">
        <p className="text-white text-stroke-carotv mb-0 mr-3">
          {user.name.value}
        </p>
        <small className="text-warning text-stroke-carotv mb-0 mr-3">
          {roomData.type === "room" ? "Chủ phòng" : "Người chơi"}
        </small>
      </div>
    </div>
  );
}

function PlayerUser({ roomData }) {
  const { state, toggleInfoModal } = React.useContext(AppContext);
  const firebaseApp = useFirebaseApp();

  const userRef = useFirestore()
    .collection("users")
    .doc(roomData.participants.player.id);

  const user = useFirestoreDocDataOnce(userRef);

  return (
    <div className="d-flex align-items-center mb-2">
      <img
        src={user.image_url !== "image" ? user.image_url : UserSVG}
        alt="user"
        style={{ height: "50px", width: "50px" }}
        className={`${
          user.image_url !== "image" ? "rounded-pill brown-border" : ""
        } mr-2`}
        onClick={() => {
          toggleInfoModal(true, roomData.participants.player.id);
        }}
      />
      <div className="w-100">
        <p className="text-white text-stroke-carotv mb-0 mr-3">
          {user.name.value}
        </p>
        <small className="text-warning text-stroke-carotv mb-0 mr-3">
          Người chơi
        </small>
      </div>
      {(state.user.uid === roomData.participants.master.id &&
        roomData.type === "room") ||
      ((state.user.uid === roomData.participants.master.id ||
        state.user.uid === roomData.participants.player.id) &&
        roomData.type === "quick-play") ? (
        <div>
          <div
            className="bg-gold-wood brown-border rounded wood-btn p-1"
            onClick={() => {
              kickUser(
                {
                  roomId: roomData.rid,
                  uid: state.user.uid,
                  kickId: roomData.participants.player.id,
                },
                firebaseApp
              );
            }}
          >
            <p className="mb-0 text-center mr-2 ml-2 brown-color">Đuổi</p>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function WatcherUser({ uid, roomData }) {
  const { state, toggleInfoModal } = React.useContext(AppContext);
  const firebaseApp = useFirebaseApp();

  const userRef = useFirestore().collection("users").doc(uid);

  const user = useFirestoreDocDataOnce(userRef);

  return (
    <div className="d-flex align-items-center mb-2">
      <img
        src={user.image_url !== "image" ? user.image_url : UserSVG}
        alt="user"
        style={{ height: "50px", width: "50px" }}
        className={`${
          user.image_url !== "image" ? "rounded-pill brown-border" : ""
        } mr-2`}
        onClick={() => {
          toggleInfoModal(true, uid);
        }}
      />
      <div className="w-100">
        <p className="text-white text-stroke-carotv mb-0 mr-3">
          {user.name.value}
        </p>
        <small className="text-warning text-stroke-carotv mb-0 mr-3">
          Người xem
        </small>
      </div>

      {(state.user.uid === roomData.participants.master.id &&
        roomData.type === "room") ||
      (roomData.participants.player &&
        (state.user.uid === roomData.participants.master.id ||
          state.user.uid === roomData.participants.player.id) &&
        roomData.type === "quick-play") ? (
        <div>
          <div
            className="bg-gold-wood brown-border rounded wood-btn p-1"
            onClick={() => {
              kickUser(
                {
                  roomId: roomData.rid,
                  uid: state.user.uid,
                  kickId: uid,
                },
                firebaseApp
              );
            }}
          >
            <p className="mb-0 text-center mr-2 ml-2 brown-color">Đuổi</p>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
