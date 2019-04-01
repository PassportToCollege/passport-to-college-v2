import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";
import iAppState from "../imodels/iAppState";

const ApplicationActions = ActionTypes.Application;

const application = (state: iAppState["Application"] = initialState.Application, action: any): iAppState["Application"] => {
  switch (action.type) {
    case ApplicationActions.GettingApplication:
      return Object.assign({}, state, {
        isGetting: true,
        failedToGetApplication: false,
        hasGotten: false,
        user: action.user
      });
    case ApplicationActions.GettingApplicationFailed:
      return Object.assign({}, state, {
        isGetting: false,
        failedToGetApplication: true,
        hasGotten: false,
        error: action.error,
        user: action.user
      });
    case ApplicationActions.GotApplication:
      return Object.assign({}, state, {
        isGetting: false,
        failedToGetApplication: false,
        hasGotten: true,
        application: action.application
      });
    case ApplicationActions.UpdatingApplication:
      return Object.assign({}, state, {
        isUpdating: true,
        hasUpdated: false,
        failedToUpdateApplication: false,
        user: action.user,
        data: action.data
      });
    case ApplicationActions.UpdatedApplication:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: true,
        failedToUpdateApplication: false,
        user: action.user,
        data: action.data
      });
    case ApplicationActions.UpdatingApplicationFailed:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: false,
        failedToUpdateApplication: true,
        user: action.user,
        data: action.data,
        error: action.error
      });
    case ApplicationActions.DeletingTest:
      return Object.assign({}, state, {
        deletingTest: true,
        deletedTest: false,
        failedToDeleteTest: false,
        user: action.user,
        test: action.test
      });
    case ApplicationActions.DeletingTestFailed:
      return Object.assign({}, state, {
        deletingTest: false,
        deletedTest: false,
        failedToDeleteTest: true,
        user: action.user,
        test: action.test,
        error: action.error
      });
    case ApplicationActions.DeletingTestFailed:
      return Object.assign({}, state, {
        deletingTest: false,
        deletedTest: true,
        failedToDeleteTest: false,
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
        sendingSubmissionEmail: true,
        hasSent: false,
        emailHasFailed: false,
        user: action.user
      });
    case ApplicationActions.SentSubmissionEmail:
      return Object.assign({}, state, {
        sendingSubmissionEmail: false,
        sentSubmissionEmail: true,
        sendingSubmissionEmailFailed: false,
        user: action.user
      });
    case ApplicationActions.SendingSubmissionEmailFailed:
      return Object.assign({}, state, {
        sendingSubmissionEmail: false,
        sentSubmissionEmail: false,
        sendingSubmissionEmailFailed: true,
        user: action.user,
        error: action.error
      });
    default:
      return state;
  }
};

export default application;