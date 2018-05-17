import initialState from "./initialState";
import {
  FEATURE_GET_INITIATED,
  FEATURE_GET_FAILED, 
  FEATURE_GET_SUCCESS,
  FEATURE_UPDATE_FAILED,
  FEATURE_UPDATE_INITIATED,
  FEATURE_UPDATED,
  FEATURE_CREATION_INITIATED,
  FEATURE_CREATED,
  FEATURE_CREATION_FAILED,
  FEATURE_DELETE_INITIATED,
  FEATURE_DELETED,
  FEATURE_DELETE_FAILED
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
    case FEATURE_CREATION_INITIATED:
      return Object.assign({}, state, {
        isCreating: true,
        hasCreated: false,
        creationFailed: false,
        data: action.data
      });
    case FEATURE_CREATED:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: true,
        creationFailed: false,
        data: action.data
      });
    case FEATURE_CREATION_FAILED:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: false,
        creationFailed: true,
        error: action.error,
        data: action.data
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
    case FEATURE_DELETE_INITIATED:
      return Object.assign({}, state, {
        isDeleting: true,
        hasDeleted: false,
        deleteFailed: false,
        feature: action.feature
      });
    case FEATURE_DELETED:
      return Object.assign({}, state, {
        isDeleting: false,
        hasDeleted: true,
        deleteFailed: false,
        feature: action.feature
      });
    case FEATURE_DELETE_FAILED:
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