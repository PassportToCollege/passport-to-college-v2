
import iAppState, { AuthState } from '../../../imodels/iAppState';
import { Dispatch } from 'react';
import { Action } from '../../../actions';
import NotificationsManager from '../../../models/NotificationsManager';
import { doResetPasswordEmailSend } from '../../../actions/auth/dispatchers';

export interface ResetPasswordProps {
  auth: AuthState;
  updateLocation: (location: string) => void;
  sendResetPasswordEmail: (email: string) => void;
}

export interface ResetPasswordState {
  email: string;
  notificationsManager: NotificationsManager;
}

export const mapStateToProps = (state: iAppState) => {
  return {
    auth: state.Auth
  };
};

export const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => {
  return {
    sendResetPasswordEmail: (email: string) => doResetPasswordEmailSend(dispatch, email)
  };
};