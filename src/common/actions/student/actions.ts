import { ActionCreator } from '..';
import { Student as _ } from '../actionTypes';
import { StudentState } from '../../imodels/iAppState';
import Student from '../../models/Student';

export const gettingStudent  = () =>
  ActionCreator<_>(_.GettingStudent);

export const gettingStudentFailed = (error: Error) =>
  ActionCreator<_, StudentState>(_.GettingStudentFailed, { error });

export const gotStudent = (student: Student) =>
  ActionCreator<_, StudentState>(_.GotStudent, { student });

export const creatingStudent = () =>
  ActionCreator<_>(_.CreatingStudent);

export const creatingStudentFailed = (error: Error) =>
  ActionCreator<_>(_.CreatingStudentFailed, { error });

export const createdStudent = () =>
  ActionCreator<_>(_.CreatedStudent);

export const updatingStudent = () =>
  ActionCreator<_>(_.UpdatingStudent);

export const updatingStudentFailed = (error: Error) =>
  ActionCreator<_, StudentState>(_.UpdatingStudentFailed, { error });

export const updatedStudent = () =>
  ActionCreator<_>(_.UpdatedStudent);

export const deletingStudentAccomplishment = () =>
  ActionCreator<_>(_.DeletingStudentAccomplishment);

export const deletingStudentAccomplishmentFailed = (error: Error) =>
  ActionCreator<_, StudentState>(_.DeletingStudentAccomplishmentFailed, { error });

export const deletedStudentAccomplishment = () =>
  ActionCreator<_>(_.DeletedStudentAccomplishment);