import { ActionCreator } from '../';
import { Auth } from '../actionTypes';
import { AuthState } from '../../imodels/iAppState';
import User from '../../models/User';

export const signInAuthorizing  = () =>
  ActionCreator<Auth>(Auth.SignInAuthorizing);

export const gettingUser = () =>
  ActionCreator<Auth>(Auth.GettingUser);

export const signedIn = (activeUser: User) =>
  ActionCreator<Auth, AuthState>(Auth.SignedIn, { activeUser });

export const signInFailed = (error: Error) =>
  ActionCreator<Auth, AuthState>(Auth.SignInFailed, { error });

export const signInAuthorizingSocial = () =>
  ActionCreator<Auth>(Auth.SignInAuthorizing_Social);

export const signInFailedSocial = (error: Error) =>
  ActionCreator<Auth, AuthState>(Auth.SignInFailed_Social, { error });

export const signedInSocial = (activeUser: User) =>
  ActionCreator<Auth, AuthState>(Auth.SignedIn_Social, { activeUser });

export const signOutAuthorizing = () =>
  ActionCreator<Auth>(Auth.SignInFailed_Social);

export const signOutFailed = (error: Error) =>
  ActionCreator<Auth, AuthState>(Auth.SignOutFailed, { error });

export const signedOut = () =>
  ActionCreator<Auth, AuthState>(Auth.SignedOut, { activeUser: false });

export const creatingAccount = () =>
  ActionCreator<Auth>(Auth.CreatingAccount);

export const creatingAccountFailed = (error: Error) =>
  ActionCreator<Auth, AuthState>(Auth.CreatingAccountFailed, { error });

export const createdAccount = () =>
  ActionCreator<Auth>(Auth.CreatedAccount);

export const addingToDb = () =>
  ActionCreator<Auth>(Auth.AddingToDb);

export const addingToDbFailed = (error: Error) => 
  ActionCreator<Auth, AuthState>(Auth.AddingToDbFailed, { error });

export const addedToDb = () =>
  ActionCreator<Auth>(Auth.AddedToDb);

export const accountCreatedEmailSending = () =>
  ActionCreator<Auth>(Auth.AccountCreatedEmailSending);

export const accountCreatedEmailSent = () =>
  ActionCreator<Auth>(Auth.AccountCreatedEmailSent);

export const accountCreatedEmailFailed = (error: Error) =>
  ActionCreator<Auth, AuthState>(Auth.AccountCreatedEmailFailed, { error });

export const creatingAccountSocial = () =>
  ActionCreator<Auth>(Auth.CreatingAccount_Social);

export const creatingAccountFailedSocial = (error: Error) =>
  ActionCreator<Auth, AuthState>(Auth.CreatingAccountFailed_Social, { error });

export const createdAccountSocial = () =>
  ActionCreator<Auth>(Auth.CreatedAccount_Social);

export const removeErrors = () =>
  ActionCreator<Auth>(Auth.RemoveErrors);

export const resetPasswordEmailSending = () =>
  ActionCreator<Auth>(Auth.ResetPasswordEmailSending);

export const resetPasswordEmailSent = () =>
  ActionCreator<Auth>(Auth.ResetPasswordEmailSent);

export const resetPasswordEmailFailed = (error: Error) =>
  ActionCreator<Auth, AuthState>(Auth.ResetPasswordEmailFailed, { error });

export const linkingSocialAccount = () =>
  ActionCreator<Auth>(Auth.LinkingSocialAccount);

export const linkingSocialAccountFailed = (error: Error) =>
  ActionCreator<Auth, AuthState>(Auth.LinkingSocialAccountFailed, { error });

export const linkedSocialAccount = () =>
  ActionCreator<Auth>(Auth.LinkedSocialAccount);

export const unlinkingSocialAccount = () =>
  ActionCreator<Auth>(Auth.UnlinkingSocialAccount);

export const unlinkedSocialAccount = () => 
  ActionCreator<Auth>(Auth.UnlinkedSocialAccount);

export const unlinkingSocialAccountFailed = (error: Error) =>
  ActionCreator<Auth, AuthState>(Auth.UnlinkingSocialAccountFailed, { error });

export const addingPasswordProvider = () =>
  ActionCreator<Auth>(Auth.AddingPasswordProvider);

export const addedPasswordProvider = () =>
  ActionCreator<Auth>(Auth.AddedPasswordProvider);

export const addingPasswordProviderFailed = (error: Error) =>
  ActionCreator<Auth, AuthState>(Auth.AddingPasswordProviderFailed, { error });

export const changingEmailAddress = () =>
  ActionCreator<Auth>(Auth.ChangedEmailAddress);

export const changedEmailAddress = () =>
    ActionCreator<Auth>(Auth.ChangedEmailAddress);

export const changingEmailAddressFailed = (error: Error) =>
  ActionCreator<Auth, AuthState>(Auth.ChangingEmailAddressFailed, { error });