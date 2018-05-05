import "./Apply.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as authActions from "../../actions/authActions";

import { SignInForm, StartApplication } from "../../components/Forms";
import Notification from "../../components/Notification";
import PageMeta from "../../components/PageMeta";

class Apply extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      hasError: false,
      error: "",
      notificationClosed: false,
      hasSent: false,
      loggingIn: false,
      creatingAccount: false
    }
  }

  componentDidMount() {
    this.props.updateLocation("apply");
  }

  componentWillUnmount() {
    this.props.authActions.removeAuthErrors();
    this.setState({ 
      hasSent: false, 
      notificationClosed: true,
      email: "",
      password: "" 
    });
  }

  static getDerivedStateFromProps(nextProps) {
    let newState = null;

    if (nextProps.auth.hasFailed) {
      newState = {
        hasError: true,
        error: nextProps.auth.error.message,
        notificationClosed: false,
        loggingIn: false,
        creatingAccount: false
      };
    }

    if (nextProps.auth.failedToSignInWithSocial) {
      if (nextProps.auth.error.message === "user type mismatch") {
        newState = {
          hasError: true,
          error: "The account you used to sign in is not an applicant account. You must use an applicant account to access the application portal.",
          notificationClosed: false,
          loggingIn: false
        }
      } else {
        newState = {
          hasError: true,
          error: nextProps.auth.error.message,
          notificationClosed: false,
          loggingIn: false
        };
      }
    }

    if (nextProps.auth.hasSent) {
      newState = {
        hasSent: true,
        notificationClosed: false
      };
    }

    if (nextProps.auth.isCreating) {
      newState = {
        creatingAccount: true
      };
    }

    if (nextProps.auth.hasCreated) {
      newState = newState || {};
      newState.creatingAccount = false;
    }

    if (nextProps.auth.isAuthorizing || nextProps.auth.signingInWithSocial) {
      newState = {
        loggingIn: true
      };
    }

    if (nextProps.auth.hasAuthorized || nextProps.auth.hasSignedInWithSocial) {
      newState = {
        loggingIn: false
      };

      const { activeUser } = nextProps.auth;
      nextProps.history.push(`/apply/p/${activeUser.uid}`);
    }

    return newState;
  }

  render() {
    return (
      <div className="apply__container">
        <PageMeta route="APPLY" />
        <SignInForm 
          title="Continue Application"
          subtitle="Or with your email"
          submitText="Continue"
          handleSubmit={this.handleSignIn}
          handleSocialSignIn={this.handleSocialSignIn}
          updateEmail={this.updateEmail}
          updatePassword={this.updatePassword} 
          authError={this.state.hasError}
          isWorking={this.state.loggingIn} />

        <StartApplication
          title="Start New Application"
          handleAccountCreation={this.handleAccountCreation}
          updateName={this.updateName}
          updateEmail={this.updateEmail}
          updatePassword={this.updatePassword}
          isWorking={this.state.creatingAccount} />

        {
          this.state.hasError && !this.state.notificationClosed?
          <Notification doClose={this.handleNotificationClose} text={this.state.error} /> :
          null
        }
        {
          this.state.hasSent && !this.state.notificationClosed ?
            <Notification doClose={this.handleNotificationClose}
              text="Account created! You may now sign in using the continue application form." />
            :
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

    this.props.authActions.doSignIn(email, password, {
      strict: "isApplicant"
    });
  }

  handleSocialSignIn = provider => {
    this.props.authActions.doSignInWithSocial(provider, {
      strict: "isApplicant"
    });
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

    // reset form
    e.target.reset();
  }

  handleNotificationClose = () => {
    this.setState({ notificationClosed: true, hasError: false, hasSent: false });
  }
}

Apply.propTypes = {
  authActions: propTypes.object,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Apply);
