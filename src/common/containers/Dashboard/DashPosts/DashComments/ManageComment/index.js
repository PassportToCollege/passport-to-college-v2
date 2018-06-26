import "./ManageComment.css";

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import propTypes from "prop-types";

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
                    { label: "likes", text: countLikes(this.state.conversation.likes) },
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
                    text: <Toggler state={this.state.conversation.isDeleted}
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
    )
  }

  handleModalClose = () => {
    this.props.history.goBack();
  }
}

export default withRouter(ManageComment);