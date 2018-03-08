import "./SignIn.css";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import React, { Component } from "react";
import propTypes from "prop-types";

import * as authActions from "../../../actions/authActions"; 

import { SignInForm } from "../../../components/Forms";
import Notification from "../../../components/Notification";

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      hasError: false,
      notificationClosed: false
    }
  }
  render() {
    return (
      <div className="signin__container">
        <SignInForm handleSubmit={this.handleSignIn}
          updateEmail={this.updateEmail}
          updatePassword={this.updatePassword} 
          authError={this.state.hasError} />
        {
          this.state.hasError ?
            <Notification doClose={this.handleNotificationClose} text={this.state.error} /> :
            null
        }
      </div>
    )
  }

  componentWillMount() {
    this.props.updateLocation("sign-in");
  }

  componentWillUnmount() {
    this.props.authActions.removeAuthErrors();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth && nextProps.auth.hasFailed && nextProps.auth.error.message)
      this.setState({ hasError: true, error: nextProps.auth.error.message });
    
    if (nextProps.auth && nextProps.auth.hasAuthorized === true) {
      const { activeUser } = nextProps.auth;

      if (activeUser.isAdmin) {
        this.props.history.push("/admin/dashboard");
      } else if (activeUser.isApplicant) {
        this.props.history.push(`/apply/p/${activeUser.uid}`);
      } else {
        this.props.history.push("/");
      }
    }
  }

  updateEmail = (e) => this.setState({ email: e.target.value });
  updatePassword = (e) => this.setState({ password: e.target.value });

  handleSignIn = (e) => {
    e.preventDefault();

    const {email, password } = this.state;

    this.props.authActions.doSignIn(email, password);
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