import { ActionCreator } from '..';
import { User as _ } from '../actionTypes';
import { UserState } from '../../imodels/iAppState';
import User from '../../models/User';

export const gettingUser = () =>
  ActionCreator<_>(_.GettingUser);

export const gettingUserFailed = (error: Error) =>
  ActionCreator<_, UserState>(_.GettingUserFailed, { error });

export const gotUser = (user: User) =>
  ActionCreator<_, UserState>(_.GotUser, { user });

export const updatingUser = () =>
  ActionCreator<_>(_.UpdatingUser);

export const updatingUserFailed = (error: Error) =>
  ActionCreator<_, UserState>(_.UpdatingUserFailed, { error });

export const updatedUser = () =>
  ActionCreator<_>(_.UpdatedUser);

export const updatingUserEmail = () =>
  ActionCreator<_>(_.UpdatingUserEmail);

export const updatingUserEmailFailed = (error: Error) =>
  ActionCreator<_, UserState>(_.UpdatingUserEmailFailed, { error });

export const updatedUserEmail = () =>
  ActionCreator<_>(_.UpdatedUserEmail);

export const reauthenticatingUser = () =>
  ActionCreator<_>(_.ReauthenticatingUser);

export const reauthenticatingUserFailed = (error: Error) =>
  ActionCreator<_, UserState>(_.ReauthentcatingUserFailed, { error });

export const reauthenticatedUser = () =>
  ActionCreator<_>(_.ReauthenticatedUser);