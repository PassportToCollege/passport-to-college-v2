import iAppState, { AuthState } from '../../imodels/iAppState';
import { Dispatch } from 'react';
import { Action } from '../../actions';
import { History, LocationState } from 'history';
import User from '../../models/User';
import NotificationsManager from '../../models/NotificationsManager';
import { 
  doAccountCreate,
  doSignUpWithSocial, 
  ValidProvider,
  doSignInWithSocial,
  doSignIn,
} from '../../actions/auth/dispatchers';
import { RouteComponentProps } from 'react-router-dom';

export interface ApplyProps extends RouteComponentProps {
  auth: AuthState;
  history: History<LocationState>;
  updateLocation: (location: string) => void;
  createAccount: (email: string, password: string, user: User) => void;
  signIn: (email: string, password: string) => void;
  signUpWithSocial: (provider: ValidProvider) => void;
  signInWithSocial: (provider: ValidProvider) => void;
}

export interface ApplyState {
  email: string;
  password: string;
  name: string;
  notificationsManager: NotificationsManager;
}

export const mapStateToProps = (state: iAppState) => {
  return {
    auth: state.Auth
  };
};

export const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => {
  return {
    createAccount: (
      email: string, 
      password: string, 
      user: User
    ) => doAccountCreate(dispatch, email, password, user),
    signIn: (email: string, password: string) => doSignIn(dispatch, email, password),
    signUpWithSocial: (provider: ValidProvider) => doSignUpWithSocial(dispatch, provider),
    signInWithSocial: (provider: ValidProvider) => doSignInWithSocial(dispatch, provider, { strict: 'isApplicant'})
  };
};