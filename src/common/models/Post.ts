import { uid } from "rand-token";

import User from "../models/User";
import iContentEditable from "../imodels/iContentEditable";
import iPost, { iPostState } from "../imodels/iPost";

export default class Post implements iPost {
  readonly id : string;
  author : User;
  title : string;
  excerpt : string;
  full : iContentEditable;
  hasHero : boolean;
  createdAt : number | Date;
  state : iPostState;
  conversations? : string[];
  category? : Object;
  likes? : Object;

  constructor(author : User, postData : iPost) {
    this.author = author;
    this.id = postData.id || uid(20);

    this.title = "";
    this.excerpt = "";
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
    }

    if (Object.keys(postData).length) {
      Object.assign(this, postData);
    }
  }

  public getPostData(useCase : string = "display") : iPost {
    const {
      id, title, author, excerpt, full,
      createdAt, category, state, conversations,
      likes, hasHero
    } = this;

    return {
      id, title, author, excerpt, full,
      createdAt: useCase === "save" ? (<Date>createdAt).getTime() : createdAt,
      category, state, conversations,
      likes, hasHero
    };
  }
}