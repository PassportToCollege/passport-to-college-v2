// HAMBURGER MENU Actions
enum Hamburger {
  Open = 0,
  Close = 1,
};

// MENU actions
enum Menu {
  Full = 0,
  Compact = 1,
  Closed = 2,
};

// AUTH Actions
enum Auth {
  RemoveErrors = 0,
  SignInAuthorizing = 1,
  SignInAuthorizing_Social = 2,
  SignedIn = 3,
  SignedIn_Social = 4,
  SignInFailed = 5,
  SignInFailed_Social = 6,
  GettingUser = 7,
  CreatingAccount = 8,
  CreatingAccount_Social = 9,
  CreatedAccount = 10,
  CreatedAccount_Social = 11,
  CreatingAccountFailed = 12,
  CreatingAccountFailed_Social = 13,
  AddingToDb = 14,
  AddedToDb = 15,
  AddingToDbFailed = 16,
  SignOutAuthorizing = 17,
  SignedOut = 18,
  SignOutFailed = 19,
  ResetPasswordEmailSending = 20,
  ResetPasswordEmailSent = 21,
  ResetPasswordEmailFailed = 22,
  AccountCreatedEmailSending = 23,
  AccountCreatedEmailSent = 24,
  AccountCreatedEmailFailed = 25,
  LinkingSocialAccount = 26,
  LinkedSocialAccount = 27,
  LinkingSocialAccountFailed = 28,
  UnlinkingSocialAccount = 29,
  UnlinkedSocialAccount = 30,
  UnlinkingSocialAccountFailed = 31,
  AddingPasswordProvider = 32,
  AddedPasswordProvider = 33,
  AddingPasswordProviderFailed = 34,
  ChangingEmailAddress = 35,
  ChangedEmailAddress = 36,
  ChangingEmailAddressFailed = 37
}

// PROFILE PICTURE Actions
export const PROFILE_PICTURE_GET_INITIATED = "PROFILE_PICTURE_GET_INITIATED";
export const PROFILE_PICTURE_GET_FAILED = "PROFILE_PICTURE_GET_FAILED";
export const PROFILE_PICTURE_GET_DONE = "PROFILE_PICTURE_GET_DONE";
export const PROFILE_PICTURE_GET_BY_UID_INITIATED = "PROFILE_PICTURE_GET_BY_UID_INITIATED";
export const PROFILE_PICTURE_GET_BY_UID_FAILED = "PROFILE_PICTURE_GET_BY_UID_FAILED";
export const PROFILE_PICTURE_GET_BY_UID_DONE = "PROFILE_PICTURE_GET_BY_UID_DONE";
export const PROFILE_PICTURE_UPLOAD_INITIATED = "PROFILE_PICTURE_UPLOAD_INITIATED";
export const PROFILE_PICTURE_UPLOAD_FAILED = "PROFILE_PICTURE_UPLOAD_FAILED";
export const PROFILE_PICTURE_UPLOADED = "PROFILE_PICTURE_UPLOADED";

// USER actions
export const USER_GET_INITIATED = "USER_GET_INITIATED";
export const USER_UPDATE_INITIATED = "USER_UPDATE_INITIATED";
export const USER_GET_FAILED = "USER_GET_FAILED";
export const USER_UPDATE_FAILED = "USER_UPDATE_FAILED";
export const USER_GET_SUCCESS = "USER_GET_SUCCESS";
export const USER_UPDATED = "USER_UPDATED";
export const USER_AUTH_EMAIL_UPDATE_INITIATED = "USER_AUTH_EMAIL_UPDATE_INITIATED";
export const USER_AUTH_EMAIL_UPDATED = "USER_AUTH_EMAIL_UPDATED";
export const USER_AUTH_EMAIL_UPDATE_FAILED = "USER_AUTH_EMAIL_UPDATE_FAILED";
export const USER_REAUTHENTICATION_INITIATED = "USER_REAUTHENTICATION_INITIATED";
export const USER_REAUTHENTICATED = "USER_REAUTHENTICATED";
export const USER_REAUTHENTICATION_FAILED = "USER_REAUTHENTICATION_FAILED";

