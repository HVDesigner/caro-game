import React from "react";
import AppContext from "./index";
import { reducer } from "./Reducers";
import {
  CHANGE_ROUTE,
  SET_USER_INFO,
  GET_ROOMS_BLOCK_HEAD,
  GET_ROOMS_GOMOKU,
} from "./ActionTypes";
import { FirebaseContext } from "./../Firebase/";

function GlobalState(props) {
  const firebase = React.useContext(FirebaseContext);

  const InitialGlobalState = {
    route: {
      path: "dashboard",
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

  const changeRoute = (path) => {
    return dispatch({
      type: CHANGE_ROUTE,
      payload: { path },
    });
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
        // update image
        if (JSON.stringify(snapshot.val().image_url) !== JSON.stringify()) {
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
