import React from "react";
import numeral from "numeral";
import { Row, Nav } from "react-bootstrap";

// SVGs
import CoinSVG from "./../../../assets/Dashboard/Coin.svg";

// Contexts
import AppContext from "./../../../context/";
import { FirebaseContext } from "./../../../Firebase/";

function MenuComponent({ gameType }) {
  const [firebase] = React.useState(React.useContext(FirebaseContext));
  const { state } = React.useContext(AppContext);

  const [userInGomoku, setUserInGomoku] = React.useState(0);
  const [userInBlockHead, setUserInBlockHead] = React.useState(0);
  const [playingUser, setPlayingUser] = React.useState(0);

  React.useEffect(() => {
    const userRef = firebase.database().ref("users");
    const roomsRef = firebase.database().ref("rooms");

    // Count user in each game type
    userRef.on("value", async (snapshot) => {
      if (snapshot && snapshot.val()) {
        const keys = Object.keys(snapshot.val());

        let gomokuTotal = 0;
        let blockHeadTotal = 0;

        let playingUserTotal = 0;

        for (let index = 0; index < keys.length; index++) {
          const element = keys[index];
          const userData = snapshot.val()[element];

          if (
            userData.room_id.value !== 0 &&
            userData.room_id.type !== "none"
          ) {
            const snapshotChild = await roomsRef
              .child(`${userData.room_id.type}/${userData.room_id.value}`)
              .once("value");

            if (
              (snapshotChild.val().participants[element].type === "player" &&
                snapshotChild.val().participants[element].status) ||
              (snapshotChild.val().participants[element].type === "master" &&
                snapshotChild.val().participants[element].status)
            ) {
              playingUserTotal = playingUserTotal + 1;
            }
          }

          // get quantity user playing in each game type
          if (userData.location.path === "lobby") {
            if (userData["game-type-select"].value === "gomoku") {
              gomokuTotal = gomokuTotal + 1;
            } else if (userData["game-type-select"].value === "block-head") {
              blockHeadTotal = blockHeadTotal + 1;
            }
          } else if (userData.location.path === "room") {
            if (userData.room_id.type === "gomoku") {
              gomokuTotal = gomokuTotal + 1;
            } else if (userData.room_id.type === "block-head") {
              blockHeadTotal = blockHeadTotal + 1;
            }
          }
        }

        setUserInGomoku(gomokuTotal);
        setUserInBlockHead(blockHeadTotal);
        setPlayingUser(playingUserTotal);
      }
    });

    return () => {
      userRef.off("value");
    };
  }, [firebase, state.userInfo.id]);

  const changGameType = (status) => {
    firebase
      .database()
      .ref("users")
      .child(`${state.userInfo.id}/game-type-select`)
      .update({ value: status });
  };

  return (
    <Row className="sticky-top room-menu shadow-sm">
      <div className="menu-top">
        <Nav>
          <Nav.Item className="text-white coin_lobby d-flex align-items-center p-2">
            <img src={CoinSVG} alt="logo"></img>
            <h5 className="ml-3 mr-2 mb-0 d-flex align-items-center text-stroke-carotv">
              {numeral(21928).format("0.0 a")}
            </h5>
          </Nav.Item>
          <Nav.Item className="text-white elo-lobby d-flex align-items-center p-2">
            <h5 className="ml-2 mr-2 mb-0 d-flex align-items-center text-stroke-carotv">
              <span className="text-warning mr-1">Elo:</span>
              1000
            </h5>
          </Nav.Item>
          <Nav.Item className="text-white d-flex align-items-center p-2">
            <h5 className="ml-2 mr-2 mb-0 d-flex align-items-center text-stroke-carotv">
              <span className="mr-1">PHÒNG CHƠI</span>
            </h5>
          </Nav.Item>
        </Nav>
      </div>
      <Nav fill className="game-type">
        <Nav.Item
          className={`text-white game-gomoku wood-btn-back ${
            gameType === "gomoku" ? "bg-success" : ""
          }`}
          onClick={() => {
            changGameType("gomoku");
          }}
        >
          <h5 className="p-1 m-0 text-stroke-carotv">
            Gomoku
            <span className="text-warning ml-1">({userInGomoku})</span>
          </h5>
        </Nav.Item>
        <Nav.Item
          className={`text-white wood-btn-back ${
            gameType === "block-head" ? "bg-success" : ""
          }`}
          onClick={() => {
            changGameType("block-head");
          }}
        >
          <h5 className="p-1 m-0 text-stroke-carotv">
            Chặn 2 đầu
            <span className="text-warning ml-1">({userInBlockHead})</span>
          </h5>
        </Nav.Item>
      </Nav>

      <Nav fill className="user-status">
        <Nav.Item className="text-warning" onClick={() => {}}>
          <h5 className="p-1 m-0 text-stroke-carotv">
            Đang chơi
            <span className="text-warning ml-1">({playingUser})</span>
          </h5>
        </Nav.Item>
        <Nav.Item className="text-warning" onClick={() => {}}>
          <h5 className="p-1 m-0 text-stroke-carotv">
            Chưa chơi
            <span className="text-warning ml-1">
              (
              {gameType === "gomoku"
                ? userInGomoku - playingUser
                : userInBlockHead - playingUser}
              )
            </span>
          </h5>
        </Nav.Item>
      </Nav>
    </Row>
  );
}

export default MenuComponent;
