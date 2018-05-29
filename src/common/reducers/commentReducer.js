import initialState from "./initialState";
import {
  CREATE_COMMENT_INITIATED,
  CREATE_COMMENT_FAILED,
  COMMENT_CREATED,
  GET_COMMENTS_INITIATED,
  GET_COMMENTS_FAILED,
  GET_COMMENTS_DONE
} from "../actions/actionTypes";

const comments = (state = initialState.comments, action) => {
  switch (action.type) {
    case CREATE_COMMENT_INITIATED:
      return Object.assign({}, state, {
        creatingComment: true,
        createdComment: false,
        failedToCreateComment: false
      });
    case CREATE_COMMENT_FAILED:
      return Object.assign({}, state, {
        creatingComment: false,
        createdComment: false,
        failedToCreateComment: true,
        error: action.error
      });
    case COMMENT_CREATED:
      return Object.assign({}, state, {
        creatingComment: false,
        createdComment: true,
        failedToCreateComment: false
      });
    case GET_COMMENTS_INITIATED:
      return Object.assign({}, state, {
        gettingComments: true,
        gotComments: false,
        failedToGetComments: false
      });
    case GET_COMMENTS_FAILED:
      return Object.assign({}, state, {
        gettingComments: false,
        gotComments: false,
        failedToGetComments: true,
        error: action.error,
        comments: null
      });
    case GET_COMMENTS_DONE:
      return Object.assign({}, state, {
        gettingComments: false,
        gotComments: true,
        failedToGetComments: false,
        comments: (action.page === 1) ? action.comments : state.comments.concat(action.comments)
      });
    default:
      return state;
  }
}

export default comments;