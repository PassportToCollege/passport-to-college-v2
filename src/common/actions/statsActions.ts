import iAction from "../imodels/iAction";
import iError from "../imodels/iError";
import iStats from "../imodels/iStats";

import { db } from "../utils/firebase";
import ActionTypes from "./actionTypes";

const StatsActions = ActionTypes.Stats;
const Console = console;

export const getInitiated = () : iAction => {
  return {
    type: StatsActions.GettingStats
  };
};

export const getStatsDone = (stats : iStats) : iAction => {
  return {
    type: StatsActions.GotStats,
    stats
  };
};

export const getStatsFailed = (error : iError) : iAction => {
  return {
    type: StatsActions.GettingStatsFailed,
    error
  };
};

export const doStatsGet = () : any => {
  return (dispatch : any) => {
    dispatch(getInitiated());

    db.collection("stats")
      .doc("all")
      .get()
      .then((doc : firebase.firestore.QueryDocumentSnapshot) => {
        if (doc.exists)
          return dispatch(getStatsDone(<iStats>doc.data()));
        
        dispatch(getStatsFailed({message: "no stats found"}));
      })
      .catch((error : iError) => {
        Console.log(error);
        dispatch(getStatsFailed(error));
      })
  }
}