// USERS actions
export const USERS_GET_INITIATED = "USERS_GET_INITIATED";
export const USERS_GET_FAILED = "USERS_GET_FAILED";
export const USERS_GET_SUCCESS = "USERS_GET_SUCCESS";
export const USER_GET_BY_ID_INITIATED = "USER_GET_BY_ID_INITIATED";
export const USER_GET_BY_ID_FAILED = "USER_GET_BY_ID_FAILED";
export const USER_GET_BY_ID_SUCCESS = "USER_GET_BY_ID_SUCCESS";
export const USERS_GET_BY_ID_INITIATED = "USERS_GET_BY_ID_INITIATED";
export const USERS_GET_BY_ID_FAILED = "USERS_GET_BY_ID_FAILED";
export const USERS_GET_BY_ID_SUCCESS = "USERS_GET_BY_ID_SUCCESS";
export const USERS_CREATE_USER_INITIATED = "USERS_CREATE_USER_INITIATED";
export const USERS_NEW_USER_CREATED = "USERS_NEW_USER_CREATED";
export const USERS_CREATE_USER_FAILED = "USERS_CREATE_USER_FAILED";
export const USERS_SEND_SIGNUP_EMAIL_INITIATED = "USERES_SEND_SIGNUP_EMAIL_INITIATED";
export const USERS_SEND_SIGNUP_EMAIL_FAILED = "USERS_SEND_SIGNUP_EMAIL_FAILED";
export const USERS_SIGNUP_EMAIL_SENT = "USERS_SIGNUP_EMAIL_SENT";
export const USERS_UPDATE_INITIATED = "USERS_UPDATE_INITIATED";
export const USERS_UPDATED = "USERS_UPDATED";
export const USERS_UPDATE_FAILED = "USERS_UPDATE_FAILED";
export const USERS_ADD_BIO_INITIATED = "USERS_ADD_BIO_INITIATED";
export const USERS_ADD_BIO_FAILED = "USERS_ADD_BIO_FAILED";
export const ADDED_BIO = "ADDED_BIO";
export const USERS_GET_FOUNDER_INITIATED = "USERS_GET_FOUNDER_INITIATED";
export const USERS_GET_FOUNDER_FAILED = "USERS_GET_FOUNDER_FAILED";
export const GOT_FOUNDER = "GOT_FOUNDER";
export const USERS_GET_STAFF_INITIATED = "USERS_GET_STAFF_INITIATED";
export const USERS_GET_STAFF_FAILED = "USERS_GET_STAFF_FAILED";
export const GOT_STAFF = "GOT_STAFF";

// APPLICATION actions
export const APPLICATION_GET_INITIATED = "APPLICATION_GET_INITIATED";
export const APPLICATION_UPDATE_INITIATED = "APPLICATION_UPDATE_INITIATED";
export const APPLICATION_GET_FAILED = "APPLICATION_GET_FAILED";
export const APPLICATION_UPDATE_FAILED = "APPLICATION_UPDATE_FAILED";
export const APPLICATION_GET_SUCCESS = "APPLICATION_GET_SUCCESS";
export const APPLICATION_UPDATED = "APPLICATION_UPDATED";
export const APPLICATION_TEST_DELETE_INITIATED = "APPLICATION_TEST_DELETE_INITIATED";
export const APPLICATION_TEST_DELETE_FAILED = "APPLICATION_TEST_DELETE_FAILED";
export const APPLICATION_TEST_DELETED = "APPLICATION_TEST_DELETED";
export const APPLICATION_SUBMIT_INITIATED = "APPLICATION_SUBMIT_INITIATED";
export const APPLICATION_SUBMIT_FAILED = "APPLICATION_SUBMIT_FAILED";
export const APPLICATION_SUBMITTED = "APPLICATION_SUBMITTED";
export const APPLICATION_SUBMITTED_EMAIL_INITIATED = "APPLICATION_SUBMITTED_EMAIL_INITIATED";
export const APPLICATION_SUBMITTED_EMAIL_SENT = "APPLICATION_SUBMITTED_EMAIL_SENT";
export const APPLICATION_SUBMITTED_EMAIL_FAILED = "APPLICATION_SUBMITTED_EMAIL_FAILED";

