import iAppState from "../imodels/iAppState";
import ActionTypes from "../actions/actionTypes";

const initialState : iAppState =  {
  Hamburger: { current: ActionTypes.Hamburger.Close },
  Menu: { dash: "full" },
  Auth: { activeUser: false },
  user: {},
  users: {},
  userProfilePicture: { url: "" },
  Application: {},
  Applications: { page: 1 },
  stats: {},
  student: {},
  students: {},
  Feature: {},
  features: {},
  post: {},
  Posts: {},
  PostCategory: {},
  Comments: {},
};

export default initialState;