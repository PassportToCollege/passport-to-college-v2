import { ActionCreator } from '..';
import { Posts } from '../actionTypes';
import { PostsState } from '../../imodels/iAppState';
import Post from '../../models/Post';

export const gettingPosts = () =>
  ActionCreator<Posts>(Posts.GettingPosts);

export const gettingPostsFailed = (error: Error) =>
  ActionCreator<Posts, PostsState>(Posts.GettingPostsFailed, { error });

export const gotPosts = (posts: Post[]) =>
  ActionCreator<Posts, PostsState>(Posts.GotPosts, { posts });

export const gettingMostRecentPosts = () =>
  ActionCreator<Posts>(Posts.GettingMostRecentPosts);

export const gettingMostRecentPostsFailed = (error: Error) =>
  ActionCreator<Posts, PostsState>(Posts.GettingMostRecentPostsFailed, { error });

export const gotMostRecentPosts = (posts: Post[]) =>
  ActionCreator<Posts, PostsState>(Posts.GotMostRecentPosts, { posts });

export const gettingMostRecentPostsByCategory = () =>
  ActionCreator<Posts>(Posts.GettingMostRecentPosts_ByCategory);

export const gettingMostRecentPostsByCategoryFailed = (error: Error) =>
  ActionCreator<Posts, PostsState>(Posts.GettingMostRecentPostsFailed_ByCategory, { error });

export const gotMostRecentPostsByCategory = (posts: Post[]) =>
  ActionCreator<Posts, PostsState>(Posts.GotMostRecentPosts_ByCategory, { posts });

export const paginatingPosts = () =>
  ActionCreator<Posts>(Posts.PaginatingPosts);

export const paginatingPostsFailed = (error: Error) =>
  ActionCreator<Posts, PostsState>(Posts.PaginatingPostFailed, { error });

export const paginatedPosts = (posts: Post[], page: number) =>
  ActionCreator<Posts, PostsState>(Posts.PaginatedPosts, { posts, page});

export const gettingAccomplishments = () =>
  ActionCreator<Posts>(Posts.GettingAccomplishments);

export const gettingAccomplishmentsFailed = (error: Error) =>
  ActionCreator<Posts, PostsState>(Posts.GettingAccomplishmentsFailed, { error });

export const gotAccomplishments = (accomplishments: Post[]) =>
  ActionCreator<Posts, PostsState>(Posts.GotAccomplishments, { accomplishments });