import iReply from "../imodels/iReply";
import iContentEditable from "../imodels/iContentEditable";
import Comment from "./Comment";
import User from "./User";
import Post from "./Post";

export default class Reply extends Comment implements iReply {
  isConversation : boolean;
  parent : Comment;
  isReply : boolean;

  constructor(User : User, Post : Post, Comment : Comment, content : iContentEditable, meta : any = {})
  {
    super(User, Post, content, meta);

    this.isConversation = false;
    this.parent = Comment;
    this.isReply = true;
  }

  public getData() {
    const {
      User,
      message,
      hasReplies,
      postedOn,
      parent,
      Post,
      isDeleted,
      isReply
    } = this;

    return {
      User,
      message,
      hasReplies,
      postedOn,
      parent,
      Post,
      isDeleted,
      isReply
    };
  }
}