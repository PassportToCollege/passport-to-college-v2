import initialState from "./initialState";
import {
  FEATURES_GET_BY_USER_INITIATED,
  FEATURES_GET_BY_USER_FAILED,
  FEATURES_GET_BY_USER_SUCCESS,
  FEATURES_GET_ACTIVE_INITIATED,
  FEATURES_GET_ACTIVE_SUCCESS,
  FEATURES_GET_ACTIVE_FAILED
} from "../actions/actionTypes";

const features = (state = initialState.features, action) => {
  switch (action.type) {
    case FEATURES_GET_BY_USER_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        hasFailed: false,
        student: action.student
      });
    case FEATURES_GET_BY_USER_SUCCESS:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        hasFailed: false,
        userFeatures: action.features,
        student: action.student
      });
    case FEATURES_GET_BY_USER_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: true,
        hasGotten: false,
        error: action.error,
        student: action.student
      });
    case FEATURES_GET_ACTIVE_INITIATED:
      return Object.assign({}, state, {
        gettingActive: true,
        gotActive: false,
        failedToGetActive: false
      });
    case FEATURES_GET_ACTIVE_SUCCESS:
      return Object.assign({}, state, {
        gettingActive: false,
        gotActive: true,
        failedToGetActive: false,
        activeFeatures: action.features
      });
    case FEATURES_GET_ACTIVE_FAILED:
      return Object.assign({}, state, {
        gettingActive: false,
        gotActive: false,
        failedToGetActive: true,
        error: action.error
      });
    default:
      return state;
  }
}

export default features;