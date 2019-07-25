import iComment from './iComment';

export default interface iReply extends iComment {
  isConversation: boolean;
  parent: iComment;
  isReply: boolean;
}