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
      replies: [],
      viewAll: props.comment.hasReplies && props.comment.replies > 5,
      hideAll: props.comment.hasReplies && props.comment.replies < 5
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
          viewAll={this.state.viewAll} 
          doViewAll={this.handleViewAllClick} 
          hideAll={this.state.hideAll && this.state.comment.hasReplies} 
          doHideAll={this.handleHideAllClick} />
        {
          (this.state.replies.length && this.state.replies.length < this.state.comment.replies) || !this.state.viewAll ?
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
    if (this.state.comment.replies > this.state.replies.length) {
      this.props.commentActions.doGetReplies(this.state.comment.id, 2);
    }

    this.setState({ viewAll: false, hideAll: true });
  }

  handleHideAllClick = () => {
    this.setState({ hideAll: false, viewAll: true });
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