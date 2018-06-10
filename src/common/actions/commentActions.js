import { db, storage } from "../utils/firebase";
import { Comment, Reply } from "../utils";
import * as types from "./actionTypes";

// Create actions
export const createCommentInitiated = () => {
  return {
    type: types.CREATE_COMMENT_INITIATED
  };
};

export const createCommentFailed = error => {
  return {
    type: types.CREATE_COMMENT_FAILED,
    error
  };
};

export const commentCreated = (newCommentId, isReply = false) => {
  return {
    type: types.COMMENT_CREATED,
    newCommentId, isReply
  };
};

export const doCommentCreate = (user = {}, content = {}, post, options = {}) => {
  return dispatch => {
    dispatch(createCommentInitiated());

    const comment = options.isReply ? 
      new Reply(user, content, post, options.comment.id) :
      new Comment(user, content, post);

    return db.collection("comments")
      .add(comment.data)
      .then(comment => {
        if (options.isReply && !options.comment.hasReplies) {
          dispatch(doUpdateComment(options.comment.id, {  
            hasReplies: true
          }));
        }

        dispatch(commentCreated(comment.id, options.isReply || false));
      })
      .catch(error => {
        dispatch(createCommentFailed(error));
      });
  }
};

// GET actions
export const getCommentInitiated = () => {
  return {
    type: types.GET_COMMENT_INITIATED
  };
};

export const getCommentFailed = error => {
  return {
    type: types.GET_COMMENT_FAILED,
    error
  };
};

export const getCommentDone = comment => {
  return {
    type: types.COMMENT_GET_DONE,
    comment
  };
};

export const doGetComment = (comment, options = {}) => {
  return dispatch => {
    dispatch(getCommentInitiated());

    return db.collection("comments")
      .doc(comment)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          let comment = snapshot.data();
          comment.id = snapshot.id;

          if (storage) {
            return storage.ref("users/profile_images")
              .child(`${comment.user.uid}.png`)
              .getDownloadURL()
              .then(url => {
                comment.user.profilePicture = url;
                dispatch(getCommentDone(comment));
              })
              .catch(error => {
                console.log(error);
                dispatch(getCommentDone(comment));
              });
          }
          
          return dispatch(getCommentDone(comment));
        }

        dispatch(getCommentFailed({ message: "no comment found" }));
      })
      .catch(error => {
        dispatch(getCommentFailed(error));
      });
  }
}

export const getCommentsInitiated = () => {
  return {
    type: types.GET_COMMENTS_INITIATED
  };
};

export const getCommentsFailed = error => {
  return {
    type: types.GET_COMMENTS_FAILED,
    error
  };
};

export const getCommentsDone = (comments, page) => {
  return {
    type: types.GET_COMMENTS_DONE,
    comments, page
  };
};

export const doGetComments = (post, page = 1) => {
  return dispatch => {
    dispatch(getCommentsInitiated());
    
    if (page === 1) {
      return db.collection("comments")
        .where("post", "==", post)
        .where("isConversation", "==", true)
        .orderBy("postedOn", "desc")
        .limit(10)
        .get()
        .then(snapshots => {
          if (snapshots.empty)
            return dispatch(getCommentsFailed({ message: "no comments found" }));
          
          let comments = [];
          let ppPromises = [];

          snapshots.forEach(snapshot => {
            let comment = snapshot.data();
            comment.id = snapshot.id;

            if (storage && !comment.user.photo)
              ppPromises.push(storage.ref("users/profile_images").child(`${comment.user.uid}.png`).getDownloadURL());
            
            comments.push(comment);
          });

          if (storage) {
            return Promise.all(ppPromises).then(urls => {
              for (let comment of comments) {
                comment.user.profilePicture = urls.find(url => {
                    return url.indexOf(comment.user.uid) > -1;
                });
              }

              dispatch(getCommentsDone(comments, page));
            });
          }

          dispatch(getCommentsDone(comments, page));
        })
        .catch(error => {
          dispatch(getCommentsFailed(error));
        });
    }

     // TODO: get other comment pages
  };
};

export const getRepliesInitiated = () => {
  return {
    type: types.GET_REPLIES_INITIATED
  };
};

export const getRepliesFailed = error => {
  return {
    type: types.GET_REPLIES_FAILED,
    error
  };
};

export const gotReplies = (parent, replies, page) => {
  return {
    type: types.GET_REPLIES_DONE,
    replies, parent, page
  };
};