// APPLICATIONS actions
export const APPLICATIONS_GET_INITIATED = "APPLICATIONS_GET_INITIATED";
export const APPLICATIONS_GET_FAILED = "APPLICATIONS_GET_FAILED";
export const APPLICATIONS_GET_SUCCESS = "APPLICATIONS_GET_SUCCESS";

// STAT actions
export const STATS_GET_INITIATED = "STATS_GET_INITIATED";
export const STATS_GET_FAILED = "STATS_GET_FAILED";
export const STATS_GET_SUCCESS = "STATS_GET_SUCCESS";

// STUDENT actions
export const STUDENT_GET_INITIATED = "STUDENT_GET_INITIATED";
export const STUDENT_GET_FAILED = "STUDENT_GET_FAILED";
export const STUDENT_GET_SUCCESS = "STUDENT_GET_SUCCESS";
export const STUDENT_UPDATE_INITIATED = "STUDENT_UPDATE_INITIATED";
export const STUDENT_UPDATED = "STUDENT_UPDATED";
export const STUDENT_UPDATE_FAILED = "STUDENT_UPDATE_FAILED";
export const STUDENT_ACCOMPLISHMENT_DELETE_INITIATED = "STUDENT_ACCOMPLISHMENT_DELETE_INITIATED";
export const STUDENT_ACCOMPLISHMENT_DELETE_FAILED = "STUDENT_ACCOMPLISHMENT_DELETE_FAILED";
export const STUDENT_ACCOMPLISHMENT_DELETED = "STUDENT_ACCOMPLISHMENT_DELETED";
export const CREATE_STUDENT_INITIATED = "CREATE_STUDENT_INITIATED";
export const CREATE_STUDENT_FAILED = "CREATE_STUDENT_FAILED";
export const STUDENT_CREATED = "STUDENT_CREATED";

// STUDENTS actions
export const STUDENTS_GET_INITIATED = "STUDENTS_GET_INITIATED";
export const STUDENTS_GET_FAILED = "STUDENTS_GET_FAILED";
export const STUDENTS_GET_SUCCESS = "STUDENTS_GET_SUCCESS";
export const STUDENTS_GET_CURRENT_INITIATED = "STUDENTS_GET_CURRENT_INITIATED";
export const STUDENTS_GET_CURRENT_FAILED = "STUDENTS_GET_CURRENT_FAILED";
export const STUDENTS_GET_CURRENT_SUCCESS = "STUDENTS_GET_CURRENT_SUCCESS";
export const STUDENTS_GET_PAST_INITIATED = "STUDENTS_GET_PAST_INITIATED";
export const STUDENTS_GET_PAST_FAILED = "STUDENTS_GET_PAST_FAILED";
export const STUDENTS_GET_PAST_SUCCESS = "STUDENTS_GET_PAST_SUCCESS";

// FEATURES actions
export const FEATURES_GET_BY_USER_INITIATED = "FEATURES_GET_BY_USER_INITIATED";
export const FEATURES_GET_BY_USER_FAILED = "FEATURES_GET_BY_USER_FAILED";
export const FEATURES_GET_BY_USER_SUCCESS = "FEATURES_GET_BY_USER_SUCCESS";
export const FEATURES_GET_ACTIVE_INITIATED = "FEATURES_GET_ACTIVE_INITIATED";
export const FEATURES_GET_ACTIVE_FAILED = "FEATURES_GET_ACTIVE_FAILED";
export const FEATURES_GET_ACTIVE_SUCCESS = "FEATURES_GET_ACTIVE_SUCCESS";

