import initialState from "./initialState";
import { 
  REMOVE_AUTH_ERRORS,
  SIGN_IN_AUTHORIZING, 
  SIGN_IN_FAILED,
  SIGNED_IN,
  SIGN_OUT_AUTHORIZING,
  SIGN_OUT_FAILED,
  SIGNED_OUT, 
  SIGN_IN_GETTING_USER,
  ACCOUNT_CREATED,
  ACCOUNT_CREATION_ADDING_TO_USER_DBS,
  ACCOUNT_CREATION_ADDING_TO_USER_DBS_FAILED,
  ACCOUNT_CREATION_ADDED_TO_USER_DBS,
  ACCOUNT_CREATION_FAILED,
  ACCOUNT_CREATION_INITIATED, 
  RESET_PASSWORD_EMAIL_INITIATED,
  RESET_PASSWORD_EMAIL_SENT,
  RESET_PASSWORD_EMAIL_FAILED,
  EMAIL_CONFIRMATION_SEND_INITIATED,
  EMAIL_CONFIRMATION_SENT,
  EMAIL_CONFIRMATION_SEND_FAILED,
  SIGN_IN_WITH_SOCIAL_INITIATED, 
  SIGN_IN_WITH_SOCIAL_FAILED,
  SIGNED_IN_WITH_SOCIAL,
  SIGN_UP_WITH_SOCIAL_INITIATED,
  SIGN_UP_WITH_SOCIAL_FAILED,
  SIGNED_UP_WITH_SOCIAL
} from "../actions/actionTypes";

const auth = (state = initialState.auth, action) => {
  switch(action.type) {
    case REMOVE_AUTH_ERRORS:
      return Object.assign({}, state, {
        isAuthorizing: false,
        hasFailed: false,
        isCreating: false,
        isAddingToDbs: false,
        failedToSignInWithSocial: false,
        error: null
      });
    case SIGN_IN_AUTHORIZING:
    case SIGN_OUT_AUTHORIZING:
      return Object.assign({}, state, {
        isAuthorizing: true,
        hasAuthorized: false,
        hasFailed: false,
        activeUser: action.user
      });
    case SIGN_IN_GETTING_USER:
      return Object.assign({}, state, {
        isAuthorizing: false,
        hasAuthorized: false,
        hasFailed: false,
        activeUser: null
      });
    case SIGNED_IN:
      return Object.assign({}, state, {
        isAuthorizing: false,
        hasAuthorized: true,
        hasFailed: false,
        activeUser: action.user
      });
    case SIGN_IN_FAILED:
    case SIGN_OUT_FAILED:
      return Object.assign({}, state, {
        hasFailed: true,
        isAuthorizing: false,
        hasAuthorized: false,
        activeUser: false,
        error: action.error
      });
    case SIGNED_OUT:
      return Object.assign({}, state, {
        isAuthorizing: false,
        hasAuthorized: false,
        hasSignedInWithSocial: false,
        hasSignedOut: true,
        hasFailed: false,
        activeUser: false
      });
    case SIGN_IN_WITH_SOCIAL_INITIATED:
      return Object.assign({}, state, {
        signingInWithSocial: true,
        hasSignedInWithSocial: false,
        failedToSignInWithSocial: false,
        provider: action.provider
      });
    case SIGN_IN_WITH_SOCIAL_FAILED:
      return Object.assign({}, state, {
        signingInWithSocial: false,
        hasSignedInWithSocial: false,
        failedToSignInWithSocial: true,
        provider: action.provider,
        error: action.error
      });
    case SIGNED_IN_WITH_SOCIAL:
      return Object.assign({}, state, {
        signingInWithSocial: false,
        hasSignedInWithSocial: true,
        failedToSignInWithSocial: false,
        provider: action.provider,
        activeUser: action.user
      });
    case SIGN_UP_WITH_SOCIAL_INITIATED:
      return Object.assign({}, state, {
        signingUpWithSocial: true,
        hasSignedUpWithSocial: false,
        failedToSignUpWithSocial: false,
        provider: action.provider
      });
    case SIGN_UP_WITH_SOCIAL_FAILED:
      return Object.assign({}, state, {
        signingUpWithSocial: false,
        hasSignedUpWithSocial: false,
        failedToSignUpWithSocial: true,
        provider: action.provider,
        error: action.error
      });
    case SIGNED_UP_WITH_SOCIAL:
      return Object.assign({}, state, {
        signingUpWithSocial: false,
        hasSignedUpWithSocial: true,
        failedToSignUpWithSocial: false,
        provider: action.provider
      });
    case ACCOUNT_CREATION_INITIATED:
      return Object.assign({}, state, {
        isCreating: true,
        hasCreated: false,
        hasFailed: false,
        data: action.data
      });
    case ACCOUNT_CREATION_FAILED:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: false,
        hasFailed: true,
        data: action.data,
        error: action.error
      });
    case ACCOUNT_CREATED:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: true,
        hasFailed: false,
        data: action.data
      });
    case ACCOUNT_CREATION_ADDING_TO_USER_DBS:
      return Object.assign({}, state, {
        isCreating: true,
        hasAdded: false,
        hasFailed: false,
        isAddingToDbs: true
      });
    case ACCOUNT_CREATION_ADDED_TO_USER_DBS:
      return Object.assign({}, state, {
        isCreating: false,
        hasAdded: true,
        hasFailed: false,
        isAddingToDbs: false
      });
    case ACCOUNT_CREATION_ADDING_TO_USER_DBS_FAILED:
      return Object.assign({}, state, {
        isCreating: false,
        hasFailed: true,
        isAddingToDbs: false,
        error: action.error
      });
    case RESET_PASSWORD_EMAIL_INITIATED:
    case EMAIL_CONFIRMATION_SEND_INITIATED:
      return Object.assign({}, state, {
        isSending: true,
        hasSent: false,
        hasFailed: false,
        email: action.email
      });
    case RESET_PASSWORD_EMAIL_SENT:
    case EMAIL_CONFIRMATION_SENT:
      return Object.assign({}, state, {
        isSending: false,
        hasSent: true,
        hasFailed: false,
        email: action.email
      });
    case RESET_PASSWORD_EMAIL_FAILED:
    case EMAIL_CONFIRMATION_SEND_FAILED:
      return Object.assign({}, state, {
        isSending: false,
        hasSent: false,
        hasFailed: true,
        email: action.email,
        error: action.error
      });
    default:
      return state;
  }
}

export default auth;