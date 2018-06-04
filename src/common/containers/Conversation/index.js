import "./Conversation.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as commentActions from "../../actions/commentActions";

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
    comments: propTypes.object,
    commentActions: propTypes.object
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

  handleReply = reply => {
    if (!this.props.comments.gettingReply)
      this.props.commentActions.doGetReply(this.state.comment.id, reply);
  }
}

const mapStateToProps = state => {
  return {
    comments: state.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    commentActions: bindActionCreators(commentActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Conversation);