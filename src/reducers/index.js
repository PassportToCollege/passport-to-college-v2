import { combineReducers } from "redux";

import hamburgerState from "./hamburgerReducer";
import auth from "./authReducer";
import avatar from "./avatarReducer";
import user from "./userReducer";
import users from "./usersReducer";
import application from "./applicationReducer";
import applications from "./applicationsReducer";
import stats from "./statsReducer";

const rootReducer = combineReducers({
  hamburgerState,
  auth,
  avatar,
  user,
  application,
  applications,
  stats,
  users
});

export default rootReducer;