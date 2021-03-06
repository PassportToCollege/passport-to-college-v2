import "./Responder.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import { isAuthorized, getWordCount, isBrowser } from "../../utils";
import _ from "lodash";

import * as authActions from "../../actions/authActions";
import * as userProfilePictureActions from "../../actions/userProfilePictureActions";
import * as userActions from "../../actions/userActions";
import * as commentActions from "../../actions/commentActions";

import InitialsAvatar from "../../components/InitialsAvatar";
import Notification from "../../components/Notification";
import { SignUpModal, SignInModal } from "../../components/Modal";
import WYSIWYGEditor from "../../components/Editor";

class Responder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: props.post,
      postId: props.postId,
      active: props.active,
      authorized: isAuthorized(),
      signingUp: false,
      signingIn: false,
      hasError: false,
      notificationClosed: true,
      error: null
    }
  }

  static propTypes = {
    active: propTypes.bool,
    post: propTypes.object,
    comment: propTypes.oneOfType([propTypes.string, propTypes.object]),
    postId: propTypes.string,
    authActions: propTypes.object,
    uppActions: propTypes.object,
    picture: propTypes.object,
    user: propTypes.object,
    userActions: propTypes.object,
    comments: propTypes.object,
    commentActions: propTypes.object,
    onResponse: propTypes.func,
    onOutsideClick: propTypes.func,
    type: propTypes.string,
    height: propTypes.string,
    doClose: propTypes.func,
    guidlines: propTypes.bool
  }

  static defaultProps = {
    type: "post",
    active: false,
    guidlines: true
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (isAuthorized() && nextProps.picture.hasGotten &&
      (prevState.profilePicture !== nextProps.picture.url)) {
      newState = {};
      newState.profilePicture = nextProps.picture.url;
    }

    if (isAuthorized() && nextProps.user.hasGotten &&
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

    if (nextProps.comments.createdComment && prevState.createdComment !== nextProps.comments.newCommentId) {
      newState = newState || {};
      newState.active = false;
      newState.createdComment = nextProps.comments.newCommentId;
    }

    if (nextProps.active) {
      newState = newState || {};

      if (!isAuthorized()) {
        newState.signingIn = true;

        if ("function" === typeof nextProps.doClose)
          nextProps.doClose();
      } else {
        newState.active = true;
      }
    }

    return newState;
  }

  componentDidMount() {
    if (isAuthorized()) {
      if (!this.state.user)
        this.props.uppActions.doAvatarGet();
      
      if (!this.state.profilePicture)
        this.props.userActions.doUserGet();
    }

    if (isBrowser) {
      document.addEventListener("mousedown", this.listenOutsideClick);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.listenOutsideClick);
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

    if (prevProps.comments.creatingComment && this.props.comments.createdComment) {
      snapshot = snapshot || {};
      snapshot.createdComment = true;
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
        user: null,
        active: false
      });
    }

    if (snapshot && snapshot.createdComment) {
      if ("function" === typeof this.props.onResponse)
        this.props.onResponse(this.state.createdComment, this.props.comments.isReply);
    }
  }

  render() {
    const heading = this.props.type === "post" ? "Create an account to respond to this story." : "Create an account to write a response.";
    const intro = this.props.type === "post" ? `Responding is a great way to show ${this.state.post.author.name.full} what you think of this story.` : "Responding is a great way to share your view."

    return (
      <React.Fragment>
        {
          this.state.signingUp ?
            <SignUpModal heading={heading}
              intro={intro}
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
        <div className="responder" onClick={this.handleResponderClick}
          ref={div => this.responderRef = div}>
          <section className="responder__meta">
            <span className="responder__meta_profile_pic">
              {
                this.state.profilePicture ?
                  <img src={this.state.profilePicture} alt="Active user profile pic" /> :
                  this.state.user && this.state.user.photo ?
                    <img src={this.state.user.photo} alt="Active user profile pic" /> :
                    this.state.user ?
                      <InitialsAvatar initials={`${this.state.user.name.first[0]}${this.state.user.name.last[0]}`} /> :
                      <span className="responder__meta_placeholder_profile_pic"></span>
              }
            </span>
            {
              this.state.user && this.state.active ?
              <span>
                Commenting as
                <span className="responder__meta_username"> {this.state.user.name.full}</span>
              </span> :
              <span className="responder__meta_ph">Write a response...</span>
            }
          </section>
          <section className="responder__editor" 
            data-state={this.state.active ? "active" : "inactive"}>
            {
              this.state.active && this.props.user.hasGotten && this.state.user ?
                <WYSIWYGEditor focus saveButton cancelButton
                  communityGuidlines={this.props.guidlines}
                  wordCounter={false}
                  content={
                    this.props.type === "comment" ?
                      `<b>${this.props.comment.user.name.full}</b><span> </span>` : null
                  }
                  captureBlur={this.handleResponderBlur} 
                  saveButtonText="Post" 
                  handleSave={this.handleResponseSave}
                  handleCancel={this.handleResponseCancel}
                  editorStyles={{
                    minHeight: `${this.props.height}px`
                  }} 
                  controlStyles={{
                    position: "relative"
                  }}/> : null
            }
          </section>
        </div>
      </React.Fragment>
    );
  }

  listenOutsideClick = e => {
    if (this.responderRef) {
      if (this.props.type === "comment") {
        if ("function" === typeof this.props.onOutsideClick)
          return this.props.onOutsideClick(e);
      }
      
      this.setState({ clickedInside: this.responderRef.contains(e.target) });
    }
  }

  handleSocialSignIn = provider => {
    this.props.authActions.doSignInWithSocial(provider);
  }

  handleSocialSignUp = provider => {
    this.props.authActions.doSignUpWithSocial(provider);
  }

  handleSignIn = (email, password) => {
    this.props.authActions.doSignIn(email.value, password.value);
  }

  handleResponderClick = () => {
    if (this.state.authorized) {
      return this.setState({  active: true });
    }

    this.setState({ signingIn: true });
  }

  handleResponderBlur = ({ blocks }) => {
    if ((blocks.length === 1 && this.props.type === "comment" &&
      blocks[0].text === `${this.props.comment.user.name.full} `) && !this.state.clickedInside) {
      if ("function" === typeof this.props.doClose)
        this.props.doClose();

      return this.setState({ active: false });
    }

    if (getWordCount(blocks) || this.state.clickedInside) 
      return;
    
    if ("function" === typeof this.props.doClose)
      this.props.doClose();

    this.setState({ active: false });
  }

  handleResponseSave = content => {
    if (this.props.type === "comment") {
      let comment = {
        hasReplies: false
      };

      if (this.props.comment.parent) {
        comment.id = this.props.comment.parent;
      } else {
        comment = this.props.comment;
      }

      this.props.commentActions.doCommentCreate(
        this.state.user,
        content,
        this.state.postId,
        {
          isReply: true,
          comment
        }
      );
    } else {
      this.props.commentActions.doCommentCreate(
        this.state.user,
        content,
        this.state.postId
      );
    }
  }

  handleResponseCancel = (e) => {
    e.stopPropagation();

    if ("function" === typeof this.props.doClose)
      this.props.doClose();

    this.setState({ active: false });
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    picture: state.userProfilePicture,
    user: state.user,
    comments: state.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    uppActions: bindActionCreators(userProfilePictureActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    commentActions: bindActionCreators(commentActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Responder);