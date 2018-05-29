import "./Conversation.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import Comment from "../Comment";

class Conversation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: props.comment
    };
  }

  static propTypes = {
    comment: propTypes.object
  }

  render() {
    return (
      <div className="conversation">
        <Comment comment={this.state.comment} />
      </div>
    )
  }
}

export default Conversation;