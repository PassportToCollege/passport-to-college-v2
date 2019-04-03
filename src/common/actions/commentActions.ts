import iAction from "../imodels/iAction";
import iError from "../imodels/iError";
import iContentEditable from "../imodels/iContentEditable";
import iComment from "../imodels/iComment";
import iReply from "../imodels/iReply";
import Comment from "../models/Comment";
import Reply from "../models/Reply";
import Post from "../models/Post";
import User from "../models/User";

import ActionTypes from "../actions/actionTypes";
import { db, storage } from "../utils/firebase";
import { doUpdateConversationsCount } from "./postActions";
import { PostUpdateType } from "../imodels/iPost";

const Console = console;
const CommentActions = ActionTypes.Comment;

// Create actions
export const createCommentInitiated = () : iAction => {
  return {
    type: CommentActions.CreatingComment
  };
}; 

export const createCommentFailed = (error : iError) : iAction => {
  return {
    type: CommentActions.CreatingCommentFailed,
    error
  };
};

export const commentCreated = (id : string, isReply : boolean = false) : iAction => {
  return {
    type: CommentActions.CreatedComment,
    id, isReply
  };
};

export const doCommentCreate = (user : User, content : iContentEditable, post : Post, commentData : any = {}) => {
  return (dispatch : any) => {
    dispatch(createCommentInitiated());

    let comment = commentData.isReply ? 
      new Reply(user, post, commentData.Comment, content) :
      new Comment(user, post, content);

    return db.collection("comments")
      .add(comment.getData())
      .then((commentSnapshot : firebase.firestore.DocumentSnapshot) => {
        if (commentData.isReply) 
        {
          const localComment : Comment = <Comment>commentData.Comment;

          if (!localComment.hasReplies)
          {
            comment = <Comment>comment;
            dispatch(doUpdateCommentLocal(commentData.Comment, {  
              hasReplies: true,
              replies: [localComment.id],
              ...comment.getData()
            }));
          }
        }

        if (comment.isConversation)
          dispatch(doUpdateConversationsCount(PostUpdateType.Increase, <Comment>comment));

        dispatch(commentCreated(commentSnapshot.id, commentData.isReply || false));
      })
      .catch((error : iError) => {
        dispatch(createCommentFailed(error));
      });
  }
};

// GET actions
export const getCommentInitiated = () : iAction => {
  return {
    type: CommentActions.GettingComment
  };
};

export const getCommentFailed = (error : iError) : iAction => {
  return {
    type: CommentActions.GettingCommentFailed,
    error
  };
};

export const getCommentDone = (comment : Comment) :iAction => {
  return {
    type: CommentActions.GotComment,
    comment
  };
};

export const doGetComment = (comment : Comment) : any => {
  return (dispatch : any) => {
    dispatch(getCommentInitiated());

    return db.collection("comments")
      .doc(comment.getData())
      .get()
      .then((snapshot : firebase.firestore.DocumentSnapshot) => {
        if (snapshot.exists) {
          let commentData = snapshot.data();
          let comment = <Comment>commentData;

          if (storage && comment.User.hasProfilePicture) {
            return comment.User.getProfilePicture()
              .then(() => {
                dispatch(getCommentDone(comment));
              })
              .catch((error : iError) => {
                console.log(error);
                dispatch(getCommentDone(comment));
              });
          }
          
          return dispatch(getCommentDone(comment));
        }

        dispatch(getCommentFailed({ message: "no comment found" }));
      })
      .catch((error : iError) => {
        dispatch(getCommentFailed(error));
      });
  }
}

export const getCommentsInitiated = () : iAction => {
  return {
    type: CommentActions.GettingComments
  };
};

export const getCommentsFailed = (error : iError) : iAction => {
  return {
    type: CommentActions.GettingCommentsFailed,
    error
  };
};

export const getCommentsDone = (comments : Comment[], page : number) : iAction => {
  return {
    type: CommentActions.GotComments,
    comments, page
  };
};

