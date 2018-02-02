import initialState from "./initialState";
import {
  USER_GET_FAILED,
  USER_UPDATE_INITIATED,
  USER_GET_INITIATED,
  USER_GET_SUCCESS,
  USER_UPDATE_FAILED,
  USER_UPDATED
} from "../actions/actionTypes";

const user = (state = initialState.user, action) => {
  switch(action.type) {
    case USER_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasFailed: false,
        user: action.user,
      });
    case USER_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: true,
        user: action.user,
        error: action.error
      });
    case USER_GET_SUCCESS:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: false,
        user: action.user,
      });
    case USER_UPDATE_INITIATED:
      return Object.assign({}, state, {
        isUpdating: true,
        hasFailed: false,
        uid: action.user,
        data: action.data
      });
    case USER_UPDATE_FAILED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasFailed: true,
        uid: action.user,
        data: action.data,
        error: action.error
      });
    case USER_UPDATED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasFailed: false,
        uid: action.user,
        data: action.data
      });
    default:
      return state;
  }
};

export default user;