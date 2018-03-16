import initialState from "./initialState";
import {
  USER_PROFILE_PICTURE_GET_DONE,
  USER_PROFILE_PICTURE_GET_FAILED,
  USER_PROFILE_PICTURE_GET_INITIATED,
  USER_PROFILE_PICTURE_UPLOAD_FAILED,
  USER_PROFILE_PICTURE_UPLOADED,
  USER_PROFILE_PICTURE_UPLOAD_INITIATED
} from "../actions/actionTypes";

const avatar = (state = initialState.userProfilePicture, action) => {
  switch(action.type) {
    case USER_PROFILE_PICTURE_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasFailed: false,
        hasGotten: false,
        url: action.avatar
      });
    case USER_PROFILE_PICTURE_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: true,
        hasGotten: false,
        error: action.error,
        url: action.avatar
      });
    case USER_PROFILE_PICTURE_GET_DONE:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: false,
        hasGotten: true,
        url: action.avatar
      });
    case USER_PROFILE_PICTURE_UPLOAD_INITIATED:
      return Object.assign({}, state, {
        isUploading: true,
        hasUploaded: false,
        hasFailed: false
      });
    case USER_PROFILE_PICTURE_UPLOAD_FAILED:
      return Object.assign({}, state, {
        isUploading: false,
        hasUploaded: false,
        hasFailed: true
      });
    case USER_PROFILE_PICTURE_UPLOADED:
      return Object.assign({}, state, {
        isUploading: false,
        hasUploaded: true,
        hasFailed: false
      });
    default:
      return state;
  }
}

export default avatar;