import Comment from '../models/Comment';
import iComment from './iComment';

export default interface iReply extends iComment {
  isConversation: boolean;
  parent: Comment;
}