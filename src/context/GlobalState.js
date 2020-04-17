import React from "react";
import AppContext from "./index";
import { reducer } from "./Reducers";
import { CHANGE_ROUTE, SET_USER_INFO } from "./ActionTypes";

function GlobalState(props) {
  const InitialGlobalState = {
    route: {
      path: "lobby",
    },
    userInfo: {
      id: "",
      name: "",
      image_url: "",
    },
  };

  const [state, dispatch] = React.useReducer(reducer, InitialGlobalState);

  const changeRoute = (path) => {
    return dispatch({
      type: CHANGE_ROUTE,
      payload: { path },
    });
  };

  const setUserInfo = (id, name, image_url) => {
    return dispatch({
      type: SET_USER_INFO,
      payload: { id, name, image_url },
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        changeRoute,
        setUserInfo,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export default GlobalState;
