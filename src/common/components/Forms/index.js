import "./Forms.css";

import React, { Component } from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import moment from "moment";

import TextedIconButton from "../TextedIconButton";
import Button from "../Button";
import Loader from "../Loader";

export class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tries: 0
    };
  }

  static propTypes = {
    title: propTypes.string,
    subtitle: propTypes.string,
    submitText: propTypes.string,
    handleSubmit: propTypes.func,
    updateEmail: propTypes.func,
    updatePassword: propTypes.func,
    authError: propTypes.bool,
    handleSocialSignIn: propTypes.func,
    isWorking: propTypes.bool
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.authError)
      return { tries: prevState.tries + 1 };

    return null;
  }

  render() {
    return (
      <form className="form auth__form signin__form" method="post" onSubmit={this.props.handleSubmit}>
        {
          this.props.title ?
            <h2 className="form__title">{this.props.title}</h2> : null
        }
        <div className="form__social_signins">
          <TextedIconButton icon="google" text="Google Account"
            doClick={this.handleGoogleSignIn}
            buttonStyles={{
              margin: "2rem 0",
              display: "inline-block"
            }} />
          <TextedIconButton icon="facebook" text="Facebook Account"
            doClick={this.handleFacebookSignIn}
            buttonStyles={{
              margin: "2rem 0 2rem 2rem",
              display: "inline-block"
            }} />
        </div>
        {
          this.props.subtitle ?
          <h2 className="form__title">{this.props.subtitle}</h2> :
          null
        }
        <div className="form__input_container">
          <input type="email" name="email" required onChange={this.props.updateEmail} />
          <label>Email</label>
        </div>
        <div className="form__input_container">
          <input type="password" name="password" required onChange={this.props.updatePassword} />
          <label>Password</label>
        </div>
        <div className="form__input_container">
          <button className="form__button" type="submit">{this.props.submitText || "Sign In"}</button>
          {
            this.props.isWorking ?
              <Loader width="48px" styles={{
                position: "absolute",
                right: "3.5rem",
                top: "2rem"
              }} />
            :
              null
          }
        </div>
        {
          this.state.tries > 0 ?
            <Link to="/auth/reset-password" className="form__reset_password">Trouble signing in?</Link>
          :
            null
        }
      </form>
    );
  }

  handleFacebookSignIn = () => {
    if ("function" === typeof this.props.handleSocialSignIn)
      this.props.handleSocialSignIn("facebook");
  }

  handleGoogleSignIn = () => {
    if ("function" === typeof this.props.handleSocialSignIn)
      this.props.handleSocialSignIn("google");
  }
}

export class ResetPasswordForm extends Component {
  static propTypes = {
    title: propTypes.string,
    submitText: propTypes.string,
    handleSubmit: propTypes.func,
    updateEmail: propTypes.func,
    updatePassword: propTypes.func,
    authError: propTypes.bool
  }

  render() {
    return (
      <form className="form auth__form reset__form" method="post" onSubmit={this.props.handleSubmit}>
        {
          this.props.title ?
            <h2 className="form__title">{this.props.title}</h2> :
            null
        }
        <div className="form__input_container">
          <input type="email" name="email" required onChange={this.props.updateEmail} />
          <label>Email</label>
        </div>
        <div className="form__input_container">
          <button className="form__button" type="submit">{this.props.submitText || "Reset"}</button>
        </div>
      </form>
    );
  }
}

export const SignUpForm = ({ user, handleSubmit, handleInputChange, isWorking }) => {
  return (
    <form className="form auth__form signup__form" method="post"
      onSubmit={handleSubmit}>
      <h2 className="form__title">Complete signup</h2>
      <div className="form__input_container">
        <input type="text" name="name" required onChange={handleInputChange} 
          defaultValue={user.name.full}/>
        <label>Full Name</label>
      </div>
      <div className="form__input_container">
        <input type="text" name="email" required onChange={handleInputChange}
          defaultValue={user.email} />
        <label>Email</label>
      </div>
      <h4>Create password</h4>
      <div className="form__input_container">
        <input type="password" name="password" required onChange={handleInputChange} />
        <label>Password</label>
      </div>
      <div className="form__input_container">
        <input type="password" name="confirm_password" required onChange={handleInputChange} />
        <label>Confirm Password</label>
      </div>
      <div className="form__input_container">
        <Button type="submit" text="done" solid />
        {
          isWorking ?
            <Loader width="48px" styles={{
              position: "absolute",
              right: "3.5rem",
              top: "2rem"
            }} />
            :
            null
        }
      </div>
    </form>
  )
}

