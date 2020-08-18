import React from "react";
import "./index.css";
import { ListGroup, Container, Row, Col } from "react-bootstrap";

// SVG
import UserSVG from "./../../assets/Dashboard/user.svg";
import ExitSVG from "./../../assets/Exit.svg";

// Locale
import { LANGUAGE_BY_LOCALE } from "./../../locale-constant";

// Contexts
import AppContext from "./../../context/";

// Functions
import { filterElo } from "./../../functions/";

// Components
import Medal from "./../Medal/";

function ProfileComponent() {
  const { state, changeRoute } = React.useContext(AppContext);

  // gameType true gomoku
  // gameType false block-head
  const [gameType, setGameType] = React.useState(true);

  const winPercent = (type) => {
    const { lost, win, tie } = state.user.game;

    const winTotal = parseInt(type ? win.gomoku : win["block-head"]);
    const all =
      winTotal +
      parseInt(type ? lost.gomoku : lost["block-head"]) +
      parseInt(type ? tie.gomoku : tie["block-head"]);

    if (winTotal === 0 && all === 0) {
      return 100;
    }

    return Math.round((winTotal / all) * 100);
  };

  return (
    <Container className="proflie-body">
      <Row>
        <Col>
          <div className="d-flex flex-column align-items-center header-profile mt-3 mb-1">
            <h4 className="text-white mb-3">Thông tin</h4>
            <div className="d-flex">
              <div className="profile-medal d-flex flex-column align-items-center">
                <Medal elo={state.user.elo.gomoku} />
                <p className="m-0 text-center text-stroke-carotv text-white">
                  {filterElo(state.user.elo.gomoku)}
                </p>
                <p className="m-0 text-center text-stroke-carotv text-white">
                  (Gomoku)
                </p>
              </div>
              <img
                src={
                  state.user.image_url !== "image"
                    ? state.user.image_url
                    : UserSVG
                }
                alt="img-profile"
                className={`mr-3 ml-3 ${
                  state.user.image_url !== "image"
                    ? "rounded-circle shadow brown-border"
                    : ""
                }`}
                style={
                  state.user.image_url !== "image" ? {} : { border: "none" }
                }
              />
              <div className="profile-medal d-flex flex-column align-items-center">
                <Medal elo={state.user.elo["block-head"]} />
                <p className="m-0 text-center text-stroke-carotv text-white">
                  {filterElo(state.user.elo["block-head"])}
                </p>
                <p className="m-0 text-center text-stroke-carotv text-white">
                  (Chặn 2 đầu)
                </p>
              </div>
            </div>
            <p className="text-white m-0 text-stroke-carotv">
              {state.user.name.value ? state.user.name.value : "..."}
            </p>
            <p className="text-white text-stroke-carotv">
              {state.user.locale
                ? LANGUAGE_BY_LOCALE[state.user.locale]
                : "..."}
            </p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <ListGroup horizontal className="statistic shadow mb-3">
            <ListGroup.Item
              className={`flex-fill ${gameType ? "bg-success" : ""}`}
              onClick={() => {
                setGameType(true);
              }}
            >
              <h5 className="m-0 text-center">
                <span
                  className="text-warning title text-stroke-carotv"
                  style={gameType ? { textDecoration: "underline" } : {}}
                >
                  Gomoku
                </span>
              </h5>
            </ListGroup.Item>
            <ListGroup.Item
              className={`flex-fill ${gameType ? "" : "bg-success"}`}
              onClick={() => {
                setGameType(false);
              }}
            >
              <h5 className="m-0 text-center">
                <span
                  className="text-warning title text-stroke-carotv"
                  style={gameType ? {} : { textDecoration: "underline" }}
                >
                  Chặn 2 đầu
                </span>
              </h5>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col></Col>
      </Row>
      <Row>
        <Col>
          <ListGroup className="statistic shadow mb-3">
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title text-stroke-carotv">
                  ELO
                </span>
                <span className="text-white text-stroke-carotv">
                  {gameType
                    ? state.user.elo.gomoku
                    : state.user.elo["block-head"]}
                </span>
              </h5>
            </ListGroup.Item>

            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title text-stroke-carotv">
                  Cấp độ
                </span>
                <span className="text-white text-stroke-carotv">
                  {gameType
                    ? filterElo(state.user.elo.gomoku)
                    : filterElo(state.user.elo["block-head"])}
                </span>
              </h5>
            </ListGroup.Item>

            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title text-stroke-carotv">
                  Trận thắng
                </span>
                <span className="text-white text-stroke-carotv">
                  {gameType
                    ? state.user.game.win.gomoku
                    : state.user.game.win["block-head"]}
                </span>
              </h5>
            </ListGroup.Item>

            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title text-stroke-carotv">
                  Trận thua
                </span>
                <span className="text-white text-stroke-carotv">
                  {gameType
                    ? state.user.game.lost.gomoku
                    : state.user.game.lost["block-head"]}
                </span>
              </h5>
            </ListGroup.Item>

            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title text-stroke-carotv">
                  Trận hòa
                </span>
                <span className="text-white text-stroke-carotv">
                  {gameType
                    ? state.user.game.tie.gomoku
                    : state.user.game.tie["block-head"]}
                </span>
              </h5>
            </ListGroup.Item>

            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title text-stroke-carotv">
                  Tỉ lệ thắng
                </span>
                <span className="text-white text-stroke-carotv">
                  {winPercent(gameType)}%
                </span>
              </h5>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <ListGroup className="statistic shadow mb-3">
            <ListGroup.Item>
              <h5 className="m-0 d-flex">
                <span className="text-warning title text-stroke-carotv">
                  Yêu thích
                </span>
                <span className="text-white text-stroke-carotv">
                  {state.user.like.length}
                </span>
              </h5>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="profile-body mb-3">
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
