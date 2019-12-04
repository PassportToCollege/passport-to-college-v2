import iReply from '../imodels/iReply';
import Comment from './Comment';
import User from './User';
import Post from './Post';
import iContentEditable from '../imodels/iContentEditable';

export default class Reply extends Comment implements iReply {
  public isConversation: boolean;
  public parent: Comment;

  constructor(user: User, post: Post, comment: Comment, content: iContentEditable, meta: any = {}) {
    super(user, post, content, meta);

    this.isConversation = false;
    this.parent = comment;
    this.isReply = true;
  }

  public getData(): iReply {
    return {
      id: this.id,
      isConversation: this.isConversation,
      User: this.User,
      message: this.message,
      hasReplies: this.hasReplies,
      postedOn: this.postedOn,
      parent: this.parent,
      Post: this.Post,
      isDeleted: this.isDeleted,
      isReply: this.isReply,
    };
  }
}