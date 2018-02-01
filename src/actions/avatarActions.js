import Cookies from "universal-cookie";

import * as types from "./actionTypes";
import { storage } from "../utils/firebase";

const cookies = new Cookies();

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

export const doAvatarGet = () => {
  return dispatch => {
    dispatch(avatarGetInitiated())

    const user = cookies.get("ssid").uid;
    const avatarRef = storage.ref("users/profile_images").child(`${user}.png`);

    avatarRef.getDownloadURL()
      .then(url => {
        dispatch(avatarGetDone(url));
      })
      .catch(error => {
        dispatch(avatarGetFailed(error));
      })
  }
}