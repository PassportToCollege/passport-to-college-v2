import "./CommentHeader.css";

import React from "react";
import moment from "moment";
import propTypes from "prop-types";

import InitialsAvatar from "../InitialsAvatar";

const CommentHeader = ({ comment }) => {
  return (
    <span className="comment_header">
      {
        comment.user.profilePicture ?
          <img src={comment.user.profilePicture || comment.user.photo} alt="commenter profile pic" /> :
          <InitialsAvatar 
            initials={`${comment.user.name.first[0]}${comment.user.name.last[0]}`} 
            styles={{
              width: "32px",
              height: "32px",
              fontSize: "1.25em",
              backgroundColor: "#FF6561"
            }}/>
      }
      <span className="comment_header__text">
        <span className="comment_header__name">{comment.user.name.full}</span>
        <span className="comment_header__posted_on">{moment(comment.postedOn).format("MMMM D, YYYY")}</span>
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