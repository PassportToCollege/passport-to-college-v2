import * as types from "./actionTypes";
import { db } from "../utils/firebase";

const Console = console;

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
        Console.error(error);
        dispatch(applicationGetFailed(error, user));
      })
  }
}

// UPDATE actions
export const applicationUpdateInitiated = (user, data) => {
  return {
    type: types.APPLICATION_UPDATE_INITIATED,
    user, data
  };
};

export const applicationUpdated = (user, data) => {
  return {
    type: types.APPLICATION_UPDATED,
    user, data
  };
};

export const applicationUpdateFailed = (error, user, data) => {
  return {
    type: types.APPLICATION_UPDATE_FAILED,
    error, user, data
  };
};

export const doApplicationUpdateWithoutGet = (user, data) => {
  return dispatch => {
    dispatch(applicationUpdateInitiated(user, data));

    db.collection("application")
      .doc(user)
      .update(data)
      .then(() => {
        dispatch(applicationUpdated(user, data));
      })
      .catch(error => {
        Console.error(error);
        dispatch(applicationUpdateFailed(error, user, data));
      });
  };
};