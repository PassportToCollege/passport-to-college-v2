import "./CommentHeader.css";

import React from "react";
import moment from "moment";
import propTypes from "prop-types";

import LoadingText from "../LoadingText";

const CommentHeader = ({ comment, ready }) => {
  if (ready) {
    return (
      <span className="comment_header">
        <img src={comment.user.profilePicture} alt="commenter profile pic" />
        <span className="comment_header__text">
          <span className="comment_header__name">{comment.user.name.full}</span>
          <span className="comment_header__posted_on">{moment(comment.postedOn).format("MMMM D, YYYY")}</span>
        </span>
      </span>
    )
  }

  return (
    <span className="comment_header comment_header__loading">
      <span className="placeholder__profile_pic"></span>
      <span className="comment_header__loading_text">
        <LoadingText height="10px"
          lines={[
            { color: "#FF6561", width: "100px" },
            { color: "#EEEEEE", width: "50px" }
          ]} />
      </span>
    </span>
  )
}

CommentHeader.defaultProps = {
  ready: false
}

CommentHeader.propTypes = {
  comment: propTypes.object,
  ready: propTypes.bool  
}

export default CommentHeader;