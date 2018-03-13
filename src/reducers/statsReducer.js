import initialState from "./initialState";
import {
  APPLICATIONS_STATS_GET_INITIATED,
  APPLICATIONS_STATS_GET_FAILED,
  USERS_STATS_GET_INITIATED,
  USERS_STATS_GET_FAILED,
  APPLICATIONS_STATS_GET_SUCCESS,
  USERS_STATS_GET_SUCCESS,
  STATS_UPDATE_INITIATED,
  STATS_UPDATE_SUCCESS,
  STATS_UPDATE_FAILED
} from "../actions/actionTypes";

const stats = (state = initialState.stats, action) => {
  switch (action.type) {
    case APPLICATIONS_STATS_GET_INITIATED:
    case USERS_STATS_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        hasFailed: false
      });
    case APPLICATIONS_STATS_GET_FAILED:
    case USERS_STATS_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: false,
        hasFailed: true,
        error: action.error
      });
    case APPLICATIONS_STATS_GET_SUCCESS:
    case USERS_STATS_GET_SUCCESS:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        hasFailed: false,
        stats: action.stats
      });
    case STATS_UPDATE_INITIATED:
      return Object.assign({}, state, {
        statUpdating: true,
        stateUpdated: false,
        hasFailed: false,
        document: action.doc,
        stat: action.stat,
        operation: action.op
      });
    case STATS_UPDATE_SUCCESS:
      return Object.assign({}, state, {
        statUpdating: false,
        stateUpdated: true,
        hasFailed: false,
        document: action.doc,
        stat: action.stat,
        operation: action.op
      });
    case STATS_UPDATE_FAILED:
      return Object.assign({}, state, {
        statUpdating: false,
        stateUpdated: false,
        hasFailed: true,
        document: action.doc,
        stat: action.stat,
        operation: action.op,
        error: action.error
      });
    default:
      return state;
  }
}

export default stats;