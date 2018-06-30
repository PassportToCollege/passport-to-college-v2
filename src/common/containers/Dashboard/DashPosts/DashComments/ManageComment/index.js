import "./ManageComment.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter, Link } from "react-router-dom";
import propTypes from "prop-types";
import _ from "lodash";

import PageMeta from "../../../../../components/PageMeta";
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
    if (nextProps.conversations &&
      !_.isEqual(state.comment, nextProps.conversation)) {
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

    return null;
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
                      doClick={this.handleSafeDelete} />
                  },
                  {
                    label: "Delete (Permanent)",
                    text: <Button solid type="button"
                      text="Delete"
                      doClick={this.handlePermaDelete}
                      styles={{
                        backgroundColor: "tomato"
                      }} />
                  }
                ]} /> : null
            }
          </section>
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
          pathname: `/admin/dashboard/post/${this.props.post}/comments/${this.state.conversationId || this.state.replyId}/likes`,
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