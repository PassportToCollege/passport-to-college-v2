import { ActionCreator } from '..';
import { Comment as _ } from '../actionTypes';
import { CommentsState } from '../../imodels/iAppState';
import Comment from '../../models/Comment';
import Reply from '../../models/Reply';

export const creatingComment = () =>
  ActionCreator<_>(_.CreatingComment);

export const createdComment = () =>
  ActionCreator<_>(_.CreatedComment);

export const creatingCommentFailed = (error: Error) =>
  ActionCreator<_, CommentsState>(_.CreatingCommentFailed, { error });

export const gettingComment = () =>
  ActionCreator<_>(_.GettingComment);

export const gotComment = (comment: Comment) =>
  ActionCreator<_, CommentsState>(_.GotComment, { comment });

export const gettingCommentFailed = (error: Error) =>
  ActionCreator<_, CommentsState>(_.GettingCommentFailed, { error });

export const gettingComments = () =>
  ActionCreator<_>(_.GettingComments);

export const gotComments = (page: number, comments: Comment[]) =>
  ActionCreator<_, CommentsState>(_.GotComments, { page, comments });

export const gettingCommentsFailed = (error: Error) =>
  ActionCreator<_, CommentsState>(_.GettingCommentsFailed, { error });

export const gettingConversations = () =>
  ActionCreator<_>(_.GettingConversations);

export const gotConversations = (conversations: Comment[]) =>
  ActionCreator<_, CommentsState>(_.GotConversations, { conversations });

export const gettingConversationsFailed = (error: Error) =>
  ActionCreator<_, CommentsState>(_.GettingConversationsFailed, { error });

export const gettingReply = () =>
  ActionCreator<_>(_.GettingReply);

export const gotReply = (reply: Reply) =>
  ActionCreator<_, CommentsState>(_.GotReply, { reply });

export const gettingReplyFailed = (error: Error) =>
  ActionCreator<_, CommentsState>(_.GettingReplyFailed, { error });

export const gettingReplies = () =>
  ActionCreator<_>(_.GettingReplies);

export const gotReplies = (page: number, parent: string, replies: Reply[]) => {
  return ActionCreator<_, CommentsState>(_.GotReplies, {
    page,
    parent,
    replies: {
      [parent]: replies
    }
  });
};

export const gettingRepliesFailed = (error: Error) =>
  ActionCreator<_, CommentsState>(_.GettingRepliesFailed, { error });

export const updatingComment = () =>
  ActionCreator<_>(_.UpdatedComment);

export const updatedComment = () => 
  ActionCreator<_>(_.UpdatedComment);

export const updatedCommentLocal = (comment: Comment) =>
  ActionCreator<_, CommentsState>(_.UpdateCommentLocal, { comment });

export const updatingCommentFailed = (error: Error) =>
  ActionCreator<_, CommentsState>(_.UpdatingCommentFailed, { error });

export const deletingComment = () =>
  ActionCreator<_>(_.DeletingComment);

export const deletedComment = () =>
  ActionCreator<_>(_.DeletedComment);

export const deletingCommentFailed = (error: Error) =>
  ActionCreator<_, CommentsState>(_.DeletingCommentFailed, { error });

export const safelyDeletingComment = () =>
  ActionCreator<_>(_.SafelyDeletingComment);

export const safelyDeletedComment = () =>
  ActionCreator<_>(_.SafelyDeletedComment);

export const safelyDeletingCommentFailed = (error: Error) =>
  ActionCreator<_, CommentsState>(_.SafelyDeletingCommentFailed, { error });