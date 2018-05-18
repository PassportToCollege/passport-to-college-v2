import { db } from "../utils/firebase";
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

export const commentCreated = () => {
  return {
    type: types.COMMENT_CREATED
  };
};

export const doCommentCreate = (user = {}, content = {}, post, options = {}) => {
  return dispatch => {
    dispatch(createCommentInitiated());

    const comment = new Comment(user, content, post);
    return db.collection("comments")
      .add(comment.data)
      .then(() => {
        dispatch(commentCreated());
      })
      .catch(error => {
        dispatch(createCommentFailed(error));
      });
  }
}