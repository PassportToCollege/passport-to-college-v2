import * as types from "./actionTypes";
import { db } from "../utils/firebase";

// USER GET actions

export const userGetInitiated = uid => {
  return {
    type: types.USER_GET_INITIATED,
    user: uid
  };
};

export const userGetFailed = (uid, error) => {
  return {
    type: types.USER_GET_FAILED,
    user: uid,
    error
  };
};

export const userGetSuccessful = user => {
  return {
    type: types.USER_GET_FAILED,
    user
  };
};

export const doUserGet = uid => {
  return dispatch => {
    dispatch(userGetInitiated(uid));

    db.ref(`/users/${uid}`)
      .once("value")
      .then(snapshot => {
        if(snapshot.val()) {
          dispatch(userGetSuccessful(snapshot.val()));
        } else {
          dispatch(userGetFailed(uid, `No user found with uid: ${uid}.`));
        }
      })
      .catch(error => {
        dispatch(userGetFailed(uid, error));
      })
  };
};

// USER UPDATE actions

export const userUpdateInitiated = (uid, data) => {
  return {
    type: types.USER_UPDATE_INITIATED,
    user: uid,
    data
  };
};

export const userUpdateFailed = (uid, data, error) => {
  return {
    type: types.USER_UPDATE_FAILED,
    user: uid,
    data,
    error
  };
};

export const userUpdated = (uid, data) => {
  return {
    type: types.USER_UPDATED,
    user: uid,
    data
  };
};

export const doUserUpdate = (uid, data) => {
  return dispatch => {
    dispatch(userUpdateInitiated(uid, data));

    db.ref(`/users/${uid}`)
      .update(data)
      .then(() => {
        dispatch(userUpdated(uid, data));

        // dispatch user get to update props
        // with new user data
        dispatch(doUserGet(uid));
      })
      .catch(error => {
        dispatch(userGetFailed(uid, data, error));
      })
  };
};