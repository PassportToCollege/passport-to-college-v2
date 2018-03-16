import { combineReducers } from "redux";

import hamburgerState from "./hamburgerReducer";
import auth from "./authReducer";
import userProfilePicture from "./userProfilePictureReducer";
import user from "./userReducer";
import users from "./usersReducer";
import application from "./applicationReducer";
import applications from "./applicationsReducer";
import stats from "./statsReducer";

const rootReducer = combineReducers({
  hamburgerState,
  auth,
  userProfilePicture,
  user,
  application,
  applications,
  stats,
  users
});

export default rootReducer;