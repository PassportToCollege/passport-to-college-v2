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
  createdAt : Date;
  state : iPostState;
  conversations? : string[];
  category? : Object;
  likes? : Object;

  constructor(author : User, postData : iPost) {
    this.author = author;
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

  getPostData(useCase : string = "display") : Object {
    const {
      id, title, author, excerpt, full,
      createdAt, category, state, conversations,
      likes, hasHero
    } = this;

    return {
      id, title, author, excerpt, full,
      createdAt: useCase === "save" ? createdAt.getTime() : createdAt,
      category, state, conversations,
      likes, hasHero
    };
  }
}