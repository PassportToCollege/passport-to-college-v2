import { Action } from '..';
import { Application as _ } from '../actionTypes';
import User from '../../models/User';
import Application from '../../models/Application';
import { ApplicationsState } from '../../imodels/iAppState';
import { Dispatch } from 'react';
import { db } from '../../utils/firebase';
import { 
  gotApplications, 
  gettingApplications, 
  gettingApplicationsFailed 
} from './actions';

const getApplicationsFromSnapshot = (snapshots: any): Application[] => {
  const applications: Application[] = [];

  snapshots.forEach((snapshot: any) => {
    const applicationData = snapshot.data();
    const applicationUser = new User(applicationData.user || applicationData.User);

    const application = new Application(applicationUser, applicationData);
    applications.push(application);
  });

  return applications;
};

export const doApplicationsGet = (
  dispatch: Dispatch<Action<_, ApplicationsState>>,
  page: number = 1) => {
    dispatch(gettingApplications());

    if (page === 1) {
      db.collection('applications')
        .where('state.draft', '==', false)
        .orderBy('startedOn', 'desc')
        .limit(50)
        .get()
        .then((snapshots: any) => {
          if (snapshots.empty) {
            dispatch(gettingApplicationsFailed(new Error('No applications found')));
          } else {
            const applications = getApplicationsFromSnapshot(snapshots);
            dispatch(gotApplications(page, applications));
          }
        })
        .catch((error: Error) => {
          dispatch(gettingApplicationsFailed(error));
        });
    } else {
      db.collection('applications')
        .where('state.draft', '==', false)
        .orderBy('startedOn', 'desc')
        .limit((page - 1) * 50)
        .get()
        .then((tempSnapshots: any) => {
          const lastVisible = tempSnapshots.docs[tempSnapshots.docs.length - 1];

          db.collection('applications')
            .where('state.draft', '==', false)
            .orderBy('startedOn', 'desc')
            .startAfter(lastVisible)
            .limit(50)
            .get()
            .then((snapshots: any) => {
              if (snapshots.empty) {
                dispatch(gettingApplicationsFailed(new Error('No applications found')));
              } else {
                const applications = getApplicationsFromSnapshot(snapshots);
                dispatch(gotApplications(page, applications));
              }
            });
        })
        .catch((error: Error) => {
          dispatch(gettingApplicationsFailed(error));
        });
    }
};