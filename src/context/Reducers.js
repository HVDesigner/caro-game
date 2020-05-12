import { SET_USER_DATA, GET_SQUARE_POSITION } from "./ActionTypes";

export function reducer(state, action) {
  switch (action.type) {
    case SET_USER_DATA:
      return { ...state, user: action.payload };
    case GET_SQUARE_POSITION:
      return {
        ...state,
        "square-position": action.payload,
      };

    default:
      throw new Error();
  }
}
