import "./SignUp.css";

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import propTypes from "prop-types";

import * as authActions from "../../../actions/authActions";
import * as usersAction from "../../../actions/usersActions";

import Notification from "../../../components/Notification";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationClosed: false,
      hasError: false
    };
  }

  componentWillMount() {
    this.props.updateLocation("sign-up");

    const { temp_id } = this.props.match.params;
    this.props.usersAction.doGetUserByUid(temp_id);
  }

  render() {
    return (
      <div className="signup__container">
        signup
      </div>
    )
  }
}

SignUp.propTypes = {
  match: propTypes.object,
  auth: propTypes.object,
  user: propTypes.object,
  usersAction: propTypes.object,
  updateLocation: propTypes.func
};

const mapStateToProps = state => {
  return {
    user: state.users,
    auth: state.auth
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