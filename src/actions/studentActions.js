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

        return dispatch(studentGetFailed({ message: "no student found" }, uid));
      })
      .catch(error => {
        dispatch(studentGetFailed(error, uid));
      });
  }
}

// UPDATE actions
export const studentUpdateInitiated = (student, data) => {
  return {
    type: types.STUDENT_UPDATE_INITIATED,
    student,
    data
  };
};

export const studentUpdateFailed = (error, student, data) => {
  return {
    type: types.STUDENT_UPDATE_FAILED,
    student, error,
    data
  };
};

export const studentUpdated = (student, data) => {
  return {
    type: types.STUDENT_UPDATED,
    student, data
  };
};

export const doStudentUpdate = (student, data) => {
  return dispatch => {
    dispatch(studentUpdateInitiated(student, data));

    data = data || {};

    db.collection("students")
      .doc(student)
      .update(data)
      .then(() => {
        dispatch(studentUpdated(student, data));

        // get student
        dispatch(doStudentGet(student));
      })
      .catch(error => {
        dispatch(studentUpdateFailed(error, student, data));
      })
  }
}

export const doStudentUpdateWithoutGet = (student, data) => {
  return dispatch => {
    dispatch(studentUpdateInitiated(student, data));

    data = data || {};

    db.collection("students")
      .doc(student)
      .update(data)
      .then(() => {
        dispatch(studentUpdated(student, data));
      })
      .catch(error => {
        dispatch(studentUpdateFailed(error, student, data));
      })
  }
}