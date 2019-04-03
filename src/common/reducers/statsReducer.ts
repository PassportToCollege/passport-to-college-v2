import iAppState from "../imodels/iAppState";
import iAction from "../imodels/iAction";

import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";

const StatsActions = ActionTypes.Stats;

const stats = (state : iAppState["Stats"] = initialState.Stats, action : iAction) : iAppState["Stats"] => {
  switch (action.type) {
    case StatsActions.GettingStats:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        hasFailed: false
      });
    case StatsActions.GettingStatsFailed:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: false,
        hasFailed: true,
        error: action.error
      });
    case StatsActions.GotStats:
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