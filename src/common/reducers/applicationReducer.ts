import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";

const ApplicationActions = ActionTypes.Application;

const application = (state = initialState.application, action : any) : any => {
  switch (action.type) {
    case ApplicationActions.GettingApplication:
      return Object.assign({}, state, {
        isGetting: true,
        hasFailed: false,
        hasGotten: false,
        user: action.user
      });
    case ApplicationActions.GettingApplicationFailed:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: true,
        hasGotten: false,
        error: action.error,
        user: action.user
      });
    case ApplicationActions.GotApplication:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: false,
        hasGotten: true,
        application: action.application
      });
    case ApplicationActions.UpdatingApplication:
      return Object.assign({}, state, {
        isUpdating: true,
        hasUpdated: false,
        hasFailed: false,
        user: action.user,
        data: action.data
      });
    case ApplicationActions.UpdatedApplication:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: true,
        hasFailed: false,
        user: action.user,
        data: action.data
      });
    case ApplicationActions.UpdatingApplicationFailed:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: false,
        hasFailed: true,
        user: action.user,
        data: action.data,
        error: action.error
      });
    case ApplicationActions.DeletingTest:
      return Object.assign({}, state, {
        isDeleting: true,
        hasDeleted: false,
        hasFailed: false,
        user: action.user,
        test: action.test
      });
    case ApplicationActions.DeletingTestFailed:
      return Object.assign({}, state, {
        isDeleting: false,
        hasDeleted: false,
        hasFailed: true,
        user: action.user,
        test: action.test,
        error: action.error
      });
    case ApplicationActions.DeletingTestFailed:
      return Object.assign({}, state, {
        isDeleting: false,
        hasDeleted: true,
        hasFailed: false,
        user: action.user,
        test: action.test
      });
    case ApplicationActions.SubmittingApplication:
      return Object.assign({}, state, {
        isSubmitting: true,
        hasSubmitted: false,
        hasFailed: false,
        user: action.user,
        date: action.date
      });
    case ApplicationActions.SubmittingApplicationFailed:
      return Object.assign({}, state, {
        isSubmitting: false,
        hasSubmitted: false,
        hasFailed: true,
        user: action.user,
        date: action.date,
        error: action.error
      });
    case ApplicationActions.SubmittedApplication:
      return Object.assign({}, state, {
        isSubmitting: false,
        hasSubmitted: true,
        hasFailed: false,
        user: action.user,
        date: action.date
      });
    case ApplicationActions.SendingSubmissionEmail:
      return Object.assign({}, state, {
        isSending: true,
        hasSent: false,
        emailHasFailed: false,
        user: action.user
      });
    case ApplicationActions.SentSubmissionEmail:
      return Object.assign({}, state, {
        isSending: false,
        hasSent: true,
        emailHasFailed: false,
        user: action.user
      });
    case ApplicationActions.SendingSubmissionEmailFailed:
      return Object.assign({}, state, {
        isSending: false,
        hasSent: false,
        emailHasFailed: true,
        user: action.user,
        error: action.error
      });
    default:
      return state;
  }
};

export default application;