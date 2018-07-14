import Cookies from "universal-cookie";
import moment from "moment";

import BadWords from "./badwords.en";

const cookies = new Cookies();

export const isBrowser = typeof window !== "undefined";

export const activeUser = () => {
  if (isAuthorized())
    return cookies.get("ssid").uid;

  return null;
};

export const isAuthorized = () => {
  return !!cookies.get("ssid");
};

export const isAdmin = () => {
  if (isAuthorized())
    return cookies.get("ssid").isAdmin;
  
    return false;
};

export const isApplicant = () => {
  if (isAuthorized())
    return cookies.get("ssid").isApplicant;
  
    return false;
};

export const isEmail = str => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  let emails = str.split(",");

  for (let email of emails) {
    if (!re.test(email))
      return re.test(email);
  }

  return true;
}

export const makeClassString = (classes = []) => {
  let str = "";
  
  if (!classes.length)
    return str;
    
  for (let c of classes) {
    str += `${c} `;
  }

  return str.trimRight();
}

export const sessionAge = () => {
  const { createdAt } = cookies.get("ssid");
  const end = moment(new Date());
  const age = moment.duration(end.diff(createdAt));

  return age.asHours();
};

export const getTestKey = test => {
  let key = test.subject.toLowerCase().replace(/\s/g, "-");
  key += `-${test.board.toLowerCase().replace(/\s/g, "-")}`;
  key += `-${test.examination.toLowerCase().replace(/\s/g, "-")}`;

  return key;
};

export const getWordCount = blocks => {
  let count = 0;

  if (blocks.length) {
    blocks.map(block => {
      let { text } = block;

      if (!text.length)
        return count;

      text = text.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        .replace(/\s{2,}/g, " ")
        .trim()
        .split(" ");

      count += text.length;
      return count;
    });
  }

  return count;
};

export const convertBlocksToText = blocks => {
  let result = "";

  if (blocks.length) {
    blocks.map(block => {
      let { text } = block;
      text = text.trim();
      result = `${result} ${text}`;

      return result;
    })
  }

  return result;
}

export const queryToObject = query => {
  if (query) {
    query = query.replace("?", "")
      .split("&");
  
    let output = {};
  
    query.map(q => {
      q = q.split("=");
      output[q[0]] = q[1];

      return q;
    });
  
    return output;
  }

  return null;
}

export const countLikes = likes => {
  likes = likes || {};
  const keys = Object.keys(likes);
  let count = 0;

  for (let key of keys) {
    if (likes[key])
      count++;
  }

  return count;
}

export const initializeFacebook = (d, s, id) => {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0&appId=${process.env.RAZZLE_FACEBOOK_APP_ID}&autoLogAppEvents=1`;
  fjs.parentNode.insertBefore(js, fjs);
}

export const getClassificationYear = classification => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  switch (classification) {
    case "freshman":
    case "freshmen":
      if (month <= 5)
        return year + 3;

      return year + 4;
    case "sophomore":
    case "sophomores":
      if (month <= 5)
        return year + 2;

      return year + 3;
    case "junior":
    case "juniors":
      if (month <= 5)
        return year + 1;

      return year + 2;
    case "senior":
    case "seniors":
      if (month <= 5)
        return year;

      return year + 1;
    default:
      return 0;
  }
}

// CLASSES

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
    const { uid, name, email, isAdmin, isApplicant, isStudent, isStaff, emailConfirmed, photo, hasProfilePicture } = this;
    return {
      uid, name, email,
      isAdmin, isApplicant, isStudent,
      isStaff, emailConfirmed, photo, hasProfilePicture
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
      uid, isAdmin, isApplicant, isStaff, isStudent,
      email, emailConfirmed, address, name, gender, role,
      dob, phone, photo
    } = this;

    return {
      uid, isAdmin, isApplicant, isStaff, isStudent,
      email, emailConfirmed, address, name, gender, role,
      dob, phone, photo
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

    return (
      !this.hasGraduated &&
      (this.graduationYear === year ||
      ((this.graduationYear - year === 1) &&
        month > 5))
    );
  }

  getData() {
    const {
      uid, user, bio, 
      enrollmentYear, graduationYear,
      university, highSchool, major, minor,
      isFeatured, showOnSite, hasGraduated
    } = this;

    return {
      uid, user, bio,
      enrollmentYear, graduationYear,
      university, highSchool, major, minor,
      isFeatured, showOnSite, hasGraduated
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

    return cookies.set("ssid", d, { path: "/", maxAge: 60 * 60 * 24 * 3 });
  }

  destroy() {
    return cookies.remove("ssid", { path: "/" });
  }
}

export class Comment {
  // TODO: search messages for bad words and censor
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
        let { text } = block;
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
      user, message, hasReplies, postedOn, post, isConversation, replies,
      isDeleted
    } = this;

    return {
      user, message, hasReplies, postedOn, post, isConversation, replies,
      isDeleted
    };
  }
}

export class Reply extends Comment {
  constructor(user = {}, content ={}, post, comment) {
    super(user, content, post);
    this.isConversation = false;
    this.parent = comment;
  }

  getData() {
    const { user, message, hasReplies, postedOn, parent, post, isDeleted } = this;

    return {
      user, message, hasReplies, postedOn, parent, post, isDeleted
    };
  }
}