export const doGetComments = (post : Post, page : number = 1) : any => {
  return (dispatch : any) => {
    dispatch(getCommentsInitiated());
    
    if (page === 1) {
      return db.collection("comments")
        .where("post", "==", post.id)
        .where("isConversation", "==", true)
        .orderBy("postedOn", "desc")
        .limit(5)
        .get()
        .then((snapshots : firebase.firestore.QuerySnapshot) => {
          if (snapshots.empty)
            return dispatch(getCommentsFailed({ message: "no comments found" }));
          
          const comments = getCommentsFromSnapshot(snapshots);
          dispatch(getCommentsDone(comments, page));
        })
        .catch((error : iError) => {
          dispatch(getCommentsFailed(error));
        });
    }

    db.collection("comments")
    .where("post", "==", post)
    .where("isConversation", "==", true)
    .orderBy("postedOn", "desc")
    .limit(5)
    .get()
      .then((tempSnapshots: firebase.firestore.QuerySnapshot) => {
      const lv = tempSnapshots.docs[tempSnapshots.docs.length - 1];

      return db.collection("comments")
        .where("post", "==", post)
        .where("isConversation", "==", true)
        .orderBy("postedOn", "desc")
        .startAfter(lv)
        .get()
        .then((snapshots : firebase.firestore.QuerySnapshot) => {
          if (snapshots.empty)
            return dispatch(getCommentsFailed({ message: "no comments found" }));
          
          const comments = getCommentsFromSnapshot(snapshots);
          dispatch(getCommentsDone(comments, page));
        })
        .catch((error : iError) => {
          dispatch(getCommentsFailed(error));
        });
    });
  };
};

export const getConversationsInitiated = (parent : string) : iAction => {
  return {
    type: CommentActions.GettingConversations,
    parent
  };
};

export const getConversationsFailed = (error : iError, parent : string) : iAction => {
  return {
    type: CommentActions.GettingConversationsFailed,
    error, parent
  };
};

export const gotConversations = (conversations : Comment[]) : iAction => {
  return {
    type: CommentActions.GotConversations,
    conversations
  };
};

export const doGetConversations = (parent : string) : any => {
  return (dispatch : any) => {
    dispatch(getConversationsInitiated(parent));

    return db.collection("comments")
      .where("post", "==", parent)
      .where("isConversation", "==", true)
      .orderBy("postedOn", "desc")
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty)
          return dispatch(getConversationsFailed({ message: "no conversations found" }, parent));

        const conversations : Comment[] = getCommentsFromSnapshot(snapshots);
        dispatch(gotConversations(conversations));
      })
      .catch((error : iError) => {
        Console.log(error);
        dispatch(getConversationsFailed(error, parent));
      })
  }
}

export const getRepliesInitiated = (parent : string) : iAction => {
  return {
    type: CommentActions.GettingReplies,
    parent
  };
};

export const getRepliesFailed = (error : iError, parent : string) : iAction => {
  return {
    type: CommentActions.GettingRepliesFailed,
    error, parent
  };
};

export const gotReplies = (parent : string, replies : Reply[], page : number = 1) : iAction => {
  return {
    type: CommentActions.GotReplies,
    replies, parent, page
  };
};

