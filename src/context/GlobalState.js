import React from "react";
import AppContext from "./index";
import { reducer } from "./Reducers";
import { CHANGE_ROUTE, SET_USER_INFO } from "./ActionTypes";
import firebase from "./../Firebase/index";

function GlobalState(props) {
  const InitialGlobalState = {
    route: {
      path: "dashboard",
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

  const changeRoute = (path) => {
    return dispatch({
      type: CHANGE_ROUTE,
      payload: { path },
    });
  };

  const getUserInfo = (id, name, image_url, locale) => {
    const userRef = firebase().database.ref("users/" + id);

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
        firebase,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export default GlobalState;
