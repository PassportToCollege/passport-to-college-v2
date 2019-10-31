import { Action } from '..';
import { Comment as _ } from '../actionTypes';
import { CommentsState } from '../../imodels/iAppState';
import { Dispatch } from 'react';
import Comment from '../../models/Comment';
import Reply from '../../models/Reply';
import Post from '../../models/Post';
import { db } from '../../utils/firebase';
import { doUpdateConversationsCount } from '../postActions';
import { PostUpdateType } from '../../imodels/iPost';
import { 
  creatingComment, 
  createdComment, 
  creatingCommentFailed, 
  gettingComment, 
  gotComment, 
  gettingCommentFailed, 
  gettingComments, 
  gotComments, 
  gettingCommentsFailed, 
  gettingConversations, 
  gettingConversationsFailed, 
  gotConversations, 
  gettingReplies,
  gettingRepliesFailed,
  gotReplies,
  gettingReply,
  gotReply,
  gettingReplyFailed,
  updatingComment,
  updatedComment,
  updatingCommentFailed,
  deletingComment,
  deletedComment,
  deletingCommentFailed,
  updatedCommentLocal,
  safelyDeletingComment,
  safelyDeletedComment,
  safelyDeletingCommentFailed, 
} from './actions';
import iComment from '../../imodels/iComment';

const getCommentsFromSnapshot = (snapshots: firebase.firestore.QuerySnapshot): Comment[] => {
  const comments: Comment[] = [];

  snapshots.forEach((snapshot: firebase.firestore.QueryDocumentSnapshot) => {
    const commentData = snapshot.data();

    comments.push(new Comment(
      commentData.User,
      commentData.Post,
      commentData.message.html,
      commentData
    ));
  });

  return comments;
};

const getRepliesFromSnapshot = (snapshots: firebase.firestore.QuerySnapshot): Reply[] => {
  const replies: Reply[] = [];

  snapshots.forEach((snapshot: firebase.firestore.QueryDocumentSnapshot) => {
    const commentData = snapshot.data();

    replies.push(new Reply(
      commentData.User,
      commentData.Post,
      commentData.parent,
      commentData.message.html,
      commentData
    ));
  });

  return replies;
};

export const doCreateComment = (
  dispatch: Dispatch<Action<_, CommentsState>>,
  comment: Comment
  ) => {
    dispatch(creatingComment());
    
    db.collection('comments')
      .add(comment.getData())
      .then(() => {
        dispatch(createdComment());
      })
      .catch((error: Error) => {
        dispatch(creatingCommentFailed(error));
      });
};

export const doGetComment = (
  dispatch: Dispatch<Action<_, CommentsState>>,
  id: string) => {
    dispatch(gettingComment());

    db.collection('comments')
      .doc(id)
      .get()
      .then((snapshot: firebase.firestore.DocumentSnapshot) => {
        if (snapshot.exists) {
          const commentData = snapshot.data();
          const comment = commentData as Comment;

          dispatch(gotComment(comment));
        } else {
          dispatch(gettingCommentFailed(new Error('no comment found')));
        }
      })
      .catch((error: Error) => {
        dispatch(gettingCommentFailed(error));
      });
};

