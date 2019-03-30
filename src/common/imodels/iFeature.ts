import iPost from "./iPost";
import iStudent from "./iStudent";

export default interface iFeature extends iPost {
  Student : iStudent;
  isFeature? : boolean;
  isActive? : boolean;
  expiration? : Date;
}