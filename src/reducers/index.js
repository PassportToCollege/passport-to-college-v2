import { combineReducers } from "redux";

import hamburgerState from "./hamburgerReducer";

const rootReducer = combineReducers({
  hamburgerState
});

export default rootReducer;