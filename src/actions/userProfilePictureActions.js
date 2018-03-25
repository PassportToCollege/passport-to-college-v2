import * as types from "./actionTypes";
import { auth, storage } from "../utils/firebase";

// GET actions
export const avatarGetInitiated = () => {
  return {
    type: types.PROFILE_PICTURE_GET_INITIATED,
    avatar: ""
  };
};

export const avatarGetFailed = error => {
  return {
    type: types.PROFILE_PICTURE_GET_FAILED,
    avatar: "",
    error
  };
};

export const avatarGetDone = avatar => {
  return {
    type: types.PROFILE_PICTURE_GET_DONE,
    avatar
  };
};

export const doAvatarGet = () => {
  return dispatch => {
    dispatch(avatarGetInitiated())
    
    auth.onAuthStateChanged(user => {
      if (user) {
        const uid = auth.currentUser.uid;
        return storage.ref("users/profile_images")
          .child(`${uid}.png`)
          .getDownloadURL()
          .then(url => {
            dispatch(avatarGetDone(url));
          })
          .catch(error => {
            dispatch(avatarGetFailed(error));
          })
      }
    });
  }
}

export const avatarGetByUidInitiated = uid => {
  return {
    type: types.PROFILE_PICTURE_GET_BY_UID_INITIATED,
    user: uid
  };
};

export const avatarGetByUidFailed = (error, uid) => {
  return {
    type: types.PROFILE_PICTURE_GET_BY_UID_FAILED,
    user: uid,
    error
  };
};

export const avatarGetByUidDone = picture => {
  return {
    type: types.PROFILE_PICTURE_GET_BY_UID_DONE,
    picture
  };
};

export const doAvatarGetByUid = uid => {
  return dispatch => {
    dispatch(avatarGetByUidInitiated());

    return storage.ref("users/profile_images")
      .child(`${uid}.png`)
      .getDownloadURL()
      .then(url => {
        dispatch(avatarGetByUidDone(url));
      })
      .catch(error => {
        dispatch(avatarGetByUidFailed(error));
      })
  }
}

// UPLOAD actions
export const avatarUploadInitiated = () => {
  return {
    type: types.PROFILE_PICTURE_UPLOAD_INITIATED
  };
};

export const avatarUploadFailed = error => {
  return {
    type: types.PROFILE_PICTURE_UPLOAD_FAILED,
    error
  };
};

export const avatarUploaded = () => {
  return {
    type: types.PROFILE_PICTURE_UPLOADED
  }
}

export const doAvatarUpload = file => {
  return dispatch => {
    dispatch(avatarUploadInitiated());

    auth.onAuthStateChanged(user => {
      if (user) {
        const user = auth.currentUser.uid;
        const avatarRef = storage.ref("users/profile_images").child(`${user}.png`);

        avatarRef.put(file)
          .then(() => {
            dispatch(avatarUploaded());

            // get new avatar
            dispatch(doAvatarGet());
          })
          .catch(error => {
            dispatch(avatarUploadFailed(error));
          })
      }
    });
  }
}