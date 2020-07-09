import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  useFirebaseApp,
  useFirestore,
  useFirestoreDocData,
  SuspenseWithPerf,
} from "reactfire";
import _ from "lodash";
import firebase from "firebase/app";

// Action Types
import { LOADING_OVERLAY } from "./../../context/ActionTypes";

// Styles
import "./Dashboard.css";

// SVGs
import Shop from "./../../assets/Dashboard/shopping.svg";
import Chat from "./../../assets/Dashboard/chat.svg";
import PlayNowSVG from "./../../assets/Dashboard/playnow.svg";
import RoomsSVG from "./../../assets/Dashboard/room.svg";
import QuestionSVG from "./../../assets/Dashboard/question.svg";
import LogoSVG from "./../../assets/Dashboard/logo_carotv.svg";
import PaperSVG from "./../../assets/Dashboard/paper.png";
import CoinSVG from "./../../assets/Dashboard/Coin.svg";
import SettingSVG from "./../../assets/Dashboard/setting.svg";
import AddCoinSVG from "./../../assets/Dashboard/add_coin.svg";
import TopTenSVG from "./../../assets/Dashboard/top10.svg";
import UserSVG from "./../../assets/Dashboard/user.svg";

// Contexts
import AppContext from "./../../context/";

function Dashboard() {
  const { state, changeRoute, dispatch } = React.useContext(AppContext);

  const firebaseApp = useFirebaseApp();

  return (
    <div
      style={{ height: "100%", minHeight: "100vh" }}
      className="carotv_background"
    >
      <Container>
        <Row>
          <Col>
            <ul className="nav mb-1">
              <li className="nav-item text-white setting_dashboard mr-2">
                <img
                  src={SettingSVG}
                  alt="logo"
                  onClick={() => {
                    changeRoute("setting");
                  }}
                  className="wood-btn"
                ></img>
              </li>
              <li className="nav-item text-white pl-2 pr-2 pb-2 pt-2 coin_dashboard">
                <img src={CoinSVG} alt="logo"></img>
                <h5 className="ml-3 mr-3 mb-0">{`${state.user.coin} xu`}</h5>
                <img src={AddCoinSVG} alt="logo" className="m-0 wood-btn"></img>
              </li>
              <li
                className="nav-item text-white text-center pl-3 pr-3 coin_dashboard"
                style={{ backgroundPosition: "right center" }}
              >
                <h5 className="m-auto">
                  <span className="text-warning">Elo:</span>
                  {Math.round(
                    (state.user.elo.gomoku + state.user.elo["block-head"]) / 2
                  )}
                </h5>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col>
            <div className="logo_dashboard mb-1">
              <img src={LogoSVG} alt="logo"></img>
            </div>
            <div className="mb-1">
              <img src={PaperSVG} alt="paper" style={{ width: "100%" }}></img>
            </div>
          </Col>
        </Row>
      </Container>

      <Container style={{ width: "55vw" }}>
        <Row>
          <Col>
            <div className="svg_btn mb-1">
              <img
                src={PlayNowSVG}
                alt="playnow"
                onClick={() => {
                  changeRoute("playnow");
                }}
                className="wood-btn"
              ></img>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="svg_btn mb-1">
              <img
                src={RoomsSVG}
                alt="rooms"
                className="wood-btn"
                onClick={() => {
                  dispatch({
                    type: LOADING_OVERLAY,
                    payload: true,
                  });

                  firebaseApp
                    .firestore()
                    .collection("users")
                    .doc(state.user.uid)
                    .update({
                      "game-type-select.value": "gomoku",
                    })
                    .then(() => {
                      changeRoute("lobby");
                    });
                }}
              ></img>
            </div>
          </Col>
        </Row>

        <SuspenseWithPerf fallback={<div></div>} traceId={"load-fun-quiz"}>
          <FunQuizButton />
        </SuspenseWithPerf>

        <Row>
          <Col>
            <div className="svg_btn mb-1">
              <img
                src={TopTenSVG}
                alt="top-10"
                className="wood-btn"
                onClick={() => {
                  changeRoute("toplist");
                }}
              ></img>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="d-flex extend mt-1 mb-3">
              <div className="svg_btn">
                <img
                  src={Chat}
                  alt="chat"
                  className="wood-btn"
                  onClick={() => {
                    changeRoute("serve-chat");
                  }}
                ></img>
              </div>
              <div className="svg_btn pl-2 pr-2 m-auto">
                <img src={Shop} alt="shop" className="wood-btn"></img>
              </div>
              <div className="svg_btn">
                <img
                  src={state.user.image_url ? state.user.image_url : UserSVG}
                  alt="user"
                  className={
                    state.user.image_url ? "rounded-circle border" : "wood-btn"
                  }
                  onClick={() => {
                    changeRoute("profile");
                  }}
                ></img>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default Dashboard;

function FunQuizButton() {
  const { state, changeRoute } = React.useContext(AppContext);

  const funQuizRef = useFirestore().collection("fun-quiz").doc(state.user.uid);

  const funQuiz = useFirestoreDocData(funQuizRef);

  const funQuizClick = () => {
    if (_.isEmpty(funQuiz)) {
      funQuizRef
        .set({
          step: 0,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          changeRoute("fun-quiz");
        });
    } else {
      changeRoute("fun-quiz");
    }
  };

  return (
    <Row>
      <Col>
        <div className="svg_btn mb-1">
          <img
            src={QuestionSVG}
            alt="question"
            className="wood-btn"
            onClick={() => {
              funQuizClick();
            }}
          ></img>
        </div>
      </Col>
    </Row>
  );
}
