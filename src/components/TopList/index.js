import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./toplist.css";
import { useFirebaseApp } from "reactfire";

// Functions
import { filterElo } from "./../../functions/index";

// Contexts
import AppContext from "./../../context/";

// SVGs
import UserSVG from "./../../assets/Dashboard/user.svg";

// Components
import Medal from "./../Medal";

function TopList() {
  const { changeRoute } = React.useContext(AppContext);
  const firebaseApp = useFirebaseApp();

  // true gomoku
  // false block-head
  const [gameType, setGameType] = React.useState(true);
  const [listTop, setListTop] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    let path = `elo.${gameType ? "gomoku" : "block-head"}`;

    firebaseApp
      .firestore()
      .collection("users")
      .where(path, ">=", 1600)
      .orderBy(path, "desc")
      .limit(15)
      .get()
      .then((doc) => {
        const arr = [];

        doc.forEach((value) => {
          arr.push(value.data());
        });

        setListTop(arr);
        setLoading(false);
      });
  }, [firebaseApp, gameType]);

  return (
    <Container fluid className="toplist-main">
      <Row className="position-sticky toplist-top-menu">
        <Col className="p-0">
          <div
            className="text-center p-1"
            style={{ borderBottom: "2px solid #4e311d" }}
          >
            <h4 className="m-0 text-stroke-carotv text-warning">TOP 10</h4>
          </div>
          <div
            className="d-flex flex-fill"
            style={{ borderBottom: "2px solid #4e311d" }}
          >
            <div
              className={`p-1 w-100 text-center wood-btn-back ${
                gameType ? "bg-success" : ""
              }`}
              style={{ borderRight: "2px solid #4e311d" }}
              onClick={() => {
                setGameType(true);
              }}
            >
              <h5 className="m-0 text-stroke-carotv text-white">Gomoku</h5>
            </div>
            <div
              className={`p-1 w-100 text-center wood-btn-back ${
                !gameType ? "bg-success" : ""
              }`}
              onClick={() => {
                setGameType(false);
              }}
            >
              <h5 className="m-0 text-stroke-carotv text-white">Chặn 2 đầu</h5>
            </div>
          </div>
        </Col>
      </Row>
      {loading ? (
        <Row>
          <Col>
            <h4 className="text-center text-stroke-carotv text-warning mt-3">
              Loading...
            </h4>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col className="pt-2 pb-2">
            {listTop.map((value, key) => {
              return (
                <div
                  className="d-flex align-items-center user-list-top mb-1"
                  key={key}
                >
                  <div>
                    <h1
                      className="text-stroke-carotv text-warning"
                      style={{ minWidth: "0.7em" }}
                    >
                      {key + 1}
                    </h1>
                  </div>
                  <div className="mr-3">
                    <img src={UserSVG} alt="user" />
                  </div>
                  <div className="mr-auto">
                    <h5 className="m-0 text-white text-stroke-carotv">
                      {value.name.value}
                    </h5>
                    <p className="m-0 text-warning text-stroke-carotv">
                      Elo: {value.elo[gameType ? "gomoku" : "block-head"]}
                    </p>
                  </div>
                  <div>
                    <p className="m-0 text-warning text-stroke-carotv">
                      {filterElo(value.elo[gameType ? "gomoku" : "block-head"])}
                    </p>
                  </div>
                  <div className="ml-2">
                    <Medal
                      elo={value.elo[gameType ? "gomoku" : "block-head"]}
                    />
                  </div>
                </div>
              );
            })}
          </Col>
        </Row>
      )}
      <Row className="fixed-bottom">
        <Col>
          <div
            className="text-center bottom-btn"
            style={{ borderTop: "2px solid #4e311d" }}
            onClick={() => {
              changeRoute("dashboard");
            }}
          >
            <h4 className="m-0 p-2 wood-btn-back text-stroke-carotv text-white">
              Thoát
            </h4>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default TopList;
