import User from '../models/User';
import iContentEditable from './iContentEditable';
import Post from '../models/Post';

export default interface iComment {
  readonly id: string;
  User: User;
  message: iContentEditable;
  Post: Post;
  postedOn?: Date;
  isConversation?: boolean;
  isReply?: boolean;
  isDeleted?: boolean;
  hasReplies?: boolean;
  replies?: string[];
}