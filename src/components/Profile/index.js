import React from "react";
import ProfileJPG from "./../../assets/profile_pic.jpg";
import ExitSVG from "./../../assets/Exit.svg";
import { ListGroup, Container, Row, Col } from "react-bootstrap";
import "./index.css";

import AppContext from "./../../context/";

function ProfileComponent() {
  const StateGlobal = React.useContext(AppContext);

  const { changeRoute } = StateGlobal;

  return (
    <Container className="proflie-body">
      <Row>
        <Col>
          <div className="d-flex flex-column align-items-center header-profile mt-3">
            <h4 className="text-white mb-3">Thông tin</h4>
            <img
              src={ProfileJPG}
              alt="img-profile"
              className="rounded-circle shadow"
            />
            <p className="text-white">Việt</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <ListGroup className="statistic shadow mb-3">
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">ELO</span>
                <span className="text-white">1000</span>
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
                <span className="text-warning title">Tỉ lệ thắng</span>
                <span className="text-white">100%</span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title">Trận đã chơi</span>
                <span className="text-white">0</span>
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
