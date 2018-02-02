import { combineReducers } from "redux";

import hamburgerState from "./hamburgerReducer";
import auth from "./authReducer";
import avatar from "./avatarReducer";
import user from "./userReducer";

const rootReducer = combineReducers({
  hamburgerState,
  auth,
  avatar,
  user
});

export default rootReducer;