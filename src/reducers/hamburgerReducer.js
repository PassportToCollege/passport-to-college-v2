import initialState from "./initialState";
import { OPEN_HAMBURGER, CLOSE_HAMBURGER } from "../actions/actionTypes";

const hamburgerState = (state = initialState.hamburgerState, action) => {
  switch(action.type) {
    case OPEN_HAMBURGER:
    case CLOSE_HAMBURGER:
      return Object.assign({}, { previous: state.current }, {
        current: action.hamburgerState
      });
    default:
      return state;
  }
}

export default hamburgerState;