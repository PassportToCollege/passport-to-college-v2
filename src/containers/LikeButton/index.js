import "./LikeButton.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import { isAuthorized, countLikes } from "../../utils";

import * as authActions from "../../actions/authActions";
import * as postActions from "../../actions/postActions";

import IconButton from "../../components/IconButton";
import { SignUpModal, SignInModal } from "../../components/Modal";
import Notification from "../../components/Notification";

class LikeButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: props.post,
      signingUp: false,
      signingIn: false,
      authorized: isAuthorized(),
      hasError: false,
      notificationClosed: true,
      error: null
    }
  }

  static propTypes = {
    auth: propTypes.oneOfType([propTypes.object, propTypes.bool]),
    authActions: propTypes.object,
    post: propTypes.object
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (nextProps.auth.activeUser !== prevState.authorized) {
      newState = {};
      newState.authorized = isAuthorized();
    }

    if (nextProps.auth.failedToSignInWithFacebook ||
      nextProps.auth.failedToSignInWithGoogle ||
      nextProps.auth.hasFailed) {
      newState = newState || {};
      newState = Object.assign({}, newState, {
        hasError: true,
        notificationClosed: false,
        error: nextProps.auth.error.message
      });
    }

    if ((nextProps.auth.hasAuthorized ||
      nextProps.auth.hasSignedInWithGoogle ||
      nextProps.auth.hasSignedInWithFacebook) && 
      (prevState.signingUp || prevState.signingIn)) {
      newState = newState || {};
      newState.signingUp = false;
      newState.signingIn = false;
    }

    return newState;
  }

  render() {
    const liked = this.state.post && this.state.authorized && this.state.post.like && this.state.post.like[this.props.auth.activeUser.uid];

    return (
      <React.Fragment>
        {
          this.state.signingUp ?
            <SignUpModal heading="Create an account to like this story."
              intro={`Liking shows ${this.state.post.author.name.full} how much you appreciate this story.`}
              doClose={() => this.setState({ signingUp: false })}
              doGoogle={this.handleGoogleSignUp} 
              doFacebook={this.handleFacebookSignup} 
              doSignIn={() => this.setState({ signingIn: true, signingUp: false })} />
            : null
        }
        {
          this.state.signingIn ?
            <SignInModal doClose={() => this.setState({ signingIn: false })}
              doGoogle={this.handleGoogleSignUp}
              doFacebook={this.handleFacebookSignup}
              doSignIn={this.handleSignIn} 
              doSignUp={() => this.setState({ signingIn: false, signingUp: true })}/> : null
        }
        {
          this.state.hasError && !this.state.notificationClosed ?
            <Notification text={this.state.error}
              doClose={this.handleErrorNotificationClose} /> : null
        }
        <div className="like_button">
          <IconButton icon="like" 
            solid={liked} 
            styles={{
              backgroundColor: liked ? "#7DE2E7" : "transparent",
              borderColor: "#7DE2E7",
              color: liked ? "#fff" : "#7DE2E7"
            }} 
            doClick={this.handleLike} />
          {
            this.state.post && 
            (!this.state.post.likes || countLikes(this.state.post.likes) === 0) ?
              <span>Be the first to like!</span> : null 
          }
        </div>
      </React.Fragment>
    )
  }

  handleLike = () => {
    if (!this.state.authorized)
      return this.setState({ signingUp: true });
  }

  handleGoogleSignUp = () => {
    this.props.authActions.doSignInWithGoogle();
  }

  handleFacebookSignup = () => {
    this.props.authActions.doSignInWithFacebook();
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
    postActions: bindActionCreators(postActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LikeButton);