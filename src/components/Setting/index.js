import React from "react";
import "./Setting.css";
import { Container, Row, Col } from "react-bootstrap";

import AppContext from "./../../context/";
import Exit from "./../../assets/Exit.svg";
import CheckButton from "./../CheckButton/";
import DefaultSVG from "./../../assets/default-btn.svg";

function Setting() {
  const StateGlobal = React.useContext(AppContext);
  const { changeRoute } = StateGlobal;

  const [sound, setSound] = React.useState(true);

  const [vn, setVN] = React.useState({ status: true, type: "VN" });
  const [en, setEN] = React.useState({ status: false, type: "EN" });

  const [matchingByElo, setMatchingByElo] = React.useState(false);

  const changeLanguage = (id, value) => {
    if (id === 1) {
      setVN({ status: value, type: "VN" });
      setEN({ status: false, type: "EN" });
    } else {
      setVN({ status: false, type: "VN" });
      setEN({ status: value, type: "EN" });
    }
  };

  return (
    <Container className="setting-body">
      <Row>
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
                      value={vn.status}
                      id={1}
                      func={changeLanguage}
                    />
                  </div>

                  <div className="flex-fill">
                    <CheckButton
                      text={"Tiếng Anh"}
                      value={en.status}
                      id={2}
                      func={changeLanguage}
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
                src={DefaultSVG}
                alt="exit"
                onClick={() => {}}
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
    </Container>
  );
}
export default Setting;
