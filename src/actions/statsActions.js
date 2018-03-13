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

// UPDATE actions
export const statUpdateInitiated = (doc, stat, op) => {
  return {
    type: types.STATS_UPDATE_INITIATED,
    doc,
    stat,
    operation: op
  };
};

export const statUpdated = (doc, stat, op) => {
  return {
    type: types.STATS_UPDATE_INITIATED,
    doc,
    stat,
    operation: op
  };
};

export const statUpdateFailed = (error, doc, stat, op) => {
  return {
    type: types.STATS_UPDATE_INITIATED,
    doc,
    stat,
    operation: op,
    error
  };
};

export const doStatUpdate = (doc, stat, op) => {
  return dispatch => {
    if (op !== "-" || op !== "+")
      return dispatch(statUpdateFailed({ error: "operation not recognized" }, stat, op));
    
    const statRef = db.collection("stats").doc(doc);

    return db.runTransaction(transaction => {
      return transaction.get(statRef)
        .then(doc => {
          const data = doc.data();
          let stat = data[stat];

          if (op === "-") {
            stat -= 1;
          } else {
            stat += 1;
          }

          transaction.update(statRef, { [stat]: stat });
        })
    }).then(() => {
      dispatch(statUpdated(doc, stat, op));
    })
    .catch(error => {
      Console.log(error);
      dispatch(statUpdateFailed(error, stat, op));
    });
  }
}