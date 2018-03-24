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
      user: props.user.users
    };
  }

  componentWillMount() {
    this.props.updateLocation("sign-up");

    const { temp_id } = this.props.match.params;
    this.props.usersAction.doGetUserByUid(temp_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.hasGotten)
      this.setState({ user: nextProps.user.users });
  }

  render() {
    return (
      <div className="signup__container">
        {
          this.props.user.hasGotten ?
            <SignUpForm user={this.state.user} /> :
            null
        }
      </div>
    )
  }
}

SignUp.propTypes = {
  match: propTypes.object,
  user: propTypes.object,
  usersAction: propTypes.object,
  updateLocation: propTypes.func
};

const mapStateToProps = state => {
  return {
    user: state.users
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