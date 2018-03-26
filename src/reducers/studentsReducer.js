import initialState from "./initialState";
import {
  STUDENTS_GET_FAILED,
  STUDENTS_GET_INITIATED,
  STUDENTS_GET_SUCCESS
} from "../actions/actionTypes";

const students = (state = initialState.students, action) {
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
    default:
      return state;
  }
}

export default students;