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

export const PersonalInformation = props => {
  return (
    <form className="form application_task__form application__personal_information">
      <div className="form__input_container">
        <input type="text" name="name" required 
          onBlur={props.updateField} autoFocus 
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
        <select name="gender" onChange={props.updateField} value={props.user.gender}>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
        <label>Gender</label>
      </div>
      {/* TODO: Replace with custom date picker */}
      <div className="form__input_container">
        <input type="date" name="dob" required 
          onBlur={props.updateField} 
          defaultValue={props.user.dob} />
        <label>Date of Birth</label>
      </div>
      {/* TODO: Replace with custom country picker */}
      <div className="form__input_container">
        <input type="text" name="country" required 
          onBlur={props.updateField} 
          defaultValue={props.user.address ? props.user.address.country : ""} />
        <label>Country</label>
      </div>
    </form>
  );
};

export const EducationInformation = props => {
  return (
    <form className="form application_task__form application__education_information">
      <div className="form__input_container">
        <select name="educationLevel" required>
          <option value="no high school">Less than high school</option>
          <option value="high school">High school graduate</option>
          <option value="college no degree">Some college, no degree</option>
          <option value="associate">Associate&quot;s degree</option>
          <option value="bachelor">Bachelor&quot;s degree</option>
          <option value="graduate">Graduate or professional degree</option>
        </select>
        <label>What is the highest level of education you have completed?</label>
      </div>
      <div className="form__input_container">
        <input type="text" name="lastSchool" required placeholder="Boat School of Hogwarts"/>
        <label>What is the last school you attended?</label>
      </div>
      <div className="form__input_container">
        <input type="number" name="gpa" required min="0" max="4.00" step="0.01" placeholder="3.88"/>
        <label>What is grade point average (GPA) out of 4.00?</label>
      </div>
    </form>    
  )
}

export const USTest = props => {
  return (
    <form className="form application_task__form application__us_test">
      <div className="form__input_container">
        <select name="usTest" required>
          <option value="none">None</option>
          <option value="ACT">ACT</option>
          <option value="SAT">SAT</option>
        </select>
        <label>Which U.S. standardized test have you taken?</label>
        <span className="type__small type__block">Selecting none will not affect your application.</span>
        <span className="type__small type__block">If you have sat multiple tests, select the test with your highest score.</span> 
      </div>
      <div className="form__input_container">
        <input type="number" required min="0" max="2400" placeholder="0" />
        <label>Score</label>
        <span className="type__small">Enter 0 if you selected 'None'.</span>
      </div>
    </form>
  )
}

export const Miscellaneous = props => {
  return (
    <form className="form application_task__form application__misc">
      <div className="form__input_container">
        <select id="income" name="income" required>
          <option value="10000">Less than $10,000</option>
          <option value="34999">Less than $35,000 but more tha $10,000</option>
          <option value="49999">Less than $50,000 but more than $35,000</option>
          <option value="74999">Less than $75,000 but more than $50,000</option>
          <option value="99999">Less than $100,000 but more than $75,000</option>
          <option value="149999">Less than $150,000 but more than $100,000</option>
          <option value="150000">More than $150,000</option>
        </select>
        <label htmlFor="income">
          Which of these categories best describe your family's combined annual income (USD)?
        </label>
      </div>
      <div className="form__input_container">
        <select id="interest" name="interest" required>
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
        <select id="workEthic" name="workEthic" required>
          <option value="below average">I love sleep</option>
          <option value="average">Average</option>
          <option value="excellent" selected="selected">Grind all night</option>
        </select>
        <label htmlFor="workEthic">
          Which of these categories best describe your work ethic? 
        </label>
      </div>
    </form>
  )
}

// Proptypes
SignInForm.propTypes = {
  title: propTypes.string,
  submitText: propTypes.string,
  handleSignIn: propTypes.func,
  updateEmail: propTypes.func,
  updatePassword: propTypes.func
};

StartApplication.propTypes = {
  title: propTypes.string,
  handleSignIn: propTypes.func,
  updateEmail: propTypes.func,
  updatePassword: propTypes.func,
  updateName: propTypes.func,
  handleAccountCreation: propTypes.func
};

PersonalInformation.propTypes = {
  updateField: propTypes.func,
  user: propTypes.object
};