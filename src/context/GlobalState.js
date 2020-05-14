import React from "react";
import AppContext from "./index";
import { reducer } from "./Reducers";
import { GET_SQUARE_POSITION } from "./ActionTypes";
import { useFirestore } from "reactfire";
import firebase from "firebase/app";

function GlobalState(props) {
  const [state, dispatch] = React.useReducer(reducer, {
    modal: {
      "find-room": false,
    },
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

  /**
   *
   * ----------------------------------------------------------------------------------
   * Chức năng chuyển trang.
   *
   * @param {string} path
   * @param {number} id
   * @param {string} type
   */
  const userCollectionFirestore = useFirestore().collection("users");

  const changeRoute = (path, id = 0, type = "") => {
    if (state.user.uid && state.user.location.path !== path) {
      const userDocFirestore = userCollectionFirestore.doc(state.user.uid);

      firebase.firestore().runTransaction((transaction) => {
        return transaction.get(userDocFirestore).then((doc) => {
          if (!doc.exists) {
            return { message: "changeRoute error" };
          }

          if (path === "room" && doc.data().location.path !== path) {
            transaction.update(userDocFirestore, {
              "location.path": path,
              "room_id.value": id,
              "room_id.type": type,
            });
          } else {
            transaction.update(userDocFirestore, {
              "location.path": path,
            });
          }
        });
      });
    }
  };

  /**
   *
   * ----------------------------------------------------------------------------------
   * Chức năng lấy vị trí của con trỏ chuột trên bàn cờ.
   *
   * @param {boolean} status
   * @param {number} row
   * @param {number} col
   */
  const getPositonSquare = (status, row, col) => {
    return dispatch({
      type: GET_SQUARE_POSITION,
      payload: { status, row, col },
    });
  };

  /**
   * ----------------------------------------------------------------------------------
   * Trả về một Context Provider.
   */
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
