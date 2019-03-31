import iAppState from "../imodels/iAppState";
import ActionTypes from "../actions/actionTypes";

const initialState : iAppState =  {
  Hamburger: { current: ActionTypes.Hamburger.Close },
  Menu: { dash: "full" },
  Auth: { activeUser: false },
  user: {},
  users: {},
  userProfilePicture: { url: "" },
  application: {},
  applications: {},
  stats: {},
  student: {},
  students: {},
  feature: {},
  features: {},
  post: {},
  posts: {},
  postCategories: {},
  comments: {},
};

export default initialState;