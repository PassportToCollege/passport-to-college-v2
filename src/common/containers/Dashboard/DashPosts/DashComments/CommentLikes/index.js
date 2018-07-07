import "./CommentLikes.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import _ from "lodash";

import Modal from "../../../../../components/Modal";
import Loader from "../../../../../components/Loader";
import UsernameCard from "../../../../../components/UsernameCard";
import Comment from "../../../../Comment";
import PageMeta from "../../../../../components/PageMeta";

import * as commentActions from "../../../../../actions/commentActions";
import * as usersActions from "../../../../../actions/usersActions";

class CommentLikes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      commentId: props.match.params.comment_id,
      comment: props.comments.comment,
      users: props.users.usersByUid
    }
  }

  static propTypes = {
    history: propTypes.object,
    match: propTypes.object,
    comments: propTypes.object,
    commentActions: propTypes.object,
    users: propTypes.object,
    usersActions: propTypes.object
  }

  componentDidMount() {
    if (!this.state.comment ||
      (this.state.comment && this.state.comment.id !== this.state.commentId)) {
      this.props.commentActions.doGetComment(this.state.commentId);
    }
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.comments.gotComment &&
      !_.isEqual(state.comment, nextProps.comments.comment)) {
      return {
        comment: nextProps.comments.comment
      }
    }

    if (nextProps.users.hasGottenUsersByUid &&
      !_.isEqual(state.users, nextProps.users.usersByUid)) {
        return {
          users: nextProps.users.usersByUid
        };
      }

    return null;
  }

  getSnapshotBeforeUpdate(props) {
    if (props.comments.gettingComment && this.props.comments.gotComment) {
      return {
        gotComment: true
      };
    }

    return null;
  }

  componentDidUpdate(props, state, snapshot) {
    if (snapshot && snapshot.gotComment) {
      if (!this.props.users.isGettingUsers && this.state.comment) {
        if (this.state.comment.likes) {
          const uids = Object.keys(this.state.comment.likes);
          let users = uids.map(uid => { // eslint-disable-line array-callback-return
            if (this.state.comment.likes[uid])
              return uid;
          });

          if (users)
            this.props.usersActions.doGetUsersByUid(users);
        }
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <PageMeta more={
          <title>
            Likes | {this.state.commentId} | Dashboard | Passport to College 
          </title>
        } />
        <Modal doClose={this.handleModalClose}
          classes={["modal__comment_likes"]}>
          {
            this.props.comments.gotComment && this.state.comment ?
              <Comment readonly={true} comment={this.state.comment} /> :
              <Loader width="24px" />
          }
          <h2>Likes</h2>
          {
            this.props.users.hasGottenUsersByUid && this.state.users ?
              this.state.users.map(user => {
                return (
                  <UsernameCard key={user.uid} user={user} />
                )
              }) : <Loader width="24px" />
          }
        </Modal>
      </React.Fragment>
    )
  }

  handleModalClose = () => {
    this.props.history.push(this.props.history.location.state.referrer);
  }
}

const mapStateToProps = state => {
  return {
    comments: state.comments,
    users: state.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    commentActions: bindActionCreators(commentActions, dispatch),
    usersActions: bindActionCreators(usersActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentLikes);