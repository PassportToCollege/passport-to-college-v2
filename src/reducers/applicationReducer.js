import initialState from "./initialState";
import {
  APPLICATION_GET_FAILED,
  APPLICATION_GET_INITIATED,
  APPLICATION_GET_SUCCESS,
  APPLICATION_UPDATE_FAILED,
  APPLICATION_UPDATE_INITIATED,
  APPLICATION_UPDATED
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
    default:
      return state;
  }
};

export default application;