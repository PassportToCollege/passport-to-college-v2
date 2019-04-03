import iAppState from "../imodels/iAppState";
import iAction from"../imodels/iAction";
import Post from "../models/Post";

import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";

const PostsActions = ActionTypes.Posts;

const posts = (state : iAppState["Posts"] = initialState.Posts, action : iAction) : iAppState["Posts"] => {
  switch (action.type) {
    case PostsActions.GettingPosts:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        postsGetFailed: false
      });
    case PostsActions.GotPosts:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        postsGetFailed: false,
        posts: <Post[]>action.posts
      });
    case PostsActions.GettingPostsFailed:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: false,
        postsGetFailed: true,
        error: action.error
      });
    case PostsActions.GettingMostRecentPosts:
      return Object.assign({}, state, {
        gettingMostRecent: true,
        gotMostRecent: false,
        mostRecentGetFailed: false
      });
    case PostsActions.GotMostRecentPosts:
      return Object.assign({}, state, {
        gettingMostRecent: false,
        gotMostRecent: true,
        mostRecentGetFailed: false,
        posts: action.posts
      });
    case PostsActions.GettingMostRecentPostsFailed:
      return Object.assign({}, state, {
        gettingMostRecent: false,
        gotMostRecent: false,
        mostRecentGetFailed: true,
        error: action.error
      });
    case PostsActions.PaginatingPosts:
      return Object.assign({}, state, {
        paginatingPosts: true,
        paginationDone: false,
        paginationFailed: false,
        page: action.page
      });
    case PostsActions.PaginatedPosts:
      return Object.assign({}, state, {
        paginatingPosts: false,
        paginationDone: true,
        paginationFailed: false,
        page: action.page,
        posts: [...<Post[]>state.posts, ...<Post[]>action.posts]
      });
    case PostsActions.PaginatingPostFailed:
      return Object.assign({}, state, {
        paginatingPosts: false,
        paginationDone: false,
        paginationFailed: true,
        page: action.page,
        error: action.error
      });
    case PostsActions.GettingMostRecentPosts_ByCategory:
      return Object.assign({}, state, {
        gettingMostRecentByCategory: true,
        gotMostRecentByCategory: false,
        mostRecentGetByCategoryGetFailed: false,
        categories: action.categories
      });
    case PostsActions.GotMostRecentPosts_ByCategory:
      return Object.assign({}, state, {
        gettingMostRecentByCategory: false,
        gotMostRecentByCategory: true,
        mostRecentGetByCategoryGetFailed: false,
        categories: action.categories,
        posts: action.posts
      });
    case PostsActions.GettingMostRecentPostsFailed_ByCategory:
      return Object.assign({}, state, {
        gettingMostRecentByCategory: false,
        gotMostRecentByCategory: false,
        mostRecentGetByCategoryGetFailed: true,
        categories: action.categories,
        error: action.error
      });
    case PostsActions.GettingAccomplishments:
      return Object.assign({}, state, {
        gettingAccomplishmentsByUser: true,
        gotAccomplishmentsByUser: false,
        failedToGetAccomplishmentsByUser: false,
        student: action.student
      });
    case PostsActions.GettingAccomplishmentsFailed:
      return Object.assign({}, state, {
        gettingAccomplishmentsByUser: false,
        gotAccomplishmentsByUser: false,
        failedToGetAccomplishmentsByUser: true,
        student: action.student,
        error: action.error
      });
    case PostsActions.GotAccomplishments:
      return Object.assign({}, state, {
        gettingAccomplishmentsByUser: false,
        gotAccomplishmentsByUser: true,
        failedToGetAccomplishmentsByUser: false,
        student: action.student,
        posts: action.posts
      });
    default:
      return state;
  }
};

export default posts;