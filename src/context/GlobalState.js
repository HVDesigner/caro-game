import React from "react";
import AppContext from "./index";
import { reducer } from "./Reducers";
import {
  CHANGE_ROUTE,
  SET_USER_INFO,
  GET_ROOMS_BLOCK_HEAD,
  GET_ROOMS_GOMOKU,
  GET_ROOM_ID,
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
    },
    rooms: {
      gomoku: [],
      "block-head": [],
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

  // const updateRoomGomoku = () => {
  //   const childChangeRef = firebase().database.ref("rooms/gomoku");

  //   childChangeRef.on("child_changed", (snapshot) => {
  //     console.log({ id: snapshot.key, ...snapshot.val() });
  //   });

  //   return childChangeRef;
  // };

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

  const getUserInfo = (id, name, image_url, locale) => {
    const userRef = firebase.database().ref("users/" + id);

    return userRef.once("value").then((snapshot) => {
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
            room_id: { value: 0 },
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
          .then(() => {
            return dispatch({
              type: SET_USER_INFO,
              payload: {
                id,
                name,
                image_url,
                locale,
              },
            });
          });
      }
    });
  };

  // console.log(state);

  return (
    <AppContext.Provider
      value={{
        state,
        changeRoute,
        getUserInfo,
        getRoomsGomoku,
        // updateRoomGomoku,
        getRoomsBlockHead,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export default GlobalState;
