import { combineReducers } from "redux";

import hamburgerState from "./hamburgerReducer";
import auth from "./authReducer";

const rootReducer = combineReducers({
  hamburgerState,
  auth
});

export default rootReducer;