export const doGetComments = (
  dispatch: Dispatch<Action<_, CommentsState>>,
  post: Post, 
  page: number = 1) => {
    dispatch(gettingComments());

    if (page === 1) {
      db.collection('comments')
        .where('post', '==', post.id)
        .where('isConversation', '==', false)
        .orderBy('postedOn', 'desc')
        .limit(5)
        .get()
        .then((snapshots: firebase.firestore.QuerySnapshot) => {
          if (snapshots.empty) {
            dispatch(gettingCommentFailed(new Error('no comments found')));
          } else {
            const comments = getCommentsFromSnapshot(snapshots);
            dispatch(gotComments(page, comments));
          }
        })
        .catch((error: Error) => {
          dispatch(gettingCommentsFailed(error));
        });
    } else {
      db.collection('comments')
        .where('post', '==', post)
        .where('isConversation', '==', false)
        .orderBy('postedOn', 'desc')
        .limit(5)
        .get()
        .then((tempSnapshots: firebase.firestore.QuerySnapshot) => {
          const lv = tempSnapshots.docs[tempSnapshots.docs.length - 1];
  
          db.collection('comments')
            .where('post', '==', post)
            .where('isConversation', '==', true)
            .orderBy('postedOn', 'desc')
            .startAfter(lv)
            .get()
            .then((snapshots: firebase.firestore.QuerySnapshot) => {
              if (snapshots.empty) {
                dispatch(gettingCommentFailed(new Error('no comments found')));
              } else {
                const comments = getCommentsFromSnapshot(snapshots);
                dispatch(gotComments(page, comments));
              }
            })
            .catch((error: Error) => {
              dispatch(gettingCommentsFailed(error));
            });
        });
    }
};

export const doGetConversations = (
  dispatch: Dispatch<Action<_, CommentsState>>,
  parent: string) => {
    dispatch(gettingConversations());

    db.collection('comments')
      .where('post', '==', parent)
      .where('isConversation', '==', true)
      .orderBy('postedOn', 'desc')
      .get()
      .then((snapshots: firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty) {
          dispatch(gettingConversationsFailed(new Error('no conversations found')));
        } else {
          const conversations: Comment[] = getCommentsFromSnapshot(snapshots);
          dispatch(gotConversations(conversations));
        }

      })
      .catch((error: Error) => {
        dispatch(gettingConversationsFailed(error));
      });
};

export const doGetReplies = (
  dispatch: Dispatch<Action<_, CommentsState>>,
  parent: string, 
  page: number = 1) => {
    dispatch(gettingReplies());

    if (page === 1) {
      db.collection('comments')
        .where('parent', '==', parent)
        .orderBy('postedOn', 'desc')
        .limit(5)
        .get()
        .then((snapshots: firebase.firestore.QuerySnapshot) => {
          if (snapshots.empty) {
            dispatch(gettingRepliesFailed(new Error('no replies found')));
          } else {
            const replies: Reply[] = getRepliesFromSnapshot(snapshots);
            dispatch(gotReplies(page, parent, replies));
          }
        })
        .catch((error: Error) => {
          dispatch(gettingRepliesFailed(error));
        });
    } else if (page === 2) {
      db.collection('comments')
        .where('parent', '==', parent)
        .orderBy('postedOn', 'desc')
        .limit(5)
        .get()
        .then((tempSnapshots: firebase.firestore.QuerySnapshot) => {
          const lv = tempSnapshots.docs[tempSnapshots.docs.length - 1];

          db.collection('comments')
            .where('parent', '==', parent)
            .orderBy('postedOn', 'desc')
            .startAfter(lv)
            .get()
            .then((snapshots: firebase.firestore.QuerySnapshot) => {
              if (snapshots.empty) {
                dispatch(gettingRepliesFailed(new Error('no replies found')));
              } else {
                const replies: Reply[] = getRepliesFromSnapshot(snapshots);
                dispatch(gotReplies(page, parent, replies));
              }
            })
            .catch((error: Error) => {
              dispatch(gettingRepliesFailed(error));
            });
        });
    }
};

export const doGetReply = (
  dispatch: Dispatch<Action<_, CommentsState>>,
  replyId: string) => {
    dispatch(gettingReply());

    db.collection('comments')
      .doc(replyId)
      .get()
      .then((snapshot: firebase.firestore.DocumentSnapshot) => {
        if (snapshot.exists) {
          const replyData = snapshot.data();
          const reply = new Reply(
            replyData!.User,
            replyData!.Post,
            replyData!.parent,
            replyData!.message
          );

          dispatch(gotReply(reply));
        } else {
          dispatch(gettingReplyFailed(new Error('no reply found')));
        }
      })
      .catch((error: Error) => {
        dispatch(gettingReplyFailed(error));
      });
};

