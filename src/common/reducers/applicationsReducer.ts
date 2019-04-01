import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";
import iAppState from "../imodels/iAppState";
import iAction from "../imodels/iAction";

const ApplicationActions = ActionTypes.Application;

const applications = (state : iAppState["Applications"] = initialState.Applications, action : iAction) : iAppState["Applications"] => {
  switch (action.type) {
    case ApplicationActions.GettingApplications:
      return Object.assign({}, state, {
        isGetting: true,
        hasFailed: false,
        hasGotten: false,
        page: action.page
      });
    case ApplicationActions.GotApplications:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: false,
        hasGotten: true,
        page: action.page,
        applications: action.applications
      });
    case ApplicationActions.GettingApplicationsFailed:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: false,
        hasGotten: false,
        page: action.page,
        error: action.error
      });
    default:
      return state;
  }
}

export default applications;