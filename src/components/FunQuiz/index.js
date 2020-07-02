import React from "react";
import "./index.css";
import { Container, Col, Row } from "react-bootstrap";

// SVG
import ExitSVG from "./../../assets/Exit.svg";

// Context
import AppContext from "./../../context/";

function FunQuiz() {
  const { changeRoute } = React.useContext(AppContext);

  return (
    <Container className="bg-brown-wood h-100vh">
      <Row>
        <Col>
          <div className="pt-3">
            <h2 className="text-warning text-center text-stroke-carotv">
              Đố Vui
            </h2>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="brown-border p-3 bg-white rounded shadow">
            <h5 className="m-0">
              Trên tay cầm một cây thước và một cây bút, làm thế nào để bạn vẽ
              được một vòng tròn thật chính xác?
            </h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mt-3 d-flex">
            <h5 className="text-success text-center text-stroke-carotv flex-fill">
              Đúng: +3000 xu
            </h5>
            <h5 className="text-danger text-center text-stroke-carotv flex-fill">
              Sai: -1500 xu
            </h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mt-3">
            <h5 className="text-warning text-stroke-carotv">
              Chọn phương án chính xác nhất:
            </h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>
            <div className="brown-border p-3 bg-white rounded shadow mt-3 answer">
              <h5 className="m-0 text-center">
                Bỏ cây thước đi và cầm compa lên rồi vẽ.
              </h5>
            </div>
            <div className="brown-border p-3 bg-white rounded shadow mt-3 answer">
              <h5 className="m-0 text-center">
                Bỏ cây thước đi và cầm compa lên rồi vẽ.
              </h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="d-flex justify-content-center mt-3 pt-2">
            <img
              style={{ width: "40%" }}
              src={ExitSVG}
              alt="exit"
              onClick={() => {
                changeRoute("dashboard");
              }}
              className="wood-btn mb-2"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default FunQuiz;
