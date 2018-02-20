import initialState from "./initialState";
import {
  APPLICATION_GET_FAILED,
  APPLICATION_GET_INITIATED,
  APPLICATION_GET_SUCCESS,
  APPLICATION_UPDATE_FAILED,
  APPLICATION_UPDATE_INITIATED,
  APPLICATION_UPDATED,
  APPLICATION_TEST_DELETE_FAILED,
  APPLICATION_TEST_DELETE_INITIATED,
  APPLICATION_TEST_DELETED
} from "../actions/actionTypes";

const application = (state = initialState.application, action) => {
  switch (action.type) {
    case APPLICATION_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasFailed: false,
        hasGotten: false,
        user: action.user
      });
    case APPLICATION_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: true,
        hasGotten: false,
        error: action.error,
        user: action.user
      });
    case APPLICATION_GET_SUCCESS:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: false,
        hasGotten: true,
        application: action.application
      });
    case APPLICATION_UPDATE_INITIATED:
      return Object.assign({}, state, {
        isUpdating: true,
        hasUpdated: false,
        hasFailed: false,
        user: action.user,
        data: action.data
      });
    case APPLICATION_UPDATED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: true,
        hasFailed: false,
        user: action.user,
        data: action.data
      });
    case APPLICATION_UPDATE_FAILED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: false,
        hasFailed: true,
        user: action.user,
        data: action.data,
        error: action.error
      });
    case APPLICATION_TEST_DELETE_INITIATED:
      return Object.assign({}, state, {
        isDeleting: true,
        hasDeleted: false,
        hasFailed: false,
        user: action.user,
        test: action.test
      });
    case APPLICATION_TEST_DELETE_FAILED:
      return Object.assign({}, state, {
        isDeleting: false,
        hasDeleted: false,
        hasFailed: true,
        user: action.user,
        test: action.test,
        error: action.error
      });
    case APPLICATION_TEST_DELETED:
      return Object.assign({}, state, {
        isDeleting: false,
        hasDeleted: true,
        hasFailed: false,
        user: action.user,
        test: action.test
      });
    default:
      return state;
  }
};

export default application;