export const doGetReplies = (parent : string, page : number = 1) : any => {
  return (dispatch : any) => {
    dispatch(getRepliesInitiated(parent));

    if (page === 1) {
      return db.collection("comments")
        .where("parent", "==", parent)
        .orderBy("postedOn", "desc")
        .limit(5)
        .get()
        .then((snapshots : firebase.firestore.QuerySnapshot) => {
          if (snapshots.empty) {
            return dispatch(getRepliesFailed({ message: "no replies found" }, parent));
          }

          const replies : Reply[] = getRepliesFromSnapshot(snapshots);
          dispatch(gotReplies(parent, replies, page));
        })
        .catch((error : iError) => {
          dispatch(getRepliesFailed(error, parent));
        })
    } else if (page === 2) {
      return db.collection("comments")
       .where("parent", "==", parent)
       .orderBy("postedOn", "desc")
       .limit(5)
       .get()
       .then((tempSnapshots : firebase.firestore.QuerySnapshot) => {
         const lv = tempSnapshots.docs[tempSnapshots.docs.length - 1];
   
         return db.collection("comments")
           .where("parent", "==", parent)
           .orderBy("postedOn", "desc")
           .startAfter(lv)
           .get()
           .then((snapshots : firebase.firestore.QuerySnapshot) => {
             if (snapshots.empty) {
               return dispatch(getRepliesFailed({ message: "no replies found" }, parent));
             }
   
             const replies: Reply[] = getRepliesFromSnapshot(snapshots);
             dispatch(gotReplies(parent, replies, page));
           })
           .catch((error : iError) => {
             dispatch(getRepliesFailed(error, parent));
           });
       });
    }

    db.collection("comments")
      .where("parent", "==", parent)
      .orderBy("postedOn", "desc")
      .limit(5)
      .get()
      .then((snapshots: firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty) {
          return dispatch(getRepliesFailed({ message: "no replies found" }, parent));
        }

        const replies: Reply[] = getRepliesFromSnapshot(snapshots);
        dispatch(gotReplies(parent, replies, page));
      })
      .catch((error: iError) => {
        dispatch(getRepliesFailed(error, parent));
      })
  }
};

export const getReplyInitiated = (replyId : string) : iAction => {
  return {
    type: CommentActions.GettingReply,
    id: replyId
  };
};

export const getReplyFailed = (error : iError) : iAction => {
  return {
    type: CommentActions.GettingReplyFailed,
    error
  };
};

export const gotReply = (reply : Reply) : iAction => {
  return {
    type: CommentActions.GotReply,
    reply
  };
};

export const doGetReply = (replyId : string) : any => {
  return (dispatch : any) => {
    dispatch(getReplyInitiated(replyId));

    return db.collection("comments")
    .doc(replyId)
    .get()
    .then((snapshot : firebase.firestore.QueryDocumentSnapshot) => {
      if (snapshot.exists) {
        let replyData = snapshot.data();
        const reply = new Reply(
          replyData.User,
          replyData.Post,
          replyData.parent,
          replyData.message
        );
        
        return dispatch(gotReply(reply));
      }

      dispatch(getReplyFailed({ message: "no reply found" }));
    })
    .catch((error : iError) => {
      dispatch(getReplyFailed(error));
    })
  }
};

// UPDATE actions
export const updateCommentInitiated = (comment : Comment, newData : iComment) : iAction => {
  return {
    type: CommentActions.UpdatingComment,
    comment,
    data: newData
  };
};

export const updateCommentFailed = (error : iError, comment : Comment, newData : iComment) : iAction => {
  return {
    type: CommentActions.UpdatingCommentFailed,
    error, comment,
    data: newData
  };
};

export const commentUpdated = (newData : iComment) : iAction => {
  return {
    type: CommentActions.UpdatedComment,
    data: newData
  };
};

export const doUpdateComment = (comment : Comment, newData : iComment) : any => {
  return (dispatch : any) => {
    dispatch(updateCommentInitiated(comment, newData));

    return db.collection("comments")
      .doc(comment.id)
      .update(newData, { merge: true })
      .then(() => {
        dispatch(commentUpdated(newData));
      })
      .catch((error : iError) => {
        dispatch(updateCommentFailed(error, comment, newData));
      })
  };
};

export const doUpdateCommentLocal = (comment : Comment, newData : iComment) : iAction => {
  return {
    type: CommentActions.UpdateCommentLocal,
    nComment: comment.update(newData)
  };
};

// DELETE actions
export const deleteCommentInitiated = (comment : Comment) : iAction => {
  return {
    type: CommentActions.DeletingComment,
    comment
  };
};

export const deleteCommentFailed = (error: iError, comment : Comment) : iAction => {
  return {
    type: CommentActions.DeletingCommentFailed,
    error, comment
  };
};

export const commentDeleted = (comment : Comment) : iAction => {
  return {
    type: CommentActions.DeletedComment,
    comment
  };
};

