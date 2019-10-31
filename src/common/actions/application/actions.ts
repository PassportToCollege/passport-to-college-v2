import { ActionCreator } from '..';
import { Application as _ } from '../actionTypes';
import Application from '../../models/Application';
import { ApplicationState } from '../../imodels/iAppState';
import User from '../../models/User';

export const gettingApplication = () =>
  ActionCreator<_>(_.GettingApplication);

export const gotApplication = (application: Application) =>
  ActionCreator<_, ApplicationState>(_.GotApplication, { Application: application });

export const gettingApplicationFailed = (error: Error) =>
  ActionCreator<_, ApplicationState>(_.GettingApplicationFailed, { error });

export const updatingApplication = () =>
  ActionCreator<_>(_.UpdatingApplication);

export const updatedApplication = (application: Application) => {
  return ActionCreator<_, ApplicationState>(_.UpdatedApplication, {
    Application: application
  });
};

export const updatingApplicationFailed = (error: Error) =>
  ActionCreator<_, ApplicationState>(_.UpdatingApplicationFailed, { error });

export const deletingTest = () =>
  ActionCreator<_>(_.DeletingTest);

export const deletedTest = () =>
  ActionCreator<_>(_.DeletedTest);

export const deletingTestFailed = (error: Error) =>
  ActionCreator<_, ApplicationState>(_.DeletingTestFailed, { error });

export const submittingApplication = (application: Application) =>
  ActionCreator<_, ApplicationState>(_.SubmittingApplication, { Application: application });

export const submittedApplication = () =>
  ActionCreator<_>(_.SubmittedApplication);

export const submittingApplicationFailed = (error: Error) =>
  ActionCreator<_, ApplicationState>(_.SubmittingApplicationFailed, { error });

export const sendingSubmissionEmail = (user: User) =>
  ActionCreator<_, ApplicationState>(_.SendingSubmissionEmail, { User: user });

export const sentSubmissionEmail = () =>
  ActionCreator<_>(_.SentSubmissionEmail);

export const sendingSubmissionEmailFailed = (error: Error) =>
  ActionCreator<_, ApplicationState>(_.SendingSubmissionEmailFailed, { error });