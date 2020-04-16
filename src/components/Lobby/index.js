import React from "react";
import "./index.css";
import { Container, Row, Col, Nav } from "react-bootstrap";

import UserSVG from "./../../assets/Dashboard/user.svg";
import LockSVG from "./../../assets/Rooms/lock.svg";
import MoreSVG from "./../../assets/Rooms/more.svg";
import CoinSVG from "./../../assets/Dashboard/Coin.svg";
import LeftSVG from "./../../assets/chevron-left.svg";
import AddCoinSVG from "./../../assets/Dashboard/add_coin.svg";

function Lobby() {
  return (
    <Container className="rooms-lobby">
      <Row className="sticky-top room-menu">
        <Nav>
          <Nav.Item className="d-flex">
            <Nav.Link>
              <img
                src={LeftSVG}
                alt="back-btn"
                // onClick={() => {
                //   changeRoute("setting");
                // }}
                className="wood-btn"
                style={{ height: "2em" }}
              ></img>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="text-white coin_dashboard pl-2 pr-2">
            <img src={CoinSVG} alt="logo"></img>
            <h5 className="ml-3 mr-3 mb-0 d-flex align-items-center">
              2.00<span className="text-warning">K</span>
            </h5>
            <img src={AddCoinSVG} alt="logo" className="m-0 wood-btn"></img>
          </Nav.Item>
        </Nav>
      </Row>
      <Row className="room-item-row">
        <Col>
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
                <img src={LockSVG} alt="lock" className="" />
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
      <Row className="room-item-row">
        <Col>
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
                <img src={MoreSVG} alt="lock" className="" />
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
    </Container>
  );
}
export default Lobby;
