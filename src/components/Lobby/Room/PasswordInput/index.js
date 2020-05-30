import React from "react";
import { useFirebaseApp } from "reactfire";

// Contexts
import { TOGGLE_DIALOG } from "./../../../../context/ActionTypes";
import AppContext from "./../../../../context/";

// Functions
import { loginRoom, loginWatch } from "./../../../../functions/";

function PasswordInput({ roomData }) {
  const firebaseApp = useFirebaseApp();
  const { state, dispatch } = React.useContext(AppContext);

  const [pass, setPass] = React.useState("");
  const [loginInProcess, setLoginInProcess] = React.useState(false);
  const [passError, setPassError] = React.useState({ status: false, text: "" });

  const onPasswordSubmit = () => {
    // Kiểm tra xu.
    if (parseInt(roomData.bet) > parseInt(state.user.coin)) {
      return dispatch({
        type: TOGGLE_DIALOG,
        payload: {
          status: true,
          message: "Bạn không đủ xu!",
        },
      });
    }

    // Kiểm tra người chơi.
    if (roomData.participants.player && roomData.participants.master) {
      return dispatch({
        type: TOGGLE_DIALOG,
        payload: {
          status: true,
          message: "Đã có người chơi!",
        },
      });
    }

    // Kiểm tra mật khẩu.
    if (pass) {
      setLoginInProcess(true);
      setPassError({ status: false, text: "" });

      loginRoom(
        { uid: state.user.uid, ...roomData, rawText: pass },
        firebaseApp
      )
        .then()
        .catch((err) => {
          setLoginInProcess(false);
          setPassError({ status: true, text: err.text });
        });
    } else {
      setPassError({ status: true, text: "Chưa điền mật khẩu." });
    }
  };

  const onWatchSubmit = () => {
    if (pass) {
      loginWatch(
        { uid: state.user.uid, ...roomData, rawText: pass },
        firebaseApp
      )
        .then()
        .catch((err) => {
          setLoginInProcess(false);
          setPassError({ status: true, text: err.text });
        });
    } else {
      setPassError({ status: true, text: "Chưa điền mật khẩu." });
    }
  };

  return (
    <div>
      {loginInProcess ? (
        <p className="text-warning mb-1 text-center">Đang đăng nhập...</p>
      ) : (
        <div
          className={`room-item-footer pt-2 pl-2 pr-2 ${
            passError.status ? "" : "pb-2"
          } d-flex flex-column`}
        >
          <div className="d-flex">
            <span className="text-white mr-2">Mật khẩu:</span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="form-carotv d-flex flex-fill"
            >
              <input
                type="password"
                className="input-carotv text-white flex-fill"
                placeholder="Nhập mật khẩu..."
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                }}
              />
            </form>
          </div>
          <div className="d-flex w-100 mt-2">
            <div
              className="flex-fill p-1 bg-gold-wood rounded brown-border mr-1 wood-btn"
              onClick={() => {
                onPasswordSubmit();
              }}
            >
              <p className="m-0 text-center brown-color">VÀO CHƠI</p>
            </div>
            <div
              className="flex-fill p-1 bg-gold-wood rounded brown-border ml-2 wood-btn"
              onClick={() => {
                onWatchSubmit();
              }}
            >
              <p className="m-0 text-center brown-color">VÀO XEM</p>
            </div>
          </div>
        </div>
      )}
      {passError.status ? (
        <p className="text-warning mb-1 text-center">{passError.text}</p>
      ) : (
        ""
      )}
    </div>
  );
}

export default PasswordInput;
