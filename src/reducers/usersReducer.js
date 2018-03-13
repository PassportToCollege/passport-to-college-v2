import initialState from "./initialState";
import {
  USERS_GET_INITIATED, 
  USERS_GET_FAILED,
  USERS_GET_SUCCESS
} from "../actions/actionTypes";

const users = (state = initialState.users, action) => {
  switch (action.type) {
    case USERS_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasFailed: false,
        hasGotten: false,
        page: action.page,
        userType: action.userType
      });
    case USERS_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: true,
        hasGotten: false,
        page: action.page,
        userType: action.userType,
        error: action.error
      });
    case USERS_GET_SUCCESS:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: false,
        hasGotten: true,
        page: action.page,
        userType: action.userType,
        users: action.users
      });
    default:
      return state;
  }
}

export default users;