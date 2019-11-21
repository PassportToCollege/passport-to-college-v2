import { ActionCreator } from '..';
import { Users } from '../actionTypes';
import { UsersState } from '../../imodels/iAppState';
import User from '../../models/User';

export const gettingUsers = () =>
  ActionCreator<Users>(Users.GettingUsers);

export const gettingUsersFailed = (error: Error) =>
  ActionCreator<Users, UsersState>(Users.GettingUsersFailed, { error });

export const gotUsers = (users: User[]) =>
  ActionCreator<Users, UsersState>(Users.GotUsers, { users });

export const gettingUser = () =>
  ActionCreator<Users>(Users.GettingUser);

export const gettingUserFailed = (error: Error) =>
  ActionCreator<Users, UsersState>(Users.GettingUserFailed, { error });

export const gotUser = (user: User) =>
  ActionCreator<Users, UsersState>(Users.GotUser, { user });

export const gotFounder = (founder: User) =>
  ActionCreator<Users, UsersState>(Users.GotFounder, { founder });

export const gotStaff = (staff: User[]) =>
  ActionCreator<Users, UsersState>(Users.GotStaff, { staff });

export const creatingUser = () =>
  ActionCreator<Users>(Users.CreatingUser);

export const creatingUserFailed = (error: Error) =>
  ActionCreator<Users, UsersState>(Users.CreatingUserFailed, { error });

export const createdUser = () =>
  ActionCreator<Users>(Users.CreatedUser);

export const sendingSignUpEmail = () =>
  ActionCreator<Users>(Users.SendingSignUpEmail);

export const sendingSignUpEmailFailed = (error: Error) =>
  ActionCreator<Users, UsersState>(Users.SendingSignUpEmailFailed, { error });

export const sentSignUpEmail = () =>
  ActionCreator<Users>(Users.SentSignUpEmail);

export const updatingUser = () =>
  ActionCreator<Users>(Users.UpdatingUser);

export const updatingUserFailed = (error: Error) =>
  ActionCreator<Users, UsersState>(Users.UpdatingUserFailed, { error });

export const updatedUser = () =>
  ActionCreator<Users>(Users.UpdatedUser);