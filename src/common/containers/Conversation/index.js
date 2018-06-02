import "./Conversation.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import Comment from "../Comment";
import Responder from "../Responder";

class Conversation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: props.comment
    };
  }

  static propTypes = {
    comment: propTypes.object,
    auth: propTypes.object
  }

  render() {
    return (
      <div className="conversation">
        <Comment comment={this.state.comment} />
        <Responder type="comment"
          comment={this.props.comment.id}
          postId={this.props.comment.post}
          onResponse={this.handleReply}
          height="100" />
      </div>
    )
  }
}

export default Conversation;