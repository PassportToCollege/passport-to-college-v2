import iUser, { UserType } from './iUser';
import iStats from './iStats';
import Post from '../models/Post';
import User from '../models/User';
import Application from '../models/Application';
import PostCategory from '../models/PostCategory';
import Feature from '../models/Feature';
import Comment from '../models/Comment';
import Student from '../models/Student';
import Reply from '../models/Reply';
import { iStringReplyListPair } from './iObjectTypes';
import { PostUpdateType } from './iPost';
import iContentEditable from './iContentEditable';

export interface ApplicationState {
  userId?: string;
  User?: User;
  Application?: Application;
  error?: Error;
  data?: any;
  date?: Date;

  isGetting?: boolean;
  hasGotten?: boolean;
  failedToGetApplication?: boolean;

  isUpdating?: boolean;
  hasUpdated?: boolean;
  failedToUpdateApplication?: boolean;

  deletingTest?: boolean;
  deletedTest?: boolean;
  failedToDeleteTest?: boolean;

  isSubmitting?: boolean;
  hasSubmitted?: boolean;
  failedToSubmit?: boolean;

  sendingSubmissionEmail?: boolean;
  sentSubmissionEmail?: boolean;
  sendingSubmissionEmailFailed?: boolean;
}

export interface ApplicationsState {
  page?: number;
  Applications?: Application[];
  error?: Error;

  isGetting?: boolean;
  hasFailed?: boolean;
  hasGotten?: boolean;
}

export interface CommentsState {
  error?: Error;
  comment?: Comment;
  comments?: Comment[];
  conversations?: Comment[];
  reply?: Reply;
  replies?: iStringReplyListPair;
  isReply?: boolean;
  id?: string;
  parent?: string;
  changedComment?: Comment;
  post?: string;
  page?:  number;

  creatingComment?: boolean;
  createdComment?: boolean;
  failedToCreateComment?: boolean;

  gettingComment?: boolean;
  gotComment?: boolean;
  failedToGetComment?: boolean;

  gettingComments?: boolean;
  gotComments?: boolean;
  failedToGetComments?: boolean;

  gettingReplies?: boolean;
  gotReplies?: boolean;
  failedToGetReplies?: boolean;

  gettingReply?: boolean;
  gotReply?: boolean;
  failedToGetReply?: boolean;

  updatingComment?: boolean;
  updatedComment?: boolean;
  failedToUpdateComment?: boolean;

  updatedCommentLocal?: boolean;

  deletingComment?: boolean;
  deletedComment?: boolean;
  failedToDeleteComment?: boolean;

  safelyDeletingComment?: boolean;
  safelyDeletedComment?: boolean;
  failedToSafelyDeleteComment?: boolean;

  gettingConversations?: boolean;
  gotConversations?: boolean;
  failedToGetConversations?: boolean;
}

export interface PostState {
  id?: string;
  error?: Error;
  post?: Post;
  hero?: string;
  data?: any;
  lastDeletedPost?: Post;
  conversations?: Comment[];

  isCreating?: boolean;
  hasCreated?: boolean;
  postCreationFailed?: boolean;

  isGetting?: boolean;
  hasGotten?: boolean;
  postGetFailed?: boolean;

  isUpdating?: boolean;
  hasUpdated?: boolean;
  postUpdateFailed?: boolean;

  updatedLocalConversationsCount?: boolean;
  postUpdateType?: PostUpdateType;
  changedComment?: Comment;

  isUploading?: boolean;
  hasUploaded?: boolean;
  heroUploadFailed?: boolean;

  gettingHero?: boolean;
  gotHero?: boolean;
  heroGetFailed?: boolean;

  deletingPost?: boolean;
  deletedPost?: boolean;
  failedToDeletePost?: boolean;
}

export interface PostsState {
  posts?: Post[];
  accomplishments?: Post[];
  error?: Error;
  page?: number;
  categories?: PostCategory[];
  student?: Student;

  isGetting?: boolean;
  hasGotten?: boolean;
  postsGetFailed?: boolean;

  gettingMostRecent?: boolean;
  gotMostRecent?: boolean;
  mostRecentGetFailed?: boolean;

  paginatingPosts?: boolean;
  paginationDone?: boolean;
  paginationFailed?: boolean;

  gettingMostRecentByCategory?: boolean;
  gotMostRecentByCategory?: boolean;
  mostRecentGetByCategoryGetFailed?: boolean;

  gettingAccomplishmentsByUser?: boolean;
  gotAccomplishmentsByUser?: boolean;
  failedToGetAccomplishmentsByUser?: boolean;
}

export interface PostCategoryState {
  slug?: string;
  error?: Error;
  category?: PostCategory;
  categories?: PostCategory[];
  uCategory?: PostCategory;

  gettingCategory?: boolean;
  gotCategory?: boolean;
  getCategoryFailed?: boolean;

  isAdding?: boolean;
  hasAdded?: boolean;
  categoryAddFailed?: boolean;

  isUpdating?: boolean;
  hasUpdated?: boolean;
  updateFailed?: boolean;

  gettingCategories?: boolean;
  gotCategories?: boolean;
  getCategoriesFailed?: boolean;

  updatingCategoryPosts?: boolean;
  updatedCategoryPosts?: boolean;
  failedToUpdatedCategoryPosts?: boolean;
}

export interface FeatureState {
  feature?: Feature;
  error?: Error;
  data?: any;

