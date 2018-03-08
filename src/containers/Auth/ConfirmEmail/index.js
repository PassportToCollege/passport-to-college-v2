import "./ConfirmEmail.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import React, { Component } from "react";
import propTypes from "prop-types";

import * as authActions from "../../../actions/authActions";
import * as userActions from "../../../actions/userActions";

import Notification from "../../../components/Notification";
import LinkButton from "../../../components/LinkButton";

class ConfirmEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      notificationClosed: false,
      emailVerified: false
    }
  }
  render() {
    return (
      <div className="confirm_email__container">
        {
          this.props.user.isUpdating ?
            <h1>Confirming email address....</h1>
              :
            null
        }
        {
          this.state.emailVerified ?
            <div>
              <h1>Way to go! Your email address has been confirmed.</h1>
              <LinkButton target={`/apply/p/${this.props.match.params.uid}`}
                text="Continue Your Application" />
            </div>
            :
            null
        }
        {
          this.state.hasError ?
            <Notification doClose={this.handleNotificationClose} text={this.state.error} /> :
            null
        }
      </div>
    )
  }

  componentWillMount() {
    this.props.updateLocation("confirm-email");

    // confirm user's email address
    const { uid } = this.props.match.params;
    this.props.userActions.doUserUpdate({ emailConfirmed: true }, uid);
  }

  componentWillUnmount() {
    this.props.authActions.removeAuthErrors();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth && nextProps.auth.hasFailed && nextProps.auth.error.message)
      this.setState({ hasError: true, error: nextProps.auth.error.message });
    
    if (nextProps.user && nextProps.user.hasFailed)
      this.setState({ hasError: true, error: nextProps.user.error.message });
    
    if (nextProps.user && !nextProps.user.isUpdating && !nextProps.user.hasFailed)
      this.setState({ emailVerified: true })
  }

  handleNotificationClose = () => {
    this.setState({ notificationClosed: true, hasError: false });
  }
}

ConfirmEmail.propTypes = {
  authActions: propTypes.object,
  updateLocation: propTypes.func,
  auth: propTypes.oneOfType([propTypes.bool, propTypes.object]),
  user: propTypes.object,
  userActions: propTypes.object,
  match: propTypes.object
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps)(ConfirmEmail);