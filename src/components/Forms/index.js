import "./Forms.css";

import React from "react";
import propTypes from "prop-types";

export const SignInForm = props => {
    return (
      <form className="form signin__form" method="post" onSubmit={props.handleSignIn}>
        <div className="form__input_container">
          <input type="email" name="email" required onChange={props.updateEmail} />
          <label>Email</label>
        </div>
        <div className="form__input_container">
          <input type="password" name="password" required onChange={props.updatePassword} />
          <label>Password</label>
        </div>
        <div className="form__input_container">
          <button className="form__button" type="submit">Sign In</button>
        </div>
      </form>
    );
}

SignInForm.propTypes = {
  handleSignIn: propTypes.func,
  updateEmail: propTypes.func,
  updatePassword: propTypes.func
};