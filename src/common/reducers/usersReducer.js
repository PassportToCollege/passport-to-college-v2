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
  USER_GET_BY_ID_INITIATED,
  USER_GET_BY_ID_FAILED,
  USER_GET_BY_ID_SUCCESS,
  USERS_UPDATE_INITIATED,
  USERS_UPDATE_FAILED,
  USERS_UPDATED,
  USERS_GET_BY_ID_INITIATED,
  USERS_GET_BY_ID_FAILED,
  USERS_GET_BY_ID_SUCCESS
} from "../actions/actionTypes";

const users = (state = initialState.users, action) => {
  switch (action.type) {
    case USERS_GET_INITIATED:
      return Object.assign({}, state, {
        isGettingUsers: true,
        hasFailed: false,
        hasGottenUsers: false,
        page: action.page,
        userType: action.userType
      });
    case USERS_GET_FAILED:
      return Object.assign({}, state, {
        isGettingUsers: false,
        hasFailed: true,
        hasGottenUsers: false,
        page: action.page,
        userType: action.userType,
        error: action.error
      });
    case USERS_GET_SUCCESS:
      return Object.assign({}, state, {
        isGettingUsers: false,
        hasFailed: false,
        hasGottenUsers: true,
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
    case USER_GET_BY_ID_INITIATED:
      return Object.assign({}, state, {
        isGettingUser: true,
        hasGottenUser: false,
        hasFailed: false,
        user: action.user
      });
    case USER_GET_BY_ID_FAILED:
      return Object.assign({}, state, {
        isGettingUser: false,
        hasGottenUser: false,
        hasFailed: true,
        user: action.user,
        error: action.error
      });
    case USER_GET_BY_ID_SUCCESS:
      return Object.assign({}, state, {
        isGettingUser: false,
        hasGottenUser: true,
        hasFailed: false,
        user: action.user
      });
    case USERS_GET_BY_ID_INITIATED:
      return Object.assign({}, state, {
        isGettingUsers: true,
        hasGottenUsersByUid: false,
        hasFailed: false,
        usersByUid: action.users
      });
    case USERS_GET_BY_ID_FAILED:
      return Object.assign({}, state, {
        isGettingUsers: false,
        hasGottenUsersByUid: false,
        hasFailed: true,
        users: action.users,
        error: action.error
      });
    case USERS_GET_BY_ID_SUCCESS:
      return Object.assign({}, state, {
        isGettingUsers: false,
        hasGottenUsersByUid: true,
        hasFailed: false,
        usersByUid: action.users
      });
    case USERS_UPDATE_INITIATED:
      return Object.assign({}, state, {
        isUpdating: true,
        hasUpdated: false,
        updateFailed: false,
        data: action.data,
        uid: action.user
      });
    case USERS_UPDATE_FAILED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: false,
        updateFailed: true,
        data: action.data,
        uid: action.user,
        error: action.error
      });
    case USERS_UPDATED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: true,
        updateFailed: false,
        data: action.data,
        uid: action.user
      });
    default:
      return state;
  }
}

export default users;