import initialState from "./initialState";
import {
  USERS_GET_INITIATED, 
  USERS_GET_FAILED,
  USERS_GET_SUCCESS,
  USERS_CREATE_USER_INITIATED,
  USERS_CREATE_USER_FAILED,
  USERS_NEW_USER_CREATED,
  USERS_SEND_SIGNUP_EMAIL_INITIATED,
  USERS_SEND_SIGNUP_EMAIL_FAILED,
  USERS_SIGNUP_EMAIL_SENT,
  USERS_GET_BY_ID_INITIATED,
  USERS_GET_BY_ID_FAILED,
  USERS_GET_BY_ID_SUCCESS
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
    case USERS_CREATE_USER_INITIATED:
      return Object.assign({}, state, {
        isCreating: true,
        hasCreated: false,
        hasFailed: false,
        data: action.data
      });
    case USERS_CREATE_USER_FAILED:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: false,
        hasFailed: true,
        data: action.data,
        error: action.error
      });
    case USERS_NEW_USER_CREATED:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: true,
        hasFailed: false,
        data: action.data
      });
    case USERS_SEND_SIGNUP_EMAIL_INITIATED:
      return Object.assign({}, state, {
        isSending: true,
        hasSent: false,
        hasFailed: false,
        email: action.email
      });
    case USERS_SEND_SIGNUP_EMAIL_FAILED:
      return Object.assign({}, state, {
        isSending: false,
        hasSent: false,
        hasFailed: true,
        email: action.email,
        error: action.error
      });
    case USERS_SIGNUP_EMAIL_SENT:
      return Object.assign({}, state, {
        isSending: false,
        hasSent: true,
        hasFailed: false,
        email: action.email
      });
    case USERS_GET_BY_ID_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        hasFailed: false,
        user: action.user
      });
    case USERS_GET_BY_ID_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: false,
        hasFailed: true,
        user: action.user,
        error: action.error
      });
    case USERS_GET_BY_ID_SUCCESS:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        hasFailed: false,
        user: action.user
      });
    default:
      return state;
  }
}

export default users;