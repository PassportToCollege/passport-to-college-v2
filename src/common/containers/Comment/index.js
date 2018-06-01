import "./Comment.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import IconButton from "../../components/IconButton";
import CommentHeader from "../../components/CommentHeader";
import WYSIWYGEditor from "../../components/Editor";
import Responder from "../Responder";
import { SignUpModal, SignInModal } from "../../components/Modal";
import Notification from "../../components/Notification";

import { isAuthorized } from "../../utils";

import * as authActions from "../../actions/authActions";

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      replying: false,
      signingUp: false,
      signingIn: false
    }
  }

  static propTypes = {
    comment: propTypes.object,
    auth: propTypes.object,
    authActions: propTypes.object
  }

  render() {
    const heading = "Create an account to write a comment.";
    const intro = "Commenting is a great way to share your view."

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
        <div className="comment">
          <CommentHeader comment={this.props.comment} />
          <WYSIWYGEditor readonly content={this.props.comment.message.html} />
          <IconButton icon="reply" solid
            doClick={this.handleReplyClick} />
          {
            this.state.replying ?
              <Responder type="comment"
                postId={this.props.comment.post} 
                onResponse={this.handleReply} 
                onOutsideClick={ () => this.setState({ replying: false }) }/> : null
          }
        </div>
      </React.Fragment>
    )
  }

  handleReplyClick = () => {
    if (isAuthorized()) {
      return this.setState({  replying: true });
    }

    this.setState({ signingUp: true });
  }

  handleSocialSignIn = provider => {
    this.props.authActions.doSignInWithSocial(provider);
  }

  handleSocialSignUp = provider => {
    this.props.authActions.doSignUpWithSocial(provider);
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