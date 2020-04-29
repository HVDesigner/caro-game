import React from "react";
import AppContext from "./index";
import { reducer } from "./Reducers";
import {
  CHANGE_ROUTE,
  SET_USER_INFO,
  GET_ROOMS_BLOCK_HEAD,
  GET_ROOMS_GOMOKU,
  GET_ROOM_ID,
  GET_SQUARE_POSITION,
  COUNT_BLOCK_HEAD_USER_PLAYING,
  COUNT_GOMOKU_USER_PLAYING,
} from "./ActionTypes";
import { FirebaseContext } from "./../Firebase/";

function GlobalState(props) {
  const [firebase] = React.useState(React.useContext(FirebaseContext));

  const InitialGlobalState = {
    route: {
      path: "dashboard",
    },
    room: {
      id: 0,
      type: "",
    },
    userInfo: {
      coin: 0,
      elo: 0,
      id: "",
      name: "",
      image_url: "",
      locale: "",
      platform: "",
    },
    rooms: {
      gomoku: {
        total: 0,
        playing: 0,
        free: 0,
      },
      "block-head": {
        total: 0,
        playing: 0,
        free: 0,
      },
    },
    "square-position": {
      status: false,
      row: 0,
      col: 0,
    },
  };

  const [state, dispatch] = React.useReducer(reducer, InitialGlobalState);

  React.useEffect(() => {
    const locationPathRef = firebase
      .database()
      .ref("users/" + state.userInfo.id + "/location/");

    locationPathRef.child("path").on("value", (snapshot) => {
      if (snapshot.val()) {
        dispatch({
          type: CHANGE_ROUTE,
          payload: { path: snapshot.val() },
        });
      }
    });

    return () => {
      locationPathRef.child("path").off();
    };
  }, [state.route.path, state.userInfo.id, firebase]);

  const changeRoute = (path, id = 0, type = "") => {
    if (state.userInfo.id && state.route.path !== path) {
      const userByIdRef = firebase.database().ref(`users/${state.userInfo.id}`);

      if (path === "room") {
        userByIdRef.child("location").update({ path });
        userByIdRef.child("room_id").update({ value: id, type });
      } else {
        userByIdRef.child("location").update({ path });
      }
    }
  };

  const countUserStatus = () => {
    firebase
      .database()
      .ref("users")
      .on("value", async (snapshot) => {
        if (snapshot && snapshot.val()) {
          const keys = Object.keys(snapshot.val());

          let gomokuTotal = 0;
          let blockHeadTotal = 0;

          let playingGomokuUserTotal = 0;
          let playingBlockHeadUserTotal = 0;

          for (let index = 0; index < keys.length; index++) {
            const element = keys[index];
            const userData = snapshot.val()[element];

            if (
              userData.room_id.value !== 0 &&
              userData.room_id.type !== "none"
            ) {
              const snapshotChild = await firebase
                .database()
                .ref(
                  `rooms/${userData.room_id.type}/${userData.room_id.value}/participants`
                )
                .once("value");

              if (userData.room_id.type === "gomoku") {
                if (
                  (snapshotChild.val()[element].type === "player" &&
                    snapshotChild.val()[element].status) ||
                  (snapshotChild.val()[element].type === "master" &&
                    snapshotChild.val()[element].status)
                ) {
                  playingGomokuUserTotal = playingGomokuUserTotal + 1;
                }
              } else {
                if (
                  (snapshotChild.val()[element].type === "player" &&
                    snapshotChild.val()[element].status) ||
                  (snapshotChild.val()[element].type === "master" &&
                    snapshotChild.val()[element].status)
                ) {
                  playingBlockHeadUserTotal = playingBlockHeadUserTotal + 1;
                }
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

          dispatch({
            type: COUNT_BLOCK_HEAD_USER_PLAYING,
            payload: {
              total: blockHeadTotal,
              playing: playingBlockHeadUserTotal,
              free: blockHeadTotal - playingBlockHeadUserTotal,
            },
          });
          dispatch({
            type: COUNT_GOMOKU_USER_PLAYING,
            payload: {
              total: gomokuTotal,
              playing: playingGomokuUserTotal,
              free: gomokuTotal - playingGomokuUserTotal,
            },
          });
        }
      });
  };

  // const updateRoomGomoku = () => {
  //   const childChangeRef = firebase().database.ref("rooms/gomoku");

  //   childChangeRef.on("child_changed", (snapshot) => {
  //     console.log({ id: snapshot.key, ...snapshot.val() });
  //   });

  //   return childChangeRef;
  // };

  const getPositonSquare = (status, row, col) => {
    return dispatch({
      type: GET_SQUARE_POSITION,
      payload: { status, row, col },
    });
  };

  const getRoomsGomoku = (finalArr) => {
    return dispatch({
      type: GET_ROOMS_GOMOKU,
      payload: finalArr,
    });
  };

  const getRoomsBlockHead = (finalArr) => {
    return dispatch({
      type: GET_ROOMS_BLOCK_HEAD,
      payload: finalArr,
    });
  };

  const getUserInfo = (id, name, image_url, locale, platform) => {
    const userRef = firebase.database().ref("users/" + id);

    userRef.on("value", (snapshot) => {
      if (snapshot.val()) {
        dispatch({
          type: CHANGE_ROUTE,
          payload: { path: snapshot.val().location.path },
        });

        dispatch({
          type: GET_ROOM_ID,
          payload: {
            id: snapshot.val().room_id.value,
            type: snapshot.val().room_id.type,
          },
        });

        // update image
        if (snapshot.val().image_url !== image_url) {
          userRef.update({ image_url });
        }

        // check name
        if (snapshot.val().name.status === "original") {
          dispatch({
            type: SET_USER_INFO,
            payload: {
              id,
              name,
              image_url,
              locale,
              coin: snapshot.val().coin,
              elo: snapshot.val().elo,
              platform,
            },
          });
        } else {
          dispatch({
            type: SET_USER_INFO,
            payload: {
              id,
              name: snapshot.val().name,
              image_url,
              locale,
              coin: snapshot.val().coin,
              elo: snapshot.val().elo,
              platform,
            },
          });
        }
      } else {
        // add new user
        return userRef
          .set({
            coin: 1000,
            elo: 1000,
            image_url,
            name: { status: "original", value: name },
            locale,
            setting: {
              sound: true,
              language: {
                status: "original",
                value: locale === "vi_VN" ? "vn" : "en",
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
                id,
                name,
                image_url,
                locale,
                platform,
              },
            });
          });
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        changeRoute,
        getUserInfo,
        getRoomsGomoku,
        getPositonSquare,
        getRoomsBlockHead,
        countUserStatus,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export default GlobalState;
