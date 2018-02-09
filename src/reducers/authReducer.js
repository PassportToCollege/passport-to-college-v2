import initialState from "./initialState";
import { 
  SIGN_IN_AUTHORIZING, 
  SIGN_IN_FAILED,
  SIGNED_IN,
  SIGN_OUT_AUTHORIZING,
  SIGN_OUT_FAILED,
  SIGNED_OUT, 
  SIGN_IN_GETTING_USER,
  ACCOUNT_CREATED,
  ACCOUNT_CREATION_ADDING_TO_USER_DBS,
  ACCOUNT_CREATION_ADDING_TO_USER_DBS_FAILED,
  ACCOUNT_CREATION_FAILED,
  ACCOUNT_CREATION_INITIATED } from "../actions/actionTypes";

const auth = (state = initialState.activeUser, action) => {
  switch(action.type) {
    case SIGN_IN_AUTHORIZING:
    case SIGN_OUT_AUTHORIZING:
      return Object.assign({}, state, {
        isAuthorizing: true,
        hasFailed: false,
        activeUser: action.user
      });
    case SIGN_IN_GETTING_USER:
      return Object.assign({}, state, {
        isAuthorizing: false,
        hasFailed: false,
        activeUser: null
      });
    case SIGNED_IN:
      return Object.assign({}, state, {
        isAuthorizing: false,
        hasFailed: false,
        activeUser: action.user
      });
    case SIGN_IN_FAILED:
    case SIGN_OUT_FAILED:
      return Object.assign({}, state, {
        hasFailed: true,
        isAuthorizing: false,
        activeUser: null,
        error: action.error
      });
    case SIGNED_OUT:
      return Object.assign({}, state, {
        isAuthorizing: false,
        hasFailed: false,
        activeUser: null
      });
    case ACCOUNT_CREATION_INITIATED:
      return Object.assign({}, state, {
        isCreating: true,
        hasFailed: true,
        data: action.data
      });
    case ACCOUNT_CREATION_FAILED:
      return Object.assign({}, state, {
        isCreating: false,
        hasFailed: false,
        data: action.data,
        error: action.data
      });
    case ACCOUNT_CREATED:
      return Object.assign({}, state, {
        isCreating: false,
        hasFailed: false,
        data: action.data
      });
    case ACCOUNT_CREATION_ADDING_TO_USER_DBS:
      return Object.assign({}, state, {
        isCreating: true,
        hasFailed: false,
        isAddingToDbs: true,
        data: action.data
      });
    case ACCOUNT_CREATION_ADDING_TO_USER_DBS_FAILED:
      return Object.assign({}, state, {
        isCreating: false,
        hasFailed: true,
        isAddingToDbs: false,
        data: action.data,
        error: action.error
      });
    default:
      return state;
  }
}

export default auth;