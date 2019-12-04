import { uid } from 'rand-token';

import iComment from '../imodels/iComment';
import User from './User';
import Post from './Post';

import BadWords from '../utils/badwords.en';
import { convertBlocksToText } from '../utils';
import iContentEditable from '../imodels/iContentEditable';

export default class Comment implements iComment {
  public readonly id: string;
  public User: User;
  public message: iContentEditable;
  public Post: Post;
  public postedOn?: Date;
  public isConversation?: boolean;
  public isReply?: boolean;
  public isDeleted?: boolean;
  public hasReplies?: boolean;
  public replies?: string[];

  constructor(user: User, post: Post, content: iContentEditable, meta: any = {}) {
    this.id = meta.id || uid(20);
    this.User = user;
    this.Post = post;
    this.message = content;

    this.postedOn = meta.postedOn || new Date();
    this.isConversation = !!meta.isConversation;
    this.isReply = false;
    this.isDeleted = !!meta.isDeleted;
    this.hasReplies = !!meta.hasReplies;
    this.replies = meta.replies || [];
  }

  public censorContent(content: iContentEditable): iContentEditable {
    const { blocks } = content.editable;
    
    for (const block of blocks) {
      block.text = this.censorText(block.text);
    }

    return { ...content, editable: { blocks, ...content.editable } };
  }

  public censorText(text: string): string {
    const bwKeys: string[] = Object.keys(BadWords);

    for (const badword of bwKeys) {
      const re: RegExp = new RegExp(badword, 'gi');
      const hearts: string = this.heartify(badword.length);
      const bwi: number = text.toLowerCase().indexOf(badword)

      if (bwi > -1) {
        text = text.replace(re, hearts);
      }
    }

    return text;
  }

  public update(newData: iComment): Comment
  {
    if (Object.keys(newData).length) {
      Object.assign(this, newData);
    }

    return this;
  }

  private heartify(length: number): string {
    let r = '';

    for (let i = 0; i < length; i++) {
      r += '*';
    }

    return r;
  }

  public getData(): iComment {
    return {
      id: this.id,
      User: this.User,
      message: this.message,
      hasReplies: this.hasReplies,
      postedOn: this.postedOn,
      Post: this.Post,
      isConversation: this.isConversation,
      replies: this.replies,
      isDeleted: this.isDeleted
    };
  }
}