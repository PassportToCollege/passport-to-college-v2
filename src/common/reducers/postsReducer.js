import initialState from "./initialState";
import {
  POSTS_GET_INITIATED,
  POSTS_GET_DONE,
  POSTS_GET_FAILED,
  POSTS_GET_MOST_RECENT_INITIATED,
  POSTS_GET_MOST_RECENT_DONE,
  POSTS_GET_MOST_RECENT_FAILED,
  PAGINATE_POSTS_INITIATED,
  PAGINATE_POSTS_DONE,
  POSTS_GET_MOST_RECENT_BY_CATEGORY_INITIATED,
  POSTS_GET_MOST_RECENT_BY_CATEGORY_DONE,
  POSTS_GET_MOST_RECENT_BY_CATEGORY_FAILED,
  PAGINATE_POSTS_FAILED,
  GET_ACCOMPLISHMENTS_BY_USER_INITIATED,
  GET_ACCOMPLISHMENTS_BY_USER_FAILED,
  GOT_ACCOMPLISHMENTS_BY_USER
} from "../actions/actionTypes";

const posts = (state = initialState.posts, action) => {
  switch (action.type) {
    case POSTS_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        postsGetFailed: false
      });
    case POSTS_GET_DONE:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        postsGetFailed: false,
        posts: action.posts
      });
    case POSTS_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: false,
        postsGetFailed: true,
        error: action.error,
        posts: null
      });
    case POSTS_GET_MOST_RECENT_INITIATED:
      return Object.assign({}, state, {
        gettingMostRecent: true,
        gotMostRecent: false,
        mostRecentGetFailed: false
      });
    case POSTS_GET_MOST_RECENT_DONE:
      return Object.assign({}, state, {
        gettingMostRecent: false,
        gotMostRecent: true,
        mostRecentGetFailed: false,
        mostRecent: action.mostRecent
      });
    case POSTS_GET_MOST_RECENT_FAILED:
      return Object.assign({}, state, {
        gettingMostRecent: false,
        gotMostRecent: false,
        mostRecentGetFailed: true,
        error: action.error,
        mostRecent: null
      });
    case PAGINATE_POSTS_INITIATED:
      return Object.assign({}, state, {
        paginatingPosts: true,
        paginationDone: false,
        paginationFailed: false,
        page: action.page
      });
    case PAGINATE_POSTS_DONE:
      return Object.assign({}, state, {
        paginatingPosts: false,
        paginationDone: true,
        paginationFailed: false,
        page: action.page,
        paginatedPosts: action.posts
      });
    case PAGINATE_POSTS_FAILED:
      return Object.assign({}, state, {
        paginatingPosts: false,
        paginationDone: false,
        paginationFailed: true,
        page: action.page,
        error: action.error,
        paginatedPosts: null
      });
    case POSTS_GET_MOST_RECENT_BY_CATEGORY_INITIATED:
      return Object.assign({}, state, {
        gettingMostRecentByCategory: true,
        gotMostRecentByCategory: false,
        mostRecentGetByCategoryGetFailed: false,
        category: action.category
      });
    case POSTS_GET_MOST_RECENT_BY_CATEGORY_DONE:
      return Object.assign({}, state, {
        gettingMostRecentByCategory: false,
        gotMostRecentByCategory: true,
        mostRecentGetByCategoryGetFailed: false,
        category: action.category,
        moreByCategory: action.more
      });
    case POSTS_GET_MOST_RECENT_BY_CATEGORY_FAILED:
      return Object.assign({}, state, {
        gettingMostRecentByCategory: false,
        gotMostRecentByCategory: false,
        mostRecentGetByCategoryGetFailed: true,
        category: action.category,
        error: action.error,
        moreByCategory: null
      });
    case GET_ACCOMPLISHMENTS_BY_USER_INITIATED:
      return Object.assign({}, state, {
        gettingAccomplishmentsByUser: true,
        gotAccomplishmentsByUser: false,
        failedToGetAccomplishmentsByUser: false,
        student: action.student
      });
    case GET_ACCOMPLISHMENTS_BY_USER_FAILED:
      return Object.assign({}, state, {
        gettingAccomplishmentsByUser: false,
        gotAccomplishmentsByUser: false,
        failedToGetAccomplishmentsByUser: true,
        student: action.student,
        error: action.error,
        accomplishmentsByUser: null
      });
    case GOT_ACCOMPLISHMENTS_BY_USER:
      return Object.assign({}, state, {
        gettingAccomplishmentsByUser: false,
        gotAccomplishmentsByUser: true,
        failedToGetAccomplishmentsByUser: false,
        student: action.student,
        accomplishmentsByUser: action.posts
      });
    default:
      return state;
  }
};

export default posts;