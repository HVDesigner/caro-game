import React from "react";
import AppContext from "./index";
import { reducer } from "./Reducers";
import { GET_SQUARE_POSITION } from "./ActionTypes";
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
    user: {
      coin: 0,
      createdAt: 0,
      elo: 0,
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

      if (path === "room") {
        userDoc.update({
          "location.path": path,
          "room_id.value": id,
          "room_id.type": type,
        });
      } else {
        userDoc.update({
          "location.path": path,
        });
      }
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
