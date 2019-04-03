import iAction from "../imodels/iAction";
import iError from "../imodels/iError";
import Student from "../models/Student";

import ActionTypes from "./actionTypes";
import { db, storage } from "../utils/firebase";

const StudentsActions = ActionTypes.Students;

const getStudentsFromSnapshots = (snapshots: firebase.firestore.QuerySnapshot): Student[] => {
  let students : Student[] = [];

  snapshots.forEach((snapshot: firebase.firestore.QueryDocumentSnapshot) => {
    const snap = <Student>snapshot.data();
    const student = new Student(snap, snap.User);

    students.push(student);
  });

  return students;
}

export const getStudentsInitiated = () : iAction => {
  return {
    type: StudentsActions.GettingStudents
  };
};

export const getStudentsSuccess = (students : Student[]) : iAction => {
  return {
    type: StudentsActions.GotStudents,
    students
  };
};

export const getStudentsFailed = (error : iError) : iAction => {
  return {
    type: StudentsActions.GettingStudentsFailed,
    error
  };
};

export const doStudentsGet = () : any => {
  return (dispatch : Function) => {
    dispatch(getStudentsInitiated());

    db.collection("students")
      .orderBy("user.name.last", "desc")
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty)
          return dispatch(getStudentsFailed({message: "no students"}));

        const students : Student[] = getStudentsFromSnapshots(snapshots);
        dispatch(getStudentsSuccess(students));
      })
      .catch((error : iError) => {
        dispatch(getStudentsFailed(error));
      })
  }
}

export const getCurrentStudentsInitiated = () : iAction => {
  return {
    type: StudentsActions.GettingCurrentStudents
  };
};

export const getCurrentStudentsFailed = (error : iError) : iAction => {
  return {
    type: StudentsActions.GettingCurrentStudentsFailed,
    error
  };
};

export const gotCurrentStudents = (current : Student[]) : iAction => {
  return {
    type: StudentsActions.GotCurrentStudents,
    current
  };
};

export const doGetCurrentStudents = () : any => {
  return (dispatch : Function) => {
    dispatch(getCurrentStudentsInitiated());

    return db.collection("students")
      .where("hasGraduated", "==", false)
      .where("showOnSite", "==", true)
      .orderBy("user.name.last", "desc")
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty)
          return dispatch(getCurrentStudentsFailed({ message: "no students found" }));

        const students : Student[] = getStudentsFromSnapshots(snapshots);
        dispatch(gotCurrentStudents(students));
      })
      .catch((error : iError) => {
        dispatch(getCurrentStudentsFailed(error));
      });
  }
}

export const getPastStudentsInitiated = () : iAction => {
  return {
    type: StudentsActions.GettingPastStudents
  };
};

export const getPastStudentsFailed = (error : iError) : iAction => {
  return {
    type: StudentsActions.GettingPastStudentsFailed,
    error
  };
};

export const gotPastStudents = (past : Student[]) : iAction => {
  return {
    type: StudentsActions.GotPastStudents,
    past
  };
};

export const doGetPastStudents = () : any => {
  return (dispatch : Function) => {
    dispatch(getPastStudentsInitiated());

    return db.collection("students")
      .where("hasGraduated", "==", true)
      .where("showOnSite", "==", true)
      .orderBy("user.name.last", "desc")
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty)
          return dispatch(getPastStudentsFailed({ message: "no students found" }));

        const students : Student[] = getStudentsFromSnapshots(snapshots);
        dispatch(gotPastStudents(students));
      })
      .catch((error : iError) => {
        dispatch(getPastStudentsFailed(error));
      });
  }
}