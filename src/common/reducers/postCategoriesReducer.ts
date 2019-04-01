import iAppState from "../imodels/iAppState";
import iAction from "../imodels/iAction";

import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";

const CategoryActions = ActionTypes.Category;

const postCategories = (state : iAppState["PostCategory"] = initialState.PostCategory, action : iAction) : iAppState["PostCategory"] => {
  switch (action.type) {
    case CategoryActions.GettingCategory:
      return Object.assign({}, state, {
        gettingCategory: true,
        gotCategory: false,
        getCategoryFailed: false,
        slug: action.slug
      });
    case CategoryActions.GettingCategoryFailed:
      return Object.assign({}, state, {
        gettingCategory: false,
        gotCategory: false,
        getCategoryFailed: true,
        slug: action.slug,
        error: action.error
      });
    case CategoryActions.GotCategory:
      return Object.assign({}, state, {
        gettingCategory: false,
        gotCategory: true,
        getCategoryFailed: false,
        category: action.category
      });
    case CategoryActions.AddingCategory:
      return Object.assign({}, state, {
        isAdding: true,
        hasAdded: false,
        categoryAddFailed: false
      });
    case CategoryActions.AddingCategoryFailed:
      return Object.assign({}, state, {
        isAdding: false,
        hasAdded: false,
        categoryAddFailed: true,
        error: action.error
      });
    case CategoryActions.AddedCategory:
      return Object.assign({}, state, {
        isAdding: false,
        hasAdded: true,
        categoryAddFailed: false
      });
    case CategoryActions.GettingCategories:
      return Object.assign({}, state, {
        gettingCategories: true,
        gotCategories: false,
        getCategoriesFailed: false
      });
    case CategoryActions.GotCategories:
      return Object.assign({}, state, {
        gettingCategories: false,
        gotCategories: true,
        getCategoriesFailed: false,
        categories: action.categories
      });
    case CategoryActions.GettingCategoriesFailed:
      return Object.assign({}, state, {
        gettingCategories: false,
        gotCategories: false,
        getCategoriesFailed: true,
        error: action.error
      });
    case CategoryActions.UpdatingCategory:
      return Object.assign({}, state, {
        isUpdating: true,
        hasUpdated: false,
        updateFailed: false,
        slug: action.slug
      });
    case CategoryActions.UpdatingCategoryFailed:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: false,
        updateFailed: true,
        slug: action.slug,
        error: action.error
      });
    case CategoryActions.UpdatedCategory:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: true,
        updateFailed: false,
        slug: action.slug
      });
    case CategoryActions.UpdatingCategoryPosts:
      return Object.assign({}, state, {
        updatingCategoryPosts: true,
        updatedCategoryPosts: false,
        failedToUpdateCategoryPosts: false,
        slug: action.slug
      });
    case CategoryActions.UpdatingCategoryPostsFailed:
      return Object.assign({}, state, {
        updatingCategoryPosts: false,
        updatedCategoryPosts: false,
        failedToUpdateCategoryPosts: true,
        slug: action.slug,
        error: action.error
      });
    case CategoryActions.UpdatedCategoryPosts:
      return Object.assign({}, state, {
        updatingCategoryPosts: false,
        updatedCategoryPosts: true,
        failedToUpdateCategoryPosts: false,
        slug: null,
        uCategory: action.category
      });
    default:
      return state;
  }
};

export default postCategories;