import React from "react";
import "./App.css";
// import { FirebaseContext } from "./../../Firebase/";

import AppContext from "./../../context/";
import LoadingComponent from "./../Loading/";

const Dashboard = React.lazy(() => import("./../Dashboard/"));
const Setting = React.lazy(() => import("./../Setting/"));
const Profile = React.lazy(() => import("./../Profile/"));
const GamePlay = React.lazy(() => import("./../GamePlay/"));
const PlayNow = React.lazy(() => import("./../PlayNow/"));
const Lobby = React.lazy(() => import("./../Lobby/"));
const Login = React.lazy(() => import("./../login/"));
const CreateRoom = React.lazy(() => import("./../Lobby/CreateRoom/"));

function App() {
  const { state, getUserInfo } = React.useContext(AppContext);
  // const [firebase] = React.useState(React.useContext(FirebaseContext));
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    window.FBInstant.initializeAsync().then(function () {
      window.FBInstant.startGameAsync()
        .then(() => {
          const playerName = window.FBInstant.player.getName();
          const playerPic = window.FBInstant.player.getPhoto();
          const playerId = window.FBInstant.player.getID();
          const playerLocale = window.FBInstant.getLocale();
          const platform = window.FBInstant.getPlatform();

          getUserInfo(
            playerId,
            playerName,
            playerPic,
            playerLocale,
            platform.toLowerCase()
          );
        })
        .then(() => {
          setLoading(false);
        });
    });

    if (process.env.NODE_ENV === "development") {
      setLoading(false);
    }
  }, [getUserInfo]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (
    !state.userInfo.name &&
    !state.userInfo.id &&
    process.env.NODE_ENV === "development"
  )
    return (
      <React.Suspense fallback={<LoadingComponent />}>
        <Login />
      </React.Suspense>
    );

  switch (state.route.path) {
    case "dashboard":
      return (
        <React.Suspense fallback={<LoadingComponent />}>
          <Dashboard />
        </React.Suspense>
      );
    case "lobby":
      return (
        <React.Suspense fallback={<LoadingComponent />}>
          <Lobby />
        </React.Suspense>
      );
    case "create-room":
      return (
        <React.Suspense fallback={<LoadingComponent />}>
          <CreateRoom />
        </React.Suspense>
      );
    case "profile":
      return (
        <React.Suspense fallback={<LoadingComponent />}>
          <Profile />
        </React.Suspense>
      );
    case "setting":
      return (
        <React.Suspense fallback={<LoadingComponent />}>
          <Setting />
        </React.Suspense>
      );
    case "playnow":
      return (
        <React.Suspense fallback={<LoadingComponent />}>
          <PlayNow />
        </React.Suspense>
      );
    case "room":
      return (
        <React.Suspense fallback={<LoadingComponent />}>
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
