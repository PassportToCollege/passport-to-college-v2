import { uid } from 'rand-token';

import User from '../models/User';
import iContentEditable from '../imodels/iContentEditable';
import iPost, { iPostState } from '../imodels/iPost';
import { iStringBooleanPair } from '../imodels/iObjectTypes';

export default class Post implements iPost {
  public readonly id: string;
  public author: string | User;
  public title: string;
  public excerpt: string;
  public full: iContentEditable;
  public hasHero: boolean;
  public createdAt: number | Date;
  public state: iPostState;
  public category?: iStringBooleanPair;
  public likes?: iStringBooleanPair;
  public conversations?: string[];

  constructor(author: string, postData: iPost) {
    this.author = author;
    this.id = postData.id || uid(20);

    this.title = '';
    this.excerpt = '';
    this.full = {
      blocks: [],
      entityMap: {}
    };
    this.hasHero = false;
    this.createdAt = new Date();
    this.state = {
      archived: false,
      published: false,
      draft: true
    };

    if (Object.keys(postData).length) {
      Object.assign(this, postData);
    }
  }

  public getPostData(useCase: string = 'display'): iPost {
    return {
      id: this.id, 
      title: this.title, 
      author: this.author, 
      excerpt: this.excerpt, 
      full: this.full,
      createdAt: useCase === 'save' ? (this.createdAt as Date).getTime() : this.createdAt,
      category: this.category, 
      state: this.state, 
      conversations: this.conversations,
      likes: this.likes, 
      hasHero: this.hasHero
    };
  }
}