import "./Forms.css";

import React from "react";
import propTypes from "prop-types";

export const SignInForm = props => {
    return (
      <form className="form signin__form" method="post" onSubmit={props.handleSignIn}>
        {
          props.title ?
          <h2 className="form__title">{props.title}</h2> :
          null
        }
        <div className="form__input_container">
          <input type="email" name="email" required onChange={props.updateEmail} />
          <label>Email</label>
        </div>
        <div className="form__input_container">
          <input type="password" name="password" required onChange={props.updatePassword} />
          <label>Password</label>
        </div>
        <div className="form__input_container">
          <button className="form__button" type="submit">{props.submitText || "Sign In"}</button>
        </div>
      </form>
    );
}

SignInForm.propTypes = {
  title: propTypes.string,
  submitText: propTypes.string,
  handleSignIn: propTypes.func,
  updateEmail: propTypes.func,
  updatePassword: propTypes.func
};

export const StartApplication = props => {
  return (
    <form className="form signin__form" method="post" onSubmit={props.handleAccountCreation}>
      {
        props.title ?
          <h2 className="form__title">{props.title}</h2> :
          null
      }
      <div className="form__input_container">
        <input type="text" name="name" required onChange={props.updateName} />
        <label>Full Name</label>
      </div>
      <div className="form__input_container">
        <input type="email" name="email" required onChange={props.updateEmail} />
        <label>Email</label>
      </div>
      <div className="form__input_container">
        <input type="password" name="password" required onChange={props.updatePassword} />
        <label>Password</label>
      </div>
      <div className="form__input_container">
        <button className="form__button" type="submit">Create Account</button>
      </div>
    </form>
  )
}

StartApplication.prototypes = {
  title: propTypes.string,
  handleSignIn: propTypes.func,
  updateEmail: propTypes.func,
  updatePassword: propTypes.func
};

export const PersonalInformation = props => {
  return (
    <form className="form application_task__form application__personal_information">
      <div className="form__input_container">
        <input type="text" name="name" required 
          onBlur={props.updateName} autoFocus 
          defaultValue={props.user.name.full}
          placeholder="John Doe" />
        <label>Full Name</label>
      </div>
      <div className="form__input_container">
        <input type="email" name="email" required 
          onBlur={props.updateEmail} 
          defaultValue={props.user.email}
          placeholder="johndoe@jd.com" />
        <label>Email</label>
      </div>
      <div className="form__input_container">
        <input type="phone" name="phone" required 
          onBlur={props.updatePhone} 
          defaultValue={props.user.phone} 
          placeholder="000-000-0000" />
        <label>Phone</label>
      </div>
      <div className="form__input_container">
        <select name="gender" onChange={props.updateGender} value={props.user.gender}>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
        <label>Gender</label>
      </div>
      {/* TODO: Replace with custom date picker */}
      <div className="form__input_container">
        <input type="date" name="dob" required 
          onBlur={props.updateDOB} 
          defaultValue={props.user.dob} />
        <label>Date of Birth</label>
      </div>
      {/* TODO: Replace with custom country picker */}
      <div className="form__input_container">
        <input type="text" name="country" required 
          onBlur={props.updateCountry} 
          defaultValue={props.user.address ? props.user.address.country : ""} />
        <label>Country</label>
      </div>
    </form>
  );
};

PersonalInformation.prototypes = {
  updateName: propTypes.func,
  updateEmail: propTypes.func,
  updatePhone: propTypes.func,
  updateGender: propTypes.func,
  updateDOB: propTypes.func,
  updateCountry: propTypes.func
};