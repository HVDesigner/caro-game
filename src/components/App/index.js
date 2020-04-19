import React from "react";
import "./App.css";
import firebase from "./../../Firebase/";

import AppContext from "./../../context/";

const Dashboard = React.lazy(() => import("./../Dashboard/"));
const Setting = React.lazy(() => import("./../Setting/"));
const Profile = React.lazy(() => import("./../Profile/"));
const GamePlay = React.lazy(() => import("./../GamePlay/"));
const PlayNow = React.lazy(() => import("./../PlayNow/"));
const Lobby = React.lazy(() => import("./../Lobby/"));

function App() {
  const StateGlobal = React.useContext(AppContext);

  const { state, setUserInfo, changeRoute } = StateGlobal;

  React.useEffect(() => {
    return window.FBInstant.initializeAsync().then(function () {
      return window.FBInstant.startGameAsync().then(() => {
        const playerName = window.FBInstant.player.getName();
        const playerPic = window.FBInstant.player.getPhoto();
        const playerId = window.FBInstant.player.getID();

        firebase()
          .database.ref("users/" + playerId)
          .on("value", function (snapshot) {
            if (snapshot.val()) {
              changeRoute(snapshot.val().location.page);
              if (snapshot.val().name.status === "original") {
                setUserInfo(playerId, playerName, playerPic);
              } else {
                setUserInfo(playerId, snapshot.val().name.value, playerPic);
              }
            } else {
              firebase()
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
                  location: {
                    page: "dashboard",
                  },
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                });
            }
          });

        return () => {
          firebase()
            .database.ref("users/" + playerId)
            .off();
        };
      });
    });
  }, [state, setUserInfo, changeRoute]);

  console.log(state);

  switch (state.route.path) {
    case "dashboard":
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </React.Suspense>
      );
    case "lobby":
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Lobby firebase={firebase} />
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
