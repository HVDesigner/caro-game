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
