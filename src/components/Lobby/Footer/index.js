import React from "react";
import { Row, Nav } from "react-bootstrap";
import AppContext from "./../../../context/";
import { FirebaseContext } from "./../../../Firebase/";

function FooterComponent() {
  const { changeRoute, state } = React.useContext(AppContext);
  const [firebase] = React.useState(React.useContext(FirebaseContext));

  const exitLooby = () => {
    firebase
      .database()
      .ref("users")
      .child(`${state.userInfo.id}/game-type-select`)
      .update({ value: "none" })
      .then(() => {
        changeRoute("dashboard");
      });
  };

  return (
    <Row className="">
      <Nav className="fixed-bottom footer-lobby" fill>
        <Nav.Item
          className="text-white p-2 text-center wood-btn-back"
          onClick={() => {
            changeRoute("create-room");
          }}
        >
          <h5 className="m-0 text-stroke-carotv">TẠO BÀN</h5>
        </Nav.Item>
        <Nav.Item
          className="text-white p-2 text-center wood-btn-back"
          onClick={() => {
            exitLooby();
          }}
          style={{
            borderLeft: "2px solid #4e311d",
          }}
        >
          <h5 className="m-0 text-stroke-carotv">THOÁT</h5>
        </Nav.Item>
      </Nav>
    </Row>
  );
}

export default FooterComponent;
