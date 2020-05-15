import {
  SET_USER_DATA,
  GET_SQUARE_POSITION,
  TOGGLE_FIND_ROOM_MODAL,
  LOADING_OVERLAY,
  TOGGLE_DIALOG,
} from "./ActionTypes";

export function reducer(state, action) {
  switch (action.type) {
    /**
     * User Action.
     */
    case SET_USER_DATA:
      return { ...state, user: action.payload };

    /**
     * Position Point.
     */
    case GET_SQUARE_POSITION:
      return {
        ...state,
        "square-position": action.payload,
      };

    case TOGGLE_FIND_ROOM_MODAL:
      return {
        ...state,
        modal: { ...state.modal, "find-room": action.payload },
      };

    case LOADING_OVERLAY:
      return {
        ...state,
        "loading-overlay": action.payload,
      };

    case TOGGLE_DIALOG:
      return {
        ...state,
        dialog: { ...state.dialog, ...action.payload },
      };

    default:
      throw new Error();
  }
}
