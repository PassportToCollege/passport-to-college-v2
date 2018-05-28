import Cookies from "universal-cookie";
import moment from "moment";

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

export class User {
  constructor(uid, email, name, options) {
    this.uid = uid;
    this.email = email;
    this.isAdmin = options.admin || false;
    this.isApplicant = options.applicant || false;
    this.isStudent = options.student || false;
    this.isStaff = options.staff || false;
    this.emailConfirmed = options.emailConfirmed || false;
    this.photo = options.photo || "";

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
  }

  get data() {   
    return this.getData(); 
  }

  getData() {
    const { uid, name, email, isAdmin, isApplicant, isStudent, isStaff, emailConfirmed, photo } = this;
    return {
      uid, name, email,
      isAdmin, isApplicant, isStudent,
      isStaff, emailConfirmed, photo
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

    return cookies.set("ssid", d, { path: "/", maxAge: 60 * 60 * 24 });
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
      text: convertBlocksToText(content.blocks),
      html: content
    };
    this.post = post;
    this.isConversation = true;
    this.hasReplies = false;
    this.replies = 0;
    this.postedOn = new Date(moment.utc(moment()).toDate()).getTime();
  }

  get data() {   
    return this.getData(); 
  }

  getData() {
    const { user, message, hasReplies, postedOn, post, isConversation } = this;

    return {
      user, message, hasReplies, postedOn, post, isConversation
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
    const { user, message, hasReplies, postedOn, parent, post } = this;

    return {
      user, message, hasReplies, postedOn, parent, post
    };
  }
}