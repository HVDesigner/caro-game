import React from "react";
import "./App.css";
import firebase from "./../Firebase/";

import AppContext from "./../../context/";

const Dashboard = React.lazy(() => import("./../Dashboard/"));
const Setting = React.lazy(() => import("./../Setting/"));
const Profile = React.lazy(() => import("./../Profile/"));
const GamePlay = React.lazy(() => import("./../GamePlay/"));
const PlayNow = React.lazy(() => import("./../PlayNow/"));
const Lobby = React.lazy(() => import("./../Lobby/"));

function App() {
  const StateGlobal = React.useContext(AppContext);

  const { state, setUserInfo } = StateGlobal;

  const [playerName, setPlayerName] = React.useState("");
  const [playerPicURL, setPlayerPicURL] = React.useState("");
  const [playerId, setPlayerId] = React.useState("3664117230328911");

  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/fbinstant.6.3.js";
    script.id = "fbinstant";
    document.body.appendChild(script);

    script.onload = () => {
      window.FBInstant.initializeAsync().then(function () {
        window.FBInstant.startGameAsync().then(() => {
          const playerName = window.FBInstant.player.getName();
          const playerPic = window.FBInstant.player.getPhoto();
          const playerId = window.FBInstant.player.getID();

          setPlayerName(playerName);
          setPlayerPicURL(playerPic);
          setPlayerId(playerId);
        });
      });
    };
  });

  React.useEffect(() => {
    firebase()
      .database.ref("users/" + playerId)
      .once("value")
      .then(function (snapshot) {
        if (snapshot.val()) {
          if (snapshot.val().name.status === "original") {
            setUserInfo(playerId, playerName, playerPicURL);
          } else {
            setUserInfo(playerId, snapshot.val().name.value, playerPicURL);
          }
        } else {
          return firebase()
            .database.ref("users/" + playerId)
            .set({
              coin: 1000,
              elo: 1000,
              name: { status: "original", value: playerName },
              setting: {
                sound: true,
                language: "vn",
                matchingByElo: true,
              },
            });
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId, playerName, playerPicURL]);

  switch (state.route.path) {
    case "dashboard":
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Dashboard playerPicURL={playerPicURL} />
        </React.Suspense>
      );
    case "lobby":
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Lobby />
        </React.Suspense>
      );
    case "profile":
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </React.Suspense>
      );
    case "setting":
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Setting />
        </React.Suspense>
      );
    case "playnow":
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <PlayNow />
        </React.Suspense>
      );
    case "gameplay":
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <GamePlay />
        </React.Suspense>
      );

    default:
      return <Dashboard />;
  }
}

export default App;
