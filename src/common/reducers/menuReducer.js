import initialState from "./initialState";
import {
  DASHBOARD_MENU_STATE_CLOSED,
  DASHBOARD_MENU_STATE_COMPACT,
  DASHBOARD_MENU_STATE_FULL
} from "../actions/actionTypes";

const menu = (state = initialState.menu, action) => {
  switch (action.type) {
    case DASHBOARD_MENU_STATE_CLOSED:
      return Object.assign({}, state, {
        dash: `${state.dash} closed`
      });
    case DASHBOARD_MENU_STATE_COMPACT:
      return Object.assign({}, state, {
        dash: "compact"
      });
    case DASHBOARD_MENU_STATE_FULL:
      return Object.assign({}, state, {
        dash: "full"
      });
    default:
      return state;
  }
}

export default menu;
