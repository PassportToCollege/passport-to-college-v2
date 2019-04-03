import iAppState from "../imodels/iAppState";
import iAction from "../imodels/iAction";

import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";

const StudentActions = ActionTypes.Student;

const student = (state : iAppState["Student"] = initialState.Student, action : iAction) : iAppState["Student"] => {
  switch (action.type) {
    case StudentActions.GettingStudent:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        hasFailed: false,
        id: action.id
      });
    case StudentActions.GettingStudentFailed:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: false,
        hasFailed: true,
        id: action.id,
        error: action.error
      });
    case StudentActions.GotStudent:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        hasFailed: false,
        student: action.student
      });
    case StudentActions.UpdatingStudent:
      return Object.assign({}, state, {
        isUpdating: true,
        hasUpdated: false,
        hasFailed: false,
        id: action.id,
        data: action.data
      });
    case StudentActions.UpdatingStudentFailed:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: false,
        hasFailed: true,
        id: action.id,
        data: action.data,
        error: action.error
      });
    case StudentActions.UpdatedStudent:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: true,
        hasFailed: false,
        id: action.id,
        data: action.data
      });
    case StudentActions.DeletedStudentAccomplishment:
      return Object.assign({}, state, {
        isDeleting: true,
        hasDeleted: false,
        failedToDeleteAccomplishment: false,
        slug: action.slug
      });
    case StudentActions.DeletedStudentAccomplishment:
      return Object.assign({}, state, {
        isDeleting: false,
        hasDeleted: true,
        failedToDeleteAccomplishment: false,
        slug: action.slug
      });
    case StudentActions.DeletingStudentAccomplishmentFailed:
      return Object.assign({}, state, {
        isDeleting: false,
        hasDeleted: false,
        failedToDeleteAccomplishment: true,
        slug: action.slug,
        error: action.error
      });
    case StudentActions.CreatingStudent:
      return Object.assign({}, state, {
        creatingStudent: true,
        createdStudent: false,
        failedToCreateStudent: false
      });
    case StudentActions.CreatingStudentFailed:
      return Object.assign({}, state, {
        creatingStudent: false,
        createdStudent: false,
        failedToCreateStudent: true,
        error: action.error,
        data: action.data
      });
    case StudentActions.CreatedStudent:
      return Object.assign({}, state, {
        creatingStudent: false,
        createdStudent: true,
        failedToCreateStudent: false,
        newStudent: action.student
      });
    default:
      return state;
  }
}

export default student;