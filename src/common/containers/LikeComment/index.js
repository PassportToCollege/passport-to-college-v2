import "./LikeComment.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as authActions from "../../actions/authActions";
import * as commentActions from "../../actions/commentActions";
import { isAuthorized, activeUser, countLikes } from "../../utils";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/fontawesome-free-solid";
import { SignUpModal, SignInModal } from "../../components/Modal";
import Notification from "../../components/Notification";

class LikeComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: props.comment,
      authorized: isAuthorized(),
      liked: isAuthorized() && props.comment && props.comment.likes && props.comment.likes[activeUser()],
      likes: countLikes(props.comment.likes),
      signingIn: false,
      signingUp: false,
      hasError: false,
      notificationClosed: true,
      error: ""
    }
  }

  static propTypes = {
    comment: propTypes.object,
    commentActions: propTypes.object,
    auth: propTypes.oneOfType([propTypes.object, propTypes.bool]),
    authActions: propTypes.object
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (nextProps.auth.activeUser !== prevState.authorized) {
      newState = {};
      newState.authorized = isAuthorized();
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
      newState.signingUp = false;
      newState.signingIn = false;
    }

    return newState
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    let snapshot = null;

    if (this.state.authorized !== prevState.authorized) {
      snapshot = {};
      if (isAuthorized()) {
        snapshot.wasAuthorized = true;
      } else {
        snapshot.wasUnauthorized = true;
      }
    }

    return snapshot;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.wasAuthorized) {
      let liked = this.state.comment.likes && this.state.comment.likes[activeUser()];
      this.setState({
        liked,
        likes: liked ? countLikes(this.state.comment.likes) + 1 : countLikes(this.state.comment.likes)
      });
    }

    if (snapshot && snapshot.wasUnauthorized) {
      this.setState({
        liked: isAuthorized() && this.state.comment && this.state.comment.likes && this.state.comment.likes[activeUser()],
        likes: countLikes(this.state.comment.likes),
      })
    }
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.signingUp ?
            <SignUpModal heading="Create an account to like this comment."
              intro={`Liking shows ${this.state.comment.user.name.full} how much you appreciate the comment.`}
              doClose={() => this.setState({ signingUp: false })}
              doGoogle={this.handleSocialSignUp} 
              doFacebook={this.handleSocialSignUp} 
              doSignIn={() => this.setState({ signingIn: true, signingUp: false })} />
            : null
        }
        {
          this.state.signingIn ?
            <SignInModal doClose={() => this.setState({ signingIn: false })}
              doGoogle={this.handleSocialSignIn}
              doFacebook={this.handleSocialSignIn}
              doSignIn={this.handleSignIn} 
              doSignUp={() => this.setState({ signingIn: false, signingUp: true })}/> : null
        }
        {
          this.state.hasError && !this.state.notificationClosed ?
            <Notification text={this.state.error}
              doClose={this.handleErrorNotificationClose} /> : null
        }
      <span className="like_comment">
        <span className={`like_comment__button ${this.state.liked ? "like_comment__liked" : ""}`} 
          title="Like"
          onClick={this.handleLike}>
          <FontAwesomeIcon icon={faThumbsUp} />
        </span>
        <span className="like_comment__likes">{this.state.likes > 0 ? this.state.likes : null}</span>
      </span>
      </React.Fragment>
    )
  }

  handleLike = () => {
    if (!this.state.authorized)
      return this.setState({ signingIn: true });
    
    const liked = !this.state.liked;
    this.setState({
      liked,
      likes: liked ? this.state.likes + 1 : this.state.likes - 1
    });

    this.props.commentActions.doUpdateComment(
      this.state.comment.id,
      {
        likes: Object.assign({}, this.state.comment.likes || {}, {
          [activeUser()]: liked
        })
      }
    );
  }

  handleSocialSignIn = provider => {
    this.props.authActions.doSignInWithSocial(provider);
  }

  handleSocialSignUp = provider => {
    this.props.authActions.doSignUpWithSocial(provider);
  }

  handleErrorNotificationClose = () => {
    this.setState({
      hasError: false,
      notificationClosed: true,
      error: null
    });

    this.props.authActions.removeAuthErrors();
  }

  handleSignIn = (email, password) => {
    this.props.authActions.doSignIn(email.value, password.value);
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    commentActions: bindActionCreators(commentActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LikeComment);