// FEATURE actions
export const FEATURE_GET_INITIATED = "FEATURE_GET_INITIATED";
export const FEATURE_GET_FAILED = "FEATURE_GET_FAILED";
export const FEATURE_GET_SUCCESS = "FEATURE_GET_SUCCESS";
export const FEATURE_UPDATE_INITIATED = "FEATURE_UPDATE_INITIATED";
export const FEATURE_UPDATE_FAILED = "FEATURE_UPDATE_FAILED";
export const FEATURE_UPDATED = "FEATURE_UPDATED";
export const FEATURE_CREATION_INITIATED = "FEATURE_CREATION_INITIATED";
export const FEATURE_CREATED = "FEATURE_CREATED";
export const FEATURE_CREATION_FAILED = "FEATURE_CREATION_FAILED";
export const FEATURE_DELETE_INITIATED = "FEATURE_DELETE_INITIATED";
export const FEATURE_DELETED = "FEATURE_DELETED";
export const FEATURE_DELETE_FAILED = "FEATURE_DELETE_FAILED";

// POST actions
export const POST_CREATE_INITIATED = "POST_CREATE_INITIATED";
export const POST_CREATE_FAILED = "POST_CREATE_FAILED";
export const POST_CREATED = "POST_CREATED";
export const POST_GET_INITIATED = "POST_GET_INITIATED";
export const POST_GET_FAILED = "POST_GET_FAILED";
export const POST_GET_DONE = "POST_GET_DONE";
export const POST_UPDATE_INITIATED = "POST_UPDATE_INITIATED";
export const POST_UPDATE_FAILED = "POST_UPDATE_FAILED";
export const POST_UPDATED = "POST_UPDATED";
export const POST_UPLOAD_HERO_INITIATED = "POST_UPLOAD_HERO_INITIATED";
export const POST_UPLOAD_HERO_FAILED = "POST_UPLOAD_HERO_FAILED";
export const POST_HERO_UPLOADED = "POST_HERO_UPLOADED";
export const POST_GET_HERO_INITIATED = "POST_GET_HERO_INITIATED";
export const POST_GET_HERO_FAILED = "POST_GET_HERO_FAILED";
export const POST_GET_HERO_DONE = "POST_GET_HERO_DONE";
export const POST_UPDATE_LOCAL_CONVERSATIONS_COUNT = "POST_UPDATE_LOCAL_CONVERSATIONS_COUNT";
export const POST_DELETE_INITIATED = "POST_DELETE_INITIATED";
export const POST_DELETE_FAILED = "POST_DELETE_FAILED";
export const POST_DELETED = "POST_DELETED";

// POSTS actions
export const POSTS_GET_INITIATED = "POSTS_GET_INITIATED";
export const POSTS_GET_FAILED = "POSTS_GET_FAILED";
export const POSTS_GET_DONE = "POSTS_GET_DONE";
export const POSTS_GET_MOST_RECENT_INITIATED = "POSTS_GET_MOST_RECENT_INITIATED";
export const POSTS_GET_MOST_RECENT_FAILED = "POSTS_GET_MOST_RECENT_FAILED";
export const POSTS_GET_MOST_RECENT_DONE = "POSTS_GET_MOST_RECENT_DONE";
export const POSTS_GET_MOST_RECENT_BY_CATEGORY_INITIATED = "POSTS_GET_MOST_RECENT_BY_CATEGORY_INITIATED";
export const POSTS_GET_MOST_RECENT_BY_CATEGORY_FAILED = "POSTS_GET_MOST_RECENT_BY_CATEGORY_FAILED";
export const POSTS_GET_MOST_RECENT_BY_CATEGORY_DONE = "POSTS_GET_MOST_RECENT_BY_CATEGORY_DONE";
export const PAGINATE_POSTS_INITIATED = "PAGINATE_POSTS_INITIATED";
export const PAGINATE_POSTS_FAILED = "PAGINATE_POSTS_FAILED";
export const PAGINATE_POSTS_DONE = "PAGINATE_POSTS_DONE";
export const GET_ACCOMPLISHMENTS_BY_USER_INITIATED = "GET_ACCOMPLISHMENTS_BY_USER_INITIATED";
export const GET_ACCOMPLISHMENTS_BY_USER_FAILED = "GET_ACCOMPLISHMENTS_BY_USER_FAILED";
export const GOT_ACCOMPLISHMENTS_BY_USER = "GOT_ACCOMPLISHMENTS_BY_USER";

