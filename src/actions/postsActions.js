import * as types from "./actionTypes";
import { db, storage } from "../utils/firebase";

const Console = console;

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
      .orderBy("createdAt", "desc")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(postsGetFailed({ message: "no posts found" }));

        let posts = [];
        let heroPromises = [];

        snapshots.forEach(snapshot => {
          heroPromises.push(storage.ref("posts/heros").child(`${snapshot.id}.png`).getDownloadURL());
          let post = snapshot.data();
          post.id = snapshot.id;

          posts.push(post);
        });

        Promise.all(heroPromises).then(urls => {
          for (let post of posts) {
            post.hero = urls.find(url => {
              return url.indexOf(post.id) > -1;
            });
          }

          dispatch(postsGetDone(posts));
        });

      })
      .catch(error => {
        Console.log(error);
        dispatch(postsGetFailed(error));
      })
  };
};

export const doPostsGetMostRecent = () => {
  return dispatch => {
    dispatch(postsGetInitiated());

    return  db.collection("posts")
      .where("state.published", "==", true)
      .orderBy("publishedOn", "desc")
      .limit(5)
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          return dispatch(postsGetFailed({ message: "no posts found" }));

        let posts = [];
        let heroPromises = [];
        let authorPromises = [];

        snapshots.forEach(snapshot => {
          let post = snapshot.data();
          post.id = snapshot.id;

          heroPromises.push(storage.ref("posts/heros").child(`${snapshot.id}.png`).getDownloadURL());
          authorPromises.push(db.collection("users").doc(post.author).get());

          posts.push(post);
        });

        Promise.all(heroPromises).then(urls => {
          for (let post of posts) {
            post.hero = urls.find(url => {
              return url.indexOf(post.id) > -1;
            });
          }

          Promise.all(authorPromises).then(authors => {
            for (let post of posts) {
              post.author = authors.find(author => {
                return author.id === post.author;
              });

              post.author = post.author.data();
            }

            dispatch(postsGetDone(posts));
          });
        });

      })
      .catch(error => {
        Console.log(error)
        dispatch(postsGetFailed(error));
      })
  };
};
