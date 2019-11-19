import { Dispatch } from 'react';
import { Action } from '..';
import { Student as _ } from '../actionTypes';
import { StudentState } from '../../imodels/iAppState';
import firebase from 'firebase';
import { db } from '../../utils/firebase';
import {
  gettingStudent, 
  gotStudent,
  gettingStudentFailed,
  creatingStudent,
  createdStudent,
  creatingStudentFailed,
  updatingStudent,
  updatedStudent,
  updatingStudentFailed,
  deletingStudentAccomplishment,
  deletedStudentAccomplishment,
  deletingStudentAccomplishmentFailed,
} from './actions';
import Student from '../../models/Student';
import iStudent from '../../imodels/iStudent';
import User from '../../models/User';

type StudentDispatch = Dispatch<Action<_, StudentState>>;

export const doGetStudent = (
  dispatch: StudentDispatch,
  uid: string
) => {
  dispatch(gettingStudent());

  db.collection('students')
    .doc(uid)
    .get()
    .then((snapshot: firebase.firestore.DocumentSnapshot) => {
      if (snapshot.exists) {
        try {
          const data = snapshot.data() as iStudent;
          const student = new Student(data, data.User as User);

          dispatch(gotStudent(student));
          return;
        } catch (e) {
          dispatch(gettingStudentFailed(e));
        }
      }

      dispatch(gettingStudentFailed(new Error('no student found')));
    })
    .catch((error: Error) => {
      dispatch(gettingStudentFailed(error));
    });
};

export const doCreateStudent = (
  dispatch: StudentDispatch,
  student: Student
) => {
  dispatch(creatingStudent());

  db.collection('students')
    .doc(student.uid)
    .set(student.data)
    .then(() => {
      dispatch(createdStudent());
    })
    .catch((error: Error) => {
      dispatch(creatingStudentFailed(error));
    });
};

export const doUpdateStudent = (
  dispatch: StudentDispatch,
  uid: string,
  data: iStudent,
  refresh: boolean = false
) => {
  dispatch(updatingStudent());

  db.collection('students')
    .doc(uid)
    .update(data)
    .then(() => {
      dispatch(updatedStudent());

      // get student
      if (refresh) {
        doGetStudent(dispatch, uid);
      }
    })
    .catch((error: Error) => {
      dispatch(updatingStudentFailed(error));
    });
};

export const doDeleteStudentAccomplishment = (
  dispatch: StudentDispatch,
  uid: string,
  slug: string,
  refresh: boolean = false
) => {
  dispatch(deletingStudentAccomplishment());

  db.collection('students')
    .doc(uid)
    .update({
      [`accomplishments.${slug}`]: firebase.firestore.FieldValue.delete()
    })
    .then(() => {
      dispatch(deletedStudentAccomplishment());

      if (refresh) {
        doGetStudent(dispatch, uid);
      }
    })
    .catch((error: Error) => {
      dispatch(deletingStudentAccomplishmentFailed(error));
    });
};