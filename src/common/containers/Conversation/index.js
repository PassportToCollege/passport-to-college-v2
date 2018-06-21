import "./Conversation.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";
import _ from "lodash";

import * as commentActions from "../../actions/commentActions";

import Comment from "../Comment";
import Responder from "../Responder";
import Loader from "../../components/Loader";

class Conversation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: props.comment,
      replies: [],
      newReplies: [],
      viewAll: props.comment.hasReplies,
      hideAll: false,
      responderActive: false,
      gettingReplies: false
    };
  }

  static propTypes = {
    comment: propTypes.object,
    comments: propTypes.object,
    commentActions: propTypes.object
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (nextProps.comments.gotReplies && 
      nextProps.comments.replies[prevState.comment.id] &&
      !_.isEqual(prevState.replies, nextProps.comments.replies[prevState.comment.id])) {
      newState = {};
      newState.replies = nextProps.comments.replies[prevState.comment.id];
      newState.gettingReplies = false;
    }

    if (nextProps.comments.gotReply && 
      nextProps.comments.reply.parent === prevState.comment.id) {
      newState = newState || {};
      newState.newReply = nextProps.comments.reply;
    }

    return newState;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (!_.isEqual(prevState.newReply, this.state.newReply)) {
      return {
        replied: true
      };
    }

    if (this.props.comments.gettingReplies && !prevState.gettingReplies &&
      this.state.comment.hasReplies && this.props.comments.parent === this.state.comment.id) {
      return {
        gettingReplies: true
      };
    }

    if (prevProps.comments.deletingComment && this.props.comments.deletedComment &&
      this.state.replies && !this.props.comments.dComment.isConversation) {
      return {
        deletedReply: true
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.replied) {
      this.setState({
        newReplies: [...this.state.newReplies ,this.state.newReply]
      });
    }

    if (snapshot && snapshot.gettingReplies) {
      this.setState({ gettingReplies: true });
    }

    if (snapshot && snapshot.deletedReply) {
      const i = this.state.replies.findIndex(reply => {
        return reply.id !== this.props.comments.dComment.id;
      });

      this.setState({
        replies: this.state.replies.splice(i, 1)
      });
    }
  }

  render() {
    return (
      <div className="conversation">
        <Comment comment={this.state.comment} 
          viewAll={this.state.viewAll} 
          doViewAll={this.handleViewAllClick} 
          hideAll={this.state.hideAll} 
          doHideAll={this.handleHideAllClick} 
          onReplyClick={() => this.setState({ responderActive: !this.state.responderActive })} 
          onReply={this.handleReply} />
        {
          this.state.gettingReplies ?
            <Loader width="32px" styles={{
              margin: "1em auto"
            }} /> : null
        }
        {
          !this.state.viewAll && this.state.replies.length ?
            this.state.replies.slice(0).reverse().map(reply => {
              return (
                <Comment key={reply.id} comment={reply} reply />
              )
            }) : null
        }
        {
          this.state.newReplies.length && this.state.viewAll ?
            this.state.newReplies.map(reply => {
              return (
                <Comment key={reply.id} comment={reply} reply />
              )
            }) : null
        }
        <Responder type="comment" active={this.state.responderActive}
          comment={this.props.comment}
          postId={this.props.comment.post}
          onResponse={this.handleReply}
          height="100" 
          doClose={this.listenResponderClose} />
      </div>
    )
  }

  handleReply = reply => {
    this.setState({ responderActive: false });

    if (!this.props.comments.gettingReply)
      this.props.commentActions.doGetReply(this.state.comment.id, reply);
  }

  listenResponderClose = () => {
    if (this.state.responderActive)
      this.setState({ responderActive: false });
  }

  handleViewAllClick = () => {
    if (this.state.comment.replies > this.state.replies.length) {
      this.props.commentActions.doGetReplies(this.state.comment.id, "all");
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