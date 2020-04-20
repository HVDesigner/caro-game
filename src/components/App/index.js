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
const Login = React.lazy(() => import("./../login/"));

function App() {
  const StateGlobal = React.useContext(AppContext);

  const { state, setUserInfo } = StateGlobal;

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // window.FBInstant.initializeAsync().then(function () {
    //   window.FBInstant.startGameAsync().then(() => {
    //     const playerName = window.FBInstant.player.getName();
    //     const playerPic = window.FBInstant.player.getPhoto();
    //     const playerId = window.FBInstant.player.getID();
    //     const playerLocale = window.FBInstant.getLocale();

    //     firebase()
    //       .database.ref("users/" + playerId)
    //       .once("value")
    //       .then(function (snapshot) {
    //         if (snapshot.val()) {
    //           if (snapshot.val().name.status === "original") {
    //             setUserInfo(playerId, playerName, playerPic, playerLocale);
    //           } else {
    //             setUserInfo(
    //               playerId,
    //               snapshot.val().name.value,
    //               playerPic,
    //               playerLocale
    //             );
    //           }
    //           setLoading(false);
    //         } else {
    //           firebase()
    //             .database.ref("users/" + playerId)
    //             .set({
    //               coin: 1000,
    //               elo: 1000,
    //               name: { status: "original", value: playerName },
    //               locale: playerLocale,
    //               setting: {
    //                 sound: true,
    //                 language: {
    //                   status: "original",
    //                   value: playerLocale === "vi_VN" ? "vn" : "en",
    //                 },
    //                 matchingByElo: true,
    //               },
    //               createdAt: Date.now(),
    //               updatedAt: Date.now(),
    //             })
    //             .then(() => {
    //               setUserInfo(playerId, playerName, playerPic);
    //               setLoading(false);
    //             });
    //         }
    //       });
    //   });
    // });

    if (process.env.NODE_ENV === "development" && state.userInfo.id) {
      firebase()
        .database.ref("users/" + state.userInfo.id)
        .once("value")
        .then(function (snapshot) {
          if (snapshot.val()) {
            if (snapshot.val().name.status === "original") {
              console.log(snapshot.val());
              setUserInfo(
                state.userInfo.id,
                state.userInfo.name,
                "",
                snapshot.val().locale
              );
            } else {
              setUserInfo(
                state.userInfo.id,
                state.userInfo.name,
                "",
                snapshot.val().locale
              );
            }
            setLoading(false);
          } else {
            firebase()
              .database.ref("users/" + state.userInfo.id)
              .set({
                coin: 1000,
                elo: 1000,
                name: { status: "original", value: state.userInfo.name },
                locale: "vi_VN",
                setting: {
                  sound: true,
                  language: {
                    status: "original",
                    value: "vn",
                  },
                  matchingByElo: true,
                },
                createdAt: Date.now(),
                updatedAt: Date.now(),
              })
              .then(() => {
                setUserInfo(
                  state.userInfo.id,
                  state.userInfo.name,
                  "",
                  "vi_VN"
                );
                setLoading(false);
              });
          }
        });
    } else {
      setLoading(false);
    }

    return () => {};
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // console.log(state);

  if (!state.userInfo.name && !state.userInfo.id)
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Login />
      </React.Suspense>
    );

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

// getLocale: ƒ ()
// getPlatform: ƒ ()
// getSDKVersion: ƒ ()
// initializeAsync: ƒ ()
// _populatePlatform: ƒ ()
// setLoadingProgress: ƒ (a)
// getSupportedAPIs: ƒ ()
// getEntryPointData: ƒ ()
// getEntryPointAsync: ƒ ()
// setSessionData: ƒ (a)
// startGameAsync: ƒ ()
// player: {getID: ƒ, getSignedPlayerInfoAsync: ƒ, canSubscribeBotAsync: ƒ, subscribeBotAsync: ƒ, getName: ƒ, …}
// context: {getID: ƒ, getType: ƒ, isSizeBetween: ƒ, switchAsync: ƒ, chooseAsync: ƒ, …}
// payments: {consumePurchaseAsync: ƒ, getCatalogAsync: ƒ, getPurchasesAsync: ƒ, purchaseAsync: ƒ, onReady: ƒ, …}
// shareAsync: ƒ (a)
// updateAsync: ƒ (a)
// switchGameAsync: ƒ (a,c)
// canCreateShortcutAsync: ƒ ()
// createShortcutAsync: ƒ ()
// quit: ƒ ()
// logEvent: ƒ (a,c,d)
// onPause: ƒ (a)
// getInterstitialAdAsync: ƒ (a)
// getRewardedVideoAsync: ƒ (a)
// matchPlayerAsync: ƒ (a,c)
// checkCanPlayerMatchAsync: ƒ ()
// getLeaderboardAsync: ƒ (a)
