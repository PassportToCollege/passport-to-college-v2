import "./SignIn.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import React, { Component } from "react";
import propTypes from "prop-types";

import * as authActions from "../../../actions/authActions"; 

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    }
  }
  render() {
    return (
      <div className="signin__container">
        <form className="form signin__form" method="post" onSubmit={this.handleSignIn}>
          <div className="form__input_container">
            <input type="email" name="email" required onChange={this.updateEmail} />
            <label>Email</label>
          </div>
          <div className="form__input_container">
            <input type="password" name="password" required onChange={this.updatePassword} />
            <label>Password</label>
          </div>
          <div className="form__input_container">
            <button className="form__button" type="submit">Sign In</button>
          </div>
        </form>
      </div>
    )
  }

  componentWillMount() {
    this.props.updateLocation("sign-in");
  }

  updateEmail = (e) => { this.setState({ email: e.target.value }); }
  updatePassword = (e) => { this.setState({ password: e.target.value }); }

  handleSignIn = (e) => {
    e.preventDefault();

    const {email, password } = this.state;

    this.props.authActions.doSignIn(email, password);
  }
}

SignIn.propTypes = {
  authActions: propTypes.object,
  activeUser: propTypes.object
};

const mapStateToProps = state => {
  return {
    activeUser: state.activeUser
  }; 
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch)
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps)(SignIn);