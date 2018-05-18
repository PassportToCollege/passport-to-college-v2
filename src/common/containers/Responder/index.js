import "./Responder.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import { isAuthorized, getWordCount } from "../../utils";
import _ from "lodash";

import * as authActions from "../../actions/authActions";
import * as userProfilePictureActions from "../../actions/userProfilePictureActions";
import * as userActions from "../../actions/userActions";

import Notification from "../../components/Notification";
import { SignUpModal, SignInModal } from "../../components/Modal";
import WYSIWYGEditor from "../../components/Editor";

class Responder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: props.post,
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
    uppActions: propTypes.object,
    picture: propTypes.object,
    user: propTypes.object,
    userActions: propTypes.object
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (nextProps.picture.hasGotten &&
      (prevState.profilePicture !== nextProps.picture.url)) {
      newState = {};
      newState.profilePicture = nextProps.picture.url;
    }

    if (nextProps.user.hasGotten &&
      !_.isEqual(prevState.user, nextProps.user.user)) {
      newState = newState || {};
      newState.user = nextProps.user.user;
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
        signingUp: false
      });
    }

    return newState;
  }

  componentDidMount() {
    if (isAuthorized()) {
      this.props.uppActions.doAvatarGet();
      this.props.userActions.doUserGet();
    }
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
      if (!this.props.picture.isGetting) {
        this.props.uppActions.doAvatarGet();
      }

      if (!this.props.user.isGetting) {
        this.props.userActions.doUserGet();
      }
    }

    if (snapshot && snapshot.wasUnauthorized) {
      this.setState({
        profilePicture: null,
        user: null
      });
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
            <span className="responder__meta_profile_pic">
              {
                this.state.profilePicture ?
                  <img src={this.state.profilePicture} alt="Active user profile pic" /> :
                  this.state.user && this.state.user.photo ?
                    <img src={this.state.user.photo} alt="Active user profile pic" /> :
                    <span className="responder__meta_placeholder_profile_pic"></span>
              }
            </span>
            {
              this.state.user && this.state.active ?
              <span className="responder__meta_username">{this.state.user.name.full}</span> :
              <span className="responder__meta_ph">Write a response...</span>
            }
          </section>
          <section className="responder__editor" 
            data-state={this.state.active ? "active" : "inactive"}>
            {
              this.state.active ?
                <WYSIWYGEditor focus saveButton
                  captureBlur={this.handleResponderBlur} 
                  saveButtonText="Post" 
                  handleSave={this.handleResponseSave} /> : null
            }
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
    if (this.state.authorized) {
      return this.setState({  active: true });
    }

    this.setState({ signingUp: true });
  }

  handleResponderBlur = ({ blocks }) => {
    if (getWordCount(blocks)) 
      return;

    this.setState({ active: false });
  }

  handleResponseSave = content => {
    this.setState({ active: false });
    debugger;
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    picture: state.userProfilePicture,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    uppActions: bindActionCreators(userProfilePictureActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Responder);