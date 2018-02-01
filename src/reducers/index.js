import { combineReducers } from "redux";

import hamburgerState from "./hamburgerReducer";
import auth from "./authReducer";
import avatar from "./avatarReducer";

const rootReducer = combineReducers({
  hamburgerState,
  auth,
  avatar
});

export default rootReducer;