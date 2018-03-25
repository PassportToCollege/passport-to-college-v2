import initialState from "./initialState";
import {
  PROFILE_PICTURE_GET_DONE,
  PROFILE_PICTURE_GET_FAILED,
  PROFILE_PICTURE_GET_INITIATED,
  PROFILE_PICTURE_UPLOAD_FAILED,
  PROFILE_PICTURE_UPLOADED,
  PROFILE_PICTURE_UPLOAD_INITIATED,
  PROFILE_PICTURE_GET_BY_UID_INITIATED,
  PROFILE_PICTURE_GET_BY_UID_DONE,
  PROFILE_PICTURE_GET_BY_UID_FAILED
} from "../actions/actionTypes";

const avatar = (state = initialState.userProfilePicture, action) => {
  switch(action.type) {
    case PROFILE_PICTURE_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasFailed: false,
        hasGotten: false,
        url: action.avatar
      });
    case PROFILE_PICTURE_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: true,
        hasGotten: false,
        error: action.error,
        url: action.avatar
      });
    case PROFILE_PICTURE_GET_DONE:
      return Object.assign({}, state, {
        isGetting: false,
        hasFailed: false,
        hasGotten: true,
        url: action.avatar
      });
    case PROFILE_PICTURE_GET_BY_UID_INITIATED:
      return Object.assign({
        isGettingByUid: true,
        hasGottenByUid: false,
        hasFailed: false,
        user: action.uid
      });
    case PROFILE_PICTURE_GET_BY_UID_DONE:
      return Object.assign({
        isGettingByUid: false,
        hasGottenByUid: true,
        hasFailed: false,
        picture: action.picture
      });
    case PROFILE_PICTURE_GET_BY_UID_FAILED:
      return Object.assign({
        isGettingByUid: false,
        hasGottenByUid: false,
        hasFailed: true,
        user: action.user,
        error: action.error
      });
    case PROFILE_PICTURE_UPLOAD_INITIATED:
      return Object.assign({}, state, {
        isUploading: true,
        hasUploaded: false,
        hasFailed: false
      });
    case PROFILE_PICTURE_UPLOAD_FAILED:
      return Object.assign({}, state, {
        isUploading: false,
        hasUploaded: false,
        hasFailed: true
      });
    case PROFILE_PICTURE_UPLOADED:
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