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
  POST_UPDATED
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
    default:
      return state;
  }
};

export default post;