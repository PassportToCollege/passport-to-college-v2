import initialState from "./initialState";
import {
  CREATE_COMMENT_INITIATED,
  CREATE_COMMENT_FAILED,
  COMMENT_CREATED
} from "../actions/actionTypes";

const comments = (state = initialState.comments, action) => {
  switch (action.type) {
    case CREATE_COMMENT_INITIATED:
      return Object.assign({}, state, {
        creatingComment: true,
        createdComment: false,
        failedToCreateComment: false
      });
    case CREATE_COMMENT_FAILED:
      return Object.assign({}, state, {
        creatingComment: false,
        createdComment: false,
        failedToCreateComment: true,
        error: action.error
      });
    case COMMENT_CREATED:
      return Object.assign({}, state, {
        creatingComment: false,
        createdComment: true,
        failedToCreateComment: false
      });
    default:
      return state;
  }
}

export default comments;