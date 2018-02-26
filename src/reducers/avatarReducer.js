import initialState from "./initialState";
import {
  AVATAR_GET_DONE,
  AVATAR_GET_FAILED,
  AVATAR_GET_INITIATED,
  AVATAR_UPLOAD_FAILED,
  AVATAR_UPLOADED,
  AVATAR_UPLOAD_INITIATED
} from "../actions/actionTypes";

const avatar = (state = initialState.avatar, action) => {
  switch(action.type) {
    case AVATAR_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasFailed: false,
        hasGotten: false,
        url: action.avatar
      });
    case AVATAR_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: true,
        hasGotten: false,
        error: action.error,
        url: action.avatar
      });
    case AVATAR_GET_DONE:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: true,
        hasGotten: true,
        url: action.avatar
      });
    case AVATAR_UPLOAD_INITIATED:
      return Object.assign({}, state, {
        isUploading: true,
        hasUploaded: false,
        hasFailed: false
      });
    case AVATAR_UPLOAD_FAILED:
      return Object.assign({}, state, {
        isUploading: false,
        hasUploaded: false,
        hasFailed: true
      });
    case AVATAR_UPLOADED:
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