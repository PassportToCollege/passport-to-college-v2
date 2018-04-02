import * as types from "./actionTypes";
import { db, auth } from "../utils/firebase";
import moment from "moment";

// ADD actions
export const createPostInitiated = () => {
  return {
    type: types.POST_CREATE_INITIATED
  };
};

export const createPostFailed = error => {
  return {
    type: types.POST_CREATE_FAILED,
    error
  };
};

export const postCreated = id => {
  return {
    type: types.POST_CREATED,
    id
  };
};

export const doPostCreate = () => {
  return dispatch => {
    dispatch(createPostInitiated());

    auth.onAuthStateChanged(user => {
      if (user) {
        const createdAt = new Date(moment.utc(moment().toDate())).getTime();

        db.collection("posts")
          .add({
            createdAt,
            state: {
              draft: true,
              published: false,
              archived: false
            },
            author: user.uid
          })
          .then(post => {
            dispatch(postCreated(post.id));
          })
          .catch(error => {
            dispatch(createPostFailed(error));
          })
      }
    })
  }
}

