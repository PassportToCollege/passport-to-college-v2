import { db } from "../utils/firebase";
import * as types from "./actionTypes";

const Console = console;

// GET actions
export const getApplicationStatsInitiated = () => {
  return {
    type: types.APPLICATIONS_STATS_GET_INITIATED
  };
};

export const getApplicationStatsDone = stats => {
  return {
    type: types.APPLICATIONS_STATS_GET_SUCCESS,
    stats
  };
};

export const getApplicationStatsFailed = error => {
  return {
    type: types.APPLICATIONS_STATS_GET_FAILED,
    error
  };
};

export const doApplicationStatsGet = () => {
  return dispatch => {
    dispatch(getApplicationStatsInitiated());

    db.collection("stats")
      .doc("applications")
      .get()
      .then(doc => {
        if (doc.exists)
          return dispatch(getApplicationStatsDone(doc.data()));
        
        dispatch(getApplicationStatsFailed({error: "no stats found"} ));
      })
      .catch(error => {
        Console.log(error);
        dispatch(getApplicationStatsFailed(error));
      })
  }
}

export const getUserStatsInitiated = () => {
  return {
    type: types.USERS_STATS_GET_INITIATED
  };
};

export const getUserStatsDone = stats => {
  return {
    type: types.USERS_STATS_GET_SUCCESS,
    stats
  };
};

export const getUserStatsFailed = error => {
  return {
    type: types.USERS_STATS_GET_FAILED,
    error
  };
};

export const doUserStatsGet = () => {
  return dispatch => {
    dispatch(getUserStatsInitiated());

    db.collection("stats")
      .doc("users")
      .get()
      .then(doc => {
        if (doc.exists)
          return dispatch(getUserStatsDone(doc.data()));

        dispatch(getUserStatsFailed({ error: "no stats found" }));
      })
      .catch(error => {
        Console.log(error);
        dispatch(getUserStatsFailed(error));
      })
  }
}