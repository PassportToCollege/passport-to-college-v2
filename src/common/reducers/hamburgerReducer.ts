import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";

const hamburgerState = (state : any = initialState.hamburgerState, action : any) : any => {
  switch(action.type) {
    case ActionTypes.Hamburger.Open:
    case ActionTypes.Hamburger.Close:
      return Object.assign({}, { previous: state.current }, {
        current: action.hamburgerState
      });
    default:
      return state;
  }
}

export default hamburgerState;