import initialState from "./initialState";
import {
  CREATE_COMMENT_INITIATED,
  CREATE_COMMENT_FAILED,
  COMMENT_CREATED,
  GET_COMMENTS_INITIATED,
  GET_COMMENTS_FAILED,
  GET_COMMENTS_DONE,
  GET_COMMENT_INITIATED,
  GET_COMMENT_FAILED,
  COMMENT_GET_DONE,
  GET_REPLIES_INITIATED,
  GET_REPLIES_FAILED,
  GET_REPLIES_DONE,
  GET_REPLY_INITIATED,
  GET_REPLY_FAILED,
  GET_REPLY_DONE
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
        failedToCreateComment: false,
        newCommentId: action.newCommentId
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
    case GET_COMMENT_INITIATED:
      return Object.assign({}, state, {
        gettingComment: true,
        gotComment: false,
        failedToGetComment: false
      });
    case GET_COMMENT_FAILED:
      return Object.assign({}, state, {
        gettingComment: false,
        gotComment: false,
        failedToGetComment: true,
        error: action.error
      });
    case COMMENT_GET_DONE:
      return Object.assign({}, state, {
        gettingComment: false,
        gotComment: true,
        failedToGetComment: false,
        comment: action.comment
      });
    case GET_REPLIES_INITIATED:
      return Object.assign({}, state, {
        gettingReplies: true,
        gotReplies: false,
        failedToGetReplies: false
      });
    case GET_REPLIES_FAILED:
      return Object.assign({}, state, {
        gettingReplies: false,
        gotReplies: false,
        failedToGetReplies: true,
        error: action.error
      });
    case GET_REPLIES_DONE:
      return Object.assign({}, state, {
        gettingReplies: false,
        gotReplies: true,
        failedToGetReplies: false,
        replies: (action.page === 1) ? Object.assign({}, state.replies, {
          [action.parent]: action.replies
        }) : Object.assign({}, state.replies, {
          [action.parent]: state.replies[action.parent].concat(action.replies)
        })
      });
    case GET_REPLY_INITIATED:
      return Object.assign({}, state, {
        gettingReply: true,
        gotReply: false,
        failedToGetReply: false
      });
    case GET_REPLY_FAILED:
      return Object.assign({}, state, {
        gettingReply: false,
        gotReply: false,
        failedToGetReply: true,
        error: action.error
      });
    case GET_REPLY_DONE:
      return Object.assign({}, state, {
        gettingReply: false,
        gotReply: true,
        failedToGetReply: false,
        reply: action.reply
      });
    default:
      return state;
  }
}

export default comments;