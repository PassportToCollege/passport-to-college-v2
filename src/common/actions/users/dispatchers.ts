import { uid } from 'rand-token';
import axios from 'axios';
import _ from 'lodash';
import { Dispatch } from 'react';
import { Action } from '..';
import { UsersState } from '../../imodels/iAppState';
import { Users } from '../actionTypes';
import User from '../../models/User';
import iUser, { UserType } from '../../imodels/iUser';
import { 
  gettingUsers, gettingUsersFailed, gotUsers, gettingUser, gotUser, gettingUserFailed, gotStaff, gotFounder,
} from './actions';
import { db } from '../../utils/firebase';

type UsersDispatch = Dispatch<Action<Users, UsersState>>;
const usersPerPage = 50;

const getUsersFromSnapshots = (snapshots: firebase.firestore.QuerySnapshot): User[] => {
  try {
    const users: User[] = [];

    snapshots.forEach((snapshot: firebase.firestore.QueryDocumentSnapshot) => {
      const snap = snapshot.data() as iUser;
      const user = new User(snap);

      users.push(user);
    });

    return users;
  } catch (e) {
    throw new Error(e);
  }
};

export const doGetUsers = (
  dispatch: UsersDispatch,
  page: number = 1,
  type: UserType = UserType.Any,
  useStaffDispatch: boolean = false
) => {
  dispatch(gettingUsers());

  let usersRef: firebase.firestore.CollectionReference | firebase.firestore.Query = db.collection('users');

  if (type !== UserType.Any) {
    let t: string = '';

    // tslint:disable-next-line:switch-default
    switch (type) {
      case UserType.Admin:
        t = 'isAdmin';
        break;
      case UserType.Student:
        t = 'isStudent';
        break;
      case UserType.Applicant:
        t = 'isApplicant';
        break;
      case UserType.Staff:
        t = 'isStaff';
        break;
    }

    usersRef = usersRef.where(t, '==', true);
  }

  usersRef = usersRef.orderBy('name.last');

  if (page > 1) {
    usersRef
      .limit((page - 1) * usersPerPage)
      .get()
      .then((tempSnaps: firebase.firestore.QuerySnapshot) => {
        const lastVisible = tempSnaps.docs[tempSnaps.docs.length - 1];

        usersRef
          .startAfter(lastVisible)
          .limit(usersPerPage)
          .get()
          .then((snapshots: firebase.firestore.QuerySnapshot) => {
            if (snapshots.empty) {
              const error = new Error('no users found');
              dispatch(gettingUsersFailed(error));

              return;
            }

            const users = getUsersFromSnapshots(snapshots);
            dispatch(gotUsers(users));
          })
          .catch((error: Error) => {
            dispatch(gettingUsersFailed(error));
          });
      })
      .catch((error: Error) => {
        dispatch(gettingUsersFailed(error));
      });
  } else {
    usersRef
      .limit(useStaffDispatch ? -1 : usersPerPage)
      .get()
      .then((snapshots: firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty) {
          const error = new Error('no users found');
          dispatch(gettingUsersFailed(error));

          return;
        }

        const users = getUsersFromSnapshots(snapshots);

        if (useStaffDispatch) {
          dispatch(gotStaff(users));
          return;
        }

        dispatch(gotUsers(users));
      })
      .catch((error: Error) => {
        dispatch(gettingUsersFailed(error));
      });
  }
};

export const doGetUserByUid = (
  dispatch: UsersDispatch,
  id: string
) => {
  dispatch(gettingUser());

  db.collection('users')
    .doc(id)
    .get()
    .then((snapshot: firebase.firestore.DocumentSnapshot) => {
      if (snapshot.exists) {
        const user = new User(snapshot.data() as iUser);
        return dispatch(gotUser(user));
      }

      const error = new Error('no user found');
      dispatch(gettingUserFailed(error));
    })
    .catch((error: Error) => {
      dispatch(gettingUserFailed(error));
    });
};

export const doGetUsersByUid = (
  dispatch: UsersDispatch,
  ids: string[]
) => {
  dispatch(gettingUsers());

  const promises: Array<Promise<firebase.firestore.DocumentSnapshot>> = [];
  for (const id of ids) {
    promises.push(db.collection('users').doc(id).get());
  }

  Promise.all(promises)
    .then((snapshosts: firebase.firestore.DocumentSnapshot[]) => {
      const users: User[] = [];

      for (const snapshot of snapshosts) {
        if (snapshot.exists) {
          const user = new User(snapshot.data() as iUser);
          users.push(user);
        }
      }

      dispatch(gotUsers(users));
    })
    .catch((error: Error) => {
      dispatch(gettingUsersFailed(error));
    });
};

export const doGetFounder = (dispatch: UsersDispatch) => {
  dispatch(gettingUser());

  db.collection('users')
    .where('isStaff', '==', true)
    .where('role', '==', 'Founder')
    .get()
    .then((snapshots: firebase.firestore.QuerySnapshot) => {
      if (snapshots.empty) {
        const error = new Error('no founder found');
        error.stack = JSON.stringify({
          type: 'founder'
        });
        
        dispatch(gettingUserFailed(error));
        return;
      }

      let founder: User | null = null;
      snapshots.forEach((snapshot: firebase.firestore.QueryDocumentSnapshot) => {
        founder = new User(snapshot.data() as iUser);
      });

      dispatch(gotFounder(founder!));
    })
    .catch((error: Error) => {
      dispatch(gettingUserFailed(error));
    });
};