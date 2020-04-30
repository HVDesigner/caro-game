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

  return (
    <Container className="proflie-body">
      <Row>
        <Col>
          <div className="d-flex flex-column align-items-center header-profile mt-3">
            <h4 className="text-white mb-3">Thông tin</h4>
            <img
              src={
                state.userInfo.image_url ? state.userInfo.image_url : UserSVG
              }
              alt="img-profile"
              className={
                state.userInfo.image_url ? "rounded-circle shadow" : ""
              }
              style={state.userInfo.image_url ? {} : { border: "none" }}
            />
            <p className="text-white m-0">
              {state.userInfo.name ? state.userInfo.name : "..."}
            </p>
            <p className="text-white">
              {state.userInfo.locale
                ? LANGUAGE_BY_LOCALE[state.userInfo.locale]
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
                <span className="text-warning title">ELO</span>
                <span className="text-white">{state.userInfo.elo}</span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">Cấp độ</span>{" "}
                <span className="text-white">Nhập môn</span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">Trận thắng</span>
                <span className="text-white">0</span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">Trận thua</span>
                <span className="text-white">0</span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">Trận hòa</span>
                <span className="text-white">0</span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">Tỉ lệ thắng</span>
                <span className="text-white">100%</span>
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
          <div className="profile-body">
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