  isGetting?: boolean;
  hasGotten?: boolean;
  failedToGetFeature?: boolean;

  isCreating?: boolean;
  hasCreated?: boolean;
  creationFailed?: boolean;

  isUpdating?: boolean;
  hasUpdated?: boolean;
  failedToUpdate?: boolean;

  isDeleting?: boolean;
  hasDeleted?: boolean;
  deleteFailed?: boolean;
}

export interface FeaturesState {
  student?: Student;
  features?: Feature[];
  error?: Error;

  isGetting?: boolean;
  hasGotten?: boolean;
  hasFailed?: boolean;

  gettingActive?: boolean;
  gotActive?: boolean;
  failedToGetActive?: boolean;
}

export interface HamburgerState {
  state: 'open' | 'closed';
}

export interface MenuState {
  state: 'full' | 'compact' | 'closed';
}

export interface AuthState {
  activeUser?: iUser | boolean;
  error?: Error;
  provider?: string;
  email?: string;

  isAuthorizing?: boolean;
  failedToAuthorize?: boolean;
  hasAuthorized?: boolean;
  hasSignedOut?: boolean;

  signingInWithSocial?: boolean;
  hasSignedInWithSocial?: boolean;
  failedToSignInWithSocial?: boolean;

  signingUpWithSocial?: boolean;
  hasSignedUpWithSocial?: boolean;
  failedToSignUpWithSocial?: boolean;

  isCreatingAccount?: boolean;
  hasCreatedAccount?: boolean;
  failedToCreateAccount?: boolean;

  isSending?: boolean; 
  hasSent?: boolean; 
  failedToSendEmail?: boolean;

  linkingSocialAccount?: boolean;
  linkedSocialAccount?: boolean;
  failedToLinkSocialAccount?: boolean;

  unlinkingSocialAccount?: boolean;
  unlinkedSocialAccount?: boolean;
  failedToUnlinkSocialAccount?: boolean;

  addingPasswordProvider?: boolean;
  addedPasswordProvider?: boolean;
  failedToAddPasswordProvider?: boolean;

  changingEmailAddress?: boolean;
  changedEmailAddress?: boolean;
  failedToChangeEmailAddress?: boolean;
}

export interface StatsState {
  error?: Error;
  stats?: iStats;

  isGetting?: boolean;
  hasGotten?: boolean;
  hasFailed?: boolean;
}

export interface UserState {
  User?: User;
  id?: string;
  error?: Error;
  data?: any;

  isGetting?: boolean;
  hasFailed?: boolean;
  hasGotten?: boolean;

  isUpdating?: boolean;
  failedToUpdate?: boolean;
  isReAuthenticating?: boolean;
  hasUpdated?: boolean;
}

export interface UsersState {
  page?: number;
  userType?: UserType;
  error?: Error;
  data?: any;
  users?: User[];
  user?: User;
  founder?: User;
  staff?: User[];
  email?: string;
  id?: string;
  bio?: iContentEditable;

  isGettingUsers?: boolean;
  failedToGetUsers?: boolean;
  hasGottenUsers?: boolean;

  isGettingUsersByUid?: boolean;
  hasGottenUsersByUid?: boolean;
  failedToGetUsersByUid?: boolean;
  
  isCreating?: boolean;
  hasCreated?: boolean;
  failedToCreateUser?: boolean;
  
  isSending?: boolean;
  hasSent?: boolean;
  failedToSend?: boolean;

  isGettingUser?: boolean;
  hasGottenUser?: boolean;
  failedToGetByUserId?: boolean;

  isUpdating?: boolean;
  hasUpdated?: boolean;
  updateFailed?: boolean;

  addingBio?: boolean;
  addedBio?: boolean;
  failedToAddBio?: boolean;

  gettingFounder?: boolean;
  gotFounder?: boolean;
  failedToGetFounder?: boolean;

  gettingStaff?: boolean;
  gotStaff?: boolean;
  failedToGetStaff?: boolean;
}

export interface StudentState {
  student?: Student;
  id?: string;
  error?: Error;
  data?: any;
  slug?: string;

  isGetting?: boolean;
  hasGotten?: boolean;
  failedToGetStudent?: boolean;

  isUpdating?: boolean;
  hasUpdated?: boolean;
  failedToUpdateStudent?: boolean;

  isDeleting?: boolean;
  hasDeleted?: boolean;
  failedToDeleteAccomplishment?: boolean;

  creatingStudent?: boolean;
  createdStudent?: boolean;
  failedToCreateStudent?: boolean;
}

export interface StudentsState {
  students?: Student[];
  current?: Student[];
  past?: Student[];
  error?: Error;

  isGetting?: boolean;
  hasGotten?: boolean;
  failedToGetStudents?: boolean;

  gettingCurrentStudents?: boolean;
  gotCurrentStudents?: boolean;
  failedToGetCurrentStudents?: boolean;

  gettingPastStudents?: boolean;
  gotPastStudents?: boolean;
  failedToGetPastStudents?: boolean;
}

export default interface iAppState {
  Application: ApplicationState;
  Applications: ApplicationsState;
  Comments: CommentsState;
  Auth: AuthState;
  Feature: FeatureState;
  Features: FeaturesState;
  Hamburger: HamburgerState;
  Menu: MenuState;
  Post: PostState;
  PostCategory: PostCategoryState;
  Posts: PostsState;
  Stats: StatsState;
  Student: StudentState;
  Students: StudentsState;
  User: UserState;
  Users: UsersState;
}