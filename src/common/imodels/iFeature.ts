import iPost from "./iPost";
import iStudent from "./iStudent";

export default interface iFeature extends iPost {
  isFeature : boolean;
  isActive : boolean;
  student : iStudent;
  expiration : Date;
}