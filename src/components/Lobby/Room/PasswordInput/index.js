import React from "react";
import { useFirebaseApp } from "reactfire";
import { TOGGLE_DIALOG } from "./../../../../context/ActionTypes";

// SVGs
import LeftSVG from "./../../../../assets/chevron-left.svg";

// Contexts
import AppContext from "./../../../../context/";

// Functions
import { loginRoom } from "./../../../../functions/";

function PasswordInput({ roomData }) {
  const firebaseApp = useFirebaseApp();
  const { state, dispatch } = React.useContext(AppContext);

  const [pass, setPass] = React.useState("");
  const [loginInProcess, setLoginInProcess] = React.useState(false);
  const [passError, setPassError] = React.useState({ status: false, text: "" });

  const onPasswordSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (
      parseInt(roomData.bet) > parseInt(state.user.coin) &&
      roomData.type === "room"
    ) {
      dispatch({
        type: TOGGLE_DIALOG,
        payload: {
          status: true,
          message: "bạn không đủ xu!",
        },
      });
    } else if (pass) {
      setLoginInProcess(true);
      setPassError({ status: false, text: "" });

      loginRoom(
        { uid: state.user.uid, ...roomData, rawText: pass },
        firebaseApp
      )
        .then()
        .catch(() => {
          setLoginInProcess(false);
          setPassError({ status: true, text: "Không thể đăng nhập" });
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
          } d-flex`}
        >
          <span className="text-white mr-2">Mật khẩu:</span>
          <form
            onSubmit={onPasswordSubmit}
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
          <img
            src={LeftSVG}
            alt="back-btn"
            className="ml-2"
            style={{ height: "1.5em", transform: "rotate(180deg)" }}
            onClick={() => onPasswordSubmit()}
          ></img>
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
