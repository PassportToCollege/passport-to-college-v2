import initialState from "./initialState";
import { 
  POST_CREATE_INITIATED, 
  POST_CREATE_FAILED, 
  POST_CREATED,
  POST_GET_INITIATED,
  POST_GET_FAILED,
  POST_GET_DONE,
  POST_UPDATE_INITIATED,
  POST_UPDATE_FAILED,
  POST_UPDATED,
  POST_UPLOAD_HERO_INITIATED,
  POST_UPLOAD_HERO_FAILED,
  POST_HERO_UPLOADED,
  POST_GET_HERO_INITIATED,
  POST_GET_HERO_DONE,
  POST_GET_HERO_FAILED
} from "../actions/actionTypes";

const post = (state = initialState.post, action) => {
  switch (action.type) {
    case POST_CREATE_INITIATED:
      return Object.assign({}, state, {
        isCreating: true,
        hasCreated: false,
        postCreationFailed: false
      });
    case POST_CREATE_FAILED:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: false,
        postCreationFailed: true,
        error: action.error
      });
    case POST_CREATED:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: true,
        postCreationFailed: false,
        id: action.id
      });
    case POST_GET_INITIATED:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        postGetFailed: false,
        id: action.id
      });
    case POST_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: false,
        postGetFailed: true,
        id: action.id,
        error: action.error
      });
    case POST_GET_DONE:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        postGetFailed: false,
        post: action.post
      });
    case POST_UPDATE_INITIATED:
      return Object.assign({}, state, {
        isUpdate: true,
        hasUpdated: false,
        postUpdateFailed: false,
        data: action.data,
        id: action.id
      });
    case POST_UPDATE_FAILED:
      return Object.assign({}, state, {
        isUpdate: false,
        hasUpdated: false,
        postUpdateFailed: true,
        data: action.data,
        id: action.id,
        error: action.error
      });
    case POST_UPDATED:
      return Object.assign({}, state, {
        isUpdate: false,
        hasUpdated: true,
        postUpdateFailed: false
      });
    case POST_UPLOAD_HERO_INITIATED:
      return Object.assign({}, state, {
        isUploading: true,
        hasUploaded: false,
        heroUploadFailed: false
      });
    case POST_HERO_UPLOADED:
      return Object.assign({}, state, {
        isUploading: false,
        hasUploaded: true,
        heroUploadFailed: false
      });
    case POST_UPLOAD_HERO_FAILED:
      return Object.assign({}, state, {
        isUploading: false,
        hasUploaded: false,
        heroUploadFailed: true,
        error: action.error
      });
    case POST_GET_HERO_INITIATED:
      return Object.assign({}, state, {
        gettingHero: true,
        gothero: false,
        heroGetFailed: false,
        id: action.id
      });
    case POST_GET_HERO_DONE:
      return Object.assign({}, state, {
        gettingHero: false,
        gothero: true,
        heroGetFailed: false,
        hero: action.hero
      });
    case POST_GET_HERO_FAILED:
      return Object.assign({}, state, {
        gettingHero: false,
        gothero: false,
        heroGetFailed: true,
        id: action.id,
        error: action.error
      });
    default:
      return state;
  }
};

export default post;