SignUpForm.propTypes = {
  user: propTypes.object,
  handleSubmit: propTypes.func,
  handleInputChange: propTypes.func,
  isWorking: propTypes.bool
};

export const CreateUserForm = props => {
  return (
    <form className="form create_user__form" method="post"
      onSubmit={props.handleSubmit}>
      <h2>Add user</h2>
      <div className="form__input_container">
        <input type="text" name="name" required
          onChange={props.handleInputChange}
          placeholder="John Doe" />
        <label>Full Name</label>
      </div>
      <div className="form__input_container">
        <input type="text" name="email" required
          onChange={props.handleInputChange}
          placeholder="johndoe@gmail.com" />
        <label>Email</label>
      </div>
      <div className="form__input_container">
        <h3>Roles</h3>
        <span>
          <input type="checkbox" name="roles" id="admin" 
            onChange={props.handleInputChange} value="admin"/>
          <label htmlFor="admin">Admin</label>
        </span>
        <span>
          <input type="checkbox" name="roles" id="student" 
            onChange={props.handleInputChange} value="student"/>
          <label htmlFor="student">Student</label>
        </span>
        <span>
          <input type="checkbox" name="roles" id="staff" 
            onChange={props.handleInputChange} value="staff"/>
          <label htmlFor="staff">Staff</label>
        </span>
      </div>
      <Button type="submit" text="add" solid />
    </form>
  )
}

CreateUserForm.propTypes = {
  handleSubmit: propTypes.func,
  handleInputChange: propTypes.func
};

