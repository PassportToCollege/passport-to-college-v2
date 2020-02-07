import iAppState, { AuthState, ApplicationState, UserState } from '../../../imodels/iAppState';
import { Dispatch } from 'react';
import { Action } from '../../../actions';
import { RouteComponentProps, match } from 'react-router-dom';
import {
  doSignOut,
  doSendEmailConfirmation
} from '../../../actions/auth/dispatchers';
import { doGetUser } from '../../../actions/user/dispatchers';
import { doApplicationGet } from '../../../actions/application/dispatchers';
import User from '../../../models/User';
import NotificationsManager from '../../../models/NotificationsManager';

export enum ApplicationTasks {
  Welcome = 'Welcome',
  Personal = 'Personal',
  Education = 'Education',
  USStandardizedTests = 'US Standardized Tests',
  NationalTests = 'National Tests',
  Miscellaneous = 'Miscellaneous',
  Essay = 'Essay',
  Review = 'Review',
  Submit = 'Submit'
}

export class ApplicationTaskTracker {
  private completedTasks: ApplicationTasks[];

  constructor() {
    this.completedTasks = [];
  }

  public addTask(task: ApplicationTasks): boolean {
    if (this.isTaskComplete(task)) {
      return false;
    }

    this.completedTasks.push(task);
    return true;
  }

  public removeTask(task: ApplicationTasks): boolean {
    if (this.isTaskComplete(task)) {
      if (this.completedTasks.length === 1) {
        this.completedTasks = [];
        return true;
      }

      const position = this.completedTasks.indexOf(task);
      this.completedTasks = [
        ...this.completedTasks.slice(0, position),
        ...this.completedTasks.slice(position + 1)
      ];

      return true;
    }

    return false;
  }

  public isTaskComplete(task: ApplicationTasks): boolean {
    if (this.completedTasks.length) {
      return this.completedTasks.includes(task);
    }

    return false;
  }
}

export interface ApplyPortalProps extends RouteComponentProps {
  auth: AuthState;
  applicationState: ApplicationState;
  userState: UserState;
  match: match<{ applicationId: string }>;
  updateLocation: (location: string) => void;
  signOut: () => void;
  sendConfirmationEmail: (id: string) => void;
  getCurrentUser: () => void;
  getCurrentApplication: (user: User) => void;
}

export interface ApplyPortalState {
  applicationId: string;
  activeTask: ApplicationTasks;
  tasksTracker: ApplicationTaskTracker;
  notificationsManager: NotificationsManager;
}

export const mapStateToProps = (state: iAppState) => {
  return {
    auth: state.Auth,
    applicationState: state.Application,
    userState: state.User
  };
};

export const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => {
  return {
    signOut: () => doSignOut(dispatch),
    sendConfirmationEmail: (id: string) => doSendEmailConfirmation(dispatch, id),
    getCurrentUser: () => doGetUser(dispatch),
    getCurrentApplication: (user: User) => doApplicationGet(dispatch, user),
  };
};