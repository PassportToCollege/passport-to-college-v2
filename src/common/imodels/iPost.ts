import iUser from "./iUser";
import iContentEditable from "./iContentEditable";

export default interface iPost {
  id : string;
  author : iUser;
  title : string;
  excerpt : string;
  full : iContentEditable;
  hasHero : boolean;
  createdAt : Date;
  state : Object;
  conversations : Array<string>;
  category : Object;
  likes : Object
} 