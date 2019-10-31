import { ActionCreator } from '..';
import { Application as _ } from '../actionTypes';
import Application from '../../models/Application';
import { ApplicationsState } from '../../imodels/iAppState';

export const gettingApplications = () =>
  ActionCreator<_>(_.GettingApplications);

export const gotApplications = (page: number, applications: Application[]) => {
  return ActionCreator<_, ApplicationsState>(_.GotApplications, {
    Applications: applications,
    page
  });
};

export const gettingApplicationsFailed = (error: Error) =>
  ActionCreator<_, ApplicationsState>(_.GettingApplicationsFailed, { error });