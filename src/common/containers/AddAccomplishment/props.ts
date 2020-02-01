import Post from '../../models/Post';
import Student from '../../models/Student';
import Accomplishment from '../../models/Accomplishment';
import NotificationsManager from '../../models/NotificationsManager';
import iAppState from '../../imodels/iAppState';
import { Dispatch } from 'react';
import { Action } from '../../actions';
import { doCreatePost, doUpdateHero } from '../../actions/post/dispatchers';
import { doUpdateCategoryPosts } from '../../actions/postCategory/dispatchers';
import { PostUpdateType } from '../../imodels/iPost';

export interface AddAccomplishmentProps {
  student: Student;
  edit: boolean;
  createNewPost: (post: Post) => void;
  updatePostHeroImage: (file: File, post: Post) => void;
  updatePostsCategory: () => void;
  doClose: () => void;
}

export interface AddAccomplishmentState {
  student: Student;
  accomplishment: Accomplishment;
  notificationsManager: NotificationsManager;
  hero?: File;
}

export const mapStateToProps = (state: iAppState) => {
  return {
    post: state.Post,
    postCategory: state.PostCategory
  };
};

export const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => {
  return {
    updatePostHeroImage: (file: File, post: Post) => doUpdateHero(dispatch, file, post),
    createNewPost: (post: Post) => doCreatePost(dispatch, post),
    updatePostsCategory: () => doUpdateCategoryPosts(dispatch, 'student_accomplishments', PostUpdateType.Increase)
  };
};