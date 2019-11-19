import { ActionCreator } from '..';
import { Students } from '../actionTypes';
import { StudentsState } from '../../imodels/iAppState';
import Student from '../../models/Student';

export const gettingStudents = () =>
  ActionCreator<Students>(Students.GettingStudents);

export const gettingStudentsFailed = (error: Error) =>
  ActionCreator<Students, StudentsState>(Students.GettingStudentsFailed, { error });

export const gotStudents = (students: Student[]) =>
  ActionCreator<Students, StudentsState>(Students.GotStudents, { students });

export const gotCurrentStudents = (current: Student[]) =>
  ActionCreator<Students, StudentsState>(Students.GotCurrentStudents, { current });

export const gotPastStudents = (past: Student[]) =>
  ActionCreator<Students, StudentsState>(Students.GotPastStudents, { past });