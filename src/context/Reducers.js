import {
  CHANGE_ROUTE,
  SET_USER_INFO,
  GET_ROOMS_GOMOKU,
  GET_ROOMS_BLOCK_HEAD,
  GET_ROOM_ID,
  GET_SQUARE_POSITION,
  COUNT_BLOCK_HEAD_USER_PLAYING,
  COUNT_GOMOKU_USER_PLAYING,
} from "./ActionTypes";

export function reducer(state, action) {
  switch (action.type) {
    case COUNT_BLOCK_HEAD_USER_PLAYING:
      return {
        ...state,
        rooms: { ...state.rooms, "block-head": action.payload },
      };
    case COUNT_GOMOKU_USER_PLAYING:
      return {
        ...state,
        rooms: { ...state.rooms, gomoku: action.payload },
      };

    case CHANGE_ROUTE:
      return { ...state, route: action.payload };
    case SET_USER_INFO:
      return { ...state, userInfo: action.payload };
    case GET_ROOMS_GOMOKU:
      return { ...state, rooms: { ...state.rooms, gomoku: action.payload } };
    case GET_ROOMS_BLOCK_HEAD:
      return {
        ...state,
        rooms: { ...state.rooms, "block-head": action.payload },
      };
    case GET_ROOM_ID:
      return {
        ...state,
        room: action.payload,
      };
    case GET_SQUARE_POSITION:
      return {
        ...state,
        "square-position": action.payload,
      };

    default:
      throw new Error();
  }
}
