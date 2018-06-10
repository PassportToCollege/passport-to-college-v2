import "./Conversation.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";
import _ from "lodash";

import * as commentActions from "../../actions/commentActions";

import Comment from "../Comment";
import Responder from "../Responder";

class Conversation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: props.comment,
      replies: []
    };
  }

  static propTypes = {
    comment: propTypes.object,
    comments: propTypes.object,
    commentActions: propTypes.object
  }

  componentDidMount() {
    if (!this.state.replies.length && this.state.comment.hasReplies)
      this.props.commentActions.doGetReplies(this.state.comment.id, 1);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (nextProps.comments.gotReplies && nextProps.comments.replies[prevState.comment.id]) {
      newState = {};
      newState.replies = nextProps.comments.replies[prevState.comment.id];
    }

    if (nextProps.comments.gotReply && 
      nextProps.comments.reply.parent === prevState.comment.id) {
      newState = newState || {};
      newState.newReply = nextProps.comments.reply;
    }

    return newState;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    let snapshot = null;

    if (!_.isEqual(prevState.newReply, this.state.newReply)) {
      snapshot = {
        replied: true
      };
    }

    return snapshot;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.replied) {
      this.state.replies.unshift(this.state.newReply);
    }
  }

  render() {
    return (
      <div className="conversation">
        <Comment comment={this.state.comment} 
          viewAll={this.state.comment.hasReplies && this.state.comment.replies > this.state.replies.length} 
          doViewAll={this.handleViewAllClick}/>
        {
          this.state.replies ?
            this.state.replies.slice(0).reverse().map(reply => {
              return (
                <Comment key={reply.id} comment={reply} reply />
              )
            }) : null
        }
        <Responder type="comment"
          comment={this.props.comment}
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

  handleViewAllClick = () => {
    this.props.commentActions.doGetReplies(this.state.comment.id, 2);
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