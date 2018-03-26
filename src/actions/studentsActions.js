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

export const getSTudentsFailed = error => {
  return {
    type: types.STUDENTS_GET_FAILED,
    error
  };
};
