import React from "react";
import "./CreateRoom.css";
import { Form, Container, Row, Col, Nav } from "react-bootstrap";
import CheckButton from "./../../CheckButton/";
import LeftSVG from "./../../../assets/chevron-left.svg";
import AppContext from "./../../../context/";
import { FirebaseContext } from "./../../../Firebase/";

function CreateRoom() {
  const { changeRoute, state } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);

  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [bet, setBet] = React.useState("");

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

  const onCreate = () => {
    const getTime = () => {
      const arr = [tenSecond, twentySecond, thirtySecond];

      const time = arr.filter((time) => time.status);

      return time[0];
    };

    const createRoom = firebase.functions().httpsCallable("createRoom");

    createRoom({
      password,
      bet,
      rule,
      time: getTime().type,
      title: name,
      gamePlay,
      user: {
        id: state.userInfo.id,
        name: state.userInfo.name,
      },
    }).then(function (result) {
      console.log(result);
    });
  };

  return (
    <Container className="create-room-body">
      <Row className="sticky-top create-room-menu shadow-sm">
        <div className="create-room-menu-top">
          <Nav>
            <Nav.Item className="d-flex">
              <Nav.Link
                onClick={() => {
                  changeRoute("lobby");
                }}
                className="wood-btn-back exit-create-room"
              >
                <img
                  src={LeftSVG}
                  alt="back-btn"
                  style={{ height: "1.5em" }}
                ></img>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </Row>
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
              className="input-carotv text-white flex-fill mb-2"
              placeholder="Nhập số xu..."
              value={bet}
              onChange={(e) => {
                setBet(e.target.value);
              }}
            />

            <div className="d-flex">
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
          <Nav className="fixed-bottom footer-create-room justify-content-center">
            <Nav.Item
              className="text-white p-2 text-center wood-btn-back"
              style={{ width: "100%" }}
              onClick={() => {
                onCreate();
              }}
            >
              <h5 className="m-0">TẠO PHÒNG</h5>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateRoom;
