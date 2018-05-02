import "./LikeButton.css";

import React, { Component} from "react";
import { connect} from "react-redux";
import { bindActionCreators } from "redux"
import propTypes from "prop-types";
import { isAuthorized, countLikes, activeUser } from "../../utils";

import * as authActions from "../../actions/authActions";
import * as postActions from "../../actions/postActions";

import IconButton from "../../components/IconButton";
import { SignUpModal, SignInModal } from "../../components/Modal";
import Notification from "../../components/Notification";

class LikeButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.postId,
      post: props.post,
      liked: isAuthorized() && props.post && props.post.likes && props.post.likes[activeUser()],
      likes: countLikes(props.post.likes),
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
    post: propTypes.object,
    postActions: propTypes.object,
    postId: propTypes.string
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
            solid={this.state.liked} 
            styles={{
              backgroundColor: this.state.liked ? "#7DE2E7" : "transparent",
              borderColor: "#7DE2E7",
              color: this.state.liked ? "#fff" : "#7DE2E7"
            }} 
            doClick={this.handleLike} />
          {
            this.state.likes === 0 ?
              <span>Be the first to like!</span> : null 
          }
          {
            this.state.liked && this.state.likes === 1 ?
              <span>You like this story!</span> : null
          }
          {
            this.state.liked && this.state.likes > 1 ?
              <span>
                You and <b>{this.state.likes - 1}</b> other{this.state.likes - 1 > 1 ? "s" : " person"} like this story!
              </span> : 
                this.state.likes > 1 ? <span>{this.state.likes}</span> : null
          }
        </div>
      </React.Fragment>
    )
  }

  handleLike = () => {
    if (!this.state.authorized)
      return this.setState({ signingUp: true });
    
    const liked = !this.state.liked;
    this.setState({ 
      liked, 
      likes: liked ? this.state.likes + 1 : this.state.likes - 1 
    });

    this.props.postActions.doPostUpdate(this.state.id, {
      likes: Object.assign({}, this.state.post.likes, {
        [activeUser()]: liked
      })
    }, {
      refresh: false
    });
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