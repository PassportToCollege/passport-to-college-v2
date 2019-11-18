import { Dispatch } from 'react';
import Post from '../../models/Post';
import iPost, { PostState } from '../../imodels/iPost';
import User from '../../models/User';
import { Action } from '..';
import { Posts as _ } from '../actionTypes';
import { PostsState } from '../../imodels/iAppState';
import { 
  gettingPosts, 
  gettingPostsFailed,
  gotPosts,
  gettingMostRecentPosts,
  gettingMostRecentPostsFailed,
  gotMostRecentPosts,
  gettingMostRecentPostsByCategory,
  gettingMostRecentPostsByCategoryFailed,
  gotMostRecentPostsByCategory,
  paginatingPosts,
  paginatingPostsFailed,
  paginatedPosts,
  gettingAccomplishments,
  gettingAccomplishmentsFailed,
  gotAccomplishments, 
} from './actions';
import { db } from '../../utils/firebase';
import PostCategory from '../../models/PostCategory';
import Student from '../../models/Student';

type PostsDispatch = Dispatch<Action<_, PostsState>>;

const getPostsFromSnapshots = (snapshots: firebase.firestore.QuerySnapshot): Post[] => {
  try {
    const posts: Post[] = [];
    snapshots.forEach((snapshot: firebase.firestore.QueryDocumentSnapshot) => {
        const snap = snapshot.data() as iPost;
        const post = new Post((snap.author as User).uid, snap);

        posts.push(post);
      });

    return posts;
  } catch (e) {
    throw new Error(e);
  }
};

export const doGetPosts = (dispatch: PostsDispatch) => {
  dispatch(gettingPosts());

  db.collection('posts')
    .orderBy('createdAt', 'desc')
    .get()
    .then((snapshots: firebase.firestore.QuerySnapshot) => {
      if (snapshots.empty) {
        dispatch(gettingPostsFailed(new Error('no posts found')));
      } else {
        const posts = getPostsFromSnapshots(snapshots);
        dispatch(gotPosts(posts));
      }
    })
    .catch((error: Error) => {
      dispatch(gettingPostsFailed(error));
    });
};

export const doGetPostsByState = (
  dispatch: PostsDispatch,
  state: PostState
) => {
  if (state === PostState.all) {
    doGetPosts(dispatch);
    return;
  }

  dispatch(gettingPosts());

  let postRef: firebase.firestore.CollectionReference | firebase.firestore.Query = db.collection('posts');

  // tslint:disable-next-line: switch-default
  switch (state) {
    case PostState.published:
      postRef = postRef.where('state.published', '==', true);
      break;
    case PostState.archived:
      postRef = postRef.where('state.archived', '==', true);
      break;
    case PostState.draft:
      postRef = postRef.where('state.draft', '==', true);
      break;
  }

  postRef
    .orderBy('createdAt', 'desc')
    .get()
    .then((snapshots: firebase.firestore.QuerySnapshot) => {
      if (snapshots.empty) {
        dispatch(gettingPostsFailed(new Error('no posts found')));
        return;
      }

      const posts = getPostsFromSnapshots(snapshots);
      dispatch(gotPosts(posts));
    })
    .catch((error: Error) => {
      dispatch(gettingPostsFailed(error));
    });
};

export const doGetMostRecentPosts = (
  dispatch: PostsDispatch,
  limit: number = 5
) => {
  dispatch(gettingMostRecentPosts());

  db.collection('posts')
    .where('state.published', '==', true)
    .orderBy('publishedOn', 'desc')
    .limit(limit)
    .get()
    .then((snapshots: firebase.firestore.QuerySnapshot) => {
      if (snapshots.empty) {
        dispatch(gettingMostRecentPostsFailed(new Error('no posts found')));
        return;
      }

      const posts = getPostsFromSnapshots(snapshots);
      dispatch(gotMostRecentPosts(posts));
    })
    .catch((error: Error) => {
      dispatch(gettingMostRecentPostsFailed(error));
    });
};

