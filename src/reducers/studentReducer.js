import initialState from "./initialState";
import {
  STUDENT_GET_INITIATED,
  STUDENT_GET_FAILED,
  STUDENT_GET_SUCCESS,
  STUDENT_UPDATE_INITIATED,
  STUDENT_UPDATE_FAILED,
  STUDENT_UPDATED,
  STUDENT_ACCOMPLISHMENT_DELETE_INITIATED,
  STUDENT_ACCOMPLISHMENT_DELETED,
  STUDENT_ACCOMPLISHMENT_DELETE_FAILED
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
        uid: action.student,
        data: action.data
      });
    case STUDENT_UPDATE_FAILED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: false,
        hasFailed: true,
        uid: action.student,
        data: action.data,
        error: action.error
      });
    case STUDENT_UPDATED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: true,
        hasFailed: false,
        uid: action.student,
        data: action.data
      });
    case STUDENT_ACCOMPLISHMENT_DELETE_INITIATED:
      return Object.assign({}, state, {
        isDeleting: true,
        hasDeleted: false,
        hasFailed: false,
        slug: action.slug
      });
    case STUDENT_ACCOMPLISHMENT_DELETED:
      return Object.assign({}, state, {
        isDeleting: false,
        hasDeleted: true,
        hasFailed: false,
        slug: action.slug
      });
    case STUDENT_ACCOMPLISHMENT_DELETE_FAILED:
      return Object.assign({}, state, {
        isDeleting: false,
        hasDeleted: false,
        hasFailed: true,
        slug: action.slug,
        error: action.error
      });
    default:
      return state;
  }
}

export default student;