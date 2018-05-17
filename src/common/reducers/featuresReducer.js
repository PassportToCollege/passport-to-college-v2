import initialState from "./initialState";
import {
  FEATURES_GET_INITIATED,
  FEATURES_GET_SUCCESS,
  FEATURES_GET_FAILED
} from "../actions/actionTypes";

const features = (state = initialState.features, action) => {
  switch (action.type) {
    case FEATURES_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        hasFailed: false
      });
    case FEATURES_GET_SUCCESS:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        hasFailed: false,
        features: action.features
      });
    case FEATURES_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: true,
        hasGotten: false,
        error: action.error
      });
    default:
      return state;
  }
}

export default features;