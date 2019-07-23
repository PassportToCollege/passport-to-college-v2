import iPost from './iPost';
import iStudent from './iStudent';

export default interface iAccomplishment extends iPost {
  student: iStudent;
  isAccomplishment: boolean;
}