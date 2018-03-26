import initialState from "./initialState";
import {
  STUDENT_GET_INITIATED,
  STUDENT_GET_FAILED,
  STUDENT_GET_SUCCESS,
  STUDENT_UPDATE_INITIATED,
  STUDENT_UPDATE_FAILED,
  STUDENT_UPDATED
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
    case STUDENT_UPDATE_INITIATED:
      return Object.assign({}, state, {
        isUpdating: true,
        hasUpdated: false,
        hasFailed: false,
        student: action.student,
        data: action.data
      });
    case STUDENT_UPDATE_FAILED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: false,
        hasFailed: true,
        student: action.student,
        data: action.data,
        error: action.error
      });
    case STUDENT_UPDATED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: true,
        hasFailed: false,
        student: action.student,
        data: action.data
      });
    default:
      return state;
  }
}

export default student;