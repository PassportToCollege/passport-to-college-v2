import "./LikeButton.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import { isAuthorized } from "../../utils";

import * as authActions from "../../actions/authActions";
import * as postActions from "../../actions/postActions";

import IconButton from "../../components/IconButton";
import { SignUpModal } from "../../components/Modal";
import Notification from "../../components/Notification";

class LikeButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: props.post,
      signingUp: false,
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
      nextProps.auth.failedToSignInWithGoogle) {
      newState = newState || {};
      newState = Object.assign({}, newState, {
        hasError: true,
        notificationClosed: false,
        error: nextProps.auth.error.message
      });
    }

    if ((nextProps.auth.hasAuthorized ||
      nextProps.auth.hasSignedInWithGoogle ||
      nextProps.auth.hasSignedInWithFacebook) && prevState.signingUp) {
      newState = newState || {};
      newState.signingUp = false;
    }

    return newState;
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.signingUp ?
            <SignUpModal heading="Create an account to like this story."
              intro={`Liking shows ${this.state.post.author.name.full} how much you appreciate this story.`}
              doClose={() => this.setState({ signingUp: false })}
              doGoogle={this.handleGoogleSignUp} 
              doFacebook={this.handleFacebookSignup} />
            : null
        }
        {
          this.state.hasError && !this.state.notificationClosed ?
            <Notification text={this.state.error}
              doClose={this.handleErrorNotificationClose} /> : null
        }
        <div className="like_button">
          <IconButton icon="like" solid 
            styles={{
              backgroundColor: "#7DE2E7"
            }} 
            doClick={this.handleLike} />
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