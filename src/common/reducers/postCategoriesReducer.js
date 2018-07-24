import initialState from "./initialState";
import {
  CATEGORY_GET_INITIATED,
  CATEGORIES_GET_DONE,
  CATEGORY_GET_FAILED,
  CATEGORY_ADD_INITIATED,
  CATEGORY_ADD_FAILED,
  CATEGORY_ADDED,
  CATEGORIES_GET_INITIATED,
  CATEGORY_GET_DONE,
  CATEGORIES_GET_FAILED,
  CATEGORY_UPDATE_INITIATED,
  CATEGORY_UPDATE_FAILED,
  CATEGORY_UPDATED,
  UPDATE_CATEGORY_POSTS_INITIATED,
  UPDATE_CATEGORY_POSTS_FAILED,
  CATEGORY_POSTS_UPDATED
} from "../actions/actionTypes";

const postCategories = (state = initialState.postCategories, action) => {
  switch (action.type) {
    case CATEGORY_GET_INITIATED:
      return Object.assign({}, state, {
        gettingCategory: true,
        gotCategory: false,
        getCategoryFailed: false,
        isAdding: false,
        hasAdded: false,
        categoryAddFailed: false,
        isUpdating: false,
        hasUpdated: true,
        updateFailed: false,
        slug: action.slug
      });
    case CATEGORY_GET_FAILED:
      return Object.assign({}, state, {
        gettingCategory: false,
        gotCategory: false,
        getCategoryFailed: true,
        slug: action.slug,
        error: action.error
      });
    case CATEGORY_GET_DONE:
      return Object.assign({}, state, {
        gettingCategory: false,
        gotCategory: true,
        getCategoryFailed: false,
        category: action.category
      });
    case CATEGORY_ADD_INITIATED:
      return Object.assign({}, state, {
        isAdding: true,
        hasAdded: false,
        categoryAddFailed: false
      });
    case CATEGORY_ADD_FAILED:
      return Object.assign({}, state, {
        isAdding: false,
        hasAdded: false,
        categoryAddFailed: true,
        error: action.error
      });
    case CATEGORY_ADDED:
      return Object.assign({}, state, {
        isAdding: false,
        hasAdded: true,
        categoryAddFailed: false
      });
    case CATEGORIES_GET_INITIATED:
      return Object.assign({}, state, {
        gettingCategories: true,
        gotCategories: false,
        getCategoriesFailed: false,
        isAdding: false,
        hasAdded: false,
        categoryAddFailed: false,
        isUpdating: false,
        hasUpdated: true,
        updateFailed: false
      });
    case CATEGORIES_GET_DONE:
      return Object.assign({}, state, {
        gettingCategories: false,
        gotCategories: true,
        getCategoriesFailed: false,
        categories: action.categories
      });
    case CATEGORIES_GET_FAILED:
      return Object.assign({}, state, {
        gettingCategories: false,
        gotCategories: false,
        getCategoriesFailed: true,
        error: action.error
      });
    case CATEGORY_UPDATE_INITIATED:
      return Object.assign({}, state, {
        isUpdating: true,
        hasUpdated: false,
        updateFailed: false,
        slug: action.slug
      });
    case CATEGORY_UPDATE_FAILED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: false,
        updateFailed: true,
        slug: action.slug,
        error: action.error
      });
    case CATEGORY_UPDATED:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: true,
        updateFailed: false,
        slug: action.slug
      });
    case UPDATE_CATEGORY_POSTS_INITIATED:
      return Object.assign({}, state, {
        updatingCategoryPosts: true,
        updatedCategoryPosts: false,
        failedToUpdateCategoryPosts: false,
        slug: action.slug
      });
    case UPDATE_CATEGORY_POSTS_FAILED:
      return Object.assign({}, state, {
        updatingCategoryPosts: false,
        updatedCategoryPosts: false,
        failedToUpdateCategoryPosts: true,
        slug: action.slug,
        error: action.error
      });
    case CATEGORY_POSTS_UPDATED:
      return Object.assign({}, state, {
        updatingCategoryPosts: false,
        updatedCategoryPosts: true,
        failedToUpdateCategoryPosts: false,
        slug: null,
        uCategory: action.updatedCategory
      });
    default:
      return state;
  }
};

export default postCategories;