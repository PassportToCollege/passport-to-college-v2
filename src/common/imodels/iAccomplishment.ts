import iPost from "./iPost";
import iStudent from "./iStudent";

export default interface iAccomplishment extends iPost {
  isAccomplishment : boolean;
  student : iStudent;
}