export const doDeleteComment = (comment : Comment & Reply, force : boolean = false) : any => {
  return (dispatch : any) => {
    dispatch(deleteCommentInitiated(comment));

    if (comment.isConversation) {
      const convoRef = db.collection("comments").doc(comment.id);

      if (comment.hasReplies) {
        return db.collection("comments")
          .where("parent", "==", comment.id)
          .get()
          .then((snapshots : firebase.firestore.QuerySnapshot) => {
            if (snapshots.empty) {
              if (force) {
                return convoRef.delete().then(() => {
                    dispatch(doUpdateConversationsCount(PostUpdateType.Decrease, comment));
                    dispatch(commentDeleted(comment));
                }).catch((error : iError) => {
                  Console.log(error);
                  dispatch(deleteCommentFailed(error, comment));
                });
              }

              return dispatch(deleteCommentFailed({ message: "no children found" }, comment));
            }

            let batch = db.batch();
            batch.delete(convoRef);

            snapshots.forEach(snapshot => {
              let ref = db.collection("comments").doc(snapshot.id);
              batch.delete(ref);
            });

            batch.commit().then(() => {
              dispatch(doUpdateConversationsCount(PostUpdateType.Decrease, comment));
              dispatch(commentDeleted(comment));
            })
            .catch((error : iError) => {
              Console.log(error);
              dispatch(deleteCommentFailed(error, comment));
            });
          })
          .catch((error : iError) => {
            Console.log(error);
            dispatch(deleteCommentFailed(error, comment));
          })
      }

      return convoRef.delete().then(() => {
        dispatch(doUpdateConversationsCount(PostUpdateType.Decrease, comment));
        dispatch(commentDeleted(comment));
      }).catch((error : iError) => {
        Console.log(error);
        dispatch(deleteCommentFailed(error, comment));
      });
    }

    const commentRef = db.collection("comments").doc(comment.id);
    db.collection("comments")
      .doc(comment.parent)
      .get()
      .then((snapshot : firebase.firestore.QueryDocumentSnapshot) => {
        let parentData = snapshot.data();
        const parent = new Comment(parentData.User, parentData.Post, parentData.message.html, parentData);

        let { replies, hasReplies } = parent;
        replies = <Array<string>>replies;

        commentRef.delete().then(() => {
          if (replies && replies.length - 1 === 0)
            hasReplies = false;
          
          dispatch(doUpdateCommentLocal(parent, {
            hasReplies, replies, ...comment.getData()
          }));

          dispatch(commentDeleted(comment));
        }).catch((error : iError) => {
          Console.log(error);
          dispatch(deleteCommentFailed(error, comment));
        });
      })
      .catch((error : iError) => {
        Console.log(error);
      })
  }
}

export const safeDeleteInitiated = (comment : Comment & Reply) : iAction => {
  return {
    type: CommentActions.SafelyDeletingComment,
    comment
  };
};

export const safeDeleteFailed = (error : iError, comment : Comment & Reply) : iAction => {
  return {
    type: CommentActions.SafelyDeletingCommentFailed,
    error, comment
  };
};

export const safelyDeleted = (comment : Comment & Reply) : iAction => {
  return {
    type: CommentActions.SafelyDeletedComment,
    comment
  };
};

export const doDeleteCommentSafe = (comment : Comment & Reply, undelete : boolean = false) : any => {
  return (dispatch : any) => {
    dispatch(safeDeleteInitiated(comment));
    const isDeleted = !!undelete;

    return db.collection("comments")
      .doc(comment.id)
      .update({ isDeleted })
      .then(() => {
        comment.isDeleted = isDeleted;
        dispatch(safelyDeleted(comment));
      })
      .catch((error : iError) => {
        Console.log(error);
        dispatch(safeDeleteFailed(error, comment));
      });
  };
};

const getCommentsFromSnapshot = (snapshots: firebase.firestore.QuerySnapshot): Comment[] => {
  let comments: Comment[] = [];

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
}

const getRepliesFromSnapshot = (snapshots: firebase.firestore.QuerySnapshot): Reply[] => {
  let replies: Reply[] = [];

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
}