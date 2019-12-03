import iTest from './iTest';
import iStats from './iStats';
import { PostUpdateType } from './iPost';
import User from '../models/User';
import Application from '../models/Application';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Reply from '../models/Reply';
import PostCategory from '../models/PostCategory';
import Feature from '../models/Feature';
import Student from '../models/Student';
import { UserType } from './iUser';
import iContentEditable from './iContentEditable';

export default interface iAction {
  type: number;
  date?: Date;
  error?: Error;
  user?: User;
  users?: User[];
  founder?: User;
  staff?: User[];
  application?: Application;
  applications?: Application[];
  comment?: Comment;
  comments?: Comment[];
  conversations?: Comment[];
  reply?: Reply;
  replies?: Reply[];
  post?: Post;
  posts?: Post[];
  category?: PostCategory;
  categories?: PostCategory[];
  feature?: Feature;
  features?: Feature[];
  student?: Student;
  students?: Student[];
  current?: Student[];
  past?: Student[];
  test?: iTest;
  userType?: UserType;
  bio?: iContentEditable;
  stats?: iStats; // website/data stats
  data?: any; // data being passed to the reducer from this action
  id?: string; // id of document
  ids?: string[];
  hero?: string; // url of post hero image
  updateType?: PostUpdateType; // post update type
  page?: number; // current page number for pagination
  provider?: string; // provider used to link/unlink social accounts
  email?: string;
  credentials?: firebase.auth.AuthCredential;
  nEmail?: string; // new email
  nComment?: Comment; // new comment
  nCategory?: PostCategory; // new category
  changedComment?: Comment; // comment that was either added or removed
  isReply?: boolean; // flag to tell if a comment is a reply
  parent?: string; // parent comment of reply
  categoryName?: string; // name of category being added
  slug?: string; // category slug
}