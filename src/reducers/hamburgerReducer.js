import initialState from "./initialState";
import { OPEN_HAMBURGER, CLOSE_HAMBURGER } from "../actions/actionTypes";

const hamburgerOpen = (state = initialState.hamburgerOpen, action) => {
  let newState;

  switch(action.type) {
    case OPEN_HAMBURGER:
      newState = action.hamburgerOpen;
      return newState;
    case CLOSE_HAMBURGER:
      newState = action.hamburgerOpen;
      return newState;
    default:
      return state;
  }
}

export default hamburgerOpen;