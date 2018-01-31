import initialState from "./initialState";
import { OPEN_HAMBURGER, CLOSE_HAMBURGER } from "../actions/actionTypes";

const hamburgerState = (state = initialState.hamburgerState, action) => {
  switch(action.type) {
    case OPEN_HAMBURGER:
    case CLOSE_HAMBURGER:
      return Object.assign({}, { previousHamburgerState: state }, {
        hamburgerState: action.hamburgerState
      });
    default:
      return state;
  }
}

export default hamburgerState;