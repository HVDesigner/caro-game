import React from "react";
import "./CreateRoom.css";
import { Form, Container, Row, Col, Nav } from "react-bootstrap";
import bcrypt from "bcryptjs";
import { useFirebaseApp } from "reactfire";
import firebase from "firebase/app";

// Components
import CheckButton from "./../../CheckButton/";

// Contexts
import AppContext from "./../../../context/";

function CreateRoom() {
  const { changeRoute, state } = React.useContext(AppContext);
  const firebaseApp = useFirebaseApp();
  const [creating, setCreating] = React.useState(false);

  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [bet, setBet] = React.useState("");

  const [showErrorBet, setShowErrorBet] = React.useState({
    status: false,
    text: "Chưa nhập số xu cược.",
  });

  // true: Gomoku
  // false: Block head
  const [gamePlay, setGamePlay] = React.useState(true);

  // true: 6-win
  // false: 6-no-win
  const [rule, setRule] = React.useState(true);

  // 10s
  const [tenSecond, setTenSecond] = React.useState({ status: false, type: 10 });

  // 20s
  const [twentySecond, setTwentySecond] = React.useState({
    status: false,
    type: 20,
  });

  // 30s
  const [thirtySecond, setThirtySecond] = React.useState({
    status: true,
    type: 30,
  });

  const timeInTurn = (id, value) => {
    if (id === 1) {
      setTenSecond({ status: value, type: 10 });
      setTwentySecond({ status: false, type: 20 });
      setThirtySecond({ status: false, type: 30 });
    } else if (id === 2) {
      setTenSecond({ status: false, type: 10 });
      setTwentySecond({ status: value, type: 20 });
      setThirtySecond({ status: false, type: 30 });
    } else {
      setTenSecond({ status: false, type: 10 });
      setTwentySecond({ status: false, type: 20 });
      setThirtySecond({ status: value, type: 30 });
    }
  };

  const getTime = () => {
    const arr = [tenSecond, twentySecond, thirtySecond];

    const time = arr.filter((time) => time.status);

    return time[0];
  };

  const getRndInteger = (min = 100000, max = 999999) => {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;

    return firebaseApp
      .firestore()
      .collection("rooms")
      .doc(num.toString())
      .get()
      .then(function (doc) {
        if (doc.exists) {
          return num.toString();
        } else {
          return num.toString();
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        return num.toString();
      });
  };

  const onCreate = () => {
    setShowErrorBet({ ...showErrorBet, status: false });

    if (bet) {
      if (parseInt(state.user.coin) >= parseInt(bet)) {
        setCreating(true);

        let createRoom = {
          bet,
          password: {
            status: password ? true : false,
            text: password ? bcrypt.hashSync(password, 10) : "",
          },
          game: {
            "current-step": {},
            player: {},
            history: [],
            status: { ready: 0 },
            turn: { uid: state.user.uid },
            "tie-request": [],
            "no-soft": {
              status: false,
              gamePlay: "",
              rowString: "",
              row: 0,
              col: 0,
            },
          },
          rule: rule ? "6-win" : "6-no-win",
          time: getTime().type,
          title: name ? name : `Phòng của ${state.user.name.value}`,
          type: "room",
          conversation: [],
          participants: {
            master: {
              id: state.user.uid,
              status: "waiting",
              win: 0,
            },
          },
          "game-play": gamePlay ? "gomoku" : "block-head",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        getRndInteger().then((num) => {
          firebaseApp
            .firestore()
            .collection(`rooms`)
            .doc(num)
            .set(createRoom)
            .then(() => {
              changeRoute("room", num, gamePlay ? "gomoku" : "block-head");
            });
        });
      } else {
        setShowErrorBet({
          ...showErrorBet,
          status: true,
          text: "Bạn không đủ xu!",
        });
      }
    } else {
      setShowErrorBet({ ...showErrorBet, status: true });
    }
  };

  return (
    <Container className="create-room-body">
      <Row className="pt-2">
        <Col>
          <form className="d-flex flex-column">
            <Form.Label className="mr-2 mb-0">Tên phòng:</Form.Label>
            <input
              type="text"
              className="input-carotv text-white flex-fill mb-2"
              placeholder="Nhập tên phòng..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />

            <Form.Label className="mr-2 mb-0">Mật khẩu:</Form.Label>
            <input
              type="password"
              className="input-carotv text-white flex-fill mb-2"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Form.Label className="mr-2 mb-0">Xu cược:</Form.Label>
            <input
              type="text"
              className="input-carotv text-white flex-fill"
              placeholder="Nhập số xu..."
              value={bet}
              onChange={(e) => {
                setBet(e.target.value);
              }}
            />
            {showErrorBet.status ? (
              <p className="form-text text-warning">{showErrorBet.text}</p>
            ) : (
              ""
            )}

            <div className="d-flex mt-2">
              <div className="flex-fill">
                <Form.Label className="mr-2">Thể loại:</Form.Label>
                <CheckButton
                  text="Gomoku"
                  value={gamePlay}
                  func={() => {
                    setGamePlay(true);
                  }}
                />
                <CheckButton
                  text="Chặn 2 đầu"
                  value={!gamePlay}
                  func={() => {
                    setGamePlay(false);
                  }}
                />
              </div>
              <div className="flex-fill">
                <Form.Label className="mr-2">Luật chơi:</Form.Label>
                <CheckButton
                  text="6 thắng"
                  value={rule}
                  func={() => {
                    setRule(true);
                  }}
                />
                <CheckButton
                  text="6 không thắng"
                  value={!rule}
                  func={() => {
                    setRule(false);
                  }}
                />
              </div>
            </div>

            <Form.Label className="mr-2">Thời gian:</Form.Label>
            <div className="d-flex">
              <div className="flex-fill">
                <CheckButton
                  text="10s"
                  value={tenSecond.status}
                  id={1}
                  func={timeInTurn}
                />
              </div>
              <div className="flex-fill">
                <CheckButton
                  text="20s"
                  value={twentySecond.status}
                  id={2}
                  func={timeInTurn}
                />
              </div>
              <div className="flex-fill">
                <CheckButton
                  text="30s"
                  value={thirtySecond.status}
                  id={3}
                  func={timeInTurn}
                />
              </div>
            </div>
          </form>
        </Col>
      </Row>
      <Row>
        <Col>
          <blockquote className="blockquote text-center mt-2">
            <p className="mb-0">
              {`Phòng của ${state.user.name.value}, ${
                password ? "có" : "không có"
              } mật khẩu, ${
                bet ? "cược " + bet + " xu mỗi ván." : "không cược xu."
              }`}
            </p>
            <footer className="blockquote-footer text-warning">
              {`Luật ${
                gamePlay ? "Gomoku" : "chặn 2 đầu"
              }, thời gian suy nghĩ ${getTime().type} giây`}
            </footer>
          </blockquote>
        </Col>
      </Row>
      <Row>
        <Col>
          <Nav fill className="fixed-bottom footer-create-room">
            {creating ? (
              <Nav.Item className="text-white p-2 text-center wood-btn-back">
                <h5 className="m-0 text-stroke-carotv">
                  ĐANG TẠO BÀN
                  <CountLoading />
                </h5>
              </Nav.Item>
            ) : (
              <Nav.Item
                className="text-white p-2 text-center wood-btn-back"
                onClick={() => {
                  onCreate();
                }}
              >
                <h5 className="m-0 text-stroke-carotv">TẠO BÀN</h5>
              </Nav.Item>
            )}
            <Nav.Item
              className="text-white p-2 text-center wood-btn-back"
              onClick={() => {
                changeRoute("lobby");
              }}
            >
              <h5 className="m-0 text-stroke-carotv">THOÁT</h5>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateRoom;

function CountLoading() {
  const [dot, setDot] = React.useState([]);

  React.useEffect(() => {
    const dotInterval = setInterval(() => {
      if (dot.length === 3) {
        setDot([]);
      } else {
        setDot([...dot, "."]);
      }
    }, 1000);

    return () => {
      clearInterval(dotInterval);
    };
  }, [dot]);

  return (
    <React.Fragment>
      {dot.map((value, key) => (
        <span key={key}>{value}</span>
      ))}
    </React.Fragment>
  );
}
