import { CHANGE_ROUTE, SET_USER_INFO } from "./ActionTypes";

export function reducer(state, action) {
  switch (action.type) {
    case CHANGE_ROUTE:
      return { ...state, route: action.payload };
    case SET_USER_INFO:
      return { ...state, userInfo: action.payload };

    default:
      throw new Error();
  }
}
