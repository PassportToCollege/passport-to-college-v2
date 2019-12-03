import iPost from './iPost';
import Student from '../models/Student';

export default interface iAccomplishment extends iPost {
  student: Student;
  isAccomplishment: boolean;
}