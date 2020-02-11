import firebase from 'firebase';
import axios, { AxiosResponse } from 'axios';
import { Action } from '..';
import { Application as _ } from '../actionTypes';
import { ApplicationState } from '../../imodels/iAppState';
import User from '../../models/User';
import Application from '../../models/Application';
import iTest from '../../imodels/iTest';
import { db } from '../../utils/firebase';
import { Dispatch } from 'react';
import { 
  gettingApplication, 
  gotApplication, 
  gettingApplicationFailed, 
  updatingApplication, 
  updatedApplication,
  updatingApplicationFailed, 
  deletingTest,
  deletedTest,
  deletingTestFailed,
  submittingApplication,
  submittedApplication,
  sendingSubmissionEmail,
  sentSubmissionEmail,
  sendingSubmissionEmailFailed
} from './actions';

const EMAIL_API = process.env.REACT_APP_EMAIL_API;

export const doApplicationGet = (
  dispatch: Dispatch<Action<_, ApplicationState>>, 
  id: string) => {
    dispatch(gettingApplication());

    db.collection('applications')
      .doc(id)
      .get()
      .then((doc: firebase.firestore.DocumentSnapshot) => {
        if (doc.exists) {
          const data = doc.data() as Application;
          const user = new User(data.User);
          const application = new Application(user, data);

          dispatch(gotApplication(application));
        } else {
          dispatch(gettingApplicationFailed(new Error('No application found for the user')));
        }
      })
      .catch((error: Error) => {
        dispatch(gettingApplicationFailed(error));
      });
};

export const doApplicationUpdate = (
  dispatch: Dispatch<Action<_, ApplicationState>>,
  application: Application, 
  refresh: boolean = false) => {
    dispatch(updatingApplication());

    db.collection('applications')
      .doc(application.uid)
      .update(application.getApplicationData())
      .then(() => {
        dispatch(updatedApplication(application));

        if (refresh) {
          doApplicationGet(dispatch, application.uid);
        }
      })
      .catch((error: Error) => {
        dispatch(updatingApplicationFailed(error));
      });
};

export const doTestDelete = (
  dispatch: Dispatch<Action<_, ApplicationState>>,
  user: User, 
  test: iTest) => {
    dispatch(deletingTest());

    db.collection('applications')
      .doc(user.uid)
      .update({ [`tests.${test.slug}`]: firebase.firestore.FieldValue.delete() })
      .then(() => {
        dispatch(deletedTest());
        doApplicationGet(dispatch, user.uid);
      })
      .catch((error: Error) => {
        dispatch(deletingTestFailed(error));
      });
};

const doSendSubmissionEmail = (
  dispatch: Dispatch<Action<_, ApplicationState>>,
  user: User): Promise<Array<AxiosResponse<any>>> => {
    dispatch(sendingSubmissionEmail(user));

    const sendToApplicant = () => {
      return axios.get(`${EMAIL_API}/s/application-submitted/${user.uid}`);
    };
  
    const sendToAdmins = () => {
      return axios.get(`${EMAIL_API}/s/application-received/${user.uid}`);
    };

    return axios.all([sendToApplicant(), sendToAdmins()]);
  };

export const doApplicationSubmit = (
  dispatch: Dispatch<Action<_, ApplicationState>>,
  application: Application) => {
    dispatch(submittingApplication(application));

    db.collection('applications')
      .doc(application.uid)
      .update(application.getApplicationData())
      .then(() => {
        const user = application.User;

        dispatch(submittedApplication());

        doSendSubmissionEmail(dispatch, user)
          .then(() => {
            dispatch(sentSubmissionEmail());
            doApplicationGet(dispatch, user.uid);
          })
          .catch((error: Error) => {
            dispatch(sendingSubmissionEmailFailed(error));
          });
      })
      .catch((error: Error) => {
        dispatch(sendingSubmissionEmailFailed(error));
      });
};