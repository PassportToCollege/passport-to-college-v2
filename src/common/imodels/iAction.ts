import iError from "./iError";
import iTest from "./iTest";
import { PostUpdateType } from "./iPost";
import User from "../models/User";
import Application from "../models/Application";
import Post from "../models/Post";

export default interface iAction 
{
  type : number;
  date? : Date;
  error? : iError;
  user? : User;
  application? : Application;
  post? : Post;
  test? : iTest;
  data? : any; // data being passed to the reducer from this action
  id? : string; // id of podt
  hero? : string; // url of post hero image
  updateType? : PostUpdateType // post update type
}