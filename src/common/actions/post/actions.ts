import { ActionCreator } from '..';
import { Post as _ } from '../actionTypes';
import { PostState } from '../../imodels/iAppState';
import Post from '../../models/Post';
import { PostUpdateType } from '../../imodels/iPost';
import Comment from '../../models/Comment';

export const creatingPost = () =>
  ActionCreator<_>(_.CreatingPost);

export const creatingPostFailed = (error: Error) =>
  ActionCreator<_, PostState>(_.CreatingPostFailed, { error });

export const createdPost = (id: string) =>
  ActionCreator<_, PostState>(_.CreatedPost, { id });

export const updatingHero = () =>
  ActionCreator<_>(_.UpdatedHero);

export const updatingHeroFailed = (error: Error) =>
  ActionCreator<_, PostState>(_.UpdatingHeroFailed, { error });

export const updatedHero = () =>
  ActionCreator<_>(_.UpdatedHero);

export const gettingPost = () =>
  ActionCreator<_>(_.GettingPost);

export const gettingPostFailed = (error: Error) =>
  ActionCreator<_, PostState>(_.GettingPostFailed, { error });

export const gotPost = (post: Post) =>
  ActionCreator<_, PostState>(_.GotPost, { post });

export const gettingHero = () =>
  ActionCreator<_>(_.GettingHero);

export const gettingHeroFailed = (error: Error) =>
  ActionCreator<_, PostState>(_.GettingHeroFailed, { error });

export const gotHero = (hero: string) =>
  ActionCreator<_, PostState>(_.GotHero, { hero });

export const updatingPost = () =>
  ActionCreator<_>(_.UpdatingPost);

export const updatingPostFailed = (error: Error) =>
  ActionCreator<_, PostState>(_.UpdatingPostFailed, { error });

export const updatedPost = () =>
  ActionCreator<_>(_.UpdatedPost);

export const updatedLocalConversationsCount = (postUpdateType: PostUpdateType, changedComment: Comment) =>
  ActionCreator<_, PostState>(_.UpdateLocalConversationsCount, {
    postUpdateType,
    changedComment
  });

export const deletingPost = () =>
  ActionCreator<_>(_.DeletedPost);

export const deletingPostFailed = (error: Error) =>
  ActionCreator<_, PostState>(_.DeletingPostFailed, { error });

export const deletedPost = () =>
  ActionCreator<_>(_.DeletedPost);