import iError from "../imodels/iError";
import iAction from "../imodels/iAction";
import iPostCategory from "../imodels/iPostCategory"
import PostCategory from "../models/PostCategory";

import ActionTypes from "./actionTypes";
import { db } from "../utils/firebase";
import { PostUpdateType } from "../imodels/iPost";

const CategoryActions = ActionTypes.Category

// SET actions
export const addCategoryInitiated = (name : string) : iAction => {
  return {
    type: CategoryActions.AddingCategory,
    categoryName : name
  };
};

export const addCategoryFailed = (error : iError) : iAction => {
  return {
    type: CategoryActions.AddingCategoryFailed,
    error
  };
};

export const categoryAdded = (nCategory : PostCategory) : iAction => {
  return {
    type: CategoryActions.AddedCategory,
    nCategory
  };
};

export const doCategoryAdd = (name : string, posts : number = 0, slug : string = "", refresh : boolean = false) : any => {
  return (dispatch : any) => {
    dispatch(addCategoryInitiated(name));

    const category = new PostCategory(name, slug, posts);

    db.collection("post-categories")
      .doc(category.slug)
      .set(category.data, { merge: true })
      .then(() => {
        dispatch(categoryAdded(category));

        if (refresh)
          return dispatch(doCategoriesGet());
      })
      .catch((error : iError) => {
        return dispatch(addCategoryFailed(error));
      })
  };
};

// GET actions
export const categoryGetInitiated = (slug : string) : iAction => {
  return {
    type: CategoryActions.GettingCategory,
    slug
  };
};

export const categoryGetDone = (category : PostCategory) : iAction => {
  return {
    type: CategoryActions.GotCategory,
    category
  };
};

export const categoryGetFailed = (error : iError, slug : string) : iAction => {
  return {
    type: CategoryActions.GettingCategoryFailed,
    error, slug
  };
};

export const doCategoryGet = (slug : string) : any => {
  return (dispatch : any) => {
    dispatch(categoryGetInitiated(slug));

    return db.collection("post-categories")
      .doc(slug)
      .get()
      .then((snapshot : firebase.firestore.DocumentSnapshot) => {
        if (snapshot.exists)
        {
          let snapshotData = <iPostCategory>snapshot.data();
          const category = new PostCategory(snapshotData.name, snapshotData.slug, snapshotData.posts);
          
          return dispatch(categoryGetDone(category));
        }

        dispatch(categoryGetFailed({
          message: `No category matching slug: [${slug}] was found.`
        }, slug));
      })
      .catch((error : iError) => {
        dispatch(categoryGetFailed(error, slug));
      })
  };
};

export const categoriesGetInitiated = () : iAction => {
  return {
    type: CategoryActions.GettingCategories
  };
};

export const categoriesGetDone = (categories : PostCategory[]) : iAction => {
  return {
    type: CategoryActions.GotCategories,
    categories
  };
};

export const categoriesGetFailed = (error : iError) : iAction => {
  return {
    type: CategoryActions.GettingCategoriesFailed,
    error
  };
};

export const doCategoriesGet = () : any => {
  return (dispatch : any) => {
    dispatch(categoriesGetInitiated());

    return db.collection("post-categories")
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty)
          return dispatch(categoriesGetFailed({ message: "no categories found" }));
        
        let categories : PostCategory[] = [];
        snapshots.forEach(snapshot => {
          let snapshotData = <iPostCategory>snapshot.data();
          const category = new PostCategory(snapshotData.name, snapshotData.slug, snapshotData.posts);

          categories.push(category);
        });

        return dispatch(categoriesGetDone(categories));
      })
      .catch((error : iError) => {
        return dispatch(categoriesGetFailed(error));
      })
  };
};

// UPDATE actions
export const categoryUpdateInitiated = (slug : string, data : iPostCategory) : iAction => {
  return {
    type: CategoryActions.UpdatingCategory,
    slug, data
  };
};

export const categoryUpdateFailed = (error : iError, slug : string, data : iPostCategory) : iAction => {
  return {
    type: CategoryActions.UpdatingCategoryFailed,
    slug, error, data
  };
};

export const categoryUpdated = (slug : string, data : iPostCategory) : iAction => {
  return {
    type: CategoryActions.UpdatedCategory,
    slug
  };
};

export const doCategoryUpdate = (slug : string, data : iPostCategory, refresh : boolean = false) : any => {
  return (dispatch : any) => {
    dispatch(categoryUpdateInitiated(slug, data));
    
    return db.collection("post-categories")
      .doc(slug)
      .update(data, { merge: true })
      .then(() => {
        dispatch(categoryUpdated(slug, data));

        if (refresh)
          return dispatch(doCategoriesGet());
      })
      .catch((error : iError) => {
        dispatch(categoryUpdateFailed(error, slug, data));
      });
  };
};

export const updateCategoryPostsInitiated = (slug : string) : iAction => {
  return {
    type: CategoryActions.UpdatingCategoryPosts,
    slug
  };
};

export const updateCategoryPostsFailed = (error : iError, slug : string) : iAction => {
  return {
    type: CategoryActions.UpdatingCategoryPostsFailed,
    slug, error
  };
};

export const updatedCategoryPosts = (updatedCategory : PostCategory) : iAction => {
  return {
    type: CategoryActions.UpdatedCategoryPosts,
    nCategory: updatedCategory
  };
};

export const doCategoryPostsUpdate = (slug : string, operation : PostUpdateType = PostUpdateType.Increase) : any => {
  return (dispatch : any) => {
    dispatch(updateCategoryPostsInitiated(slug));

    const categoryRef = db.collection("post-categories").doc(slug);
    let updatedCategory : PostCategory;

    return db.runTransaction((transaction : firebase.firestore.Transaction) => {
      return transaction.get(categoryRef)
        .then(snapshot => {
          const categoryData = <PostCategory>snapshot.data();
          let category = new PostCategory(categoryData.name, categoryData.slug, categoryData.posts);

          if (operation === PostUpdateType.Increase) {
            category.increasePosts();
          } else {
            category.decreasePost();
          }

          updatedCategory = category;
          transaction.update(categoryRef, { posts: category.posts });
        });
    })
    .then(() => {
      dispatch(updatedCategoryPosts(updatedCategory));
    })
    .catch((error : iError) => {
      dispatch(updateCategoryPostsFailed(error, slug));
    });
  };
};