// POST CATEGORIES actions
export const CATEGORY_GET_INITIATED = "CATEGORY_GET_INITIATED";
export const CATEGORY_GET_DONE = "CATEGORY_GET_DONE";
export const CATEGORY_GET_FAILED = "CATEGORY_GET_FAILED";
export const CATEGORY_ADD_INITIATED = "CATEGORY_ADD_INITIATED";
export const CATEGORY_ADD_FAILED = "CATEGORY_ADD_FAILED";
export const CATEGORY_ADDED = "CATEGORY_ADDED";
export const CATEGORY_UPDATE_INITIATED = "CATEGORY_UPDATE_INITIATED";
export const CATEGORY_UPDATE_FAILED = "CATEGORY_UPDATE_FAILED";
export const CATEGORY_UPDATED = "CATEGORY_UPDATED";
export const CATEGORIES_GET_INITIATED = "CATEGORIES_GET_INITIATED";
export const CATEGORIES_GET_DONE = "CATEGORIES_GET_DONE";
export const CATEGORIES_GET_FAILED = "CATEGORIES_GET_FAILED";
export const UPDATE_CATEGORY_POSTS_INITIATED = "UPDATE_CATEGORY_POSTS_INITIATED";
export const UPDATE_CATEGORY_POSTS_FAILED = "UPDATE_CATEGORY_POSTS_FAILED";
export const CATEGORY_POSTS_UPDATED = "CATEGORY_POSTS_UPDATED";

// COMMENTS actions
export const CREATE_COMMENT_INITIATED = "CREATE_COMMENT_INITIATED";
export const CREATE_COMMENT_FAILED = "CREATE_COMMENT_FAILED";
export const COMMENT_CREATED = "COMMENT_CREATED";
export const DELETE_COMMENT_INITIATED = "DELETE_COMMENT_INITIATED";
export const DELETE_COMMENT_FAILED = "DELETE_COMMENT_FAILED";
export const COMMENT_DELETED = "COMMENT_DELETED";
export const SAFE_DELETE_COMMENT_INITIATED = "SAFE_DELETE_COMMENT_INITIATED";
export const SAFE_DELETE_COMMENT_FAILED = "SAFE_DELETE_COMMENT_FAILED";
export const SAFELY_DELETED_COMMENT = "SAFELY_DELETED_COMMENT";
export const GET_COMMENT_INITIATED = "GET_COMMENT_INITIATED";
export const GET_COMMENT_FAILED = "GET_COMMENT_FAILED";
export const COMMENT_GET_DONE = "COMMENT_GET_DONE";
export const GET_COMMENTS_INITIATED = "GET_COMMENTS_INITIATED";
export const GET_COMMENTS_FAILED = "GET_COMMENTS_FAILED";
export const GET_COMMENTS_DONE = "GET_COMMENTS_DONE";
export const GET_REPLIES_INITIATED = "GET_REPLIES_INITIATED";
export const GET_REPLIES_FAILED = "GET_REPLIES_FAILED";
export const GET_REPLIES_DONE = "GET_REPLIES_DONE";
export const GET_REPLY_INITIATED = "GET_REPLY_INITIATED";
export const GET_REPLY_FAILED = "GET_REPLY_FAILED";
export const GET_REPLY_DONE = "GET_REPLY_DONE";
export const UPDATE_COMMENT_INITIATED = "UPDATE_COMMENT_INITIATED";
export const UPDATE_COMMENT_FAILED = "UPDATE_COMMENT_FAILED";
export const COMMENT_UPDATED = "COMMENT_UPDATED";
export const UPDATE_COMMENT_LOCAL = "UPDATE_COMMENT_LOCAL";
export const GET_CONVERSATIONS_INITIATED = "GET_CONVERSATIONS_INITIATED";
export const GET_CONVERSATIONS_FAILED = "GET_CONVERSATIONS_FAILED";
export const GOT_CONVERSATIONS = "GOT_CONVERSATIONS";

// EVENT actions
export const CREATE_EVENT_INITIATED = "CREATE_EVENT_INITIATED";
export const CREATE_EVENT_FAILED = "CREATE_EVENT_FAILED";
export const CREATED_EVENT = "CREATED_EVENT";

export default {
  Hamburger,
  Menu,
  Auth
}