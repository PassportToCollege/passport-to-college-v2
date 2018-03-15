import "./ResetPassword.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import React, { Component } from "react";
import propTypes from "prop-types";

import * as authActions from "../../../actions/authActions";

import { ResetPasswordForm } from "../../../components/Forms";
import Notification from "../../../components/Notification";

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      hasError: false,
      hasSent: false,
      notificationClosed: false
    };
  }

  componentWillMount() {
    this.props.updateLocation("reset");
  }

  componentWillUnmount() {
    this.props.authActions.removeAuthErrors();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth && nextProps.auth.hasFailed && nextProps.auth.error.message)
      this.setState({ hasError: true, error: nextProps.auth.error.message });
    
    if (nextProps.auth && nextProps.auth.hasSent)
      this.setState({ hasSent: true });
  }

  render() {
    return (
      <div className="reset__container">
        <ResetPasswordForm handleSubmit={this.handleSubmit}
          updateEmail={this.updateEmail}
          authError={this.state.hasError} 
          title="Provide your email to reset your password"/>
        {
          this.state.hasError ?
            <Notification doClose={this.handleNotificationClose} text={this.state.error} /> :
            null
        }
        {
          this.state.hasSent ?
            <Notification doClose={this.handleNotificationClose} 
              text={`Reset email sent to ${this.state.email}. Check your email.`} /> :
            null
        }
      </div>
    )
  }

  updateEmail = (e) => this.setState({ email: e.target.value });

  handleSubmit = (e) => {
    e.preventDefault();

    const { email } = this.state;

    this.props.authActions.doResetPasswordEmailSend(email);
  }

  handleNotificationClose = () => {
    this.setState({ notificationClosed: true, hasError: false });
  }
}

ResetPassword.propTypes = {
  authActions: propTypes.object,
  updateLocation: propTypes.func,
  auth: propTypes.oneOfType([propTypes.bool, propTypes.object])
};

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
  mapDispatchToProps)(ResetPassword);