export const doGetMostRecentPostsByCategory = (
  dispatch: PostsDispatch,
  categories: PostCategory[],
  limit: number = 5,
  postToExclude?: string
) => {
  dispatch(gettingMostRecentPostsByCategory());

  let query: firebase.firestore.CollectionReference | firebase.firestore.Query = db.collection('posts');
  for (const category of categories) {
    query = query.where(`category.${category.slug}`, '==', true);
  }

  query.where('state.published', '==', true)
    .orderBy('publishedOn', 'desc')
    .limit(limit)
    .get()
    .then((snapshots: firebase.firestore.QuerySnapshot) => {
      if (snapshots.empty) {
        dispatch(gettingMostRecentPostsByCategoryFailed(new Error('no posts found')));
      }

      const posts = getPostsFromSnapshots(snapshots);
      dispatch(gotMostRecentPostsByCategory(posts));
    })
    .catch((error: Error) => {
      dispatch(gettingMostRecentPostsFailed(error));
    });
};

export const doPaginatePosts = (
  dispatch: PostsDispatch,
  page: number,
  category: string = 'all',
  limit: number = 25
) => {
  dispatch(paginatingPosts());

  let postRef: firebase.firestore.CollectionReference | firebase.firestore.Query = db.collection('posts');

  if (category !== 'all') {
    postRef = postRef
      .where('state.published', '==', true)
      .where(`category.${category}`, '==', true)
      .orderBy('publishedOn', 'desc');
  } else {
    postRef = postRef
      .where('state.published', '==', true)
      .orderBy('publishedOn', 'desc');
  }

  if (page === 1) {
    postRef
      .limit(limit)
      .get()
      .then((snapshots: firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty) {
          dispatch(paginatingPostsFailed(new Error('no posts found')));
          return;
        }

        const posts = getPostsFromSnapshots(snapshots);
        dispatch(paginatedPosts(posts, page));
      })
      .catch((error: Error) => {
        dispatch(paginatingPostsFailed(error));
      });
  } else {
    postRef.limit((page - 1) * limit)
      .get()
      .then((tempSnapshots: firebase.firestore.QuerySnapshot) => {
        const lastVisible = tempSnapshots.docs[tempSnapshots.docs.length - 1];

        postRef.startAfter(lastVisible)
          .limit(limit)
          .get()
          .then((snapshots: firebase.firestore.QuerySnapshot) => {
            if (snapshots.empty) {
              dispatch(paginatingPostsFailed(new Error('no posts found')));
              return;
            }

            const posts = getPostsFromSnapshots(snapshots);
            dispatch(paginatedPosts(posts, page));
          })
          .catch((error: Error) => {
            dispatch(paginatingPostsFailed(error));
          });
      })
      .catch((error: Error) => {
        dispatch(paginatingPostsFailed(error));
      });
  }
};

export const doGetAccomplishmentsByUser = (
  dispatch: PostsDispatch,
  student: Student,
  state: PostState = PostState.all
) => {
  dispatch(gettingAccomplishments());

  let ref: firebase.firestore.Query = db.collection('posts')
    .where('isAccomplishment', '==', true)
    .where('student', '==', student.uid);

  switch (state) {
    case PostState.published:
      ref = ref.where('state.published', '==', true);
      break;
    case PostState.archived:
      ref = ref.where('state.archived', '==', true);
      break;
    case PostState.draft:
      ref = ref.where('state.draft', '==', true);
      break;
    case PostState.all:
    default:
      break;
  }

  ref
    .orderBy('createdAt', 'desc')
    .get()
    .then((snapshots: firebase.firestore.QuerySnapshot) => {
      if (snapshots.empty) {
        dispatch(gettingAccomplishmentsFailed(new Error('no accomplishments found')));
        return;
      }

      const posts = getPostsFromSnapshots(snapshots);
      dispatch(gotAccomplishments(posts));
    })
    .catch((error: Error) => {
      dispatch(gettingAccomplishmentsFailed(error));
    });
};
