import iAppState from "../imodels/iAppState";
import iAction from "../imodels/iAction";

import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";

const FeaturesActions = ActionTypes.Features;

const features = (state : iAppState["Features"] = initialState.Features, action : iAction) : iAppState["Features"] => {
  switch (action.type) {
    case FeaturesActions.GettingFeatures:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        hasFailed: false,
        student: action.student
      });
    case FeaturesActions.GotFeatures:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        hasFailed: false,
        features: action.features,
        student: action.student
      });
    case FeaturesActions.GettingFeaturesFailed:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: true,
        hasGotten: false,
        error: action.error,
        student: action.student
      });
    case FeaturesActions.GettingActiveFeatures:
      return Object.assign({}, state, {
        gettingActive: true,
        gotActive: false,
        failedToGetActive: false
      });
    case FeaturesActions.GotActiveFeatures:
      return Object.assign({}, state, {
        gettingActive: false,
        gotActive: true,
        failedToGetActive: false,
        features: action.features
      });
    case FeaturesActions.GettingActiveFeaturesFailed:
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