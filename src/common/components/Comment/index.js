import "./Comment.css";

import React from "react";
import propTypes from "prop-types";

import CommentHeader from "../CommentHeader";
import WYSIWYGEditor from "../Editor";

const Comment = ({ comment }) => {
  
  return (
    <div className="comment">
      <CommentHeader comment={comment} />
      <WYSIWYGEditor readonly content={comment.message.html} />
    </div>
  )
}

Comment.propTypes = {
  comment: propTypes.object,
  ready: propTypes.bool
};

export default Comment;