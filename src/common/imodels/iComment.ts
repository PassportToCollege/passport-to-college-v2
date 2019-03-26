import iUser from "../imodels/iUser";
import iContentEditable from "./iContentEditable";

export default interface iComment {
  User : iUser;
  message : {
    text : string,
    html : iContentEditable
  };
  Post : iPost;
  isConversation : boolean;
  isDeleted : boolean;
  hasReplies : boolean;
  replies : Array<string>;
  postedOn : Date;
}