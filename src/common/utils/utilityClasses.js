import Cookies from "universal-cookie";
import moment from "moment";
import { uid } from "rand-token";

import BadWords from "./badwords.en";
import { convertBlocksToText, isEmail } from ".";
import { auth } from "./firebase";

const cookies = new Cookies();

export class User {
  constructor(uid = "", email = "", name = "", options = {}) {
    this.uid = uid;
    this.email = email;
    this.isAdmin = options.admin || false;
    this.isApplicant = options.applicant || false;
    this.isStudent = options.student || false;
    this.isStaff = options.staff || false;
    this.hasProfilePicture = options.hasProfilePicture || !!options.photo || false;
    this.emailConfirmed = options.emailConfirmed || false;
    this.photo = options.photo || "";

    if (name.length) {
      let n = name.split(" ");
      if (n.length === 3) {
        this.name = {
          first: n[0],
          middle: n[1],
          last: n[2],
          full: [n[0], n[2]].join(" ")
        }
      } else {
        this.name = {
          first: n[0],
          last: n[1],
          full: name
        }
      }
    } else {
      this.name = {};
    }
  }

  get data() {
    return this.getData();
  }

  getData() {
    const {
      uid,
      name,
      email,
      isAdmin,
      isApplicant,
      isStudent,
      isStaff,
      emailConfirmed,
      photo,
      hasProfilePicture
    } = this;
    return {
      uid,
      name,
      email,
      isAdmin,
      isApplicant,
      isStudent,
      isStaff,
      emailConfirmed,
      photo,
      hasProfilePicture
    };
  }
}

export class DefaultUser {
  constructor(data = {}) {
    this.uid = null;
    this.isAdmin = false;
    this.isApplicant = false;
    this.isStudent = false;
    this.isStaff = false;
    this.emailConfirmed = false;
    this.address = {};
    this.name = {};
    this.gender = null;
    this.role = null;
    this.dob = null;
    this.email = null;
    this.phone = null;
    this.photo = null;

    if (Object.keys(data).length) {
      Object.assign(this, data);
    }

    if (this.email && !isEmail(this.email)) {
      this.email = null;
    }

    if (Object.keys(this.name).length)
      this.name.full = `${this.name.first} ${this.name.last}`;
  }

  get data() {
    return this.getData();
  }

  get isComplete() {
    return !!(
      this.uid &&
      (this.address && this.address.country) &&
      (this.name && this.name.first && this.name.last) &&
      this.gender &&
      this.dob &&
      this.email
    );
  }

  get missingProps() {
    let props = [];

    if (!this.uid)
      props.push("uid");

    if (!this.email)
      props.push("email");

    if (!this.name.first)
      props.push("name.first");

    if (!this.name.last)
      props.push("name.last");

    if (!this.address.country)
      props.push("country");

    if (!this.gender)
      props.push("gender");

    if (!this.dob)
      props.push("dob");

    if (this.isStaff && !this.role)
      props.push("role");


    return props;
  }

  getData() {
    const {
      uid,
      isAdmin,
      isApplicant,
      isStaff,
      isStudent,
      email,
      emailConfirmed,
      address,
      name,
      gender,
      role,
      dob,
      phone,
      photo
    } = this;

    return {
      uid,
      isAdmin,
      isApplicant,
      isStaff,
      isStudent,
      email,
      emailConfirmed,
      address,
      name,
      gender,
      role,
      dob,
      phone,
      photo
    }
  }
}

export class Student {
  constructor(student = {}, user = {}) {
    this.user = user;

    this.uid = user.uid;
    this.bio = student.bio || {};
    this.enrollmentYear = parseInt(student.enrollmentYear, 10) || null;
    this.graduationYear = parseInt(student.graduationYear, 10) || null;
    this.university = student.university || null;
    this.highSchool = student.highSchool || null;
    this.major = student.major || null;
    this.minor = student.minor || null;
    this.isFeatured = !!student.isFeatured;
    this.showOnSite = !!student.showOnSite;
    this.hasGraduated = !!student.hasGraduated;
  }

  get data() {
    return this.getData();
  }

  get isComplete() {
    return !!(
      this.uid &&
      Object.keys(this.bio).length &&
      this.enrollmentYear &&
      this.graduationYear &&
      this.major &&
      this.university &&
      Object.keys(this.user)
    );
  }

  get isFreshman() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (
      this.enrollmentYear === year ||
      ((this.graduationYear - year === 3) &&
        month <= 5)
    );
  }

  get isSophomore() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (
      (year - this.enrollmentYear === 1) ||
      ((this.graduationYear - year === 2) &&
        month <= 5)
    );
  }

  get isJunior() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (
      (year - this.enrollmentYear === 2) ||
      ((this.graduationYear - year === 1) &&
        month <= 5)
    );
  }

  get isSenior() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (!this.hasGraduated &&
      (this.graduationYear === year ||
        ((this.graduationYear - year === 1) &&
          month > 5))
    );
  }

  get classification() {
    if (this.isFreshman)
      return "freshman";

    if (this.isSophomore)
      return "sophomore";

    if (this.isJunior)
      return "junior";

    return "senior";
  }

  getData() {
    const {
      uid,
      user,
      bio,
      enrollmentYear,
      graduationYear,
      university,
      highSchool,
      major,
      minor,
      isFeatured,
      showOnSite,
      hasGraduated
    } = this;

    return {
      uid,
      user,
      bio,
      enrollmentYear,
      graduationYear,
      university,
      highSchool,
      major,
      minor,
      isFeatured,
      showOnSite,
      hasGraduated
    };
  }
}

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
      likes
    } = this;

    return {
      id, title, author, excerpt, full,
      createdAt, category, state, conversations,
      likes
    };
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
      likes, isAccomplishment, student
    } = this;

    return {
      id, title, author, excerpt, full,
      createdAt, category, state, conversations,
      likes, isAccomplishment, student
    };
  }
}