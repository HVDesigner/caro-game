import React from "react";
import "./App.css";
import { useFirebaseApp } from "reactfire";
import firebase from "firebase/app";

// Components
import LoadingComponent from "./../Loading/";
import LoadingOverlay from "./../LoadingOverlay/";
import DialogComponent from "./../Dialog/";
import InfoModal from "./../InfoModal/";

// Constants
import { SET_USER_DATA } from "./../../context/ActionTypes";

// Contexts
import AppContext from "./../../context/";

const Dashboard = React.lazy(() => import("./../Dashboard/"));
const Setting = React.lazy(() => import("./../Setting/"));
const Profile = React.lazy(() => import("./../Profile/"));
const GamePlay = React.lazy(() => import("./../GamePlay/"));
const PlayNow = React.lazy(() => import("./../PlayNow/"));
const Lobby = React.lazy(() => import("./../Lobby/"));
const Login = React.lazy(() => import("./../login/"));
const CreateRoom = React.lazy(() => import("./../Lobby/CreateRoom/"));
const TopList = React.lazy(() => import("./../TopList/"));
const ServeChat = React.lazy(() => import("./../ServeChat/"));
const FunQuiz = React.lazy(() => import("./../FunQuiz/"));

function App() {
  const firebaseApp = useFirebaseApp();
  const { state, dispatch } = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(true);

  const [userInfo, setUserInfo] = React.useState({
    playerId: "",
    playerName: "",
    playerPic: "",
    playerLocale: "",
    platform: "web",
  });

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/fbinstant.6.2.js";
      script.id = "fbinstant";
      document.body.appendChild(script);

      script.onload = () => {
        window.FBInstant.initializeAsync().then(function () {
          window.FBInstant.player
            .getSignedPlayerInfoAsync()
            .then(function (result) {
              console.log(result);
            });

          window.FBInstant.startGameAsync().then(() => {
            setLoading(false);
          });

          const playerName = window.FBInstant.player.getName();
          const playerPic = window.FBInstant.player.getPhoto();
          const playerId = window.FBInstant.player.getID();
          const playerLocale = window.FBInstant.getLocale();
          const platform = window.FBInstant.getPlatform();

          console.log({
            playerId,
            playerName,
            playerPic,
            playerLocale,
            platform: platform.toLowerCase(),
          });

          setUserInfo({
            playerId,
            playerName,
            playerPic,
            playerLocale,
            platform: platform.toLowerCase(),
          });
        });
      };
    }

    if (process.env.NODE_ENV === "development") {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const userCollectionFirestore = firebaseApp.firestore().collection("users");

    if (process.env.NODE_ENV === "production") {
      function doGet(doc) {
        if (doc.exists) {
          if (
            doc.data().name.value !== userInfo.playerName &&
            doc.data().name.status === "original"
          ) {
            userCollectionFirestore
              .doc(userInfo.playerId)
              .update({ "name.value": userInfo.playerName });
          }

          dispatch({
            type: SET_USER_DATA,
            payload: { uid: doc.id, ...doc.data() },
          });
        } else {
          const newUserdata = {
            coin: 5000,
            "login-time": {
              "login-at": firebase.firestore.FieldValue.serverTimestamp(),
              value: 1,
            },
            elo: {
              gomoku: 1000,
              "block-head": 1000,
            },
            image_url: userInfo.playerPic ? userInfo.playerPic : "",
            name: {
              status: "original",
              value: userInfo.playerName
                ? userInfo.playerName
                : `user${userInfo.playerId}`,
              cost: 500,
            },
            locale: userInfo.playerLocale,
            setting: {
              music: { background: true, effect: true },
              language: {
                status: "original",
                value: userInfo.playerLocale === "vi_VN" ? "vn" : "en",
              },
              matchingByElo: true,
            },
            location: {
              path: "dashboard",
            },
            game: {
              win: { gomoku: 0, "block-head": 0 },
              lost: { gomoku: 0, "block-head": 0 },
              tie: { gomoku: 0, "block-head": 0 },
            },
            on_queue: false,
            room_id: { value: 0, type: "none" },
            "game-type-select": { value: "gomoku" },
            like: [],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          };

          userCollectionFirestore
            .doc(userInfo.playerId)
            .set(newUserdata)
            .then(function () {
              dispatch({
                type: SET_USER_DATA,
                payload: {
                  ...newUserdata,
                  uid: userInfo.playerId,
                  platform: userInfo.platform,
                },
              });
            })
            .catch(function (error) {
              console.error("Error writing document: ", error);
            });
        }
      }

      if (userInfo.playerId !== "") {
        userCollectionFirestore
          .doc(userInfo.playerId)
          .get()
          .then(doGet)
          .catch(function (error) {
            console.log("Error getting document:", error);
          });
      }
    }
  }, [
    firebaseApp,
    userInfo.playerId,
    userInfo.platform,
    userInfo.playerLocale,
    userInfo.playerName,
    userInfo.playerPic,
    dispatch,
  ]);

  React.useEffect(() => {
    const userCollectionFirestore = firebaseApp.firestore().collection("users");

    let unsubscribe;

    if (state.user.uid !== "") {
      unsubscribe = userCollectionFirestore
        .doc(state.user.uid)
        .onSnapshot(function (querySnapshot) {
          if (querySnapshot.exists) {
            dispatch({
              type: SET_USER_DATA,
              payload: {
                ...querySnapshot.data(),
                uid: state.user.uid,
                platform: userInfo.platform,
              },
            });
          }
        });
    }

    return () => {
      if (state.user.uid) {
        return unsubscribe();
      }
    };
  }, [dispatch, state.user.uid, userInfo.platform, firebaseApp]);

  const PageShow = (path) => {
    switch (path) {
      case "dashboard":
        return (
          <React.Suspense fallback={<LoadingComponent />}>
            <Dashboard />
          </React.Suspense>
        );
      case "fun-quiz":
        return (
          <React.Suspense fallback={<LoadingComponent />}>
            <FunQuiz />
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
      case "toplist":
        return (
          <React.Suspense fallback={<LoadingComponent />}>
            <TopList />
          </React.Suspense>
        );
      case "serve-chat":
        return (
          <React.Suspense fallback={<LoadingComponent />}>
            <ServeChat />
          </React.Suspense>
        );

      default:
        return (
          <React.Suspense fallback={<LoadingComponent />}>
            <Dashboard />
          </React.Suspense>
        );
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (!state.user.uid && process.env.NODE_ENV === "development")
    return (
      <React.Suspense fallback={<LoadingComponent />}>
        <Login />
      </React.Suspense>
    );

  return (
    <div className="position-relative">
      {state.dialog.status ? <DialogComponent /> : ""}
      {state["loading-overlay"] ? <LoadingOverlay /> : ""}
      {state.modal["user-info"].status ? <InfoModal /> : ""}
      {PageShow(state.user.location.path)}
    </div>
  );
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
