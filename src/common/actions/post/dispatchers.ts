import { Dispatch } from 'react';
import { Post as _ } from '../actionTypes';
import { Action } from '..';
import Post from '../../models/Post';
import { PostState } from '../../imodels/iAppState';
import { 
  creatingPost, 
  createdPost,
  creatingPostFailed,
  updatingHero,
  updatedHero,
  updatingHeroFailed,
  gettingPost,
  gotPost,
  gettingPostFailed,
  gettingHero,
  gettingHeroFailed,
  gotHero,
  updatingPost,
  updatedPost,
  updatingPostFailed,
  deletingPost,
  deletedPost,
  deletingPostFailed,
} from './actions';
import { db, storage } from '../../utils/firebase';
import iPost, { PostOptions, PostUpdateType } from '../../imodels/iPost';
import { deletePostHero } from '../../utils/firebase/functions';
import { iStringBooleanPair } from '../../imodels/iObjectTypes';

export const doCreatePost = (
  dispatch: Dispatch<Action<_, PostState>>,
  post: Post
) => {
  dispatch(creatingPost());

  db.collection('posts')
    .doc(post.id)
    .set(post)
    .then(() => {
      dispatch(createdPost(post.id));
    })
    .catch((error: Error) => {
      dispatch(creatingPostFailed(error));
    });
};

export const doGetPost = (
  dispatch: Dispatch<Action<_, PostState>>,
  id: string
) => {
  dispatch(gettingPost());

  db.collection('posts')
    .doc(id)
    .get()
    .then((snapshot: firebase.firestore.DocumentSnapshot) => {
      if (snapshot.exists) {
        const postData = snapshot.data();
        const post: Post = new Post(postData!.author, postData as iPost);

        dispatch(gotPost(post));
      } else {
        dispatch(gettingPostFailed(new Error('no post found')));
      }
    })
    .catch((error: Error) => {
      dispatch(gettingPostFailed(error));
    });
};

export const doGetHero = (
  dispatch: Dispatch<Action<_, PostState>>,
  post: Post
) => {
  dispatch(gettingHero());

  if (storage) {
    storage.ref('posts/heros')
      .child(`${post.id}.png`)
      .getDownloadURL()
      .then((url: string) => {
        dispatch(gotHero(url));
      })
      .catch((error: Error) => {
        dispatch(gettingHeroFailed(error));
      });
  } else {
    dispatch(gettingHeroFailed(new Error('storage undefined')));
  }
};

export const doUpdateHero = (
  dispatch: Dispatch<Action<_, PostState>>,
  file: File,
  post: Post,
  refresh: boolean = false
) => {
  dispatch(updatingHero());

  if (storage) {
    storage.ref('posts/heros')
      .child(`${post}.png`)
      .put(file)
      .then(() => {
        dispatch(updatedHero());
  
        if (refresh) {
          doGetHero(dispatch, post);
        }
      })
      .catch((error: Error) => {
        dispatch(updatingHeroFailed(error));
      });
  } else {
    dispatch(updatingHeroFailed(new Error('storage undefined')));
  }
};

export const doUpdatePost = (
  dispatch: Dispatch<Action<_, PostState>>,
  post: Post,
  newData: iPost,
  options?: PostOptions
) => {
  dispatch(updatingPost());

  db.collection('posts')
    .doc(post.id)
    .update(newData)
    .then(() => {
      dispatch(updatedPost());

      if (options) {
        if (options.refresh) {
          doGetPost(dispatch, post.id);
        }
  
        if (options.publishing) {
          dispatch(doPostsGetMostRecent());
        }
      }
    })
    .catch((error: Error) => {
      dispatch(updatingPostFailed(error));
    });
};

export const doDeletePost = (
  dispatch: Dispatch<Action<_, PostState>>,
  post: Post
) => {
  dispatch(deletingPost());

  return db.collection('posts')
    .doc(post.id)
    .delete()
    .then(() => {
      if (post.hasHero) {
        deletePostHero(post.id);
      }

      const categories =  post.category as iStringBooleanPair;
      for (const key of Object.keys(categories)) {
        if (categories[key]) {
          dispatch(doCategoryPostsUpdate(key, PostUpdateType.Decrease));
        }
      }

      dispatch(deletedPost());
    })
    .catch((error: Error) => {
      dispatch(deletingPostFailed(error));
    });
};