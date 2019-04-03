import ActionTypes from "./actionTypes";
import { db, auth, storage } from "../utils/firebase";
import moment from "moment";

import iError from "../imodels/iError";
import iAction from "../imodels/iAction";
import iPost, { PostUpdateType } from "../imodels/iPost";
import Post from "../models/Post";
import Comment from "../models/Comment";
import { doPostsGetMostRecent } from "./postsActions";
import { doCategoryPostsUpdate } from "./postCategoryActions";
import { deletePostHero } from "../utils/firebase/functions";
import { iStringBooleanPair } from "../imodels/iObjectTypes";

const PostActions = ActionTypes.Post;
const Console = console;

// ADD actions
export const createPostInitiated = () : iAction => {
  return {
    type: PostActions.CreatingPost
  };
};

export const createPostFailed = (error : iError) : iAction => {
  return {
    type: PostActions.CreatingPostFailed,
    error
  };
};

export const postCreated = (id : string) : iAction => {
  return {
    type: PostActions.CreatingPostFailed,
    id
  };
};

export const doPostCreate = (post : Post) : any => {
  return (dispatch : any) => {
    dispatch(createPostInitiated());
    
    db.collection("posts")
      .doc(post.id)
      .set(post)
      .then(() => {
        dispatch(postCreated(post.id));
      })
      .catch((error : iError) => {
        dispatch(createPostFailed(error));
      });
  };
};

export const uploadHeroInitiated = () : iAction => {
  return {
    type: PostActions.UpdatingHero
  };
};

export const uploadHeroFailed = (error : iError) : iAction => {
  return {
    type: PostActions.UpdatingHeroFailed,
    error
  };
};

export const heroUploaded = () : iAction => {
  return {
    type: PostActions.UpdatedHero
  };
};

export const doHeroUpload = (file : File, post : Post, refresh : boolean = false) : any => {
  return (dispatch : any) => {
    dispatch(uploadHeroInitiated());

    storage.ref("posts/heros")
      .child(`${post}.png`)
      .put(file)
      .then(() => {
        dispatch(heroUploaded());

        if (refresh)
          return dispatch(doHeroGet(post.id));
      })
      .catch((error : iError) => {
        dispatch(uploadHeroFailed(error));
      })
  }
}

// GET actions
export const postGetInitiated = (id : string) : iAction => {
  return {
    type: PostActions.GettingPost,
    id
  };
};

export const postGetFailed = (error : iError, id : string) : iAction => {
  return {
    type: PostActions.GettingPostFailed,
    id, error
  };
};

export const postGetDone = (post : Post) : iAction => {
  return {
    type: PostActions.GotPost,
    post
  };
};

export const doPostGet = (id : string) : any => {
  return (dispatch : any) => {
    dispatch(postGetInitiated(id));

    db.collection("posts")
      .doc(id)
      .get()
      .then((snapshot : firebase.firestore.DocumentSnapshot) => {
        if (snapshot.exists) {
          let postData = snapshot.data();
          postData = <firebase.firestore.DocumentSnapshot>postData;

          let post : Post = new Post(postData.author, <iPost>postData);

          return dispatch(postGetDone(post));
        }

        dispatch(postGetFailed({ message: "no post found" }, id));
      })
      .catch((error : iError) => {
        dispatch(postGetFailed(error, id));
      });
  };
};

export const getHeroInitiated = (postId : string) : iAction => {
  return {
    type: PostActions.GettingHero,
    id: postId
  };
};

export const getHeroFailed = (error : iError, postId : string) : iAction => {
  return {
    type: PostActions.GettingHeroFailed,
    id: postId,
    error
  };
};

export const getHeroDone = (hero : string) : iAction => {
  return {
    type: PostActions.GotHero,
    hero
  };
};

export const doHeroGet = (postId : string) : any => {
  return (dispatch : any) => {
    dispatch(getHeroInitiated(postId));

    storage.ref("posts/heros")
      .child(`${postId}.png`)
      .getDownloadURL()
      .then((url : string) => {
        dispatch(getHeroDone(url));
      })
      .catch((error : iError) => {
        dispatch(getHeroFailed(error, postId));
      })
  }
}

// UPDATE actions
export const updatePostInitiated = (id : string, data : any) : iAction => {
  return {
    type: PostActions.UpdatingPost,
    id, data
  };
};

export const updatePostFailed = (error : iError, id : string, data : any) : iAction => {
  return {
    type: PostActions.UpdatingPostFailed,
    id, data, error
  };
};

export const postUpdated = () : iAction => {
  return {
    type: PostActions.UpdatedPost
  };
};

export const doPostUpdate = (id : string, data : any = {}, options : any = {}) : any => {
  return (dispatch : any) => {
    dispatch(updatePostInitiated(id, data));

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
      .catch((error : iError) => {
        dispatch(updatePostFailed(error, id, data));
      });
  };
};

export const doUpdateConversationsCount = (updateType : PostUpdateType, changedComment : Comment) : iAction => {
  return {
    type: PostActions.UpdateLocalConversationsCount,
    updateType,
    changedComment
  };
};

// DELETE actions
export const postDeleteInitiated = (post : Post) : iAction => {
  return {
    type: PostActions.DeletingPost,
    post
  };
};

export const postDeleteFailed = (error : iError, post : Post) : iAction => {
  return {
    type: PostActions.DeletingPostFailed,
    error, post
  };
};

export const postDeleted = (post : Post) : iAction => {
  return {
    type: PostActions.DeletedPost,
    post
  };
};

export const doPostDelete = (post : Post) : any => {
  return (dispatch : any) => {
    dispatch(postDeleteInitiated(post));

    return db.collection("posts")
      .doc(post.id)
      .delete()
      .then(() => {
        if (post.hasHero)
          deletePostHero(post.id);

        let categories = <iStringBooleanPair>post.category;
        for (let key of Object.keys(categories)) {
          if (categories[key])
            dispatch(doCategoryPostsUpdate(key, PostUpdateType.Decrease));
        }

        dispatch(postDeleted(post));
      })
      .catch((error : iError) => {
        Console.log(error);
        dispatch(postDeleteFailed(error, post));
      });
  }
}