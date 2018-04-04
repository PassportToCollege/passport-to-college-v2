import * as types from "./actionTypes";
import { db } from "../utils/firebase";

// SET actions
export const addCategoryInitiated = () => {
  return {
    type: types.CATEGORY_ADD_INITIATED
  };
};

export const addCategoryFailed = error => {
  return {
    type: types.CATEGORY_ADD_FAILED,
    error
  };
};

export const categoryAdded = () => {
  return {
    type: types.CATEGORY_ADDED
  };
};

export const doCategoryAdd = (category, options = {}) => {
  return dispatch => {
    dispatch(addCategoryInitiated());

    const slug = category.toLowerCase().split(" ").join("-");

    db.collection("post-categories")
      .doc(slug)
      .set({
        slug,
        posts: 0,
        name: category
      }, { merge: true })
      .then(() => {
        dispatch(categoryAdded());

        if (options.refresh)
          return dispatch(doCategoriesGet());
      })
      .catch(error => {
        return dispatch(addCategoryFailed(error));
      })
  };
};

// GET actions
export const categoryGetInitiated = category => {
  return {
    type: types.CATEGORY_GET_INITIATED,
    slug: category
  };
};

export const categoryGetDone = category => {
  return {
    type: types.CATEGORY_GET_DONE,
    category
  };
};

export const categoryGetFailed = (error, category) => {
  return {
    type: types.CATEGORY_GET_FAILED,
    error, 
    slug: category
  };
};

export const doCategoryGet = category => {
  return dispatch => {
    dispatch(categoryGetInitiated(category));

    return db.collection("post-categories")
      .doc(category)
      .get()
      .then(category => {
        return dispatch(categoryGetDone(category.data()));
      })
      .catch(error => {
        return dispatch(categoryGetFailed(error, category));
      })
  };
};

export const categoriesGetInitiated = () => {
  return {
    type: types.CATEGORIES_GET_INITIATED
  };
};

export const categoriesGetDone = categories => {
  return {
    type: types.CATEGORIES_GET_DONE,
    categories
  };
};

export const categoriesGetFailed = error => {
  return {
    type: types.CATEGORIES_GET_FAILED,
    error
  };
};

export const doCategoriesGet = () => {
  return dispatch => {
    dispatch(categoryGetInitiated());

    return db.collection("post-categories")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(categoriesGetFailed({ message: "no categories found" }));
        
        let categories = [];
        snapshots.forEach(snapshot => {
          categories.push(snapshot.data());
        });

        return dispatch(categoryGetDone(categories));
      })
      .catch(error => {
        return dispatch(categoriesGetFailed(error));
      })
  };
};

// UPDATE actions
export const categoryUpdateInitiated = slug => {
  return {
    type: types.CATEGORY_UPDATE_INITIATED,
    slug
  };
};

export const categoryUpdateFailed = (error, slug) => {
  return {
    type: types.CATEGORY_UPDATE_FAILED,
    slug, error
  };
};

export const categoryUpdated = slug => {
  return {
    type: types.CATEGORY_UPDATED,
    slug
  };
};

export const doCategoryUpdate = (slug, data = {}, options = {}) => {
  return dispatch => {
    dispatch(categoryUpdateInitiated(slug));

    return db.collection("post-collections")
      .doc(slug)
      .update(data)
      .then(() => {
        dispatch(categoryUpdated(slug));

        if (options.refresh)
          return dispatch(doCategoriesGet());
      })
      .catch(error => {
        dispatch(categoryUpdateFailed(error, slug));
      });
  };
};