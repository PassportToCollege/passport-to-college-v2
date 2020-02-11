import iAppState, { AuthState } from '../../../imodels/iAppState';
import { Dispatch } from 'react';
import { Action } from '../../../actions';
import { RouteComponentProps } from 'react-router-dom';
import { 
  doSignIn, 
  doSignInWithSocial, 
  ValidProvider 
} from '../../../actions/auth/dispatchers';
import NotificationsManager from '../../../models/NotificationsManager';

export interface SignInProps extends RouteComponentProps {
  auth: AuthState;
  signIn: (email: string, password: string) => void;
  signInWithSocial: (provider: ValidProvider) => void;
  updateLocation: (location: string) => void;
}

export interface SignInState {
  email: string;
  password: string;
  notificationsManager: NotificationsManager;
}

export const mapStateToProps = (state: iAppState) => {
  return {
    auth: state.Auth
  };
};

export const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => {
  return {
    signIn: (email: string, password: string) => doSignIn(dispatch, email, password),
    signInWithSocial: (provider: ValidProvider) => doSignInWithSocial(dispatch, provider)
  };
};