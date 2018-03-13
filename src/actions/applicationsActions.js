import * as types from "./actionTypes";
import { db } from "../utils/firebase";

const Console = console;

// GET actions
export const applicationsGetInitiated = page => {
  return {
    type: types.APPLICATIONS_GET_INITIATED,
    page
  };
};

export const applicationsGetDone = (page, applications) => {
  return {
    type: types.APPLICATIONS_GET_SUCCESS,
    applications, page
  };
};

export const applicationsGetFailed = (error, page) => {
  return {
    type: types.APPLICATIONS_GET_FAILED,
    error, page
  };
};

export const doApplicationsGet = page => {
  return dispatch => {
    dispatch(applicationsGetInitiated(page));

    if (page === 1) {
      db.collection("application")
        .orderBy("submittedOn")
        .limit(50)
        .get()
        .then(snapshots => {
          const data = [];

          snapshots.forEach(snapshot => {
            data.push(snapshot.data());
          });

          dispatch(applicationsGetDone(page, data));
        })
        .catch(error => {
          Console.log(error);
          dispatch(applicationsGetFailed(error, page));
        })
    } else {
      db.collection("application")
        .orderBy("submittedOn")
        .limit((page - 1) * 50)
        .get()
        .then(tempSnapshots => {
          const lastVisible = tempSnapshots.docs[tempSnapshots.docs.length - 1];

          db.collection("application")
            .orderBy("submittedOn")
            .startAfter(lastVisible)
            .limit(50)
            .get()
            .then(snapshots => {
              const data = [];

              snapshots.forEach(snapshot => {
                data.push(snapshot.data());
              });

              dispatch(applicationsGetDone(page, data));
            })
        })
        .catch(error => {
          Console.log(error);
          dispatch(applicationsGetFailed(error, page));
        })
    }
  }
}