import React from "react";
import "./App.css";
import LoadingComponent from "./../Loading/";

// Constants
import {
  CHANGE_ROUTE,
  GET_ROOM_ID,
  SET_USER_INFO,
} from "./../../context/ActionTypes";

// Contexts
import AppContext from "./../../context/";
import { FirebaseContext } from "./../../Firebase/";

const Dashboard = React.lazy(() => import("./../Dashboard/"));
const Setting = React.lazy(() => import("./../Setting/"));
const Profile = React.lazy(() => import("./../Profile/"));
const GamePlay = React.lazy(() => import("./../GamePlay/"));
const PlayNow = React.lazy(() => import("./../PlayNow/"));
const Lobby = React.lazy(() => import("./../Lobby/"));
const Login = React.lazy(() => import("./../login/"));
const CreateRoom = React.lazy(() => import("./../Lobby/CreateRoom/"));

function App() {
  const { state, dispatch } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);
  const [loading, setLoading] = React.useState(true);

  const [userInfo, setUserInfo] = React.useState({
    playerId: "",
    playerName: "",
    playerPic: "",
    playerLocale: "",
    platform: "",
  });

  React.useEffect(() => {
    window.FBInstant.initializeAsync().then(function () {
      window.FBInstant.startGameAsync()
        .then(() => {
          const playerName = window.FBInstant.player.getName();
          const playerPic = window.FBInstant.player.getPhoto();
          const playerId = window.FBInstant.player.getID();
          const playerLocale = window.FBInstant.getLocale();
          const platform = window.FBInstant.getPlatform();

          console.log(window.FBInstant);

          setUserInfo({
            playerId,
            playerName,
            playerPic,
            playerLocale,
            platform: platform.toLowerCase(),
          });
        })
        .then(() => {
          setLoading(false);
        });
    });

    if (process.env.NODE_ENV === "development") {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const userRef = firebase
      .database()
      .ref(
        `users/${
          process.env.NODE_ENV === "development"
            ? state.userInfo.id
            : userInfo.playerId
        }`
      );

    function doSnapShot(snapshot) {
      if (snapshot.exists()) {
        dispatch({
          type: GET_ROOM_ID,
          payload: {
            id: snapshot.val().room_id.value,
            type: snapshot.val().room_id.type,
          },
        });

        // update image
        if (snapshot.val().image_url !== userInfo.playerPic) {
          userRef.update({ image_url: userInfo.playerPic });
        }

        // check name
        dispatch({
          type: SET_USER_INFO,
          payload: {
            id:
              process.env.NODE_ENV === "development"
                ? snapshot.key
                : userInfo.playerId,
            name:
              snapshot.val().name.status === "original"
                ? process.env.NODE_ENV === "development"
                  ? snapshot.val().name.value
                  : userInfo.playerName
                : snapshot.val().name.value,
            image_url:
              process.env.NODE_ENV === "development"
                ? snapshot.val().image_url
                : userInfo.playerPic,
            locale:
              process.env.NODE_ENV === "development"
                ? snapshot.val().locale
                : userInfo.playerLocale,
            coin: snapshot.val().coin,
            elo: snapshot.val().elo,
            platform:
              process.env.NODE_ENV === "development"
                ? snapshot.val().locale
                : userInfo.platform,
          },
        });
      } else {
        // add new user
        userRef
          .set({
            coin: 1000,
            elo: 1000,
            image_url: userInfo.playerPic,
            name: { status: "original", value: userInfo.playerName },
            locale: userInfo.playerLocale,
            setting: {
              sound: true,
              language: {
                status: "original",
                value: userInfo.playerLocale === "vi_VN" ? "vn" : "en",
              },
              matchingByElo: true,
            },
            location: {
              path: "dashboard",
            },
            room_id: { value: 0, type: "none" },
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
          .then(() => {
            dispatch({
              type: SET_USER_INFO,
              payload: {
                id: userInfo.playerId,
                name: userInfo.playerName,
                image_url: userInfo.playerPic,
                locale: userInfo.playerLocale,
                platform: userInfo.platform,
              },
            });
          });
      }
    }

    if (process.env.NODE_ENV === "development") {
      if (state.userInfo.id) userRef.on("value", doSnapShot);
    } else {
      if (userInfo.playerId) userRef.on("value", doSnapShot);
    }

    return () => userRef.off("value", doSnapShot);
  }, [
    dispatch,
    firebase,
    userInfo.platform,
    userInfo.playerId,
    userInfo.playerLocale,
    userInfo.playerName,
    userInfo.playerPic,
    state.userInfo.id,
  ]);

  React.useEffect(() => {
    const userRef = firebase
      .database()
      .ref(
        `users/${
          process.env.NODE_ENV === "development"
            ? state.userInfo.id
            : userInfo.playerId
        }/location`
      );

    function doSnapShot(snapshot) {
      if (snapshot.val()) {
        switch (snapshot.key) {
          case "location":
            dispatch({
              type: CHANGE_ROUTE,
              payload: { path: snapshot.val().path },
            });
            break;
          case "path":
            dispatch({
              type: CHANGE_ROUTE,
              payload: { path: snapshot.val() },
            });
            break;

          default:
            break;
        }
      }
    }

    userRef.once("value", doSnapShot);
    userRef.on("child_changed", doSnapShot);

    return () => userRef.off("child_changed", doSnapShot);
  }, [dispatch, firebase, state.userInfo.id, userInfo.playerId]);

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
      return (
        <React.Suspense fallback={<LoadingComponent />}>
          <Dashboard />
        </React.Suspense>
      );
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