export const StartApplication = props => {
  const handleFacebookSignUp = () => {
    if ("function" === typeof props.handleSocialSignUp)
      props.handleSocialSignUp("facebook");
  }

  const handleGoogleSignUp = () => {
    if ("function" === typeof props.handleSocialSignUp)
      props.handleSocialSignUp("google");
  }

  return (
    <form className="form auth__form start_application__form" method="post" onSubmit={props.handleAccountCreation}>
      {
        props.title ?
          <h2 className="form__title">{props.title}</h2> :
          null
      }
      <div className="form__social_signins">
        <TextedIconButton icon="google" text="Start with Google"
          doClick={handleGoogleSignUp}
          buttonStyles={{
            margin: "2rem 0",
            display: "inline-block"
          }} />
        <TextedIconButton icon="facebook" text="Start with Facebook"
          doClick={handleFacebookSignUp}
          buttonStyles={{
            margin: "2rem 0 2rem 2rem",
            display: "inline-block"
          }} />
      </div>
      {
        props.subtitle ?
          <h2 className="form__title">{props.subtitle}</h2> :
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
        {
          props.isWorking ?
            <Loader width="48px" styles={{
              position: "absolute",
              right: "3.5rem",
              top: "2rem"
            }}/>
            :
            null
        }
      </div>
    </form>
  )
}

StartApplication.propTypes = {
  title: propTypes.string,
  subtitle: propTypes.string,
  handleSignIn: propTypes.func,
  updateEmail: propTypes.func,
  updatePassword: propTypes.func,
  updateName: propTypes.func,
  handleAccountCreation: propTypes.func,
  handleSocialSignUp: propTypes.func,
  isWorking: propTypes.bool
};

export const PersonalInformation = props => {
  return (
    <form className="form application_task__form application__personal_information">
      <fieldset disabled={props.disabled === true ? "disabled" : null}>
        <div className="form__input_container">
          <input type="text" name="name" required 
            onBlur={props.updateField} 
            defaultValue={props.user.name.full}
            placeholder="John Doe" />
          <label>Full Name</label>
        </div>
        <div className="form__input_container">
          <input type="email" name="email" required 
            onBlur={props.updateField} 
            defaultValue={props.user.email}
            placeholder="johndoe@jd.com" />
          <label>Email</label>
        </div>
        <div className="form__input_container">
          <input type="phone" name="phone" required 
            onBlur={props.updateField} 
            defaultValue={props.user.phone} 
            placeholder="000-000-0000" />
          <label>Phone</label>
        </div>
        <div className="form__input_container">
          <select name="gender" onChange={props.updateField} defaultValue={props.user.gender || ""}>
            <option value="" disabled>Select One</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
          <label>Gender</label>
        </div>
        {/* TODO: Replace with custom date picker */}
        <div className="form__input_container">
          <input type="date" name="dob" required 
            onBlur={props.updateField} 
            defaultValue={moment.utc(props.user.dob).format("Y-MM-DD")} />
          <label>Date of Birth</label>
        </div>
        {/* TODO: Replace with custom country picker */}
        <div className="form__input_container">
          <input type="text" name="country" required 
            onBlur={props.updateField} 
            defaultValue={props.user.address ? props.user.address.country : ""} 
            placeholder="Jamaica" />
          <label>Country</label>
        </div>
      </fieldset>
    </form>
  );
};

PersonalInformation.propTypes = {
  updateField: propTypes.func,
  user: propTypes.object,
  disabled: propTypes.bool
};

export const EducationInformation = ({ application, updateApplicationField, disabled }) => {
  return (
    <form className="form application_task__form application__education_information">
      <fieldset disabled={disabled === true ? "disabled" : null}>
        <div className="form__input_container">
          <select name="educationLevel" required defaultValue={application.application.educationLevel || ""}
            onChange={updateApplicationField}>
            <option value="" disabled>Select One</option>
            <option value="no high school">Less than high school</option>
            <option value="high school">High school graduate</option>
            <option value="college no degree">Some college, no degree</option>
            <option value="associate">Associate&apos;s degree</option>
            <option value="bachelor">Bachelor&apos;s degree</option>
            <option value="graduate">Graduate or professional degree</option>
          </select>
          <label>What is the highest level of education you have completed?</label>
        </div>
        <div className="form__input_container">
          <input type="text" name="lastSchool" required 
            placeholder="Boat School of Hogwarts"
            defaultValue={application.application.lastSchool}
            onBlur={updateApplicationField} />
          <label>What is the last school you attended?</label>
        </div>
        <div className="form__input_container">
          <input type="number" name="gpa" required min="0" max="4.00" 
            step="0.01" placeholder="3.88"
            defaultValue={application.application.gpa}
            onBlur={updateApplicationField} />
          <label>What is grade point average (GPA) out of 4.00?</label>
        </div>
      </fieldset>
    </form>    
  )
}

export const USTest = ({ application, updateApplicationField, disabled }) => {
  return (
    <form className="form application_task__form application__us_test">
      <fieldset disabled={disabled === true ? "disabled" : null}>
        <div className="form__input_container">
          <select name="usTest" required defaultValue={application.application.usTest || ""}
            onChange={updateApplicationField}>
            <option value="" disabled>Select One</option>
            <option value="none">None</option>
            <option value="ACT">ACT</option>
            <option value="SAT">SAT</option>
          </select>
          <label>Which U.S. standardized test have you taken?</label>
          <span className="type__small type__block">Selecting none will not affect your application.</span>
          <span className="type__small type__block">If you have sat multiple tests, select the test with your highest score.</span> 
        </div>
        <div className="form__input_container">
          <input type="number" required min="0" max="2400" 
            placeholder="0" name="score"
            defaultValue={application.application.score} 
            onBlur={updateApplicationField}/>
          <label>Score</label>
          <span className="type__small">Enter 0 if you selected &apos;None.&apos;</span>
        </div>
      </fieldset>
    </form>
  )
}

export const Miscellaneous = ({ application, updateApplicationField, disabled }) => {
  return (
    <form className="form application_task__form application__misc">
      <fieldset disabled={disabled === true ? "disabled" : null}>
        <div className="form__input_container">
          <select id="income" name="income" required defaultValue={application.application.income || ""}
            onChange={updateApplicationField}>
            <option value="" disabled>Select One</option>
            <option value="10000">Less than $10,000</option>
            <option value="34999">Less than $35,000 but more tha $10,000</option>
            <option value="49999">Less than $50,000 but more than $35,000</option>
            <option value="74999">Less than $75,000 but more than $50,000</option>
            <option value="99999">Less than $100,000 but more than $75,000</option>
            <option value="149999">Less than $150,000 but more than $100,000</option>
            <option value="150000">More than $150,000</option>
          </select>
          <label htmlFor="income">
            Which of these categories best describe your family&apos;s combined annual income (USD)?
          </label>
        </div>
        <div className="form__input_container">
          <select id="interest" name="interest" required defaultValue={application.application.interest || ""}
            onChange={updateApplicationField}>
            <option value="" disabled>Select One</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
            <option value="humanities">Humanities</option>
            <option value="stem">STEM</option>
            <option value="undecided">Undecided</option>
          </select>
          <label htmlFor="interest">
            Which of these categories best describe the area of study you would like to pursue? 
          </label>
        </div>
        <div className="form__input_container">
          <select id="workEthic" name="workEthic" required defaultValue={application.application.workEthic || ""}
            onChange={updateApplicationField}>
            <option value="" disabled>Select One</option>
            <option value="below average">I love sleep</option>
            <option value="average">Average</option>
            <option value="excellent">Grind all night</option>
          </select>
          <label htmlFor="workEthic">
            Which of these categories best describe your work ethic? 
          </label>
        </div>
      </fieldset>
    </form>
  )
}

EducationInformation.propTypes = USTest.propTypes = Miscellaneous.propTypes = {
  application: propTypes.object,
  updateApplicationField: propTypes.func,
  disabled: propTypes.bool
};

export const NationalTest = ({ handleTestAdded, handleInputChange }) => {
  const inputChanged = e => {
    if ("function" === typeof handleInputChange)
      handleInputChange(e);
  }

  const formSubmitted = e => {
    e.preventDefault();

    if ("function" === typeof handleTestAdded)
      handleTestAdded();
  }

  return (
    <form className="form application_task__form application__national_test"
      onSubmit={formSubmitted}>
      <h2>Add a new national test</h2>
      <div className="form__input_container">
        <select name="hasTaken" required defaultValue="" onChange={inputChanged}>
          <option value="" disabled>Select One</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <label>Have you already taken this test?</label>
      </div>
      <div className="form__input_container">
        <input type="text" name="country" required placeholder="Jamaica"
          onBlur={inputChanged}/>
        <label>Country</label>
      </div>
      <div className="form__input_container">
        <input type="text" name="board" required placeholder="CXC"
          onBlur={inputChanged} />
        <label>Examination Board</label>
      </div>
      <div className="form__input_container">
        <input type="text" name="examination" required placeholder="CAPE"
          onBlur={inputChanged} />
        <label>Examination</label>
      </div>
      <div className="form__input_container">
        <input type="text" name="subject" required placeholder="Mathematics"
          onBlur={inputChanged} />
        <label>Subject</label>
      </div>
      <div className="form__input_container">
        <input type="number" name="year" required 
          placeholder={new Date().getFullYear() - 5} 
          min="2000"
          max={new Date().getFullYear()}
          onBlur={inputChanged} />
        <label>Year</label>
      </div>
      <div className="form__input_container">
        <input type="number" name="grade" required placeholder="1"
          onBlur={inputChanged} />
        <label>Grade (Number)</label>
      </div>
      <Button type="submit" text="add" solid/>
    </form>
  )
}

NationalTest.propTypes = {
  handleTestAdded: propTypes.func,
  handleInputChange: propTypes.func
};