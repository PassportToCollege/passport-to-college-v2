import "./Responder.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import { isAuthorized, activeUser } from "../../utils";

import * as authActions from "../../actions/authActions";
import * as userProfilePictureActions from "../../actions/userProfilePictureActions";

import Notification from "../../components/Notification";
import { SignUpModal, SignInModal } from "../../components/Modal";

class Responder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: props.post,
      user: activeUser(),
      active: false,
      authorized: isAuthorized(),
      signingUp: false,
      signingIn: false,
      hasError: false,
      notificationClosed: true,
      error: null
    }
  }

  static propTypes = {
    post: propTypes.object,
    authActions: propTypes.object,
    uppActions: propTypes.object
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (nextProps.picture.hasGotten &&
      (prevState.profilePicture !== nextProps.picture.url)) {
      newState = {};
      newState.profilePicture = nextProps.picture.url;
    }

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
        signingUp: false,
        user: activeUser()
      });
    }

    return newState;
  }

  componentDidMount() {
    if (isAuthorized()) {
      this.props.uppActions.doAvatarGet();
    }
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.signingUp ?
            <SignUpModal heading="Create an account to respond to this story."
              intro={`Responding is a great way to show ${this.state.post.author.name.full} what you think of this story.`}
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
        <div className="responder" onClick={this.handleResponderClick}>
          <section className="responder__meta">
            <span className="responder__meta_her">
              
            </span>
          </section>
          <section className="responder__editor">

          </section>
        </div>
      </React.Fragment>
    );
  }

  handleSocialSignIn = provider => {
    this.props.authActions.doSignInWithSocial(provider);
  }

  handleSocialSignUp = provider => {
    this.props.authActions.doSignUpWithSocial(provider);
  }

  handleResponderClick = () => {
    if (this.state.authorized)
      return;

    this.setState({ signingUp: true });
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    picture: state.userProfilePicture
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    uppActions: bindActionCreators(userProfilePictureActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Responder);