import User from '../models/User';
import iPost from './iPost';
import iContentEditable from './iContentEditable';

export default interface iComment {
  readonly id: string;
  User: User;
  message: iContentEditable;
  Post: iPost;
  postedOn?: Date;
  isConversation?: boolean;
  isReply?: boolean;
  isDeleted?: boolean;
  hasReplies?: boolean;
  replies?: string[];
}