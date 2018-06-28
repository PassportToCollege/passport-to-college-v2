import "./ManageComment.css";

import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import propTypes from "prop-types";

import PageMeta from "../../../../../components/PageMeta";
import Modal from "../../../../../components/Modal";
import AnnotatedList from "../../../../../components/AnnotatedList";
import Toggler from "../../../../../components/Toggler";
import Button from "../../../../../components/Button";
import Comment from "../../../../Comment"

import { countLikes } from "../../../../../utils";

class ManageComment extends Component {
  state = {
    conversationId: this.props.match.params.conversation_id
  }

  static propTypes = {
    history: propTypes.object,
    match: propTypes.object,
    location: propTypes.object,
    conversations: propTypes.arrayOf(propTypes.object)
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.conversations) {
      return {
        conversation: nextProps.conversations.find(el => {
          return el.id === state.conversationId
        })
      };
    }

    return null;
  }

  render() {
    return (
      <React.Fragment>
      {
        <PageMeta more={
          <title>
            Manage Comment | {this.state.conversationId} | Dashboard | Passport to College
          </title>
        } />
      }
      <Modal doClose={this.handleModalClose}
        classes={["modal__manage_comment"]}>
        <h2>Manage this Conversation</h2>
        <main className="manage_comment">
          <section className="manage_comment__full_comment">
            {
              this.state.conversation ?
                <React.Fragment>
                  <Comment readonly comment={this.state.conversation} />
                  <h3>Stats</h3>
                  <AnnotatedList data={[
                    { 
                      label: this.getLikesLink(), text: countLikes(this.state.conversation.likes) },
                    { label: "replies", text: this.state.conversation.replies },
                    { label: "reports", text: "0" }
                  ]} />
                </React.Fragment> 
                : null
            }
          </section>
          <section className="manage_comment__tasks">
            <h3>Actions</h3>
            {
              this.state.conversation ?
                <AnnotatedList data={[
                  {
                    label: "Delete (Safe)",
                    text: <Toggler state={this.state.conversation.isDeleted ? "yes" : "no"}
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
    this.props.history.push(`/admin/dashboard/post/${this.state.conversation.post}/comments`);
  }

  getLikesLink = () => {
    const likes = countLikes(this.state.conversation.likes);

    if (likes) {
      return (
        <Link to={{
          pathname: `/admin/dashboard/post/${this.state.conversation.post}/comments/${this.state.conversation.id}/likes`,
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
}

export default withRouter(ManageComment);