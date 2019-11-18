import { Dispatch } from 'react';
import { Category } from '../actionTypes';
import { Action } from '..';
import PostCategory from '../../models/PostCategory';
import { PostCategoryState } from '../../imodels/iAppState';
import { db } from '../../utils/firebase';
import {
  addingCategory, 
  addedCategory,
  addingCategoryFailed,
  gettingCategory,
  gotCategory,
  gettingCategoryFailed,
  gettingCategories,
  gettingCategoriesFailed,
  gotCategories,
  updatingCategory,
  updatedCategory,
  updatingCategoryFailed,
  updatingCategoryPosts,
  updatedCategoryPosts,
  updatingCategoryPostsFailed,
} from './actions';
import iPostCategory from '../../imodels/iPostCategory';
import { PostUpdateType } from '../../imodels/iPost';

export const doAddCategory = (
  dispatch: Dispatch<Action<Category, PostCategoryState>>,
  name: string,
  posts?: number,
  slug?: string,
  refresh?: boolean
) => {
  dispatch(addingCategory());

  const category = new PostCategory(name, slug, posts);

  db.collection('post-categories')
    .doc(category.slug)
    .set(category.data, { merge: true })
    .then(() => {
      dispatch(addedCategory());

      if (refresh) {
        // tslint:disable-next-line: no-use-before-declare
        doGetCategories(dispatch);
      }
    })
    .catch((error: Error) => {
      dispatch(addingCategoryFailed(error));
    });
};

export const doGetCategory = (
  dispatch: Dispatch<Action<Category, PostCategoryState>>,
  slug: string
) => {
  dispatch(gettingCategory());

  db.collection('post-categories')
    .doc(slug)
    .get()
    .then((snapshot: firebase.firestore.DocumentSnapshot) => {
      if (snapshot.exists) {
        try {
          const snapshotData = snapshot.data() as PostCategory;
          const category = new PostCategory(snapshotData.name, snapshotData.slug, snapshotData.posts);

          dispatch(gotCategory(category));
        } catch (e) {
          dispatch(gettingCategoryFailed(e));
        }
      }

      dispatch(gettingCategoryFailed(new Error(`No category matching slug: [${slug}] was found.`)));
    })
    .catch((error: Error) => {
      dispatch(gettingCategoryFailed(error));
    });
};

export const doGetCategories = (dispatch: Dispatch<Action<Category, PostCategoryState>>) => {
  dispatch(gettingCategories());

  db.collection('post-categories')
    .get()
    .then((snapshots: firebase.firestore.QuerySnapshot) => {
      if (snapshots.empty) {
        dispatch(gettingCategoriesFailed(new Error('no categories found')));
      } else {
        try {
          const categories: PostCategory[] = [];
          snapshots.forEach((snapshot) => {
            const snapshotData = snapshot.data() as PostCategory;
            const category = new PostCategory(snapshotData.name, snapshotData.slug, snapshotData.posts);

            categories.push(category);
          });

          dispatch(gotCategories(categories));
        } catch (e) {
          gettingCategoriesFailed(e);
        }
      }
    })
    .catch((error: Error) => {
      return dispatch(gettingCategoriesFailed(error));
    });
};

export const doUpdateCategory = (
  dispatch: Dispatch<Action<Category, PostCategoryState>>,
  slug: string,
  data: iPostCategory,
  refresh?: boolean
) => {
  dispatch(updatingCategory());

  db.collection('post-categories')
    .doc(slug)
    .update(data)
    .then(() => {
      dispatch(updatedCategory());

      if (refresh) {
        doGetCategories(dispatch);
      }
    })
    .catch((error: Error) => {
      dispatch(updatingCategoryFailed(error));
    });
};

export const doUpdateCategoryPosts = (
  dispatch: Dispatch<Action<Category, PostCategoryState>>,
  slug: string,
  operation: PostUpdateType
) => {
  dispatch(updatingCategoryPosts());

  const categoryRef: firebase.firestore.DocumentReference = db.collection('post-categories').doc(slug);
  let uCategory: PostCategory;

  db.runTransaction((transaction: firebase.firestore.Transaction) => {
    return transaction.get(categoryRef)
      .then((snapshot: firebase.firestore.DocumentSnapshot) => {
        const categoryData =  snapshot.data() as PostCategory;
        const category = new PostCategory(categoryData.name, categoryData.slug, categoryData.posts);

        if (operation === PostUpdateType.Increase) {
          category.increasePosts();
        } else {
          category.decreasePost();
        }

        uCategory = category;
        transaction.update(categoryRef, { posts: category.posts });
      });
  })
    .then(() => {
      dispatch(updatedCategoryPosts(uCategory));
    })
    .catch((error: Error) => {
      dispatch(updatingCategoryPostsFailed(error));
    });
};