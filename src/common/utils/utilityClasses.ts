import Cookies from "universal-cookie";
import moment from "moment";
import { uid as Uid } from "rand-token";

import BadWords from "./badwords.en";
import { convertBlocksToText, isEmail } from ".";
import { auth } from "./firebase";

const cookies = new Cookies();

export class SSID {
  constructor(user) {
    this.user = user || {};
  }

  create() {
    const d = {
      uid: this.user.uid,
      isAdmin: this.user.isAdmin,
      isApplicant: this.user.isApplicant,
      isStaff: this.user.isStaff,
      isStudent: this.user.isStudent,
      createdAt: new Date()
    }

    return cookies.set("ssid", d, {
      path: "/",
      maxAge: 60 * 60 * 24 * 3
    });
  }

  destroy() {
    return cookies.remove("ssid", {
      path: "/"
    });
  }
}

export class Comment {
  constructor(user = {}, content = {}, post) {
    this.user = user;
    this.message = {
      text: this.censorText(convertBlocksToText(content.blocks)),
      html: {
        entityMap: content.entityMap,
        blocks: this.censorBlocks(content.blocks)
      }
    };
    this.post = post;
    this.isConversation = true;
    this.isDeleted = false;
    this.hasReplies = false;
    this.replies = 0;
    this.postedOn = new Date(moment.utc(moment()).toDate()).getTime();
  }

  get data() {
    return this.getData();
  }

  censorBlocks(blocks) {
    const bwKeys = Object.keys(BadWords);

    for (let badword of bwKeys) {
      const re = new RegExp(badword, "gi");
      const hearts = this.heartify(badword.length);

      for (let block of blocks) {
        let {
          text
        } = block;
        const bwi = text.toLowerCase().indexOf(badword);

        if (bwi > -1) {
          block.text = text.replace(re, hearts);
        }
      }
    }

    return blocks;
  }

  censorText(text) {
    const bwKeys = Object.keys(BadWords);

    for (let badword of bwKeys) {
      const re = new RegExp(badword, "gi");
      const hearts = this.heartify(badword.length);
      const bwi = text.toLowerCase().indexOf(badword)

      if (bwi > -1) {
        text = text.replace(re, hearts);
      }
    }

    return text;
  }

  heartify(length) {
    let r = "";

    for (let i = 0; i < length; i++)
      r += "*";

    return r;
  }

  getData() {
    const {
      user,
      message,
      hasReplies,
      postedOn,
      post,
      isConversation,
      replies,
      isDeleted
    } = this;

    return {
      user,
      message,
      hasReplies,
      postedOn,
      post,
      isConversation,
      replies,
      isDeleted
    };
  }
}

export class Reply extends Comment {
  constructor(user = {}, content = {}, post, comment) {
    super(user, content, post);
    this.isConversation = false;
    this.parent = comment;
  }

  getData() {
    const {
      user,
      message,
      hasReplies,
      postedOn,
      parent,
      post,
      isDeleted
    } = this;

    return {
      user,
      message,
      hasReplies,
      postedOn,
      parent,
      post,
      isDeleted
    };
  }
}

export class Interval {
  constructor(fn, time = 2000) {
    if ("function" === typeof fn) {
      this.fn = fn;
    } else {
      this.fn = () => {
        console.log("interval running");
      };
    }

    this.time = time;
  }

  start() {
    this.interval = setInterval(() => {
      this.fn();
    }, this.time);

    return this.interval;
  }

  stop() {
    clearInterval(this.interval);
    return this;
  }

  restart() {
    return this.stop().start();
  }

  reset(time) {
    this.time = time;

    return this.restart();
  }
}

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

export class Feature extends Post {
  constructor(post = {}, active = true, student = "", expiration = "") {
    super(post);

    this.isFeature = true;
    this.category = { student_features: true };
    this.isActive = !!active;
    this.student = student;
    this.expiration = expiration;
  }

  get data() {
    return this.getData();
  }

  getData() {
    const {
      id, title, author,excerpt, full,
      createdAt, category, state, conversations,
      likes, isFeature, student, expiration, hasHero,
      isActive
    } = this;

    return {
      id, title, author, excerpt, full,
      createdAt, category, state, conversations,
      likes, isFeature, student, expiration, hasHero,
      isActive
    };
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