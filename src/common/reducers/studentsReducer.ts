import iAppState from "../imodels/iAppState";
import iAction from "../imodels/iAction";

import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";

const StudentsActions = ActionTypes.Students;

const students = (state : iAppState["Students"] = initialState.Students, action : iAction) : iAppState["Students"] => {
  switch (action.type) {
    case StudentsActions.GettingStudents:
      return Object.assign({}, state, {
        isGetting: true,
        failedToGetStudents: false,
        hasGotten: false
      });
    case StudentsActions.GotStudents:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        failedToGetStudents: false,
        students: action.students
      });
    case StudentsActions.GettingStudentsFailed:
      return Object.assign({}, state, {
        isGetting: false, 
        hasGotten: false,
        failedToGetStudents: true,
        error: action.error
      });
    case StudentsActions.GettingCurrentStudents:
      return Object.assign({}, state, {
        gettingCurrentStudents: true,
        gotCurrentStudents: false,
        failedToGetCurrentStudents: false
      });
    case StudentsActions.GettingCurrentStudentsFailed:
      return Object.assign({}, state, {
        gettingCurrentStudents: false,
        gotCurrentStudents: false,
        failedToGetCurrentStudents: true,
        error: action.error
      });
    case StudentsActions.GotCurrentStudents:
      return Object.assign({}, state, {
        gettingCurrentStudents: false,
        gotCurrentStudents: true,
        failedToGetCurrentStudents: false,
        current: action.current
      });
    case StudentsActions.GettingPastStudents:
      return Object.assign({}, state, {
        gettingPastStudents: true,
        gotPastStudents: false,
        failedToGetPastStudents: false
      });
    case StudentsActions.GettingPastStudentsFailed:
      return Object.assign({}, state, {
        gettingPastStudents: false,
        gotPastStudents: false,
        failedToGetPastStudents: true,
        error: action.error
      });
    case StudentsActions.GotPastStudents:
      return Object.assign({}, state, {
        gettingPastStudents: false,
        gotPastStudents: true,
        failedToGetPastStudents: false,
        past: action.past
      });
    default:
      return state;
  }
}

export default students;