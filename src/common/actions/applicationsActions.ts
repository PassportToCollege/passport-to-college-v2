import ActionTypes from "../actions/actionTypes";
import User from "../models/User";
import Application from "../models/Application"

import { db } from "../utils/firebase";

const ApplicationActions = ActionTypes.Application;
const Console = console;

// GET actions
export const applicationsGetInitiated = (page : number) : any => {
  return {
    type: ApplicationActions.GettingApplications,
    page
  };
};

export const applicationsGetDone = (page : number, applications : Array<Application>) : any => {
  return {
    type: ApplicationActions.GotApplications,
    applications, page
  };
};

export const applicationsGetFailed = (error : any, page : number) : any => {
  return {
    type: ApplicationActions.GettingApplicationsFailed,
    error, page
  };
};

export const doApplicationsGet = (page : number) : any => {
  return (dispatch : any) => {
    dispatch(applicationsGetInitiated(page));

    if (page === 1) {
      db.collection("applications")
        .where("state.draft", "==", false)
        .orderBy("startedOn", "desc")
        .limit(50)
        .get()
        .then((snapshots : any) => {
          if (snapshots.empty)
            return dispatch(applicationsGetFailed({ message: "No applications found." }, page));

          const applications = getApplicationsFromSnapshot(snapshots);
          dispatch(applicationsGetDone(page, applications));
        })
        .catch((error : any) => {
          Console.log(error);
          dispatch(applicationsGetFailed(error, page));
        })
    } else {
      db.collection("applications")
        .where("state.draft", "==", false)
        .orderBy("startedOn", "desc")
        .limit((page - 1) * 50)
        .get()
        .then((tempSnapshots : any) => {
          const lastVisible = tempSnapshots.docs[tempSnapshots.docs.length - 1];

          db.collection("applications")
            .where("state.draft", "==", false)
            .orderBy("startedOn", "desc")
            .startAfter(lastVisible)
            .limit(50)
            .get()
            .then((snapshots : any) => {
              if (snapshots.empty)
                return dispatch(applicationsGetFailed({ message: "No applications found." }, page));

              const applications = getApplicationsFromSnapshot(snapshots);
              dispatch(applicationsGetDone(page, applications));
            })
        })
        .catch((error : any) => {
          Console.log(error);
          dispatch(applicationsGetFailed(error, page));
        })
    }
  }
}

const getApplicationsFromSnapshot = (snapshots : any) : Array<Application> => {
  let applications: Array<Application> = [];

  snapshots.forEach((snapshot: any) => {
    const applicationData = snapshot.data();
    const applicationUser = new User(applicationData.user);

    let application = new Application(applicationUser, applicationData);
    applications.push(application);
  });

  return applications;
}