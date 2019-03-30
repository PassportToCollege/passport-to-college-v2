import iUser from "./iUser";
import iContentEditable from "./iContentEditable";

export interface iPostState {
  draft : boolean;
  archived : boolean;
  published : boolean;
}

export default interface iPost {
  readonly id : string;
  author? : iUser;
  title : string;
  excerpt : string;
  full : iContentEditable;
  hasHero : boolean;
  createdAt : number | Date;
  state : iPostState;
  conversations? : string[];
  category? : Object;
  likes? : Object
} 