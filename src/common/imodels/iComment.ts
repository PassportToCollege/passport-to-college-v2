import User from '../models/User';
import iContentEditable from './iContentEditable';
import iPost from './iPost';

export default interface iComment {
  readonly id: string;
  User: User;
  message: {
    text: string,
    html: iContentEditable
  };
  Post: iPost;
  postedOn?: Date;
  isConversation?: boolean;
  isDeleted?: boolean;
  hasReplies?: boolean;
  replies?: string[];
}