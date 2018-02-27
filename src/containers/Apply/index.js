import "./Apply.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as authActions from "../../actions/authActions";

import { SignInForm, StartApplication } from "../../components/Forms";
import Notification from "../../components/Notification";

class Apply extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      hasError: false,
      error: "",
      notificationClosed: false
    }
  }

  componentWillMount() {
    this.props.updateLocation("apply");
  }

  componentWillUnmount() {
    this.props.authActions.removeAuthErrors();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth && nextProps.auth.hasFailed && nextProps.auth.error.message)
      this.setState({ hasError: true, error: nextProps.auth.error.message });
  }

  render() {
    return (
      <div className="apply__container">
        <SignInForm 
          title="Continue Application"
          submitText="Continue"
          handleSignIn={this.handleSignIn}
          updateEmail={this.updateEmail}
          updatePassword={this.updatePassword} />

        <StartApplication
          title="Start New Application"
          handleAccountCreation={this.handleAccountCreation}
          updateName={this.updateName}
          updateEmail={this.updateEmail}
          updatePassword={this.updatePassword} />

        {
          this.state.hasError && !this.state.notificationClosed?
          <Notification doClose={this.handleNotificationClose} text={this.state.error} /> :
          null
        }
      </div>
    )
  }

  updateEmail = (e) => this.setState({ email: e.target.value });
  updatePassword = (e) => this.setState({ password: e.target.value });
  updateName = (e) => this.setState({ name: e.target.value });

  handleSignIn = (e) => {
    e.preventDefault();

    const { email, password } = this.state;

    this.props.authActions.doSignIn(email, password);
  }

  handleAccountCreation = (e) => {
    e.preventDefault();

    const data = {
      isApplicant: true,
      email: this.state.email,
      name: this.state.name,
      password: this.state.password
    };

    this.props.authActions.doAccountCreate(data);
  }

  handleNotificationClose = () => {
    this.setState({ notificationClosed: true });
  }
}

Apply.propTypes = {
  authActions: propTypes.object,
  updateLocation: propTypes.func,
  auth: propTypes.object
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Apply);
