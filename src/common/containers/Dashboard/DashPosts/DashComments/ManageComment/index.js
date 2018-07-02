import "./ManageComment.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter, Link } from "react-router-dom";
import propTypes from "prop-types";
import _ from "lodash";

import PageMeta from "../../../../../components/PageMeta";
import Loader from "../../../../../components/Loader";
import Modal from "../../../../../components/Modal";
import AnnotatedList from "../../../../../components/AnnotatedList";
import Toggler from "../../../../../components/Toggler";
import Button from "../../../../../components/Button";
import Comment from "../../../../Comment"

import { countLikes } from "../../../../../utils";
import * as commentActions from "../../../../../actions/commentActions";

class ManageComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      conversationId: this.props.match.params.conversation_id
    }
  }

  static propTypes = {
    comments: propTypes.object,
    commentActions: propTypes.object,
    history: propTypes.object,
    match: propTypes.object,
    location: propTypes.object,
    conversations: propTypes.arrayOf(propTypes.object),
    post: propTypes.string
  }

  componentDidMount() {
    if (this.props.match.params.reply_id) {
      const { reply_id } = this.props.match.params;

      this.props.commentActions.doGetReply(this.state.conversationId, reply_id);
      this.setState({ replyId: reply_id });
    }
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.conversations) {
      return {
        comment: nextProps.conversations.find(el => {
          return el.id === state.conversationId
        })
      };
    }

    if (nextProps.comments.gotReply && 
      !_.isEqual(state.comment, nextProps.comments.reply)) {
      return {
        comment: nextProps.comments.reply
      }
    }

    if (nextProps.comments.safelyDeletedComment &&
      !_.isEqual(state.comment, nextProps.comments.dComment)) {
      return {
        comment: nextProps.comments.dComment
      };
    }

    return null;
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.comments.deletingComment && this.props.comments.deletedComment) {
      return {
        deletedComment: true
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.deletedComment) {
      if (this.props.location && this.props.location.state) {
        return this.props.history.push(this.props.history.location.state.referrer);
      }

      this.props.history.push(`/admin/dashboard/post/${this.state.comment.post}/comments`);
    }
  }

  render() {
    return (
      <React.Fragment>
        <PageMeta more={
          <title>
            Manage Comment | {this.state.replyId || this.state.conversationId} | Dashboard | Passport to College
          </title>
        } />
        <Modal doClose={this.handleModalClose}
          classes={["modal__manage_comment"]}>
          <h2>Manage this Comment</h2>
          <main className="manage_comment">
            <section className="manage_comment__full_comment">
              {
                this.state.comment ?
                  <React.Fragment>
                    <Comment readonly comment={this.state.comment} />
                    <h3>Stats</h3>
                    {
                      this.state.comment && this.state.comment.isConversation ?
                        <AnnotatedList data={[
                          { label: this.getLikesLink(), text: countLikes(this.state.comment.likes) },
                          { label: this.getRepliesLink(), text: this.state.comment.replies },
                          { label: "reports", text: "0" }
                        ]} /> : null
                    }
                    {
                      this.state.comment && !this.state.comment.isConversation ?
                        <AnnotatedList data={[
                            { label: this.getLikesLink(), text: countLikes(this.state.comment.likes) },
                            { label: "reports", text: "0" }
                          ]} /> : null
                    }
                  </React.Fragment> 
                  : null
              }
            </section>
            <section className="manage_comment__tasks">
              <h3>Actions</h3>
              {
                this.state.comment ?
                  <AnnotatedList data={[
                    {
                      label: "Delete (Safe)",
                      text: <Toggler state={this.state.comment.isDeleted ? "yes" : "no"}
                        doClick={this.handleSafeDelete} 
                        disabled={this.props.comments.safelyDeletingComment} 
                        options={{
                          title: this.state.comment.isDeleted ? "Comment is deleted" : "Make this comment deleted"
                        }} />
                    },
                    {
                      label: "Delete (Permanent)",
                      text: <Button solid type="button"
                        text="Delete"
                        doClick={this.handlePermaDelete} />
                    }
                  ]} /> : null
              }
            </section>
            {
              this.props.comments.safelyDeletingComment ||
              this.props.comments.deletingComment ?
                <Loader width="24px"
                  styles={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    margin: "0 0 0 1em",
                    position: "absolute",
                    right: "2em",
                    bottom: "2em"
                  }} /> : null
            }
          </main>
        </Modal>
      </React.Fragment>
    )
  }

  handleModalClose = () => {
    if (this.props.location && this.props.location.state) {
      return this.props.history.push(this.props.history.location.state.referrer);
    }

    this.props.history.push(`/admin/dashboard/post/${this.state.comment.post}/comments`);
  }

  getLikesLink = () => {
    const likes = countLikes(this.state.comment.likes);

    if (likes) {
      return (
        <Link to={{
          pathname: this.state.replyId ? 
            `/admin/dashboard/post/${this.props.post}/comments/${this.state.replyId}/likes` : 
            `/admin/dashboard/post/${this.props.post}/comments/${this.state.conversationId}/likes`,
          state: {
            referrer: this.props.location.pathname
          }
        }}>
          likes
        </Link>
      )
    }
    
    return "likes"
  }

  getRepliesLink = () => {
    if (this.state.comment && this.state.comment.hasReplies) {
      return (
        <Link to={{
          pathname: `/admin/dashboard/post/${this.state.comment.post}/comments/${this.state.comment.id}/replies`,
          state: {
            referrer: this.props.location.pathname
          }
        }}>
          replies
        </Link>
      )
    }

    return "replies"
  }

  handleSafeDelete = () => {
    if (!this.props.comments.safelyDeletingComment) {
      this.props.commentActions.doDeleteCommentSafe(this.state.comment, {
        undelete: !this.state.comment.isDeleted
      });
    }
  }

  handlePermaDelete = () => {
    this.props.commentActions.doDeleteComment(this.state.comment);
  }
}

const mapStateToProps = state => {
  return {
    comments: state.comments,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    commentActions: bindActionCreators(commentActions, dispatch),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ManageComment)
);