import iError from "./iError";
import iTest from "./iTest";
import { PostUpdateType } from "./iPost";
import User from "../models/User";
import Application from "../models/Application";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Reply from "../models/Reply";

export default interface iAction 
{
  type : number;
  date? : Date;
  error? : iError;
  user? : User;
  application? : Application;
  applications? : Application[];
  comment? : Comment;
  comments? : Comment[];
  conversations? : Comment[];
  reply? : Reply;
  replies? : Reply[];
  post? : Post;
  test? : iTest;
  data? : any; // data being passed to the reducer from this action
  id? : string; // id of document
  hero? : string; // url of post hero image
  updateType? : PostUpdateType; // post update type
  page? : number; // current page number for pagination
  provider? : string; // proveder used to link/unlink social accounts
  email? : string;
  credentials? : firebase.auth.AuthCredential;
  nEmail? : string; // new email
  nComment? : Comment; // new comment
  isReply? : boolean; // flag to tell if a comment is a reply
  parent? : string; // parent comment of reply
}