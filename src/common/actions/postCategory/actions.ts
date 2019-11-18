import { ActionCreator } from '..';
import { Category } from '../actionTypes';
import { PostCategoryState } from '../../imodels/iAppState';
import PostCategory from '../../models/PostCategory';

export const addingCategory = () =>
  ActionCreator<Category>(Category.AddingCategory);

export const addingCategoryFailed = (error: Error) =>
  ActionCreator<Category, PostCategoryState>(Category.AddingCategoryFailed, { error });

export const addedCategory = () =>
  ActionCreator<Category>(Category.AddedCategory);

export const gettingCategory = () =>
  ActionCreator<Category>(Category.GettingCategory);
  
export const gettingCategoryFailed = (error: Error) =>
  ActionCreator<Category, PostCategoryState>(Category.GettingCategoryFailed, { error });

export const gotCategory = (category: PostCategory) =>
  ActionCreator<Category, PostCategoryState>(Category.GotCategory, { category });

export const gettingCategories = () =>
  ActionCreator<Category>(Category.GettingCategories);

export const gettingCategoriesFailed = (error: Error) =>
  ActionCreator<Category, PostCategoryState>(Category.GettingCategoriesFailed, { error });

export const gotCategories = (categories: PostCategory[]) =>
  ActionCreator<Category, PostCategoryState>(Category.GotCategories, { categories });

export const updatingCategory = () =>
  ActionCreator<Category>(Category.UpdatingCategory);

export const updatingCategoryFailed = (error: Error) =>
  ActionCreator<Category, PostCategoryState>(Category.UpdatingCategoryFailed, { error });

export const updatedCategory = () =>
  ActionCreator<Category>(Category.UpdatedCategoryPosts);

export const updatingCategoryPosts = () =>
  ActionCreator<Category>(Category.UpdatingCategoryPosts);

export const updatingCategoryPostsFailed = (error: Error) =>
  ActionCreator<Category, PostCategoryState>(Category.UpdatingCategoryPostsFailed, { error });

export const updatedCategoryPosts = (uCategory: PostCategory) =>
  ActionCreator<Category, PostCategoryState>(Category.UpdatedCategoryPosts, { uCategory});