export const doGetReplies = (parent, page = 1) => {
  return dispatch => {
    dispatch(getRepliesInitiated());

    if (page === 1) {
      return db.collection("comments")
        .where("parent", "==", parent)
        .orderBy("postedOn", "desc")
        .limit(5)
        .get()
        .then(snapshots => {
          if (snapshots.empty) {
            return dispatch(getRepliesFailed({ message: "no replies found" }));
          }

          let replies = [];
          let ppPromises = [];

          snapshots.forEach(snapshot => {
            let reply = snapshot.data();
            reply.id = snapshot.id;

            if (storage && !reply.user.photo)
              ppPromises.push(storage.ref("users/profile_images").child(`${reply.user.uid}.png`).getDownloadURL());
            
            replies.push(reply);
          });

          if (storage) {
            return Promise.all(ppPromises).then(urls => {
              for (let reply of replies) {
                reply.user.profilePicture = urls.find(url => {
                    return url.indexOf(reply.user.uid) > -1;
                });
              }

              dispatch(gotReplies(parent, replies, page));
            });
          }

          dispatch(gotReplies(parent, replies, page));
        })
        .catch(error => {
          dispatch(getRepliesFailed(error));
        })
    }

   db.collection("comments")
    .where("parent", "==", parent)
    .orderBy("postedOn", "desc")
    .limit(5)
    .get()
    .then(tempSnapshots => {
      const lv = tempSnapshots.docs[tempSnapshots.docs.length - 1];

      return db.collection("comments")
        .where("parent", "==", parent)
        .orderBy("postedOn", "desc")
        .startAfter(lv)
        .get()
        .then(snapshots => {
          if (snapshots.empty) {
            return dispatch(getRepliesFailed({ message: "no replies found" }));
          }

          let replies = [];
          let ppPromises = [];

          snapshots.forEach(snapshot => {
            let reply = snapshot.data();
            reply.id = snapshot.id;

            if (storage && !reply.user.photo)
              ppPromises.push(storage.ref("users/profile_images").child(`${reply.user.uid}.png`).getDownloadURL());
            
            replies.push(reply);
          });

          if (storage) {
            return Promise.all(ppPromises).then(urls => {
              for (let reply of replies) {
                reply.user.profilePicture = urls.find(url => {
                    return url.indexOf(reply.user.uid) > -1;
                });
              }

              dispatch(gotReplies(parent, replies, page));
            });
          }

          dispatch(gotReplies(parent, replies, page));
        })
        .catch(error => {
          dispatch(getRepliesFailed(error));
        });
    });
  }
};

export const getReplyInitiated = () => {
  return {
    type: types.GET_REPLY_INITIATED
  };
};

export const getReplyFailed = error => {
  return {
    type: types.GET_REPLY_FAILED,
    error
  };
};

export const gotReply = (parent, reply) => {
  return {
    type: types.GET_REPLY_DONE,
    parent, reply
  };
};

export const doGetReply = (parent, reply) => {
  return dispatch => {
    dispatch(getReplyInitiated());

    return db.collection("comments")
    .doc(reply)
    .get()
    .then(snapshot => {
      if (snapshot.exists) {
        let reply = snapshot.data();
        reply.id = snapshot.id;

        if (storage) {
          return storage.ref("users/profile_images")
            .child(`${reply.user.uid}.png`)
            .getDownloadURL()
            .then(url => {
              reply.user.profilePicture = url;
              dispatch(gotReply(parent, reply));
            })
            .catch(error => {
              console.log(error);
              dispatch(getReplyFailed(error));
            });
          }
          
          return dispatch(gotReply(parent, reply));
        }

        dispatch(getReplyFailed({ message: "no reply found" }));
      })
      .catch(error => {
        dispatch(getReplyFailed(error));
      })
  }
};

// UPDATE actions
export const updateCommentInitiated = () => {
  return {
    type: types.UPDATE_COMMENT_INITIATED
  };
};

export const updateCommentFailed = error => {
  return {
    type: types.UPDATE_COMMENT_FAILED,
    error
  };
};

export const commentUpdated = () => {
  return {
    type: types.COMMENT_UPDATED
  };
};

export const doUpdateComment = (comment, data = {}) => {
  return dispatch => {
    dispatch(updateCommentInitiated());

    return db.collection("comments")
      .doc(comment)
      .update(data)
      .then(() => {
        dispatch(commentUpdated());
      })
      .catch(error => {
        dispatch(updateCommentFailed(error));
      })
  };
};