import iComment from "../imodels/iComment";
import iContentEditable from "../imodels/iContentEditable";
import User from "./User";
import Post from "./Post";

import BadWords from "../utils/badwords.en";
import { convertBlocksToText } from "../utils";

export default class Comment implements iComment {
  User : User;
  message : {
    text : string,
    html : iContentEditable
  };
  Post : Post;
  postedOn? : Date;
  isConversation? : boolean;
  isDeleted? : boolean;
  hasReplies? : boolean;
  replies? : string[];

  constructor(user : User, post : Post, content : iContentEditable, meta : any = {}) {
    this.User = user;
    this.Post = post;
    this.message = {
      text: convertBlocksToText(content.blocks),
      html: content
    };

    this.postedOn = meta.postedOn || new Date();
    this.isConversation = !!meta.isConversation;
    this.isDeleted = !!meta.isDeleted;
    this.hasReplies = !!meta.hasReplies;
    this.replies = meta.replies || [];

  }

  public censorContent(content : iContentEditable) : iContentEditable {
    let { blocks } = content;
    
    for (let block of blocks)
      block.text = this.censorText(block.text);

    return { blocks, entityMap: content.entityMap };
  }

  public censorText(text : string) : string {
    const bwKeys: string[] = Object.keys(BadWords);

    for (let badword of bwKeys) {
      const re : RegExp = new RegExp(badword, "gi");
      const hearts : string = this.heartify(badword.length);
      const bwi : number = text.toLowerCase().indexOf(badword)

      if (bwi > -1) {
        text = text.replace(re, hearts);
      }
    }

    return text;
  }

  private heartify(length : number) : string {
    let r = "";

    for (let i = 0; i < length; i++)
      r += "*";

    return r;
  }

  public getData() : Object {
    const {
      User,
      message,
      hasReplies,
      postedOn,
      Post,
      isConversation,
      replies,
      isDeleted
    } = this;

    return {
      User,
      message,
      hasReplies,
      postedOn,
      Post,
      isConversation,
      replies,
      isDeleted
    };
  }
}