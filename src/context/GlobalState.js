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
} from "./ActionTypes";
import { FirebaseContext } from "./../Firebase/";

function GlobalState(props) {
  const [firebase] = React.useState(React.useContext(FirebaseContext));

  const [state, dispatch] = React.useReducer(reducer, {
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
  });

  React.useEffect(() => {
    const locationPathRef = firebase
      .database()
      .ref("users/" + state.userInfo.id + "/location/");

    function dispatchRoute(snapshot) {
      if (snapshot.val()) {
        dispatch({
          type: CHANGE_ROUTE,
          payload: { path: snapshot.val() },
        });
      }
    }

    locationPathRef.child("path").on("value", dispatchRoute);

    return () => {
      locationPathRef.child("path").off("value", dispatchRoute);
    };
  }, [state.route.path, state.userInfo.id, firebase]);

  const getRoute = (path) => {
    dispatch({
      type: CHANGE_ROUTE,
      payload: { path },
    });
  };

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
        userRef
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

    return userRef;
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        changeRoute,
        getUserInfo,
        getRoomsGomoku,
        getPositonSquare,
        getRoomsBlockHead,
        getRoute,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export default GlobalState;
