import Cookies from "universal-cookie";

import * as types from "./actionTypes";
import { storage } from "../utils/firebase";

const cookies = new Cookies();

// GET actions
export const avatarGetInitiated = () => {
  return {
    type: types.AVATAR_GET_INITIATED,
    avatar: ""
  };
};

export const avatarGetFailed = error => {
  return {
    type: types.AVATAR_GET_FAILED,
    avatar: "",
    error
  };
};

export const avatarGetDone = avatar => {
  return {
    type: types.AVATAR_GET_DONE,
    avatar
  };
};

export const doAvatarGet = (uid) => {
  return dispatch => {
    dispatch(avatarGetInitiated())

    const avatarRef = storage.ref("users/profile_images").child(`${uid}.png`);

    avatarRef.getDownloadURL()
      .then(url => {
        dispatch(avatarGetDone(url));
      })
      .catch(error => {
        dispatch(avatarGetFailed(error));
      })
  }
}

// UPLOAD actions
export const avatarUploadInitiated = () => {
  return {
    type: types.AVATAR_UPLOAD_INITIATED
  };
};

export const avatarUploadFailed = error => {
  return {
    type: types.AVATAR_UPLOAD_FAILED,
    error
  };
};

export const avatarUploaded = () => {
  return {
    type: types.AVATAR_UPLOADED
  }
}

export const doAvatarUpload = file => {
  return dispatch => {
    dispatch(avatarUploadInitiated());

    const user = cookies.get("ssid").uid;
    const avatarRef = storage.ref("users/profile_images").child(`${user}.png`);

    avatarRef.put(file)
      .then(() => {
        dispatch(avatarUploaded());

        // get new avatar
        dispatch(doAvatarGet(user));
      })
      .catch(error => {
        dispatch(avatarUploadFailed(error));
      })
  }
}