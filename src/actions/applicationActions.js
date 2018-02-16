import * as types from "./actionTypes";
import { db } from "../utils/firebase";

// GET actions
export const applicationGetInitiated = user => {
  return {
    type: types.APPLICATION_GET_INITIATED,
    user
  };
};

export const applicationGetDone = application => {
  return {
    type: types.APPLICATION_GET_SUCCESS,
    application
  };
};

export const applicationGetFailed = (error, user) => {
  return {
    type: types.APPLICATION_GET_FAILED,
    error, user
  };
};

export const doApplicationGet = user => {
  return dispatch => {
    dispatch(applicationGetInitiated(user));

    db.collection("application")
      .doc(user)
      .get()
      .then(doc => {
        if (doc.exists) {
          dispatch(applicationGetDone(doc.data()));
        } else {
          dispatch(applicationGetFailed("no application found.", user));
        }
      })
      .catch(error => {
        console.log(error);
        dispatch(applicationGetFailed(error, user));
      })
  }
}

// UPDATE actions
export const applicationUpdateInitiated = user => {
  return {
    type: types.APPLICATION_UPDATE_INITIATED,
    user
  };
};

export const applicationUpdated = application => {
  return {
    type: types.APPLICATION_UPDATED,
    application
  };
};

export const applicationUpdateFailed = (error, user) => {
  return {
    type: types.APPLICATION_UPDATE_FAILED,
    error, user
  };
};