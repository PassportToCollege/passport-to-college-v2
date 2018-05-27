import "./SignIn.css";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import React, { Component } from "react";
import propTypes from "prop-types";

import * as authActions from "../../../actions/authActions"; 

import PageMeta from "../../../components/PageMeta";
import { SignInForm } from "../../../components/Forms";
import Notification from "../../../components/Notification";

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null,
      hasError: false,
      notificationClosed: false
    }
  }

  componentDidMount() {
    this.props.updateLocation("sign-in");
  }

  componentWillUnmount() {
    this.props.authActions.removeAuthErrors();
  }

  static getDerivedStateFromProps(nextProps) {
    let newState = null;

    if ((nextProps.auth.hasFailed || nextProps.auth.failedToSignInWithSocial) && nextProps.auth.error.message) {
      newState = {
        hasError: true,
        error: nextProps.auth.error.message
      };
    }

    return newState;
  }

  getSnapshotBeforeUpdate(prevProps) {
    let snapshot = null;

    if ((prevProps.auth.isAuthorizing || prevProps.auth.signingInWithSocial) &&
    (this.props.auth.hasAuthorized || this.props.auth.hasSignedInWithSocial)) {
      snapshot = {
        wasAuthorized: true
      };
    }

    return snapshot;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && snapshot.wasAuthorized) {
      const { activeUser } = this.props.auth;

      if (activeUser.isAdmin) {
        this.props.history.push("/admin/dashboard");
      } else if (activeUser.isApplicant) {
        this.props.history.push(`/apply/p/${activeUser.uid}`);
      } else {
        this.props.history.push("/");
      }
    }
  }

  render() {
    return (
      <div className="signin__container">
        <PageMeta route="SIGN_IN" />
        <SignInForm title="Sign in" subtitle="Or with your email:"
          handleSubmit={this.handleSignIn}
          handleSocialSignIn={this.handleSocialSignIn}
          updateEmail={this.updateEmail}
          updatePassword={this.updatePassword} 
          authError={this.state.hasError} 
          isWorking={this.props.auth.isAuthorizing || this.props.auth.signingInWithSocial}/>
        {
          this.state.hasError ?
            <Notification doClose={this.handleNotificationClose} text={this.state.error} /> :
            null
        }
      </div>
    )
  }

  updateEmail = (e) => this.setState({ email: e.target.value });
  updatePassword = (e) => this.setState({ password: e.target.value });

  handleSignIn = (e) => {
    e.preventDefault();

    const {email, password } = this.state;

    this.props.authActions.doSignIn(email, password);
    this.setState({
      email: null,
      password: null
    });
  }

  handleSocialSignIn = provider => {
    this.props.authActions.doSignInWithSocial(provider);
  }

  handleNotificationClose = () => {
    this.setState({ notificationClosed: true, hasError: false });
  }
}

SignIn.propTypes = {
  authActions: propTypes.object,
  activeUser: propTypes.object,
  updateLocation: propTypes.func,
  auth: propTypes.oneOfType([propTypes.bool, propTypes.object]),
  history: propTypes.object
};

const mapStateToProps = state => {
  return {
    activeUser: state.activeUser,
    auth: state.auth
  }; 
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch)
  };
};


export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps)(SignIn)
);