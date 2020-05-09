import React from "react";
import AppContext from "./index";
import { reducer } from "./Reducers";
import { GET_SQUARE_POSITION } from "./ActionTypes";
import { FirebaseContext } from "./../Firebase/";

function GlobalState(props) {
  const [firebase] = React.useState(React.useContext(FirebaseContext));

  const [state, dispatch] = React.useReducer(reducer, {
    user: {
      coin: 0,
      createdAt: 0,
      elo: { gomoku: 0, "block-head": 0 },
      image_url: "",
      locale: "",
      location: { path: "dashboard" },
      name: { value: "", status: "original" },
      room_id: { value: 0, type: "none" },
      setting: {
        sound: true,
        matchingByElo: true,
        language: { status: "", value: "" },
      },
      game: {
        win: { gomoku: 0, "block-head": 0 },
        lost: { gomoku: 0, "block-head": 0 },
        tie: { gomoku: 0, "block-head": 0 },
      },
      on_queue: false,
      uid: "",
      updatedAt: 0,
    },
    "square-position": {
      status: false,
      row: 0,
      col: 0,
    },
  });

  const changeRoute = (path, id = 0, type = "") => {
    if (state.user.uid && state.user.location.path !== path) {
      const userDoc = firebase
        .firestore()
        .collection("users")
        .doc(state.user.uid);

      firebase.firestore().runTransaction((transaction) => {
        return transaction.get(userDoc).then((doc) => {
          if (!doc.exists) {
            return { message: "changeRoute error" };
          }

          if (path === "room" && doc.data().location.path !== path) {
            transaction.update(userDoc, {
              "location.path": path,
              "room_id.value": id,
              "room_id.type": type,
            });
          } else {
            transaction.update(userDoc, {
              "location.path": path,
            });
          }
        });
      });
    }
  };

  const getPositonSquare = (status, row, col) => {
    return dispatch({
      type: GET_SQUARE_POSITION,
      payload: { status, row, col },
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        changeRoute,
        getPositonSquare,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export default GlobalState;
