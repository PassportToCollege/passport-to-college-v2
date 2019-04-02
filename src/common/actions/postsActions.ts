import iPost, { PostState } from "../imodels/iPost";
import iError from "../imodels/iError";
import iAction from "../imodels/iAction";
import Post from "../models/Post";
import PostCategory from "../models/PostCategory";
import Student from "../models/Student";

import ActionTypes from "./actionTypes";
import { db, storage } from "../utils/firebase";

const PostsActions = ActionTypes.Posts;
const Console = console;

const getPostsFromSnapshots = (snapshots : firebase.firestore.QuerySnapshot) : Post[] =>
{
  let posts : Post[] = [];

  snapshots.forEach((snapshot : firebase.firestore.QueryDocumentSnapshot) => {
    const snap = <Post>snapshot.data();
    const post = new Post(snap.author, snap);

    posts.push(post);
  });

  return posts;
}

export const postsGetInitiated = () : iAction => {
  return {
    type: PostsActions.GettingPosts
  };
};

export const postsGetFailed = (error : iError) : iAction => {
  return {
    type: PostsActions.GettingPostsFailed,
    error
  };
};

export const postsGetDone = (posts : Post[]) : iAction => {
  return {
    type: PostsActions.GotPosts,
    posts
  };
};

export const doPostsGet = () : any => {
  return (dispatch : any) => {
    dispatch(postsGetInitiated());

    return db.collection("posts")
      .orderBy("createdAt", "desc")
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty)
          return dispatch(postsGetFailed({ message: "no posts found" }));

        const posts = getPostsFromSnapshots(snapshots);
        dispatch(postsGetDone(posts));
      })
      .catch((error : iError) => {
        Console.log(error);
        dispatch(postsGetFailed(error));
      })
  };
};

export const doGetPostsByState = (state : PostState = PostState.all) : any => {
  return (dispatch : any) => {
    if (state === PostState.all)
      return doPostsGet();
    
    dispatch(postsGetInitiated());

    let postRef : any;
    switch (state) {
      case PostState.published:
        postRef = postRef.where("state.published", "==", true);
        break;
      case PostState.archived:
        postRef = postRef.where("state.archived", "==", true);
        break;
      case PostState.draft:
        postRef = postRef.where("state.draft", "==", true);
        break;
    }

    return postRef.orderBy("createdAt", "desc")
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty)
          return dispatch(postsGetFailed({ message: "no posts found" }));

        const posts = getPostsFromSnapshots(snapshots);
        dispatch(postsGetDone(posts));
      })
      .catch((error : iError) => {
        Console.log(error);
        dispatch(postsGetFailed(error));
      });
  }
}

export const postsGetMostRecentInitiated = () : iAction => {
  return {
    type: PostsActions.GettingMostRecentPosts
  };
};

export const postsGetMostRecentFailed = (error : iError) : iAction => {
  return {
    type: PostsActions.GettingMostRecentPostsFailed,
    error
  };
};

export const postsGetMostRecentDone = (mostRecent : Post[]) : iAction => {
  return {
    type: PostsActions.GotMostRecentPosts,
    posts : mostRecent
  };
};

export const doPostsGetMostRecent = (limit : number = 5) : any => {
  return (dispatch : any) => {
    dispatch(postsGetMostRecentInitiated());

    return db.collection("posts")
      .where("state.published", "==", true)
      .orderBy("publishedOn", "desc")
      .limit(limit)
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty)
          return dispatch(postsGetMostRecentFailed({ message: "no posts found" }));

        const posts = getPostsFromSnapshots(snapshots);
        dispatch(postsGetMostRecentDone(posts));
      })
      .catch((error : iError) => {
        Console.log(error)
        dispatch(postsGetMostRecentFailed(error));
      })
  };
};

export const postsGetMostRecentByCategoryInititated = (categories : PostCategory[]) : iAction => {
  return {
    type: PostsActions.GettingMostRecentPosts_ByCategory,
    categories
  }
};

export const postsGetMostRecentByCategoryFailed = (error : iError, categories : PostCategory[]) : iAction => {
  return {
    type: PostsActions.GettingMostRecentPostsFailed_ByCategory,
    error, categories
  }
};

export const postsGetMostRecentByCategoryDone = (posts : Post[], categories : PostCategory[]) : iAction => {
  return {
    type: PostsActions.GotMostRecentPosts_ByCategory,
    posts, categories
  }
};

