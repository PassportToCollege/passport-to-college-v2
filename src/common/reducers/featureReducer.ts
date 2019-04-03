import iAppState from "../imodels/iAppState";
import iAction from "../imodels/iAction";

import ActionTypes from "../actions/actionTypes";
import initialState from "./initialState";
import Feature from "../models/Feature";

const FeatureActions = ActionTypes.Feature;

const feature = (state : iAppState["Feature"] = initialState.Feature, action : iAction) : iAppState["Feature"] => {
  switch (action.type) {
    case FeatureActions.GettingFeature:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        failedToGetFeature: false,
        id: action.id
      });
    case FeatureActions.GettingFeatureFailed:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: false,
        failedToGetFeature: true,
        error: action.error,
        id: action.id
      });
    case FeatureActions.GotFeature:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        failedToGetFeature: false,
        feature: <Feature>action.feature
      });
    case  FeatureActions.CreatedFeature:
      return Object.assign({}, state, {
        isCreating: true,
        hasCreated: false,
        creationFailed: false,
        data: action.data
      });
    case FeatureActions.CreatedFeature:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: true,
        creationFailed: false,
        data: action.data
      });
    case FeatureActions.CreatingfeatureFailed:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: false,
        creationFailed: true,
        error: action.error,
        data: action.data
      });
    case FeatureActions.UpdatedFeature:
      return Object.assign({}, state, {
        isUpdating: true,
        hasUpdated: false,
        failedToUpdate: false,
        feature: action.feature,
        data: action.data,
      });
    case FeatureActions.UpdatedFeature:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdate: true,
        failedToUpdate: false,
        feature: action.feature,
        data: action.data
      });
    case FeatureActions.UpdatingFeatureFailed:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: false,
        failedToUpdate: true,
        error: action.error,
        data: action.data
      });
    case FeatureActions.DeletingFeature:
      return Object.assign({}, state, {
        isDeleting: true,
        hasDeleted: false,
        deleteFailed: false,
        feature: action.feature
      });
    case FeatureActions.DeletedFeature:
      return Object.assign({}, state, {
        isDeleting: false,
        hasDeleted: true,
        deleteFailed: false,
        feature: action.feature
      });
    case FeatureActions.DeletingFeatureFailed:
      return Object.assign({}, state, {
        isDeleting: false,
        hasDeleted: false,
        deleteFailed: true,
        error: action.error,
        feature: action.feature
      });
    default:
      return state;
  }
};

export default feature;