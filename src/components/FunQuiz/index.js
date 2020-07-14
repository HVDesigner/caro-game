import React from "react";
import "./index.css";
import firebase from "firebase/app";
import { Container, Col, Row, Nav } from "react-bootstrap";
import { useFirestore, useFirestoreDocData } from "reactfire";

// SVG
import CoinSVG from "./../../assets/Dashboard/Coin.svg";
import CoinPrize from "./../../assets/coin-prize.svg";

// Action Types
import { TOGGLE_DIALOG } from "./../../context/ActionTypes";

// Danh sách câu hỏi
import quizList from "./QuizList";

// SVG
import ExitSVG from "./../../assets/Exit.svg";

// Context
import AppContext from "./../../context/";

function FunQuiz() {
  const { state, changeRoute, dispatch } = React.useContext(AppContext);
  const [toggleModal, setToggleModal] = React.useState({
    status: false,
    type: false,
  });

  const funQuizRef = useFirestore().collection("fun-quiz").doc(state.user.uid);

  const userRef = useFirestore().collection("users").doc(state.user.uid);

  const funQuiz = useFirestoreDocData(funQuizRef);

  const checkAnswer = (choice) => {
    if (
      (funQuiz.step >= 0 && funQuiz.step < 9 && state.user.coin < 1500) ||
      (funQuiz.step > 9 && state.user.coin < 2500)
    ) {
      dispatch({
        type: TOGGLE_DIALOG,
        payload: {
          status: true,
          message: "Bạn không đủ xu!",
        },
      });
    } else {
      if (choice) {
        userRef
          .update({
            coin: firebase.firestore.FieldValue.increment(
              funQuiz.step >= 0 && funQuiz.step < 9 ? 3000 : 5000
            ),
          })
          .then(() => {
            setToggleModal({ status: true, type: true });
          });
      } else {
        userRef
          .update({
            coin: firebase.firestore.FieldValue.increment(
              funQuiz.step >= 0 && funQuiz.step < 9 ? -1500 : -2500
            ),
          })
          .then(() => {
            setToggleModal({ status: true, type: false });
          });
      }

      funQuizRef.update({
        step: firebase.firestore.FieldValue.increment(1),
      });
    }
  };

  return (
    <React.Fragment>
      {toggleModal.status ? (
        <Container
          fluid
          className="h-100 position-absolute"
          style={{
            zIndex: 9999,
            backgroundColor: "#48484891",
            minHeight: "100vh",
          }}
        >
          <div className="d-flex justify-content-center align-items-center w-100 h-100">
            <div className="bg-brown-wood brown-border p-3 rounded shadow">
              <h1 className="text-warning text-center text-stroke-carotv mb-3">
                {toggleModal.type ? "Đúng" : "Sai"}
              </h1>
              <div className="d-flex justify-content-center mb-2">
                <img
                  src={CoinPrize}
                  alt="coin-prize"
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
              {toggleModal.type ? (
                <p className="text-warning text-center text-stroke-carotv mb-3">
                  Bạn đã trả lời đúng. Bạn nhận được{" "}
                  {funQuiz.step >= 0 && funQuiz.step < 9 ? 3000 : 5000} xu
                </p>
              ) : (
                <p className="text-warning text-center text-stroke-carotv mb-3">
                  Bạn đã trả lời sai. Bạn bị trừ{" "}
                  {funQuiz.step >= 0 && funQuiz.step < 9 ? 1500 : 2500} xu
                </p>
              )}
              <div
                className="p-2 brown-border rounded bg-brown-wood wood-btn"
                onClick={() => {
                  setToggleModal({ status: false, type: true });
                }}
              >
                <p className="text-warning text-center text-stroke-carotv m-0">
                  Tiếp tục
                </p>
              </div>
            </div>
          </div>
        </Container>
      ) : (
        ""
      )}
      <Container className="bg-brown-wood h-100vh">
        <Row
          className="bg-gold-wood shadow"
          style={{ borderBottom: "1.5px solid #5c3c25" }}
        >
          <Nav>
            <Nav.Item className="text-white coin_lobby d-flex align-items-center p-2">
              <img
                src={CoinSVG}
                alt="logo"
                style={{ width: "30px", height: "30px" }}
              ></img>
              <h5 className="ml-3 mr-2 mb-0 d-flex align-items-center text-stroke-carotv">
                {`${state.user.coin} xu`}
              </h5>
            </Nav.Item>
          </Nav>
        </Row>
        <Row>
          <Col>
            <div className="pt-3 pb-3">
              <h1 className="text-warning text-center text-stroke-carotv m-0">
                Đố Vui
              </h1>
            </div>
          </Col>
        </Row>
        {quizList.length === funQuiz.step + 1 ? (
          <Row>
            <Col>
              <div className="brown-border p-3 bg-white rounded shadow">
                <h5 className="text-warning text-center text-stroke-carotv m-0">
                  Chúc mừng. Bạn đã hoàn tất 20 câu hỏi.
                </h5>
              </div>
            </Col>
          </Row>
        ) : (
          <React.Fragment>
            <Row>
              <Col>
                <div className="brown-border p-3 bg-white rounded shadow">
                  <h5 className="m-0">{quizList[funQuiz.step].title}</h5>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="mt-3 d-flex">
                  <h5 className="text-center text-white text-stroke-carotv flex-fill">
                    Đúng:{" "}
                    <span className="text-success">
                      +{funQuiz.step >= 0 && funQuiz.step < 9 ? 3000 : 5000} xu
                    </span>
                  </h5>
                  <h5 className="text-white text-center text-stroke-carotv flex-fill">
                    Sai:{" "}
                    <span className="text-danger">
                      -{funQuiz.step >= 0 && funQuiz.step < 9 ? 1500 : 2500} xu
                    </span>
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
                  {quizList[funQuiz.step].result.map((value, key) => {
                    return (
                      <div
                        className="brown-border p-3 bg-white rounded shadow mt-3 answer"
                        key={key}
                        onClick={() => {
                          checkAnswer(value.type);
                        }}
                      >
                        <h5 className="m-0 text-center">{value.title}</h5>
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
          </React.Fragment>
        )}
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
    </React.Fragment>
  );
}

export default FunQuiz;
