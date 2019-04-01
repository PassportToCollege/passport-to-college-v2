import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";
import iAppState from "../imodels/iAppState";
import iAction from "../imodels/iAction";

const menu = (state: iAppState["Menu"] = initialState.Menu, action: iAction): iAppState["Menu"] => {
  switch (action.type) {
    case ActionTypes.Menu.Closed:
      return Object.assign({}, state, {
        dash: `${state.dash} closed`
      });
    case ActionTypes.Menu.Compact:
      return Object.assign({}, state, {
        dash: "compact"
      });
    case ActionTypes.Menu.Full:
      return Object.assign({}, state, {
        dash: "full"
      });
    default:
      return state;
  }
}

export default menu;
