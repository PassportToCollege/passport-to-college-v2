import initialState from "./initialState";
import {
  STATS_GET_INITIATED,
  STATS_GET_SUCCESS,
  STATS_GET_FAILED
} from "../actions/actionTypes";

const stats = (state = initialState.stats, action) => {
  switch (action.type) {
    case STATS_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        hasFailed: false
      });
    case STATS_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: false,
        hasFailed: true,
        error: action.error
      });
    case STATS_GET_SUCCESS:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        hasFailed: false,
        stats: action.stats
      });
    default:
      return state;
  }
}

export default stats;