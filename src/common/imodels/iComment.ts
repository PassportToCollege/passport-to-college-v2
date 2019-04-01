import iUser from "../imodels/iUser";
import iContentEditable from "./iContentEditable";
import iPost from "./iPost";

export default interface iComment {
  readonly id : string;
  User : iUser;
  message : {
    text : string,
    html : iContentEditable
  };
  Post : iPost;
  postedOn? : Date;
  isConversation? : boolean;
  isDeleted? : boolean;
  hasReplies? : boolean;
  replies? : string[];
}