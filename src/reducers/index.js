import { combineReducers } from "redux";

import hamburgerOpen from "./hamburgerReducer";

const rootReducer = combineReducers({
  hamburgerOpen
});

export default rootReducer;