import Post from '../../models/Post';
import Student from '../../models/Student';
import Accomplishment from '../../models/Accomplishment';
import NotificationsManager from '../../models/NotificationsManager';
import iAppState from '../../imodels';
import { Dispatch } from 'react';
import { Action } from '../../actions';
import { doCreatePost, doUpdateHero } from '../../actions/post/dispatchers';
import { doUpdateCategoryPosts } from '../../actions/postCategory/dispatchers';

export interface AddAccomplishmentProps {
  student: Student;
  edit: boolean;
  createNewPost: (post: Post) => void;
  updatePostHeroImage: (file: File, post: Post, refresh: boolean) => void;
  doClose: () => void;
}

export interface AddAccomplishmentState {
  student: Student;
  accomplishment: Accomplishment;
  notificationsManager: NotificationsManager;
}