import Cookies from "universal-cookie";
import moment from "moment";
import { uid as Uid } from "rand-token";

import BadWords from "./badwords.en";
import { convertBlocksToText, isEmail } from ".";
import { auth } from "./firebase";



export class Post {
  constructor(postOrTitle = "", author = "", excerpt = "", full = {}, meta = {}) {
    if ("object" === typeof postOrTitle) {
      Object.assign(this, postOrTitle);
    }

    if("string" === typeof postOrTitle) {
      this.title = postOrTitle;
      this.author = author || auth.currentUser.uid;
      this.excerpt = excerpt;
      this.full = full;
      
      Object.assign(this, meta);
    }

    this.id = this.id || uid(20);
    this.hasHero = !!this.hasHero;
    this.createdAt = this.createdAt || new Date().getTime();
    this.state = this.state || {
      draft: true,
      published: false,
      archived: false
    }
    this.conversations = this.conversations || 0;
    this.category = this.category || {};
    this.likes = this.likes || {};
  }

  get data() {
    return this.getData();
  }

  getData() {
    const {
      id, title, author,excerpt, full,
      createdAt, category, state, conversations,
      likes, hasHero
    } = this;

    return {
      id, title, author, excerpt, full,
      createdAt, category, state, conversations,
      likes, hasHero
    };
  }

  set hero(hasHero) {
    this.hasHero = hasHero;
  }
}

export class Accomplishment extends Post {
  constructor(post = {}, student = "") {
    super(post);

    this.isAccomplishment = true;
    this.category = { student_accomplishments: true };
    this.student = student;
  }

  get data() {
    return this.getData();
  }

  getData() {
    const {
      id, title, author,excerpt, full,
      createdAt, category, state, conversations,
      likes, isAccomplishment, student, hasHero
    } = this;

    return {
      id, title, author, excerpt, full,
      createdAt, category, state, conversations,
      likes, isAccomplishment, student, hasHero
    };
  }
}