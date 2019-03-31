import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";
import iAction from "../imodels/iAction";
import iAppState from "../imodels/iAppState";

const PostActions = ActionTypes.Post;

const post = (state : iAppState = initialState.Post, action : iAction) : iAppState => {
  switch (action.type) {
    case PostActions.CreatingPost:
      return Object.assign({}, state, {
        isCreating: true,
        hasCreated: false,
        postCreationFailed: false
      });
    case PostActions.CreatingPostFailed:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: false,
        postCreationFailed: true,
        error: action.error
      });
    case PostActions.CreatedPost:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: true,
        postCreationFailed: false,
        id: action.id
      });
    case PostActions.GettingPost:
      return Object.assign({}, state, {
        isGetting: true,
        hasGotten: false,
        postGetFailed: false,
        id: action.id
      });
    case PostActions.GettingPostFailed:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: false,
        postGetFailed: true,
        id: action.id,
        error: action.error
      });
    case PostActions.GotPost:
      return Object.assign({}, state, {
        isGetting: false,
        hasGotten: true,
        postGetFailed: false,
        post: action.post
      });
    case PostActions.UpdatingPost:
      return Object.assign({}, state, {
        isUpdating: true,
        hasUpdated: false,
        postUpdateFailed: false,
        data: action.data,
        id: action.id
      });
    case PostActions.UpdatingPostFailed:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: false,
        postUpdateFailed: true,
        data: action.data,
        id: action.id,
        error: action.error
      });
    case PostActions.UpdatedPost:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: true,
        postUpdateFailed: false
      });
    case PostActions.UpdateLocalConversationsCount:
      return Object.assign({}, state, {
        updatedLocalConversationsCount: true,
        post: Object.assign({}, state.post, {
          conversations: action.updateType === "inc" ? state.post.conversations + 1 : state.post.conversations - 1
        })
      });
    case PostActions.UpdatingHero:
      return Object.assign({}, state, {
        isUploading: true,
        hasUploaded: false,
        heroUploadFailed: false
      });
    case PostActions.UpdatedHero:
      return Object.assign({}, state, {
        isUploading: false,
        hasUploaded: true,
        heroUploadFailed: false
      });
    case PostActions.UpdatingHeroFailed:
      return Object.assign({}, state, {
        isUploading: false,
        hasUploaded: false,
        heroUploadFailed: true,
        error: action.error
      });
    case PostActions.GettingHero:
      return Object.assign({}, state, {
        gettingHero: true,
        gotHero: false,
        heroGetFailed: false,
        id: action.id
      });
    case PostActions.GotHero:
      return Object.assign({}, state, {
        gettingHero: false,
        gotHero: true,
        heroGetFailed: false,
        hero: action.hero
      });
    case PostActions.GettingHeroFailed:
      return Object.assign({}, state, {
        gettingHero: false,
        gotHero: false,
        heroGetFailed: true,
        id: action.id,
        error: action.error
      });
    case PostActions.DeletingPost:
      return Object.assign({}, state, {
        deletingPost: true,
        deletedPost: false,
        failedToDeletePost: false,
        dPost: action.post
      });
    case PostActions.DeletingPostFailed:
      return Object.assign({}, state, {
        deletingPost: false,
        deletedPost: false,
        failedToDeletePost: true,
        dPost: action.post,
        error: action.error
      });
    case PostActions.DeletedPost:
      return Object.assign({}, state, {
        deletingPost: false,
        deletedPost: true,
        failedToDeletePost: false,
        dPost: action.post
      });
    default:
      return state;
  }
};

export default post;