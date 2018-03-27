import initialState from "./initialState";
import {
  FEATURE_GET_INITIATED,
  FEATURE_GET_FAILED, 
  FEATURE_GET_SUCCESS,
  FEATURE_UPDATE_FAILED,
  FEATURE_UPDATE_INITIATED,
  FEATURE_UPDATED
} from "../actions/actionTypes";

const feature = (state = initialState.feature, action) => {
  switch (action.type) {
    case FEATURE_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        hasFailed: false,
        feature: action.feature
      });
    case FEATURE_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: false,
        hasFailed: true,
        error: action.error,
        data: action.data
      });
    case FEATURE_GET_SUCCESS:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        hasFailed: false,
        feature: action.feature
      });
    case FEATURE_UPDATE_INITIATED:
      return Object.assign({}, state, {
        isUpdating: true,
        hasUpdated: false,
        hasFailed: false,
        data: action.data,
      });
    case FEATURE_UPDATED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdate: true,
        hasFailed: false,
        data: action.data
      });
    case FEATURE_UPDATE_FAILED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: false,
        hasFailed: true,
        error: action.error,
        data: action.data
      });
    default:
      return state;
  }
};

export default feature;