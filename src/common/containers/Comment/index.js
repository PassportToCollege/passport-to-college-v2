import "./Comment.css";

import React, { Component } from "react";
import propTypes from "prop-types";


import CommentHeader from "../../components/CommentHeader";
import WYSIWYGEditor from "../../components/Editor";
import Responder from "../Responder";

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      replying: false
    }
  }

  render() {
    return (
      <div className="comment">
        <CommentHeader comment={this.props.comment} />
        <WYSIWYGEditor readonly content={this.props.comment.message.html} />
        {
          this.state.replying ?
            <Responder type="comment"
              postId={this.props.comment.post} 
              onResponse={this.handleReply} 
              onOutsideClick={ () => this.setState({ replying: false }) }/> : null
        }
      </div>
    )
  }
}

Comment.propTypes = {
  comment: propTypes.object
};

export default Comment;