import initialState from "./initialState";
import { 
    SIGN_IN_AUTHORIZING, 
    SIGN_IN_FAILED,
    SIGNED_IN } from "../actions/actionTypes";

const auth = (state = initialState.user, action) => {
  switch(action.type) {
    case SIGN_IN_AUTHORIZING:
      return Object.assign({}, state, {
        isAuthorizing: true,
        hasFailed: false,
        user: action.user
      });
    case SIGNED_IN:
      return Object.assign({}, state, {
        isAuthorizing: false,
        hasFailed: false,
        user: action.user
      });
    case SIGN_IN_FAILED:
      return Object.assign({}, state, {
        hasFailed: true,
        isAuthorizing: false,
        user: action.user,
        error: action.error
      });
    default:
      return state;
  }
}

export default auth;