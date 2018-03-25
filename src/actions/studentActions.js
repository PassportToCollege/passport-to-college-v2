import { db } from "../utils/firebase";
import * as types from "./actionTypes";

// GET actions
export const studentGetInitiated = uid => {
  return {
    type: types.STUDENT_GET_INITIATED,
    student: uid
  };
};

export const studentGetFailed = (error, uid) => {
  return {
    type: types.STUDENT_GET_FAILED,
    error,
    student: uid
  };
};

export const studentGetSuccess = student => {
  return {
    type: types.STUDENT_GET_SUCCESS,
    student
  };
};

export const doStudentGet = uid => {
  return dispatch => {
    dispatch(studentGetInitiated(uid));

    db.collection("students")
      .doc(uid)
      .get()
      .then(snapshot => {
        if (snapshot.exists)
          return dispatch(studentGetSuccess(snapshot.data()));

        return dispatch(studentGetFailed({ message: "no student found" }. uid));
      })
      .catch(error => {
        dispatch(studentGetFailed(error, uid));
      });
  }
}
