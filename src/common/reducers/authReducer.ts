import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";
import iAppState from "../imodels/iAppState";
import iAction from "../imodels/iAction";

const { Auth } = ActionTypes;

const auth = (state : iAppState["Auth"] = initialState.Auth, action : iAction) : iAppState["Auth"] => {
  switch(action.type) {
    case Auth.RemoveErrors :
      return Object.assign({}, state, {
        isAuthorizing: false,
        failedToAuthorize: false,
        isCreating: false,
        isAddingToDbs: false,
        failedToSignInWithSocial: false,
        failedToSignUpWithSocial: false,
        error: null
      });
    case Auth.SignInAuthorizing:
    case Auth.SignOutAuthorizing:
      return Object.assign({}, state, {
        isAuthorizing: true,
        hasAuthorized: false,
        failedToAuthorize: false,
        activeUser: action.user
      });
    case Auth.GettingUser:
      return Object.assign({}, state, {
        isAuthorizing: false,
        hasAuthorized: false,
        failedToAuthorize: false,
        activeUser: null
      });
    case Auth.SignedIn:
      return Object.assign({}, state, {
        isAuthorizing: false,
        hasAuthorized: true,
        failedToAuthorize: false,
        activeUser: action.user
      });
    case Auth.SignInFailed:
    case Auth.SignOutFailed:
      return Object.assign({}, state, {
        hasFailed: true,
        isAuthorizing: false,
        failedToAuthorize: false,
        activeUser: false,
        error: action.error
      });
    case Auth.SignedOut:
      return Object.assign({}, state, {
        isAuthorizing: false,
        hasAuthorized: false,
        hasSignedInWithSocial: false,
        hasSignedOut: true,
        failedToAuthorize: false,
        activeUser: false
      });
    case Auth.SignInAuthorizing_Social:
      return Object.assign({}, state, {
        signingInWithSocial: true,
        hasSignedInWithSocial: false,
        failedToSignInWithSocial: false,
        provider: action.provider
      });
    case Auth.SignInFailed_Social:
      return Object.assign({}, state, {
        signingInWithSocial: false,
        hasSignedInWithSocial: false,
        failedToSignInWithSocial: true,
        provider: action.provider,
        error: action.error
      });
    case Auth.SignedIn_Social:
      return Object.assign({}, state, {
        signingInWithSocial: false,
        hasSignedInWithSocial: true,
        failedToSignInWithSocial: false,
        provider: action.provider,
        activeUser: action.user
      });
    case Auth.CreatingAccount_Social:
      return Object.assign({}, state, {
        signingUpWithSocial: true,
        hasSignedUpWithSocial: false,
        failedToSignUpWithSocial: false,
        provider: action.provider
      });
    case Auth.CreatingAccountFailed_Social:
      return Object.assign({}, state, {
        signingUpWithSocial: false,
        hasSignedUpWithSocial: false,
        failedToSignUpWithSocial: true,
        provider: action.provider,
        error: action.error
      });
    case Auth.CreatedAccount_Social:
      return Object.assign({}, state, {
        signingUpWithSocial: false,
        hasSignedUpWithSocial: true,
        failedToSignUpWithSocial: false,
        provider: action.provider
      });
    case Auth.CreatingAccount:
      return Object.assign({}, state, {
        isCreating: true,
        hasCreated: false,
        hasFailed: false,
        data: action.data
      });
    case Auth.CreatingAccountFailed:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: false,
        hasFailed: true,
        data: action.data,
        error: action.error
      });
    case Auth.CreatedAccount:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: true,
        hasFailed: false,
        data: action.data
      });
    case Auth.AddingToDb:
      return Object.assign({}, state, {
        isCreating: true,
        hasAdded: false,
        hasFailed: false,
        isAddingToDbs: true
      });
    case Auth.AddedToDb:
      return Object.assign({}, state, {
        isCreating: false,
        hasAdded: true,
        hasFailed: false,
        isAddingToDbs: false
      });
    case Auth.AddingToDbFailed:
      return Object.assign({}, state, {
        isCreating: false,
        hasFailed: true,
        isAddingToDbs: false,
        error: action.error
      });
    case Auth.ResetPasswordEmailSending:
    case Auth.AccountCreatedEmailSending:
      return Object.assign({}, state, {
        isSending: true,
        hasSent: false,
        failedToSendEmail: false,
        email: action.email
      });
    case Auth.ResetPasswordEmailSent:
    case Auth.AccountCreatedEmailSent:
      return Object.assign({}, state, {
        isSending: false,
        hasSent: true,
        failedToSendEmail: false,
        email: action.email
      });
    case Auth.ResetPasswordEmailFailed:
    case Auth.AccountCreatedEmailFailed:
      return Object.assign({}, state, {
        isSending: false,
        hasSent: false,
        failedToSendEmail: true,
        email: action.email,
        error: action.error
      });
    case Auth.LinkingSocialAccount:
      return Object.assign({}, state, {
        linkingSocialAccount: true,
        linkedSocialAccount: false,
        failedToLinkSocialAccount: false,
        provider: action.provider
      });
    case Auth.LinkingSocialAccountFailed:
      return Object.assign({}, state, {
        linkingSocialAccount: false,
        linkedSocialAccount: false,
        failedToLinkSocialAccount: true,
        provider: action.provider,
        error: action.error
      });
    case Auth.LinkedSocialAccount:
      return Object.assign({}, state, {
        linkingSocialAccount: false,
        linkedSocialAccount: true,
        failedToLinkSocialAccount: false,
        provider: action.provider,
        credentials: action.credentials
      });
    case Auth.UnlinkingSocialAccount:
      return Object.assign({}, state, {
        unlinkingSocialAccount: true,
        unlinkedSocialAccount: false,
        failedToUnlinkSocialAccount: false,
        provider: action.provider
      });
    case Auth.UnlinkingSocialAccountFailed:
      return Object.assign({}, state, {
        unlinkingSocialAccount: false,
        unlinkedSocialAccount: false,
        failedToUnlinkSocialAccount: true,
        provider: action.provider,
        error: action.error
      });
    case Auth.UnlinkedSocialAccount:
      return Object.assign({}, state, {
        unlinkingSocialAccount: false,
        unlinkedSocialAccount: true,
        failedToUnlinkSocialAccount: false,
        provider: action.provider
      });
    case Auth.AddingPasswordProvider:
      return Object.assign({}, state, {
        addingPasswordProvider: true,
        addedPasswordProvider: false,
        failedToAddPasswordProvider: false
      });
    case Auth.AddingPasswordProviderFailed:
      return Object.assign({}, state, {
        addingPasswordProvider: false,
        addedPasswordProvider: false,
        failedToAddPasswordProvider: true,
        error: action.error
      });
    case Auth.AddedPasswordProvider:
      return Object.assign({}, state, {
        addingPasswordProvider: false,
        addedPasswordProvider: true,
        failedToAddPasswordProvider: false,
        credentials: action.credentials
      });
    case Auth.ChangingEmailAddress:
      return Object.assign({}, state, {
        changingEmailAddress: true,
        changedEmailAddress: false,
        failedToChangeEmailAddress: false,
        nEmail: action.nEmail
      });
    case Auth.ChangingEmailAddressFailed:
      return Object.assign({}, state, {
        changingEmailAddress: false,
        changedEmailAddress: false,
        failedToChangeEmailAddress: true,
        nEmail: action.nEmail,
        error: action.error
      });
    case Auth.ChangedEmailAddress:
      return Object.assign({}, state, {
        changingEmailAddress: false,
        changedEmailAddress: true,
        failedToChangeEmailAddress: false,
        nEmail: action.nEmail
      });
    default:
      return state;
  }
}

export default auth;