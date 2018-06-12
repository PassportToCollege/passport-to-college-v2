import "./Comment.css";

import React, { Component } from "react";
import propTypes from "prop-types";

import Responder from "../Responder";
import CommentHeader from "../../components/CommentHeader";
import WYSIWYGEditor from "../../components/Editor";
import LikeComment from "../LikeComment";

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      replying: false
    }
  }

  static propTypes = {
    comment: propTypes.object,
    reply: propTypes.bool,
    viewAll: propTypes.bool,
    doViewAll: propTypes.func,
    hideAll: propTypes.bool,
    doHideAll: propTypes.func,
    onReplyClick: propTypes.func,
    onReply: propTypes.func
  }

  static defaultProps = {
    reply: false
  }

  render() {
    return (
      <div className={`comment ${this.props.reply ? "comment__reply" : ""}`}>
        <CommentHeader comment={this.props.comment} />
        <WYSIWYGEditor readonly content={this.props.comment.message.html} />
        <LikeComment comment={this.props.comment} />
        <span className="comment__reply_button"
          onClick={this.handleReplyClick}>
          Reply
        </span>
        {
          !this.props.comment.isConversation && this.state.replying ?
            <Responder type="comment" active={this.state.replying}
              comment={this.props.comment}
              postId={this.props.comment.post}
              onResponse={this.handleReply}
              height="50" 
              doClose={this.listenResponderClose} /> : null
        }
        {
          this.props.comment.isConversation && this.props.viewAll ?
            <span className="comment__view_all" onClick={this.handleViewAllClick}>
              {
                this.props.comment.replies > 1 ?
                  <React.Fragment>
                    view all {this.props.comment.replies} responses
                  </React.Fragment> :
                  <React.Fragment>
                    view response
                  </React.Fragment>
              }
            </span> : null
        }
        {
          this.props.comment.isConversation && this.props.hideAll ?
          <span className="comment__hide_all" onClick={this.handleHideAllClick}>
              {
                this.props.comment.replies > 1 ?
                  <React.Fragment>
                    hide all responses
                  </React.Fragment> :
                  <React.Fragment>
                    hide response
                  </React.Fragment>
              }
            </span> : null
        }
      </div>
    )
  }

  handleReplyClick = () => {
    if (this.props.comment.isConversation &&
      "function" === typeof this.props.onReplyClick) {
      return this.props.onReplyClick();
    }

    this.setState({ replying: !this.state.replying });
  }

  listenResponderClose = () => {
    if (this.state.replying)
      this.setState({ replying: false });
  }

  handleReply = reply => {
    this.setState({ replying: false });
    
    if ("function" === typeof this.props.onReply)
      this.props.onReply(reply);
  }

  handleViewAllClick = () => {
    if ("function" === typeof this.props.doViewAll)
      this.props.doViewAll();
  }

  handleHideAllClick = () => {
    if ("function" === typeof this.props.doHideAll)
      this.props.doHideAll();
  }
}

export default Comment;