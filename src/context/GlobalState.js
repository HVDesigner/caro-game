import React from "react";
import AppContext from "./index";
import { reducer } from "./Reducers";
import { CHANGE_ROUTE, SET_USER_INFO } from "./ActionTypes";
import firebase from "./../Firebase/index";

function GlobalState(props) {
  const InitialGlobalState = {
    route: {
      path: "lobby",
    },
    userInfo: {
      id: "",
      name: "",
      image_url: "",
      locale: "",
    },
    rooms: {
      gomoku: {},
      "block-head": {},
    },
  };

  const [state, dispatch] = React.useReducer(reducer, InitialGlobalState);

  // const getRooms = (type) => {
  //   if (type) {
  //     firebase()
  //       .database.ref("rooms/gomoku")
  //       .on("value", (snapshot) => {
  //         return dispatch({
  //           type: GET_ROOMS_GOMOKU,
  //           payload: { ...snapshot.val() },
  //         });
  //       });

  //     return firebase().database.ref("rooms/gomoku");
  //   } else {
  //     firebase()
  //       .database.ref("rooms/block-head")
  //       .on("value", (snapshot) => {
  //         return dispatch({
  //           type: GET_ROOMS_BLOCK_HEAD,
  //           payload: { ...snapshot.val() },
  //         });
  //       });

  //     return firebase().database.ref("rooms/block-head");
  //   }
  // };

  const changeRoute = (path) => {
    return dispatch({
      type: CHANGE_ROUTE,
      payload: { path },
    });
  };

  const getUserInfo = (id, name, image_url, locale) => {
    return firebase()
      .database.ref("users/" + id)
      .once("value")
      .then(function (snapshot) {
        if (snapshot.val()) {
          if (snapshot.val().name.status === "original") {
            return dispatch({
              type: SET_USER_INFO,
              payload: {
                id,
                name,
                image_url,
                locale,
              },
            });
          } else {
            return dispatch({
              type: SET_USER_INFO,
              payload: {
                id,
                name: snapshot.val().name,
                image_url,
                locale,
              },
            });
          }
        } else {
          firebase()
            .database.ref("users/" + id)
            .set({
              coin: 1000,
              elo: 1000,
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
        firebase,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export default GlobalState;
