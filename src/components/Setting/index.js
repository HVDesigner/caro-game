import React from "react";
import "./Setting.css";
import { Container, Row, Col } from "react-bootstrap";

import { useFirebaseApp } from "reactfire";
import firebase from "firebase/app";

// SVGs
import Exit from "./../../assets/Exit.svg";
import CheckButton from "./../CheckButton/";
import SaveSVG from "./../../assets/save.svg";

// Contexts
import AppContext from "./../../context/";

function Setting() {
  const { changeRoute, state } = React.useContext(AppContext);
  const firebaseApp = useFirebaseApp();
  const [newName, setNewName] = React.useState("");

  // true Open
  // false Off
  const [musicBackground, setMusicBackground] = React.useState(true);
  const [soundEffect, setSoundEffect] = React.useState(true);

  // true vn
  // false en
  const [language, setLanguage] = React.useState(true);

  const [matchingByElo, setMatchingByElo] = React.useState(false);

  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    setLanguage(state.user.setting.language.value === "vn" ? true : false);
    setSoundEffect(state.user.setting.music.effect);
    setMusicBackground(state.user.setting.music.background);
    setMatchingByElo(state.user.setting.matchingByElo);
  }, [
    state.user.setting.language.value,
    state.user.setting.music.background,
    state.user.setting.music.effect,
    state.user.setting.matchingByElo,
  ]);

  const updateName = (e) => {
    if (e) {
      e.preventDefault();
    }

    const checkSpace = (str) => {
      var arr = str.split("");

      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];

        if (element === " ") {
          return false;
        }
      }

      return true;
    };

    if (newName !== "" && checkSpace(newName) && newName.length <= 9) {
      if (state.user.coin >= state.user.name.cost * 2) {
        firebaseApp
          .firestore()
          .collection("users")
          .doc(state.user.uid)
          .update({
            "name.cost": state.user.name.cost * 2,
            "name.value": newName,
            coin: firebase.firestore.FieldValue.increment(
              -(state.user.name.cost * 2)
            ),
            "name.status": "changed",
          })
          .then(() => {
            setMessage("Đổi tên thành công");
          })
          .catch(() => {
            setMessage("Đổi tên thất bại!");
          });
      } else {
        setMessage("Bạn không đủ xu!");
      }
    } else if (!checkSpace(newName)) {
      setMessage("Không được phép dùng khoảng trắng!");
    } else {
      setMessage("Bạn chưa nhập tên mới!");
    }
  };

  return (
    <Container className="setting-body">
      <Row className="mb-3">
        <Col>
          <div className="d-flex flex-column">
            <div className="setting-game">
              <h4 className="text-white text-center mt-2">Cài đặt âm thanh</h4>
              <div className="d-flex flex-column mt-2">
                <div className="d-flex" style={{ width: "100%" }}>
                  <p className="text-white flex-fill m-0">Nhạc nền</p>
                  <div className="flex-fill">
                    <CheckButton
                      text={"Tắt"}
                      value={!musicBackground}
                      func={() => {
                        setMusicBackground(false);
                      }}
                    />
                  </div>

                  <div className="flex-fill">
                    <CheckButton
                      text={"Bật"}
                      value={musicBackground}
                      func={() => {
                        setMusicBackground(true);
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex" style={{ width: "100%" }}>
                  <p className="text-white flex-fill m-0">Hiệu ứng</p>
                  <div className="flex-fill">
                    <CheckButton
                      text={"Tắt"}
                      value={!soundEffect}
                      func={() => {
                        setSoundEffect(false);
                      }}
                    />
                  </div>

                  <div className="flex-fill">
                    <CheckButton
                      text={"Bật"}
                      value={soundEffect}
                      func={() => {
                        setSoundEffect(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              <h4 className="text-white text-center mt-2">Cài đặt ngôn ngữ</h4>
              <div className="d-flex mt-2">
                <div className="d-flex" style={{ width: "100%" }}>
                  <div className="flex-fill">
                    <CheckButton
                      text={"Tiếng Việt"}
                      value={language}
                      func={() => {
                        setLanguage(true);
                      }}
                    />
                  </div>

                  <div className="flex-fill">
                    <CheckButton
                      text={"Tiếng Anh"}
                      value={!language}
                      func={() => {
                        setLanguage(false);
                      }}
                    />
                  </div>
                </div>
              </div>

              <h4 className="text-white text-center mt-2">Chọn đối thủ</h4>
              <div className="d-flex mt-2">
                <div className="d-flex flex-fill">
                  <div className="flex-fill">
                    <CheckButton
                      text={"Đối thủ bất kỳ"}
                      value={!matchingByElo}
                      func={() => setMatchingByElo(false)}
                    />
                  </div>

                  <div className="flex-fill">
                    <CheckButton
                      text={"Đối thủ cùng trình độ"}
                      value={matchingByElo}
                      func={() => setMatchingByElo(true)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="setting-btn mb-2 d-flex fixed-bottom">
              <img
                src={SaveSVG}
                alt="save"
                onClick={() => {
                  setMessage("");

                  firebaseApp
                    .firestore()
                    .collection("users")
                    .doc(state.user.uid)
                    .update({
                      "setting.matchingByElo": matchingByElo,
                      "setting.music.background": musicBackground,
                      "setting.music.effect": soundEffect,
                    })
                    .then(() => {
                      setMessage("Áp dụng thành công!");
                    });
                }}
                className="wood-btn d-block pl-2 pr-1"
              />
              <img
                src={Exit}
                alt="exit"
                onClick={() => {
                  changeRoute("Dashboard");
                }}
                className="wood-btn d-block pr-2 pl-1"
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4 className="text-white text-center mt-2">Đổi tên</h4>
          <div className="p-3 rename-box brown-border d-flex flex-column justify-content-center align-items-center rounded shadow">
            <form onSubmit={updateName}>
              <input
                placeholder="Nhập tên mới"
                className="input-carotv-2 mb-2 w-100"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
                maxLength="9"
              />
            </form>
            <div
              className="p-1 rename-box-btn w-100 brown-border rounded shadow wood-btn"
              onClick={() => {
                updateName();
              }}
            >
              <p className="mb-0 text-center">Thay đổi</p>
            </div>
            <p className="mb-0 mt-2 text-center text-warning text-stroke-carotv">
              Phí đổi tên: {state.user.name.cost * 2}xu
            </p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          {message ? (
            <div className="mt-5 text-center">
              <h4 className="text-warning text-stroke-carotv">{message}</h4>
            </div>
          ) : (
            ""
          )}
        </Col>
      </Row>
    </Container>
  );
}
export default Setting;
