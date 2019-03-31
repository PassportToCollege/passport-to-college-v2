import iError from "./iError";
import iUser from "./iUser";
import Post from "../models/Post";
import User from "../models/User";
import Application from "../models/Application";

interface ApplicationState
{
  userId? : string;
  User? : User;
  Application? : Application;
  error? : iError;
  data? : any;
  date? : Date;

  isGetting? : boolean;
  hasGotten? : boolean;
  failedToGetApplication? : boolean;

  isUpdating? : boolean;
  hasUpdated? : boolean;
  failedToUpdateApplication? : boolean;

  deletingTest? : boolean;
  deletedTest? : boolean;
  failedToDeleteTest? : boolean;

  isSubmitting? : boolean;
  hasSubmitted? : boolean;
  failedToSubmit? : boolean;

  sendingSubmissionEmail? : boolean;
  sentSubmissionEmail? : boolean;
  sendingSubmissionEmailFailed? : boolean;
}

interface PostState
{
  id? : string;
  error? : iError;
  Post? : Post;
  data? : any;
  lastDeletedPost : Post;

  isCreating? : boolean;
  hasCreated? : boolean;
  postCreationFailed? : boolean;

  isGetting? : boolean;
  hasGotten? : boolean;
  postGetFailed? : boolean;

  isUpdating? : boolean;
  hasUpdated? : boolean;
  postUpdateFailed? : boolean;

  updatedLocalConversationsCount? : boolean;

  isUploading? : boolean;
  hasUploaded? : boolean;
  heroUploadFailed? : boolean;

  gettingHero? : boolean;
  gotHero? : boolean;
  heroGetFailed? : boolean;

  deletingPost? : boolean;
  deletedPost? : boolean;
  failedToDeletePost? : boolean;
}

interface HamburgerState
{
  current : number;
  previous? : number;
}

interface MenuState
{
  dash : string;
}

interface AuthState
{
  activeUser? : iUser | boolean;
  error? : iError;
  provider? : string;
  email? : string;

  isAuthorizing? : boolean;
  failedToAuthorize? : boolean;
  hasAuthorized? : boolean;

  signingInWithSocial? : boolean;
  hasSignedInWithSocial? : boolean;
  failedToSignInWithSocial? : boolean;

  signingUpWithSocial? : boolean;
  hasSignedUpWithSocial? : boolean;
  failedToSignUpWithSocial? : boolean;

  isCreating? : boolean;
  hasCreated? : boolean;
  hasFailed? : boolean;

  isSending? : boolean; 
  hasSent? : boolean; 
  failedToSendEmail? : boolean;

  linkingSocialAccount? : boolean;
  linkedSocialAccount? : boolean;
  failedToLinkSocialAccount? : boolean;

  unlinkingSocialAccount? : boolean;
  unlinkedSocialAccount? : boolean;
  failedToUnlinkSocialAccount? : boolean;

  addingPasswordProvider? : boolean;
  addedPasswordProvider? : boolean;
  failedToAddPasswordProvider? : boolean;

  changingEmailAddress? : boolean;
  changedEmailAddress? : boolean;
  failedToChangeEmailAddress? : boolean;
}

export default interface iAppState {
  Application : ApplicationState;
  Post : PostState;
  Hamburger : HamburgerState;
  Menu : MenuState;
  Auth : AuthState;
}