export const doPostsGetMostRecentByCategory = (categories : PostCategory[], limit: number = 5, postToExclude? : string) : any => {
  return (dispatch : any) => {
    dispatch(postsGetMostRecentByCategoryInititated(categories));

    let query = db.collection("posts");
    for (let category of categories) {
      query = query.where(`category.${category.slug}`, "==", true);
    }

    return query.where("state.published", "==", true)
      .orderBy("publishedOn", "desc")
      .limit(limit)
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty)
          return dispatch(postsGetMostRecentByCategoryFailed({ message: "no posts found" }, categories));

        const posts = getPostsFromSnapshots(snapshots);
        dispatch(postsGetMostRecentByCategoryDone(posts, categories));
      })
      .catch((error : iError) => {
        Console.log(error);
        dispatch(postsGetMostRecentByCategoryFailed(error, categories));
      })
  };
};

export const paginatePostsInitiated = (page : number) : iAction => {
  return {
    type: PostsActions.PaginatingPosts,
    page
  };
};

export const paginatePostsDone = (posts : Post[], page : number) : iAction => {
  return {
    type: PostsActions.PaginatedPosts,
    page, posts
  };
};

export const paginatePostsFailed = (error : iError, page : number) : iAction => {
  return {
    type: PostsActions.PaginatingPostFailed,
    page, error
  };
};

export const doPostsPaginate = (page : number, category : string = "all", limitPerPage : number = 25) : any => {
  return (dispatch : any) => {
    dispatch(paginatePostsInitiated(page));
    let postRef : any;

    if (category !== "all") {
      postRef = db.collection("posts")
        .where("state.published", "==", true)
        .where(`category.${category}`, "==", true)
        .orderBy("publishedOn", "desc")
    } else {
      postRef = db.collection("posts")
        .where("state.published", "==", true)
        .orderBy("publishedOn", "desc")
    }

    if (page === 1) {
      return postRef
        .limit(limitPerPage)
        .get()
        .then((snapshots : firebase.firestore.QuerySnapshot) => {
          if (snapshots.empty)
            return dispatch(paginatePostsFailed({ message: "no posts found" }, page));

          const posts = getPostsFromSnapshots(snapshots);
          dispatch(paginatePostsDone(posts, page));
        })
        .catch((error : iError) => {
          Console.log(error)
          dispatch(paginatePostsFailed(error, page));
        });
    } else {
      postRef.limit((page - 1) * limitPerPage)
        .get()
        .then((tempSnapshots : firebase.firestore.QuerySnapshot) => {
          const lastVisible = tempSnapshots.docs[tempSnapshots.docs.length - 1];
          
          return postRef.startAfter(lastVisible)
            .limit(limitPerPage)
            .get()
            .then((snapshots : firebase.firestore.QuerySnapshot) => {
              if (snapshots.empty)
                return dispatch(paginatePostsFailed({ message: "no posts found" }, page));

              const posts = getPostsFromSnapshots(snapshots);
              dispatch(paginatePostsDone(posts, page));
            })
            .catch((error : iError) => {
              Console.log(error)
              dispatch(paginatePostsFailed(error, page));
            }) 
        })
        .catch((error : iError) => {
          Console.log(error)
          dispatch(paginatePostsFailed(error, page));
        });
    }
  };
};

export const getAccomplishmentsByUserInitiated = (student : Student) : iAction => {
return {
    type: PostsActions.GettingAccomplishments,
    student
  };
};

export const getAccomplishmentsByUserFailed = (error : iError, student : Student) : iAction => {
  return {
    type: PostsActions.GettingAccomplishmentsFailed,
    error, student
  };
};

export const gotAccomplishmentsByUser = (posts : Post[], student : Student) : iAction => {
  return {
    type: PostsActions.GotAccomplishments,
    posts, student
  };
};

export const doGetAccomplishmentsByUser = (student : Student, state : PostState = PostState.all) : any => {
  return (dispatch : any) => {
    dispatch(getAccomplishmentsByUserInitiated(student));

    let ref = db.collection("posts")
      .where("isAccomplishment", "==", true)
      .where("student", "==", student.uid);

    switch (state) {
      case PostState.published:
        ref = ref.where("state.published", "==", true);
        break;
      case PostState.archived:
        ref = ref.where("state.archived", "==", true);
        break;
      case PostState.draft:
        ref = ref.where("state.draft", "==", true);
        break;
      case PostState.all:
      default:
        break;
    }

    ref.orderBy("createdAt", "desc")
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
        if (snapshots.empty)
          return dispatch(getAccomplishmentsByUserFailed({ message: "no accomplishments found" }, student));

        const posts = getPostsFromSnapshots(snapshots);
        dispatch(gotAccomplishmentsByUser(posts, student));
      })
      .catch((error : iError) => {
        Console.log(error);
        dispatch(getAccomplishmentsByUserFailed(error, student));
      })
  }
}
