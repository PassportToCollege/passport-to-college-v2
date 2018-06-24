import { combineReducers } from "redux";

import hamburgerState from "./hamburgerReducer";
import auth from "./authReducer";
import userProfilePicture from "./userProfilePictureReducer";
import user from "./userReducer";
import users from "./usersReducer";
import application from "./applicationReducer";
import applications from "./applicationsReducer";
import stats from "./statsReducer";
import student from "./studentReducer";
import students from "./studentsReducer";
import feature from "./featureReducer";
import features from "./featuresReducer";
import post from "./postReducer";
import posts from "./postsReducer";
import postCategories from "./postCategoriesReducer";
import comments from "./commentReducer";

const rootReducer = combineReducers({
  hamburgerState,
  auth,
  userProfilePicture,
  user,
  application,
  applications,
  stats,
  users,
  student,
  students,
  feature,
  features,
  post,
  posts,
  postCategories,
  comments
});

export default rootReducer;