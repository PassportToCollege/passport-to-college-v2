import iError from "./iError";
import iTest from "./iTest";
import iStats from "./iStats";
import { PostUpdateType } from "./iPost";
import User from "../models/User";
import Application from "../models/Application";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Reply from "../models/Reply";
import PostCategory from "../models/PostCategory";
import Feature from "../models/Feature";
import Student from "../models/Student";

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
  posts? : Post[];
  category? : PostCategory;
  categories? : PostCategory[];
  feature? : Feature;
  features? : Feature[];
  student? : Student;
  students? : Student[];
  test? : iTest;
  stats? : iStats; // website/data stats
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
  nCategory? : PostCategory; // new category
  isReply? : boolean; // flag to tell if a comment is a reply
  parent? : string; // parent comment of reply
  categoryName? : string // name of categoy=ry being added
  slug? : string; // category slug
}