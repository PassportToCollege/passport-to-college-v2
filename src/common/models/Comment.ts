import iComment from "../imodels/iComment";
import iContentEditable from "../imodels/iContentEditable";
import User from "./User";
import Post from "./Post";

import BadWords from "../utils/badwords.en";

export default class Comment implements iComment {
  User : User;
  message : {
    text : string,
    html : iContentEditable
  };
  Post : Post;
  postedOn : Date;
  isConversation : boolean;
  isDeleted : boolean;
  hasReplies : boolean;
  replies? : string[];

  constructor(user : User, post : Post, content : iContentEditable, meta : Object = {}) {
    this.User = user;
    this.Post = post;
  }

  private censorContent(content : iContentEditable) : iContentEditable {
    const bwKeys : string[] = Object.keys(BadWords);
    let { blocks } = content;
    
    for (let badWord of bwKeys) {
      const re = new RegExp(badWord, "gi");
      const hearts = this.heartify(badWord.length);

      for (let block of blocks) {
        let {
          text
        } = block;
        const bwi = text.toLowerCase().indexOf(badWord);

        if (bwi > -1) {
          block.text = text.replace(re, hearts);
        }
      }
    }
  }

  private heartify(length : number) : string {
    let r = "";

    for (let i = 0; i < length; i++)
      r += "*";

    return r;
  }
}