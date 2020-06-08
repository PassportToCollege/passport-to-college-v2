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

    db.collection("applications")
      .orderBy("startedOn", "desc")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(applicationsGetDone(page, { empty: true }));

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
  }
}
