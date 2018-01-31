import "./Login.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import React, { Component } from "react";
import propTypes from "prop-types";

import * as authActions from "../../../actions/authActions"; 

class Login extends Component {

  render() {
    return (
      <div className="login__container">
        <form className="form login__form" method="post">
          <div className="form__input_container">
            <input type="email" name="email" required />
            <label>Email</label>
          </div>
          <div className="form__input_container">
            <input type="password" name="password" required />
            <label>Password</label>
          </div>
          <div className="form__input_container">
            <button class="form__button" type="submit">Login</button>
          </div>
        </form>
      </div>
    )
  }
}

Login.propTypes = {
  authActions: propTypes.object,
  user: propTypes.object
};

const mapStateToProps = state => {
  return {
    user: state.user
  }; 
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch)
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps)(Login);