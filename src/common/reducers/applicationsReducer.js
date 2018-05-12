import initialState from "./initialState";
import {
  APPLICATIONS_GET_INITIATED, 
  APPLICATIONS_GET_SUCCESS,
  APPLICATION_SUBMIT_FAILED
} from "../actions/actionTypes";

const applications = (state = initialState.applications, action) => {
  switch (action.type) {
    case APPLICATIONS_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasFailed: false,
        hasGotten: false,
        page: action.page
      });
    case APPLICATIONS_GET_SUCCESS:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: false,
        hasGotten: true,
        page: action.page,
        applications: action.applications
      });
    case APPLICATION_SUBMIT_FAILED:
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