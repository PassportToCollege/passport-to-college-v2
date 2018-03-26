import { db } from "../utils/firebase";
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