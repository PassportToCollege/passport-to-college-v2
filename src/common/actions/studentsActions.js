import { db, storage } from "../utils/firebase";
import * as types from "./actionTypes";

// GET actions
export const getStudentsInitiated = () => {
  return {
    type: types.STUDENTS_GET_INITIATED
  };
};

export const getStudentsSuccess = students => {
  return {
    type: types.STUDENTS_GET_SUCCESS,
    students
  };
};

export const getStudentsFailed = error => {
  return {
    type: types.STUDENTS_GET_FAILED,
    error
  };
};

export const doStudentsGet = () => {
  return dispatch => {
    dispatch(getStudentsInitiated());

    db.collection("students")
      .orderBy("user.name.last", "desc")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(getStudentsFailed({message: "no students"}));

        const data = [];
        snapshots.forEach(snapshot => {
          data.push(snapshot.data());
        });

        dispatch(getStudentsSuccess(data));
      })
      .catch(error => {
        dispatch(getStudentsFailed(error));
      })
  }
}

export const getCurrentStudentsInitiated = () => {
  return {
    type: types.STUDENTS_GET_CURRENT_INITIATED
  };
};

export const getCurrentStudentsFailed = error => {
  return {
    type: types.STUDENTS_GET_CURRENT_FAILED,
    error
  };
};

export const gotCurrentStudents = students => {
  return {
    type: types.STUDENTS_GET_CURRENT_SUCCESS,
    students
  };
};

export const doGetCurrentStudents = () => {
  return dispatch => {
    dispatch(getCurrentStudentsInitiated());

    return db.collection("students")
      .where("hasGraduated", "==", false)
      .orderBy("user.name.last", "desc")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(getCurrentStudentsFailed({ message: "no students found" }));

        const students = [];
        const ppPromises = [];

        snapshots.forEach(snapshot => {
          const student = snapshot.data();

          if (storage && student.user.hasProfilePicture)
            ppPromises.push(storage.ref("users/profile_images").child(`${student.uid}.png`).getDownloadUrl());

          students.push(student);
        });

        if (storage && ppPromises.length) {
          return Promise.all(ppPromises).then(urls => {
            for (let student of students) {
              student.user.profilePicture = urls.find(url => {
                return url.indexOf(student.uid) > -1;
              });
            }

            dispatch(getStudentsSuccess(students));
          });
        }

        dispatch(getStudentsSuccess(students));
      })
      .catch(error => {
        dispatch(getCurrentStudentsFailed(error));
      });
  }
}