import React from "react";
import CheckButton from "./../../CheckButton/";
import AppContext from "./../../../context/";
import { useFirebaseApp } from "reactfire";

function MenuModal({ showMenu, setShowMenu }) {
  const firebaseApp = useFirebaseApp();
  const { state } = React.useContext(AppContext);

  // true Bật
  // false Tắt
  const [sound, setSound] = React.useState(true);

  React.useEffect(() => {
    setSound(state.user.setting.sound);
  }, [state.user.setting.sound]);

  const onToggleSound = () => {
    firebaseApp.firestore().collection("users").doc(state.user.uid).update({
      "setting.sound": sound,
    });
  };

  return (
    <React.Fragment>
      {showMenu ? (
        <div className="menu-more d-flex justify-content-center">
          <div className="menu-more-content bg-brown-wood rounded d-flex flex-column justify-content-center align-self-center p-2 brown-border">
            <h4 className="text-center text-white text-stroke-carotv">MENU</h4>
            <div className="d-flex flex-column mb-2 brown-border rounded p-2">
              <p className="text-white text-center mb-2">Cài đặt âm thanh</p>
              <div className="d-flex" style={{ width: "100%" }}>
                <div className="flex-fill">
                  <CheckButton
                    text={"Tắt"}
                    value={!sound}
                    func={() => {
                      setSound(false);
                    }}
                  />
                </div>

                <div className="flex-fill">
                  <CheckButton
                    text={"Bật"}
                    value={sound}
                    func={() => {
                      setSound(true);
                    }}
                  />
                </div>
              </div>
              {state.user.setting.sound !== sound ? (
                <div
                  className="brown-border bg-gold-wood rounded wood-btn p-1"
                  onClick={() => {
                    onToggleSound();
                  }}
                >
                  <h5 className="text-center brown-color mb-0">Áp dụng</h5>
                </div>
              ) : (
                ""
              )}
            </div>

            <span className="brown-border bg-gold-wood rounded wood-btn p-1 mb-2">
              <h5 className="text-center brown-color mb-0">Chia sẻ</h5>
            </span>

            <span className="brown-border bg-gold-wood rounded wood-btn p-1 mb-2">
              <h5 className="text-center brown-color mb-0">Cầu Hòa</h5>
            </span>

            <span
              className="brown-border bg-gold-wood rounded wood-btn p-1"
              onClick={() => {
                setShowMenu(false);
              }}
            >
              <h5 className="text-center brown-color mb-0">Đóng</h5>
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}

export default MenuModal;
