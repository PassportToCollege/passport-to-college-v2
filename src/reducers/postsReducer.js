import initialState from "./initialState";
import {
  POSTS_GET_INITIATED,
  POSTS_GET_DONE,
  POSTS_GET_FAILED
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
    default:
      return state;
  }
};

export default posts;