import iAppState, { UserState } from '../../../imodels/iAppState';
import { Dispatch } from 'react';
import { Action } from '../../../actions';
import { match } from 'react-router-dom';
import iUser from '../../../imodels/iUser';
import NotificationsManager from '../../../models/NotificationsManager';
import { doUpdateUser } from '../../../actions/user/dispatchers';

export interface ConfirmEmailProps {
  match: match<{ uid: string }>;
  user: UserState;
  updateLocation: (location: string) => void;
  updateUser: (user: Partial<iUser>) => void;
}

export interface ConfirmEmailState {
  emailConfirmed: boolean;
  notificationsManager: NotificationsManager;
}

export const mapStateToProps = (state: iAppState) => {
  return {
    user: state.User
  };
};

export const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => {
  return {
    updateUser: (user: Partial<iUser>) => doUpdateUser(dispatch, user, true /* refresh */)
  };
};