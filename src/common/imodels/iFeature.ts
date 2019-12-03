import iPost from './iPost';
import Student from '../models/Student';

export default interface iFeature extends iPost {
  Student: Student;
  isFeature?: boolean;
  isActive?: boolean;
  expiration?: Date;
}