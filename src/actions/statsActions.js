import { db } from "../utils/firebase";
import * as types from "./actionTypes";

const Console = console;

// GET actions
export const getInitiated = () => {
  return {
    type: types.STATS_GET_INITIATED
  };
};

export const getStatsDone = stats => {
  return {
    type: types.STATS_GET_SUCCESS,
    stats
  };
};

export const getStatsFailed = error => {
  return {
    type: types.STATS_GET_FAILED,
    error
  };
};

export const doApplicationStatsGet = () => {
  return dispatch => {
    dispatch(getInitiated());

    db.collection("stats")
      .doc("applications")
      .get()
      .then(doc => {
        if (doc.exists)
          return dispatch(getStatsDone(doc.data()));
        
        dispatch(getStatsFailed({error: "no stats found"} ));
      })
      .catch(error => {
        Console.log(error);
        dispatch(getStatsFailed(error));
      })
  }
}