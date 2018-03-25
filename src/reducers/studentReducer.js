import initialState from "./initialState";
import {
  STUDENT_GET_INITIATED,
  STUDENT_GET_FAILED,
  STUDENT_GET_SUCCESS
} from "../actions/actionTypes";

const student = (state = initialState.student, action) => {
  switch (action.type) {
    case STUDENT_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        hasFailed: false,
        student: action.student
      });
    case STUDENT_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: false,
        hasFailed: true,
        student: action.student,
        error: action.error
      });
    case STUDENT_GET_SUCCESS:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        hasFailed: false,
        student: action.student
      });
    default:
      return state;
  }
}

export default student;