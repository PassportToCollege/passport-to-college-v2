import initialState from "./initialState";
import {
  POSTS_GET_INITIATED,
  POSTS_GET_DONE,
  POSTS_GET_FAILED,
  POSTS_GET_MOST_RECENT_INITIATED,
  POSTS_GET_MOST_RECENT_DONE,
  POSTS_GET_MOST_RECENT_FAILED
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
        error: action.error
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
        mostRecent: action.posts
      });
    case POSTS_GET_MOST_RECENT_FAILED:
      return Object.assign({}, state, {
        gettingMostRecent: false,
        gotMostRecent: false,
        mostRecentGetFailed: true,
        error: action.error
      });
    default:
      return state;
  }
};

export default posts;