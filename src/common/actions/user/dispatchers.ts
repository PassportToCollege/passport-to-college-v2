// Dispatches actions for the currently logged in user

import { Dispatch } from 'react';
import firebase from 'firebase';
import { Action } from '..';
import { db, auth } from '../../utils/firebase';
import { isEmail } from '../../utils/index';
import { User as _ } from '../actionTypes';
import { UserState } from '../../imodels/iAppState';
import {
  gettingUser, 
  gotUser,
  gettingUserFailed,
  updatingUser,
  updatedUser,
  updatingUserFailed,
  updatingUserEmailFailed,
  updatingUserEmail,
  updatedUserEmail,
  reAuthenticatingUser,
  reAuthenticatedUser,
  reAuthenticatingUserFailed,
} from './actions';
import User from '../../models/User';
import iUser from '../../imodels/iUser';

type UserDispatch = Dispatch<Action<_, UserState>>;

export const doGetUser = (dispatch: UserDispatch) => {
  auth.onAuthStateChanged((user: firebase.User | null) => {
    if (user) {
      dispatch(gettingUser());
      
      const { uid } = user;
      db.collection('users')
        .doc(uid)
        .get()
        .then((snapshot: firebase.firestore.DocumentSnapshot) => {
          if (snapshot.exists) {
            const _user = new User(snapshot.data() as iUser);
            dispatch(gotUser(_user));

            return;
          }

          const error = new Error(`No user found with uid: ${uid}.`);
          dispatch(gettingUserFailed(error));
        })
        .catch((error: Error) => {
          dispatch(gettingUserFailed(error));
        });
    }
  });
};

export const doUpdateUser = (
  dispatch: UserDispatch,
  data: Partial<iUser>,
  refresh: boolean = false
) => {
  auth.onAuthStateChanged((user: firebase.User | null) => {
    if (user) {
      dispatch(updatingUser());

      const uid = data.uid || user.uid;
      db.collection('users')
        .doc(uid)
        .update(data)
        .then(() => {
          dispatch(updatedUser());

          if (refresh) {
            doGetUser(dispatch);
          }
        })
        .catch((error: Error) => {
          dispatch(updatingUserFailed(error));
        });
    }
  });
};

const updateUserEmail = (
  dispatch: UserDispatch,
  user: firebase.User,
  email: string
) => {
  user.updateEmail(email)
    .then(() => {
      dispatch(updatedUserEmail());
    })
    .catch((error: Error) => {
      dispatch(updatingUserEmailFailed(error));
    });
};

const reAuthenticateUser = (
  dispatch: UserDispatch,
  user: firebase.User,
  password: string
): Promise<boolean | Error> => {
  dispatch(reAuthenticatingUser());

  return new Promise((reject, resolve) => {
    const email = user.email || '';
    const credentials = firebase.auth.EmailAuthProvider.credential(email, password);

    user.reauthenticateWithCredential(credentials)
      .then(() => {
        reAuthenticatedUser();
        resolve(true);
      })
      .catch((error: Error) => {
        reAuthenticatingUserFailed(error);
        reject(error);
      });
  });
};

export const doUpdateUserEmail = (
  dispatch: UserDispatch,
  email: string,
  shouldAuthenticate: boolean = false,
  password: string = ''
) => {
  if (!isEmail(email)) {
    const error = new Error('invalid email');
    dispatch(updatingUserEmailFailed(error));
    return;
  }

  auth.onAuthStateChanged((user: firebase.User | null) => {
    if (user) {
      dispatch(updatingUserEmail());
      
      if (shouldAuthenticate) {
        reAuthenticateUser(dispatch, user, password)
          .then(() => {
            updateUserEmail(dispatch, user, email);
          })
          .catch((error: Error) => {
            dispatch(updatingUserEmailFailed(error));
          });
      } else {
        updateUserEmail(dispatch, user, email);
      }
    }
  });
};