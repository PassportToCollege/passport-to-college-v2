import "./Comment.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import CommentHeader from "../../components/CommentHeader";
import WYSIWYGEditor from "../../components/Editor";

import { isAuthorized } from "../../utils";

import * as authActions from "../../actions/authActions";
import * as commentActions from "../../actions/commentActions";

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      replying: false,
      signingUp: false,
      signingIn: false,
      authorized: isAuthorized(),
      hasError: false,
      notificationClosed: true,
      error: null
    }
  }

  static propTypes = {
    comment: propTypes.object,
    auth: propTypes.object,
    authActions: propTypes.object,
    reply: propTypes.bool,
    viewAll: propTypes.bool,
    doViewAll: propTypes.func
  }

  static defaultProps = {
    reply: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (nextProps.auth.activeUser !== prevState.authorized) {
      newState = newState || {};
      newState = Object.assign({}, newState, {
        authorized: isAuthorized()
      });
    }

    if (nextProps.auth.failedToSignInWithSocial ||
      nextProps.auth.failedToSignUpWithSocial ||
      nextProps.auth.hasFailed) {
      newState = newState || {};
      newState = Object.assign({}, newState, {
        hasError: true,
        notificationClosed: false,
        error: nextProps.auth.error.message
      });

      if (nextProps.auth.error.message === "user already exists")
        newState.error = "A user was found linked to the account you provided. Try signing in instead.";
    }

    if ((nextProps.auth.hasAuthorized ||
      nextProps.auth.hasSignedInWithSocial ||
      nextProps.auth.hasSignedUpWithSocial) &&
      (prevState.signingUp || prevState.signingIn)) {
      newState = newState || {};
      newState = Object.assign({}, newState, {
        signingIn: false,
        signingUp: false
      });
    }

    return newState;
  }

  render() {
    return (
      <div className={`comment ${this.props.reply ? "comment__reply" : ""}`}>
        <CommentHeader comment={this.props.comment} />
        <WYSIWYGEditor readonly content={this.props.comment.message.html} />
        {
          this.props.viewAll ?
            <span className="comment__view_all" onClick={this.handleViewAllClick}>
              view all {this.props.comment.replies} responses
            </span> : null
        }
      </div>
    )
  }

  handleReplyClick = () => {
    if (this.state.authorized) {
      return this.setState({  replying: !this.state.replying });
    }

    this.setState({ signingUp: true });
  }

  handleSocialSignIn = provider => {
    this.props.authActions.doSignInWithSocial(provider);
  }

  handleSocialSignUp = provider => {
    this.props.authActions.doSignUpWithSocial(provider);
  }

  handleViewAllClick = () => {
    if ("function" === typeof this.props.doViewAll)
      this.props.doViewAll();
  }

  handleReply = content => {
    console.log(content)
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comment);