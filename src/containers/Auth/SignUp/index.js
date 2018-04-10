import "./SignUp.css";

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as authActions from "../../../actions/authActions";
import * as usersAction from "../../../actions/usersActions";

import { SignUpForm } from "../../../components/Forms";
import Notification from "../../../components/Notification";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationClosed: false,
      hasError: false,
      user: props.users.user,
      formData: {},
      creatingAccount: false
    };
  }

  componentWillMount() {
    this.props.updateLocation("sign-up");

    const { temp_id } = this.props.match.params;
    this.props.usersAction.doGetUserByUid(temp_id);
  }

  componentWillUnmount() {
    this.props.authActions.removeAuthErrors();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users.hasGottenUser)
      this.setState({ user: nextProps.users.user });
    
    if (nextProps.users.hasFailed)
      this.setState({ 
        hasError: true,
        error: nextProps.users.error.message
       });

    if (nextProps.auth.hasFailed)
      this.setState({ 
        hasError: true, 
        error: nextProps.auth.error.message, 
        creatingAccount: false });

    if (nextProps.auth.hasCreated)
      this.setState({ creatingAccount: false, accountCreated: true });
  }

  render() {
    return (
      <div className="signup__container">
        {
          this.props.users.hasGottenUser && this.state.user ?
            <SignUpForm user={this.state.user} 
              handleSubmit={this.handleSubmit}
              handleInputChange={this.handleInputChange} 
              isWorking={this.state.creatingAccount} /> :
            null
        }
        {
          this.state.hasError && !this.state.notificationClosed ?
            <Notification doClose={this.handleNotificationClose}
              text={this.state.error} /> :
            null
        }
        {
          !this.state.hasError && this.state.accountCreated ?
            <Notification doClose={this.handleNotificationClose}
              text="Signup complete. Close me to sign in." /> :
            null
        }
      </div>
    )
  }

  handleInputChange = e => {
    const newFormData = Object.assign({}, this.state.formData, {
      [e.target.name]: e.target.value
    });

    this.setState({ formData: newFormData });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ creatingAccount: true });

    if (this.state.formData.password !== this.state.formData.confirm_password) {
      this.setState({ 
        hasError: true,
        creatingAccount: false,
        error: "Passwords do not match."
       });

       return;
    }
    let { user, formData } = this.state;
    formData.emailConfirmed = true;

    const data = Object.assign({}, user, formData);
    this.props.authActions.doAccountCreate(data);
  }

  handleNotificationClose = () => {
    this.setState({ hasError: false, notificationClosed: true });

    if (this.state.accountCreated)
      return this.props.history.push("/auth/sign-in");
    
    if (this.props.users.hasFailed)
      this.props.history.push("/");
  }
}

SignUp.propTypes = {
  match: propTypes.object,
  users: propTypes.object,
  usersAction: propTypes.object,
  updateLocation: propTypes.func,
  auth: propTypes.oneOfType([propTypes.bool, propTypes.object]),
  authActions: propTypes.object,
  history: propTypes.object
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    users: state.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    usersAction: bindActionCreators(usersAction, dispatch)
  };
};


export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps)(SignUp)
);