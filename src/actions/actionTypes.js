// AHMBURGER MENU Actions
export const OPEN_HAMBURGER = "OPEN_HAMBURGER";
export const CLOSE_HAMBURGER = "CLOSE_HAMBURGER";

// AUTH Actions
export const REMOVE_AUTH_ERRORS = "REMOVE_AUTH_ERRORS";
export const SIGN_IN_AUTHORIZING = "SIGN_IN_AUTHORIZING";
export const SIGN_IN_GETTING_USER = "SIGN_IN_GETTING_USER";
export const SIGNED_IN = "SIGNED_IN";
export const SIGN_IN_FAILED = "SIGN_IN_FAILED";
export const SIGN_IN_WITH_GOOGLE_INITIATED = "SIGN_IN_WITH_GOOGLE_INITIATED";
export const SIGN_IN_WITH_GOOGLE_FAILED = "SIGN_IN_WITH_GOOGLE_FAILED";
export const SIGNED_IN_WITH_GOOGLE = "SIGNED_IN_WITH_GOOGLE";
export const SIGN_IN_WITH_FACEBOOK_INITIATED = "SIGN_IN_WITH_FACEBOOK_INITIATED";
export const SIGN_IN_WITH_FACEBOOK_FAILED = "SIGN_IN_WITH_FACEBOOK_FAILED";
export const SIGNED_IN_WITH_FACEBOOK = "SIGNED_IN_WITH_FACEBOOK";
export const SIGN_OUT_AUTHORIZING = "SIGN_OUT_AUTHORIZING";
export const SIGNED_OUT = "SIGNED_OUT";
export const SIGN_OUT_FAILED = "SIGN_OUT_FAILED";
export const ACCOUNT_CREATION_INITIATED = "ACCOUNT_CREATION_INITIATED";
export const ACCOUNT_CREATION_FAILED = "ACCOUNT_CREATION_FAILED";
export const ACCOUNT_CREATED = "ACCOUNT_CREATED";
export const ACCOUNT_CREATION_ADDING_TO_USER_DBS = "ACCOUNT_CREATION_ADDING_TO_USER_DBS";
export const ACCOUNT_CREATION_ADDED_TO_USER_DBS = "ACCOUNT_CREATION_ADDED_TO_USER_DBS";
export const ACCOUNT_CREATION_ADDING_TO_USER_DBS_FAILED = "ACCOUNT_CREATION_ADDING_TO_USER_DBS_FAILED";
export const RESET_PASSWORD_EMAIL_INITIATED = "RESET_PASSWORD_EMAIL_INITIATED";
export const RESET_PASSWORD_EMAIL_SENT = "RESET_PASSWORD_EMAIL_SENT";
export const RESET_PASSWORD_EMAIL_FAILED = "RESET_PASSWORD_EMAIL_FAILED";
export const EMAIL_CONFIRMATION_SEND_INITIATED = "EMAIL_CONFIRMATION_SEND_INITIATED";
export const EMAIL_CONFIRMATION_SENT = "EMAIL_CONFIRMATION_SENT";
export const EMAIL_CONFIRMATION_SEND_FAILED = "EMAIL_CONFIRMATION_SEND_FAILED";

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

// STUDENTS actions
export const STUDENTS_GET_INITIATED = "STUDENTS_GET_INITIATED";
export const STUDENTS_GET_FAILED = "STUDENTS_GET_FAILED";
export const STUDENTS_GET_SUCCESS = "STUDENTS_GET_SUCCESS";

// FEATURES actions
export const FEATURES_GET_INITIATED = "FEATURES_GET_INITIATED";
export const FEATURES_GET_FAILED = "FEATURES_GET_FAILED";
export const FEATURES_GET_SUCCESS = "FEATURES_GET_SUCCESS";

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