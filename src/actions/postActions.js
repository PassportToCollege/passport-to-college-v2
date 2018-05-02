import * as types from "./actionTypes";
import { db, auth, storage } from "../utils/firebase";
import moment from "moment";

import { doPostsGetMostRecent } from "./postsActions";

const Console = console;

// ADD actions
export const createPostInitiated = () => {
  return {
    type: types.POST_CREATE_INITIATED
  };
};

export const createPostFailed = error => {
  return {
    type: types.POST_CREATE_FAILED,
    error
  };
};

export const postCreated = id => {
  return {
    type: types.POST_CREATED,
    id
  };
};

export const doPostCreate = () => {
  return dispatch => {
    dispatch(createPostInitiated());

    auth.onAuthStateChanged(user => {
      if (user) {
        const createdAt = new Date(moment.utc(moment().toDate())).getTime();

        db.collection("posts")
          .add({
            createdAt,
            state: {
              draft: true,
              published: false,
              archived: false
            },
            author: user.uid
          })
          .then(post => {
            dispatch(postCreated(post.id));
          })
          .catch(error => {
            dispatch(createPostFailed(error));
          });
      }
    });
  };
};

export const uploadHeroInitiated = () => {
  return {
    type: types.POST_UPLOAD_HERO_INITIATED
  };
};

export const uploadHeroFailed = error => {
  return {
    type: types.POST_UPLOAD_HERO_FAILED,
    error
  };
};

export const heroUploaded = () => {
  return {
    type: types.POST_HERO_UPLOADED
  };
};

export const doHeroUpload = (file, post, options) => {
  return dispatch => {
    dispatch(uploadHeroInitiated());

    options = options || {};

    return storage.ref("posts/heros")
      .child(`${post}.png`)
      .put(file)
      .then(() => {
        dispatch(heroUploaded());

        if (options.refresh)
          return dispatch(doHeroGet(post));
      })
      .catch(error => {
        dispatch(uploadHeroFailed(error));
      })
  }
}

// GET actions
export const postGetInitiated = id => {
  return {
    type: types.POST_GET_INITIATED,
    id
  };
};

export const postGetFailed = (error, id) => {
  return {
    type: types.POST_GET_FAILED,
    id, error
  };
};

export const postGetDone = post => {
  return {
    type: types.POST_GET_DONE,
    post
  };
};

export const doPostGet = id => {
  return dispatch => {
    dispatch(postGetInitiated(id));

    db.collection("posts")
      .doc(id)
      .get()
      .then(post => {
        if (post.exists) {
          const postData = post.data();

          // get user if author is uid
          if ("string" === typeof postData.author) {
            return db.collection("users")
              .doc(postData.author)
              .get()
              .then(author => {
                if (author.exists) {
                  postData.author = author.data();
                  return dispatch(postGetDone(postData));
                }
                
                Console.log("Author not found.\nReturning with author id instead.");
                dispatch(postGetDone(postData));
              })
              .catch(error => {
                Console.log(`Error getting author: ${error.message}\nReturning with author id instead.`);
                dispatch(postGetDone(postData));
              })
          }

          return dispatch(postGetDone(post.data()));
        }

        dispatch(postGetFailed({ message: "no post found" }, id));
      })
      .catch(error => {
        dispatch(postGetFailed(error, id));
      });
  };
};

export const getHeroInitiated = post => {
  return {
    type: types.POST_GET_HERO_INITIATED,
    id: post
  };
};

export const getHeroFailed = (error, post) => {
  return {
    type: types.POST_GET_HERO_FAILED,
    id: post,
    error
  };
};

export const getHeroDone = hero => {
  return {
    type: types.POST_GET_HERO_DONE,
    hero
  };
};

export const doHeroGet = post => {
  return dispatch => {
    dispatch(getHeroInitiated(post));

    return storage.ref("posts/heros")
      .child(`${post}.png`)
      .getDownloadURL()
      .then(url => {
        dispatch(getHeroDone(url));
      })
      .catch(error => {
        dispatch(getHeroFailed(error, post));
      })
  }
}

// UPDATE actions
export const updatePostInitiated = (id, data) => {
  return {
    type: types.POST_UPDATE_INITIATED,
    id, data
  };
};

export const updatePostFailed = (error, id, data) => {
  return {
    type: types.POST_UPDATE_FAILED,
    id, data, error
  };
};

export const postUpdated = () => {
  return {
    type: types.POST_UPDATED
  };
};

export const doPostUpdate = (id, data, options) => {
  return dispatch => {
    dispatch(updatePostInitiated(id, data));

    options = options || {};
    data = data || {};
    db.collection("posts")
      .doc(id)
      .update(data)
      .then(() => {
        dispatch(postUpdated());

        if (options.refresh)
          dispatch(doPostGet(id));
        
        if (options.publishing)
          return dispatch(doPostsGetMostRecent());
      })
      .catch(error => {
        dispatch(updatePostFailed(error, id, data));
      });
  };
};