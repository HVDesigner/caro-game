import React from "react";
import "./Setting.css";
import { Container, Row, Col } from "react-bootstrap";

import { useFirebaseApp } from "reactfire";

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
  const [sound, setSound] = React.useState(true);

  // true vn
  // false en
  const [language, setLanguage] = React.useState(true);

  const [matchingByElo, setMatchingByElo] = React.useState(false);

  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    setLanguage(state.user.setting.language.value === "vn" ? true : false);
    setSound(state.user.setting.sound);
    setMatchingByElo(state.user.setting.matchingByElo);
  }, [
    state.user.setting.language.value,
    state.user.setting.sound,
    state.user.setting.matchingByElo,
  ]);

  const updateName = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (newName !== "") {
      if (state.user.coin >= state.user.name.cost * 2) {
        firebaseApp
          .firestore()
          .collection("users")
          .doc(state.user.uid)
          .update({
            "name.cost": state.user.name.cost * 2,
            "name.value": newName,
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
              <div className="d-flex mt-2">
                <div className="d-flex" style={{ width: "100%" }}>
                  <div className="flex-fill">
                    <CheckButton
                      text={"Tắt"}
                      value={!sound}
                      id={1}
                      func={() => {
                        setSound(false);
                      }}
                    />
                  </div>

                  <div className="flex-fill">
                    <CheckButton
                      text={"Bật"}
                      value={sound}
                      id={2}
                      func={() => {
                        setSound(true);
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
                      id={1}
                      func={() => {
                        setLanguage(true);
                      }}
                    />
                  </div>

                  <div className="flex-fill">
                    <CheckButton
                      text={"Tiếng Anh"}
                      value={!language}
                      id={2}
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
                      id={1}
                      func={() => setMatchingByElo(false)}
                    />
                  </div>

                  <div className="flex-fill">
                    <CheckButton
                      text={"Đối thủ cùng trình độ"}
                      value={matchingByElo}
                      id={2}
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
                      "setting.sound": sound,
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
