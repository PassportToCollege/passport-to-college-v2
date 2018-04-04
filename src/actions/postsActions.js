import * as types from "./actionTypes";
import { db, storage } from "../utils/firebase";

// GET actions
export const postsGetInitiated = () => {
  return {
    type: types.POSTS_GET_INITIATED
  };
};

export const postsGetFailed = (error) => {
  return {
    type: types.POSTS_GET_FAILED,
    error
  };
};

export const postsGetDone = posts => {
  return {
    type: types.POSTS_GET_DONE,
    posts
  };
};

export const doPostsGet = () => {
  return dispatch => {
    dispatch(postsGetInitiated());

    return db.collection("posts")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(postsGetFailed({ message: "no posts found" }));

        let posts = [];
        snapshots.forEach(snapshot => {
          // get post hero image
          storage.ref("posts/heros")
            .child(`${snapshot.id}.png`)
            .getDownloadURL()
            .then(url => {
              let post = snapshot.data();
              post.hero = url;
              posts.push(post);
            })
            .catch(() => {
              posts.push(snapshot.data());
            })
        });

        dispatch(postsGetDone(posts));
      })
      .catch(error => {
        dispatch(postsGetFailed(error));
      })
  };
};
