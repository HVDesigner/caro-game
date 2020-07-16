import React from "react";
import UserSVG from "./../../../assets/Dashboard/user.svg";
import { useFirestore, useFirestoreDocDataOnce } from "reactfire";
import AppContext from "./../../../context/";

function UserInRoomModal({ setShowUserList, roomData }) {
  return (
    <div
      className="d-flex justify-content-center position-absolute align-items-center h-100vh w-100vw"
      style={{ zIndex: "999", backgroundColor: " #48484891" }}
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
                return <WatcherUser key={value} uid={value} />;
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
        src={user.image_url ? user.image_url : UserSVG}
        alt="user"
        style={{ height: "50px", width: "50px" }}
        className={`${user.image_url ? "rounded-pill brown-border" : ""} mr-2`}
        onClick={() => {
          toggleInfoModal(true, roomData.participants.master.id);
        }}
      />
      <div className="w-100">
        <p className="text-white text-stroke-carotv mb-0 mr-3">
          {user.name.value}
        </p>
        <small className="text-warning text-stroke-carotv mb-0 mr-3">
          Chủ phòng
        </small>
      </div>
    </div>
  );
}

function PlayerUser({ roomData }) {
  const { state, toggleInfoModal } = React.useContext(AppContext);

  const userRef = useFirestore()
    .collection("users")
    .doc(roomData.participants.player.id);

  const user = useFirestoreDocDataOnce(userRef);

  return (
    <div className="d-flex align-items-center mb-2">
      <img
        src={user.image_url ? user.image_url : UserSVG}
        alt="user"
        style={{ height: "50px", width: "50px" }}
        className={`${user.image_url ? "rounded-pill brown-border" : ""} mr-2`}
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
      {state.user.uid === roomData.participants.master.id ? (
        <div>
          <div className="bg-gold-wood brown-border rounded wood-btn p-1">
            <p className="mb-0 text-center mr-2 ml-2 brown-color">Đuổi</p>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function WatcherUser({ uid }) {
  const { toggleInfoModal } = React.useContext(AppContext);

  const userRef = useFirestore().collection("users").doc(uid);

  const user = useFirestoreDocDataOnce(userRef);

  return (
    <div className="d-flex align-items-center mb-2">
      <img
        src={user.image_url ? user.image_url : UserSVG}
        alt="user"
        style={{ height: "50px", width: "50px" }}
        className={`${user.image_url ? "rounded-pill brown-border" : ""} mr-2`}
        onClick={() => {
          toggleInfoModal(true, uid);
        }}
      />
      <p className="text-white text-stroke-carotv mb-0 mr-3">
        {user.name.value}
      </p>
    </div>
  );
}
