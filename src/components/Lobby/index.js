import React from "react";
import "./index.css";
import { Container, Row, Col, Nav, Modal } from "react-bootstrap";

import UserSVG from "./../../assets/Dashboard/user.svg";
import LockSVG from "./../../assets/Rooms/lock.svg";
import MoreSVG from "./../../assets/Rooms/more.svg";
import CoinSVG from "./../../assets/Dashboard/Coin.svg";
import LeftSVG from "./../../assets/chevron-left.svg";
import AddCoinSVG from "./../../assets/Dashboard/add_coin.svg";

import AppContext from './../../context/';

function Lobby() {
  const StateGlobal = React.useContext(AppContext);
  const { state, changeRoute } = StateGlobal;

  const [show, setShow] = React.useState(false);

  const handleClose = () => { setShow(false) };
  const handleShow = () => { setShow(true) };

  return (
    <Container className="rooms-lobby">
      <Row className="sticky-top room-menu">
        <Nav>
          <Nav.Item className="d-flex">
            <Nav.Link onClick={() => {
              changeRoute("dashboard");
            }} className="wood-btn-back">
              <img
                src={LeftSVG}
                alt="back-btn"
                style={{ height: "1.5em" }}
              ></img>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="text-white coin_lobby d-flex align-items-center pl-2 pr-2">
            <img src={CoinSVG} alt="logo"></img>
            <h5 className="ml-3 mr-3 mb-0 d-flex align-items-center">
              2.00<span className="text-warning">K</span>
            </h5>
            <img src={AddCoinSVG} alt="logo" className="m-0 wood-btn"></img>
          </Nav.Item>
        </Nav>
      </Row>
      <Row>
        <Col className="room-item-col">
          <div className="room-item d-flex flex-column shadow mt-2">
            <div className="d-flex room-item-head pl-2 text-white bg-success">
              <span>id: 1234</span>
            </div>
            <div className="d-flex room-item-body p-2">
              <div className="d-flex align-items-center">
                <img
                  src={UserSVG}
                  alt="user-playing"
                  className="player-inroom-img mr-2"
                />
                <div className="d-flex flex-column text-white">
                  <span>Viet</span>
                  <span>Elo: 1000</span>
                </div>
              </div>
              <div className="lock-room">
                <img src={LockSVG} alt="lock" className="wood-btn" onClick={() => { setShow(true) }} />
              </div>
              <div className="d-flex justify-content-end align-items-center">
                <div className="d-flex flex-column text-white text-right">
                  <span>Viet</span>
                  <span>Elo: 1000</span>
                </div>
                <img
                  src={UserSVG}
                  alt="user-playing"
                  className="player-inroom-img ml-2"
                />
              </div>
            </div>
          </div>
        </Col>
        <Col className="room-item-col">
          <div className="room-item d-flex flex-column shadow mt-2">
            <div className="d-flex room-item-head pl-2 text-white bg-success">
              <span>id: 1234</span>
            </div>
            <div className="d-flex room-item-body p-2">
              <div className="d-flex align-items-center">
                <img
                  src={UserSVG}
                  alt="user-playing"
                  className="player-inroom-img mr-2"
                />
                <div className="d-flex flex-column text-white">
                  <span>Viet</span>
                  <span>Elo: 1000</span>
                </div>
              </div>
              <div className="lock-room">
                <img src={MoreSVG} alt="lock" className="wood-btn" />
              </div>
              <div className="d-flex justify-content-end align-items-center">
                <div className="d-flex flex-column text-white text-right">
                  <span>Viet</span>
                  <span>Elo: 1000</span>
                </div>
                <img
                  src={UserSVG}
                  alt="user-playing"
                  className="player-inroom-img ml-2"
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <React.StrictMode>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>


          </Modal.Footer>
        </Modal>
      </React.StrictMode>
    </Container>


  );
}
export default Lobby;
