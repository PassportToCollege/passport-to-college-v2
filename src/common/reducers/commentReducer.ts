import iAppState from "../imodels/iAppState";
import iAction from "../imodels/iAction";
import { iStringReplyListPair } from "../imodels/iObjectTypes";
import Comment from "../models/Comment";

import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";

const CommentActions = ActionTypes.Comment;

const comments = (state : iAppState["Comments"] = initialState.Comments, action : iAction) : iAppState["Comments"] => {
  switch (action.type) {
    case CommentActions.CreatingComment:
      return Object.assign({}, state, {
        creatingComment: true,
        createdComment: false,
        failedToCreateComment: false
      });
    case CommentActions.CreatingCommentFailed:
      return Object.assign({}, state, {
        creatingComment: false,
        createdComment: false,
        failedToCreateComment: true,
        error: action.error
      });
    case CommentActions.CreatedComment:
      return Object.assign({}, state, {
        creatingComment: false,
        createdComment: true,
        failedToCreateComment: false,
        changedComment: <Comment>action.changedComment,
        isReply: action.isReply
      });
    case CommentActions.GettingComments:
      return Object.assign({}, state, {
        gettingComments: true,
        gotComments: false,
        failedToGetComments: false
      });
    case CommentActions.GettingCommentsFailed:
      return Object.assign({}, state, {
        gettingComments: false,
        gotComments: false,
        failedToGetComments: true,
        error: action.error
      });
    case CommentActions.GotComments:
      return Object.assign({}, state, {
        gettingComments: false,
        gotComments: true,
        failedToGetComments: false,
        comments: [...<Comment[]>state.comments, ...<Comment[]>action.comments]
      });
    case CommentActions.GettingComment:
      return Object.assign({}, state, {
        gettingComment: true,
        gotComment: false,
        failedToGetComment: false
      });
    case CommentActions.GettingCommentFailed:
      return Object.assign({}, state, {
        gettingComment: false,
        gotComment: false,
        failedToGetComment: true,
        error: action.error
      });
    case CommentActions.GotComment:
      return Object.assign({}, state, {
        gettingComment: false,
        gotComment: true,
        failedToGetComment: false,
        comment: <Comment>action.comment
      });
    case CommentActions.GettingReplies:
      return Object.assign({}, state, {
        gettingReplies: true,
        gotReplies: false,
        failedToGetReplies: false,
        parent: action.parent
      });
    case CommentActions.GettingRepliesFailed:
      return Object.assign({}, state, {
        gettingReplies: false,
        gotReplies: false,
        failedToGetReplies: true,
        parent: action.parent,
        error: action.error
      });
    case CommentActions.GotReplies:
      action.parent = <string>action.parent;

      return Object.assign({}, state, {
        gettingReplies: false,
        gotReplies: true,
        failedToGetReplies: false,
        parent: action.parent,
        replies: (action.page === 1 || action.page === -1) ? 
          Object.assign({}, state.replies, {
            [`${action.parent}`]: action.replies
          }) : Object.assign({}, state.replies, {
            [`${action.parent}`]: action.replies
          })
      });
    case CommentActions.GettingReply:
      return Object.assign({}, state, {
        gettingReply: true,
        gotReply: false,
        failedToGetReply: false
      });
    case CommentActions.GettingReplyFailed:
      return Object.assign({}, state, {
        gettingReply: false,
        gotReply: false,
        failedToGetReply: true,
        error: action.error
      });
    case CommentActions.GotReply:
      return Object.assign({}, state, {
        gettingReply: false,
        gotReply: true,
        failedToGetReply: false,
        reply: action.reply
      });
    case CommentActions.UpdatingComment:
      return Object.assign({}, state, {
        updatingComment: true,
        updatedComment: false,
        failedToUpdateComment: false
      });
    case CommentActions.UpdatingCommentFailed:
      return Object.assign({}, state, {
        updatingComment: false,
        updatedComment: false,
        failedToUpdateComment: true,
        error: action.error
      });
    case CommentActions.UpdatedComment:
      return Object.assign({}, state, {
        updatingComment: false,
        updatedComment: true,
        failedToUpdateComment: false
      });
    case CommentActions.UpdateCommentLocal:
      return Object.assign({}, state, {
        updatedCommentLocal: true,
        nComment: action.nComment
      });
    case CommentActions.DeletingComment:
      return Object.assign({}, state, {
        deletingComment: true,
        deletedComment: false,
        failedToDeleteComment: false,
      });
    case CommentActions.DeletingCommentFailed:
      return Object.assign({}, state, {
        deletingComment: false,
        deletedComment: false,
        failedToDeleteComment: true,
        error: action.error
      });
    case CommentActions.SafelyDeletingComment:
      return Object.assign({}, state, {
        safelyDeletingComment: true,
        safelyDeletedComment: false,
        failedToSafelyDeleteComment: false
      });
    case CommentActions.SafelyDeletingCommentFailed:
      return Object.assign({}, state, {
        safelyDeletingComment: false,
        safelyDeletedComment: true,
        failedToSafelyDeleteComment: false,
        error: action.error,
      });
    case CommentActions.SafelyDeletedComment:
      return Object.assign({}, state, {
        safelyDeletingComment: false,
        safelyDeletedComment: true,
        failedToSafelyDeleteComment: false,
        changedComment: action.comment,
      });
    case CommentActions.DeletedComment:
      return Object.assign({}, state, {
        deletingComment: false,
        deletedComment: true,
        failedToDeleteComment: false,
        changedComment: action.comment
      });
    case CommentActions.GettingConversations:
      return Object.assign({}, state, {
        gettingConversations: true,
        gotConversations: false,
        failedToGetConversations: false,
        post: action.parent
      });
    case CommentActions.GettingConversationsFailed:
      return Object.assign({}, state, {
        gettingConversations: false,
        gotConversations: false,
        failedToGetConversations: true,
        error: action.error,
        post: action.parent
      });
    case CommentActions.GotConversations:
      return Object.assign({}, state, {
        gettingConversations: false,
        gotConversations: true,
        failedToGetConversations: false,
        conversations: action.conversations
      });
    default:
      return state;
  }
}

export default comments;