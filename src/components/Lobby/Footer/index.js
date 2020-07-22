import React from "react";
import { Row, Nav } from "react-bootstrap";
import { useFirebaseApp } from "reactfire";

// Contexts
import AppContext from "./../../../context/";

// Action Types
import { TOGGLE_FIND_ROOM_MODAL } from "./../../../context/ActionTypes";

function FooterComponent() {
  const firebaseApp = useFirebaseApp();
  const { changeRoute, state, dispatch } = React.useContext(AppContext);

  const findRoom = () => {
    dispatch({
      type: TOGGLE_FIND_ROOM_MODAL,
      payload: true,
    });
  };

  const exitLooby = () => {
    firebaseApp
      .firestore()
      .collection("users")
      .doc(state.user.uid)
      .update({
        "game-type-select.value": "none",
      })
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
            changeRoute("serve-chat");
          }}
        >
          <h5 className="m-0 text-stroke-carotv">CHAT</h5>
        </Nav.Item>
        <Nav.Item
          className="text-white p-2 text-center wood-btn-back"
          style={{
            borderLeft: "2px solid #4e311d",
          }}
          onClick={() => {
            findRoom();
          }}
        >
          <h5 className="m-0 text-stroke-carotv">TÌM BÀN</h5>
        </Nav.Item>
        <Nav.Item
          className="text-white p-2 text-center wood-btn-back"
          onClick={() => {
            changeRoute("create-room");
          }}
          style={{
            borderLeft: "2px solid #4e311d",
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
