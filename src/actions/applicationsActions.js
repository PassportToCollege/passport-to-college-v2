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
      db.collection("applications")
        .where("state.draft", "==", false)
        .orderBy("startedOn", "desc")
        .limit(50)
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
    } else {
      db.collection("applications")
        .where("state.draft", "==", false)
        .orderBy("startedOn", "desc")
        .limit((page - 1) * 50)
        .get()
        .then(tempSnapshots => {
          const lastVisible = tempSnapshots.docs[tempSnapshots.docs.length - 1];

          db.collection("applications")
            .where("state.draft", "==", false)
            .orderBy("startedOn", "desc")
            .startAfter(lastVisible)
            .limit(50)
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
        })
        .catch(error => {
          Console.log(error);
          dispatch(applicationsGetFailed(error, page));
        })
    }
  }
}