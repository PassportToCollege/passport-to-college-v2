import { Dispatch } from 'react';
import { Action } from '..';
import Student from '../../models/Student';
import { Students } from '../actionTypes';
import { StudentsState } from '../../imodels/iAppState';
import { StudentType } from '../../imodels/iStudent';
import { 
  gettingStudents, 
  gettingStudentsFailed, 
  gotStudents, 
  gotCurrentStudents, 
  gotPastStudents 
} from './actions';
import { db } from '../../utils/firebase';

const getStudentsFromSnapshots = (snapshots: firebase.firestore.QuerySnapshot): Student[] => {
  try {
    const students: Student[] = [];

    snapshots.forEach((snapshot: firebase.firestore.QueryDocumentSnapshot) => {
      const snap = snapshot.data() as Student;
      const student = new Student(snap, snap.User);

      students.push(student);
    });

    return students;
  } catch (e) {
    throw new Error(e);
  }
};

export const doGetStudents = (
  dispatch: Dispatch<Action<Students, StudentsState>>,
  type: StudentType = StudentType.All,
  visible: boolean = false
) => {
  dispatch(gettingStudents());

  let userRef: firebase.firestore.CollectionReference | firebase.firestore.Query = db.collection('students');

  if (type === StudentType.Current) {
      userRef = userRef.where('hasGraduated', '==', false);
  } else if (type === StudentType.Graduated) {
      userRef = userRef.where('hasGraduated', '==', true);
  }

  if (visible) {
    userRef = userRef.where('showOnSite', '==', true);
  }

  userRef
    .orderBy('User.name.last', 'desc')
    .get()
    .then((snapshots: firebase.firestore.QuerySnapshot) => {
      if (snapshots.empty) {
        dispatch(gettingStudentsFailed(new Error('no students found')));
        return;
      }

      const students: Student[] = getStudentsFromSnapshots(snapshots);

      switch (type) {
        case StudentType.Current:
          dispatch(gotCurrentStudents(students));
          break;
        case StudentType.Graduated:
          dispatch(gotPastStudents(students));
          break;
        default:
          dispatch(gotStudents(students));
      }
    })
    .catch((error: Error) => {
      dispatch(gettingStudentsFailed(error));
    });
};