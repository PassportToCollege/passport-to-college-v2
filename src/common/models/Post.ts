import { uid } from 'rand-token';

import User from '../models/User';
import iContentEditable from '../imodels/iContentEditable';
import iPost, { iPostState } from '../imodels/iPost';
import { iStringBooleanPair } from '../imodels/iObjectTypes';

export default class Post implements iPost {
  public readonly id: string;
  public author: string | User;
  public title: string;
  public content: iContentEditable;
  public hasHero: boolean;
  public hero?: string;
  public createdAt: number | Date;
  public publishedOn: number | Date;
  public archivedOn: number | Date;
  public state: iPostState;
  public category?: iStringBooleanPair;
  public likes?: iStringBooleanPair;
  public conversations?: string[];

  constructor(author: string | User, postData: iPost) {
    this.author = author;
    this.id = postData.id || uid(20);

    this.title = '';
    this.content = {
      text: '',
      editable: {
        blocks: [],
        entityMap: {}
      }
    };
    this.hasHero = false;
    this.createdAt = new Date();
    this.publishedOn = 0;
    this.archivedOn = 0;
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
      content: this.content,
      createdAt: useCase === 'save' ? (this.createdAt as Date).getTime() : this.createdAt,
      publishedOn: this.publishedOn,
      archivedOn: this.archivedOn,
      category: this.category, 
      state: this.state, 
      conversations: this.conversations,
      likes: this.likes, 
      hasHero: this.hasHero,
      hero: this.hero
    };
  }

  public static getPostStub(id: string): Post {
    return new Post(id, {
      id,
      author: id,
      title: '',
      hasHero: false,
      createdAt: new Date()
    });
  }
}