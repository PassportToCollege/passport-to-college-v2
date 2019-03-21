import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";

const menu = (state : any = initialState.menu, action : any) : any => {
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
