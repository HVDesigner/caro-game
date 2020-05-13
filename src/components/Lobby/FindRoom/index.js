import React from "react";
import "./index.css";
import AppContext from "./../../../context/";
import { FirebaseContext } from "./../../../Firebase/";
import { TOGGLE_FIND_ROOM_MODAL } from "./../../../context/ActionTypes";
import { loginRoom } from "./../../../functions/";

function FindRoom() {
  const { dispatch, state } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);
  const [roomId, setRoomId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const closeModal = () => {
    dispatch({
      type: TOGGLE_FIND_ROOM_MODAL,
      payload: false,
    });
  };

  const onSubmitForm = (e) => {
    if (e) {
      e.preventDefault();
    }
    console.log(roomId);
    firebase
      .firestore()
      .collection("rooms")
      .doc(roomId.toString())
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          console.log(doc.data().password.status, password);
          if (doc.data().password.status && password !== "") {
            loginRoom(
              { uid: state.user.uid, ...doc.data(), rawText: password },
              firebase
            );
          } else {
            setError("Bàn có mật khẩu!");
          }
        } else {
          setError("Bàn không tồn tại");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  };

  return (
    <div
      className="position-absolute find-room-modal d-flex justify-content-center align-items-center"
      style={{ zIndex: "9999" }}
    >
      <div className="find-room-modal-content p-3 brown-border rounded shadow">
        <form onSubmit={onSubmitForm} className="d-flex flex-column">
          <input
            placeholder="Nhập ID phòng"
            className="input-carotv-2 mb-2"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            maxLength="6"
          />
          <input
            placeholder="Nhập mật khẩu (nếu có)"
            className="input-carotv-2 mb-2"
            value={password}
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </form>
        <div className="find-room-btn brown-border rounded mb-2">
          <p
            className="mb-0 text-center wood-btn-back p-1"
            onClick={() => {
              onSubmitForm();
            }}
          >
            Vào phòng
          </p>
        </div>
        <div className="find-room-btn brown-border rounded mb-2">
          <p
            className="mb-0 text-center wood-btn-back p-1"
            onClick={() => {
              closeModal();
            }}
          >
            Thoát
          </p>
        </div>
        {error ? (
          <p className="mb-0 text-center text-warning p-1">{error}</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default FindRoom;
