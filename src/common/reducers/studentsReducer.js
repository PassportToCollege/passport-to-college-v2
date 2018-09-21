import initialState from "./initialState";
import {
  STUDENTS_GET_FAILED,
  STUDENTS_GET_INITIATED,
  STUDENTS_GET_SUCCESS,
  STUDENTS_GET_CURRENT_INITIATED,
  STUDENTS_GET_CURRENT_FAILED,
  STUDENTS_GET_CURRENT_SUCCESS,
  STUDENTS_GET_PAST_INITIATED,
  STUDENTS_GET_PAST_FAILED,
  STUDENTS_GET_PAST_SUCCESS
} from "../actions/actionTypes";

const students = (state = initialState.students, action) => {
  switch (action.type) {
    case STUDENTS_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasFailed: false,
        hasGotten: false
      });
    case STUDENTS_GET_SUCCESS:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        hasFailed: false,
        students: action.students
      });
    case STUDENTS_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false, 
        hasGotten: false,
        hasFailed: true,
        error: action.error
      });
    case STUDENTS_GET_CURRENT_INITIATED:
      return Object.assign({}, state, {
        gettingCurrentStudents: true,
        gotCurrentStudents: false,
        failedToGetCurrentStudents: false
      });
    case STUDENTS_GET_CURRENT_FAILED:
      return Object.assign({}, state, {
        gettingCurrentStudents: false,
        gotCurrentStudents: false,
        failedToGetCurrentStudents: true,
        error: action.error
      });
    case STUDENTS_GET_CURRENT_SUCCESS:
      return Object.assign({}, state, {
        gettingCurrentStudents: false,
        gotCurrentStudents: true,
        failedToGetCurrentStudents: false,
        students: action.students
      });
    case STUDENTS_GET_PAST_INITIATED:
      return Object.assign({}, state, {
        gettingPastStudents: true,
        gotPastStudents: false,
        failedToGetPastStudents: false
      });
    case STUDENTS_GET_PAST_FAILED:
      return Object.assign({}, state, {
        gettingPastStudents: false,
        gotPastStudents: false,
        failedToGetPastStudents: true,
        error: action.error
      });
    case STUDENTS_GET_PAST_SUCCESS:
      return Object.assign({}, state, {
        gettingPastStudents: false,
        gotPastStudents: true,
        failedToGetPastStudents: false,
        pastStudents: action.students
      });
    default:
      return state;
  }
}

export default students;