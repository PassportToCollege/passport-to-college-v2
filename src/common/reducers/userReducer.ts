import iAppState from '../imodels/iAppState';
import iAction from '../imodels/iAction';
import User from '../models/User';

import initialState from './initialState';
import ActionTypes from '../actions/actionTypes';

const UserActions = ActionTypes.User;

const user = (state: iAppState['User'] = initialState.User, action: iAction): iAppState['User'] => {
  switch (action.type) {
    case UserActions.GettingUser:
      return {...state, 
        isGetting: true,
        hasFailed: false,
        hasGotten: false,
        id: action.id};
    case UserActions.GettingUserFailed:
      return {...state, 
        isGetting: false,
        hasFailed: true,
        hasGotten: false,
        id: action.id,
        error: action.error};
    case UserActions.GotUser:
      return {...state, 
        isGetting: false,
        hasFailed: false,
        hasGotten: true,
        user: action.user};
    case UserActions.ReauthentcatingUserFailed:
      return {...state, 
        isUpdating: false,
        hasFailed: false,
        isReauthenticating: false,
        id: action.id,
        error: action.error};
    case UserActions.ReauthenticatedUser:
      return {...state, 
        isUpdating: true,
        hasFailed: false,
        isReauthenticating: false,
        id: action.id};
    case UserActions.ReauthenticatingUser:
      return {...state, 
        isUpdating: true,
        hasFailed: false,
        isReauthenticating: true,
        id: action.id};
    case UserActions.UpdatingUser:
      return {...state, 
        isUpdating: true,
        hasFailed: false,
        hasUpdated: false,
        isReauthenticating: false,
        id: action.id,
        data: action.data};
    case UserActions.UpdatingUserFailed:
      return {...state, 
        isUpdating: false,
        hasFailed: true,
        hasUpdated: false,
        isReauthenticating: false,
        id: action.id,
        data: action.data,
        error: action.error};
    case UserActions.UpdatedUser:
      return {...state, 
        isUpdating: false,
        hasFailed: false,
        hasUpdated: true,
        isReauthenticating: false,
        id: action.id,
        data: action.data};
    case UserActions.UpdatingUserEmail:
      return {...state, 
        isUpdating: true,
        hasFailed: false,
        isReauthenticating: false,
        id: action.id};
    case UserActions.UpdatingUserEmailFailed:
      return {...state, 
        isUpdating: true,
        hasFailed: true,
        isReauthenticating: false,
        id: action.id,
        error: action.error};
    case UserActions.UpdatedUser:
      return {...state, 
        isUpdating: true,
        hasFailed: false,
        isReauthenticating: false,
        id: action.id};
    default:
      return state;
  }
};

export default user;