export const doUpdateComment = (
  dispatch: Dispatch<Action<_, CommentsState>>,
  comment: Comment, 
  newData: Comment) => {
    dispatch(updatingComment());

    db.collection('comments')
      .doc(comment.id)
      .update(newData)
      .then(() => {
        dispatch(updatedComment());
      })
      .catch((error: Error) => {
        dispatch(updatingCommentFailed(error));
      });
};

const deleteComment = (
  dispatch: Dispatch<Action<_, CommentsState>>,
  conversationRef: firebase.firestore.DocumentReference,
  comment: Comment,
  force: boolean = false) => {
  db.collection('comments')
    .where('parent', '==', comment.id)
    .get()
    .then((snapshots: firebase.firestore.QuerySnapshot) => {
      if (snapshots.empty) {
        if (force) {
          conversationRef.delete().then(() => {
            dispatch(doUpdateConversationsCount(PostUpdateType.Decrease, comment));
            dispatch(deletedComment());
          }).catch((error: Error) => {
            dispatch(deletingCommentFailed(error));
          });
        } else {
          return dispatch(deletingCommentFailed(new Error('no children found')));
        }
      } else {
        const batch = db.batch();
        batch.delete(conversationRef);

        snapshots.forEach((snapshot: firebase.firestore.QueryDocumentSnapshot) => {
          const ref = db.collection('comments').doc(snapshot.id);
          batch.delete(ref);
        });

        batch
          .commit().then(() => {
            dispatch(doUpdateConversationsCount(PostUpdateType.Decrease, comment));
            dispatch(deletedComment());
          })
          .catch((error: Error) => {
            dispatch(deletingCommentFailed(error));
          });
      }
    })
    .catch((error: Error) => {
      dispatch(deletingCommentFailed(error));
    });
};

const deleteReply = (
  dispatch: Dispatch<Action<_, CommentsState>>,
  commentRef: firebase.firestore.DocumentReference,
  comment: Reply) => {
  db.collection('comments')
    .doc((comment as Reply).parent.id)
    .get()
    .then((snapshot: firebase.firestore.DocumentSnapshot) => {
      if (snapshot.exists) {
        const parentData = snapshot.data() as iComment;
        const parent = new Comment(parentData.User, parentData.Post as Post, parentData.message.html, parentData);

        const { replies } = parent;

        commentRef.delete().then(() => {
          if (replies && replies.length - 1 === 0) {
            parent.hasReplies = false;
          }

          dispatch(updatedCommentLocal(parent));

          dispatch(deletedComment());
        }).catch((error: Error) => {
          dispatch(deletingCommentFailed(error));
        });
      }
    });
};

export const doDeleteComment = (
  dispatch: Dispatch<Action<_, CommentsState>>,
  comment: Comment | Reply, 
  force: boolean = false) => {
    dispatch(deletingComment());

    if (comment.isConversation) {
      const conversationRef = db.collection('comments').doc(comment.id);

      if (comment.hasReplies) {
        deleteComment(dispatch, conversationRef, comment, force);
      } else {
        conversationRef.delete().then(() => {
          dispatch(doUpdateConversationsCount(PostUpdateType.Decrease, comment));
          dispatch(deletedComment());
        }).catch((error: Error) => {
          dispatch(deletingCommentFailed(error));
        });
      }
    } else {
      const commentRef = db.collection('comments').doc(comment.id);
      deleteReply(dispatch, commentRef, comment as Reply);
    }
};

export const doDeleteCommentSafe = (
  dispatch: Dispatch<Action<_, CommentsState>>,
  comment: Comment | Reply, 
  isDeleted: boolean = false) => {
    dispatch(safelyDeletingComment());

    return db.collection('comments')
      .doc(comment.id)
      .update({ isDeleted })
      .then(() => {
        comment.isDeleted = isDeleted;
        dispatch(safelyDeletedComment());
      })
      .catch((error: Error) => {
        dispatch(safelyDeletingCommentFailed(error));
      });
};