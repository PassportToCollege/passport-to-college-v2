import User from '../models/User';
import iPost from './iPost';
import { RawDraftContentState } from 'draft-js';

export default interface iComment {
  readonly id: string;
  User: User;
  message: {
    text: string,
    html: RawDraftContentState
  };
  Post: iPost;
  postedOn?: Date;
  isConversation?: boolean;
  isReply?: boolean;
  isDeleted?: boolean;
  hasReplies?: boolean;
  replies?: string[];
}