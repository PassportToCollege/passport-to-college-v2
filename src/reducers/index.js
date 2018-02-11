import { combineReducers } from "redux";

import hamburgerState from "./hamburgerReducer";
import auth from "./authReducer";
import avatar from "./avatarReducer";
import user from "./userReducer";
import application from "./applicationReducer";

const rootReducer = combineReducers({
  hamburgerState,
  auth,
  avatar,
  user,
  application
});

export default rootReducer;