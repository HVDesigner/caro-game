import React from "react";
import ExitSVG from "./../../assets/Exit.svg";
import UserSVG from "./../../assets/Dashboard/user.svg";
import { ListGroup, Container, Row, Col } from "react-bootstrap";
import "./index.css";
import { LANGUAGE_BY_LOCALE } from "./../../locale-constant";

import AppContext from "./../../context/";

function ProfileComponent() {
  const StateGlobal = React.useContext(AppContext);

  const { state, changeRoute } = StateGlobal;

  const filterElo = (elo) => {
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

  return (
    <Container className="proflie-body">
      <Row>
        <Col>
          <div className="d-flex flex-column align-items-center header-profile mt-3">
            <h4 className="text-white mb-3">Thông tin</h4>
            <img
              src={state.user.image_url ? state.user.image_url : UserSVG}
              alt="img-profile"
              className={state.user.image_url ? "rounded-circle shadow" : ""}
              style={state.user.image_url ? {} : { border: "none" }}
            />
            <p className="text-white m-0">
              {state.user.name.value ? state.user.name.value : "..."}
            </p>
            <p className="text-white">
              {state.user.locale
                ? LANGUAGE_BY_LOCALE[state.user.locale]
                : "..."}
            </p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <ListGroup className="statistic shadow mb-3">
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">ELO Gomoku</span>
                <span className="text-white">{state.user.elo.gomoku}</span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">ELO Chặn 2 đầu</span>
                <span className="text-white">
                  {state.user.elo["block-head"]}
                </span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">Cấp độ Gomoku</span>
                <span className="text-white">
                  {filterElo(state.user.elo.gomoku)}
                </span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">Cấp độ Chặn 2 đầu</span>
                <span className="text-white">
                  {filterElo(state.user.elo["block-head"])}
                </span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">Trận thắng</span>
                <span className="text-white">
                  {state.user.game.win.gomoku +
                    state.user.game.win["block-head"]}
                </span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">Trận thua</span>
                <span className="text-white">
                  {state.user.game.lost.gomoku +
                    state.user.game.lost["block-head"]}
                </span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">Trận hòa</span>
                <span className="text-white">
                  {state.user.game.tie.gomoku +
                    state.user.game.tie["block-head"]}
                </span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">Tỉ lệ thắng</span>
                <span className="text-white">
                  {state.user.game.win > 0
                    ? Math.round(
                        (state.user.game.win /
                          (state.user.game.win +
                            state.user.game.lost +
                            state.user.game.tie)) *
                          100
                      )
                    : 100}
                  %
                </span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">Yêu thích</span>
                <span className="text-white">0</span>
              </h5>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="profile-body mb-3">
            <img
              src={ExitSVG}
              alt="exit"
              onClick={() => {
                changeRoute("dashboard");
              }}
              className="wood-btn"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfileComponent;
